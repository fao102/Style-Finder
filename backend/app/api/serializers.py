from rest_framework.serializers import ModelSerializer
from ..models import OutfitSearch


class ImageSerializer(ModelSerializer):
    class Meta:
        model = OutfitSearch
        fields = ("id", "image")
