from rest_framework.serializers import ModelSerializer
from ..models import OutfitSearch


class ImageSerializer(ModelSerializer):
    class Meta:
        model = OutfitSearch
        fields = "__all__"


class HistorySerializer(ModelSerializer):
    class Meta:
        model = OutfitSearch
        exclude = ["clerk_user_id"]
