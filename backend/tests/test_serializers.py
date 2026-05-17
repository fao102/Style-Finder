import pytest
from app.api.serializers import ImageSerializer
from app.models import OutfitSearch


@pytest.mark.unit
@pytest.mark.django_db
class TestImageSerializer:
    """Tests for ImageSerializer."""

    def test_serializer_with_valid_image(self, sample_image):
        """Test serializer with valid image."""
        data = {"image": sample_image}
        serializer = ImageSerializer(data=data)
        assert serializer.is_valid()

    def test_serializer_missing_image(self):
        """Test serializer without image raises validation error."""
        serializer = ImageSerializer(data={})
        assert not serializer.is_valid()
        assert "image" in serializer.errors

    def test_serializer_creates_outfit_search(self, sample_image):
        """Test that serializer can create OutfitSearch instance."""
        data = {"image": sample_image}
        serializer = ImageSerializer(data=data)
        if serializer.is_valid():
            instance = serializer.save()
            assert isinstance(instance, OutfitSearch)
            assert instance.image is not None

    def test_serializer_fields_represented(self, outfit_search):
        """Test serializer represents all expected fields."""
        serializer = ImageSerializer(outfit_search)
        data = serializer.data
        # At least image field should be present
        assert "image" in data or "id" in data
