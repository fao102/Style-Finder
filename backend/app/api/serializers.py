from rest_framework.serializers import ModelSerializer
from ..models import OutfitSearch


class ImageSerializer(ModelSerializer):
    class Meta:
        model = OutfitSearch
        fields = "__all__"


class HistorySerializer(ModelSerializer):
    class Meta:
        model = OutfitSearch
        fields = [
            "id",
            "refined_label",
            "results",
            "image_url",
            "created_at",
            "clerk_user_id",
        ]
