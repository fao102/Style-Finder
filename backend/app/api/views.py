import os
import hashlib
import requests
import google.generativeai as genai
from django.core.cache import cache
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from ..models import OutfitSearch
from .serializers import ImageSerializer
from dotenv import load_dotenv
from .helper import resize_image
import json

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
SERP_API_KEY = os.getenv("SERP_API_KEY")
CACHE_TTL = 3600  # 1 hour


class UploadImageViewSet(ModelViewSet):
    queryset = OutfitSearch.objects.all()
    serializer_class = ImageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        # Step 3: Analyze image with Gemini Vision
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = """
        You are a fashion label extractor.
        Analyze the outfit in the image and return ONLY a JSON object with:
        - gender: "Men" | "Women" | "Unisex"
        - type: concise clothing type (e.g., "T-shirt", "Blazer", "Dress", "Tracksuit")
        - color: main visible color(s)
        - fit: e.g., "Slim fit", "Oversized", "Regular", "Loose"
        - style_summary: one-sentence summary (e.g., "Men's navy slim-fit blazer")
        Output only JSON, no extra commentary.
        """
        image_path = resize_image(instance.image.path)

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

        # Step 4: Save labels to DB
        instance.gender = data.get("gender")
        instance.outfit_type = data.get("type")
        instance.color = data.get("color")
        instance.fit = data.get("fit")
        instance.style_summary = data.get("style_summary")

        refined_label = instance.style_summary or ""

        # Step 7a: Check Redis cache before calling SerpAPI (step 5)
        cache_key = "serp_" + hashlib.md5(refined_label.encode()).hexdigest()
        cached = cache.get(cache_key)

        if cached is not None:
            results = cached
        else:
            # Step 5: Search products via SerpAPI
            try:
                serp_url = "https://serpapi.com/search.json"
                params = {
                    "engine": "google_shopping",
                    "q": f"{refined_label} cheap alternatives",
                    "api_key": SERP_API_KEY,
                }
                serp_response = requests.get(serp_url, params=params)
                results = serp_response.json().get("shopping_results", [])
            except Exception as e:
                results = []

            # Step 7a: Store results in cache
            cache.set(cache_key, results, timeout=CACHE_TTL)

        # Step 7b: Save search results + timestamp to DB
        instance.results = results
        instance.save()

        return Response(
            {
                "refined_label": refined_label,
                "products": results,
            },
            status=status.HTTP_201_CREATED,
        )
