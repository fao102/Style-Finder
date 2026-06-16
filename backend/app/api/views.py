import os
import hashlib
import requests
import google.generativeai as genai
from django.core.cache import cache
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from ..models import OutfitSearch
from .serializers import ImageSerializer, HistorySerializer
from dotenv import load_dotenv
from .helper import resize_image
import json
import jwt
from jwt import PyJWKClient

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
SERP_API_KEY = os.getenv("SERP_API_KEY")
CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL", "")
CACHE_TTL = 3600

_jwks_client = PyJWKClient(CLERK_JWKS_URL) if CLERK_JWKS_URL else None


def get_clerk_user_id(request):
    if not _jwks_client:
        return None
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header[7:]
    try:
        signing_key = _jwks_client.get_signing_key_from_jwt(token)
        data = jwt.decode(token, signing_key.key, algorithms=["RS256"])
        return data.get("sub")
    except Exception:
        return None


def serp_api_search(refined_label):
    serp_url = "https://serpapi.com/search.json"
    params = {
        "engine": "google_shopping",
        "q": f"{refined_label} cheap alternatives",
        "api_key": SERP_API_KEY,
    }
    serp_response = requests.get(serp_url, params=params)
    results = serp_response.json().get("shopping_results", [])
    return results


def gemini_vision_data(instance):
    # Step 3: Analyze image with Gemini Vision
    model = genai.GenerativeModel("gemini-2.5-flash")
    prompt = """
    You are a fashion label extractor.
    Analyze the outfit in the image and return ONLY a JSON object with:
    - gender: "Men" | "Women" | "Unisex"
    - type: concise clothing type (e.g., "T-shirt", "Blazer", "Dress", "Tracksuit")
    - color: main visible color(s)
    - fit: e.g., "Slim fit", "Oversized", "Regular", "Loose"
    - brand (if visible): e.g., "Nike", "Adidas", "Zara"
    - era/style: e.g., "90s", "Streetwear", "Bohemian", "Business casual"
    - style_summary: most effective one sentence summary to find similar items online, making sure to include type, fit, and style keywords. The more accurate the better.
    Output only JSON, no extra commentary.
    """
    image_path = resize_image(instance.image.file)

    try:
        with open(image_path, "rb") as img:
            response = model.generate_content(
                [
                    {
                        "role": "user",
                        "parts": [
                            {"mime_type": "image/jpeg", "data": img.read()},
                            {"text": prompt},
                        ],
                    },
                ],
                generation_config={"response_mime_type": "application/json"},
            )
        try:
            data = json.loads(response.text)
        except json.JSONDecodeError:
            data = {"error": "Could not parse AI output", "raw": response.text}
    except Exception as e:
        data = {"error": f"Gemini API call failed: {str(e)}"}

    finally:
        if os.path.exists(image_path):
            os.unlink(image_path)

    return data


class UploadImageViewSet(ModelViewSet):
    queryset = OutfitSearch.objects.all()
    serializer_class = ImageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        data = gemini_vision_data(instance)

        # Save labels to DB
        instance.image = data.get("image")
        instance.gender = data.get("gender")
        instance.outfit_type = data.get("type")
        instance.color = data.get("color")
        instance.fit = data.get("fit")
        instance.style_summary = data.get("style_summary")

        # Link search to authenticated user if signed in
        instance.clerk_user_id = get_clerk_user_id(request)

        refined_label = instance.style_summary or ""

        # Step 7a: Check Redis cache before calling SerpAPI
        cache_key = "serp_" + hashlib.md5(refined_label.encode()).hexdigest()
        cached = cache.get(cache_key)

        if cached is not None:
            results = cached
        else:
            # Step 5: Search products via SerpAPI
            try:
                results = serp_api_search(refined_label)
            except Exception:
                results = []

            cache.set(cache_key, results, timeout=CACHE_TTL)

        # Step 7b: Save search results + timestamp to DB
        instance.results = results
        instance.save()

        return Response(
            {"refined_label": refined_label, "products": results},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=["get"])
    def history(self, request):
        user_id = get_clerk_user_id(request)
        if not user_id:
            return Response(
                {"error": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        searches = OutfitSearch.objects.filter(clerk_user_id=user_id).order_by(
            "-created_at"
        )
        serializer = HistorySerializer(
            searches, many=True, context={"request": request}
        )
        return Response(serializer.data)
