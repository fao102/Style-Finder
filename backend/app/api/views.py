from rest_framework.viewsets import ModelViewSet
from ..models import OutfitSearch
from .serializers import ImageSerializer


class UploadImageViewSet(ModelViewSet):
    queryset = OutfitSearch.objects.all()
    serializer_class = ImageSerializer
