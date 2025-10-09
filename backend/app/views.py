from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from .models import OutfitSearch
from rest_framework.views import APIView


class UploadImageView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        image = request.FILES.get("image")
        if image:
            search = OutfitSearch.objects.create(image=image)
            return Response(
                {"message": "Image uploaded", "id": search.id},
                status=status.HTTP_201_CREATED,
            )
        return Response({"error": "No image found"}, status=status.HTTP_400_BAD_REQUEST)
