import pytest
from django.test import TestCase
from app.models import OutfitSearch


@pytest.mark.unit
@pytest.mark.django_db
class TestOutfitSearchModel:
    """Tests for OutfitSearch model."""

    def test_outfit_search_creation(self, outfit_search):
        """Test creating an OutfitSearch object."""
        assert outfit_search.id is not None
        assert outfit_search.refined_label == "Men's navy blazer"
        assert outfit_search.type == "blazer"
        assert outfit_search.gender == "men"
        assert outfit_search.color == "navy"
        assert outfit_search.fit == "slim"

    def test_outfit_search_image_upload(self, outfit_search):
        """Test that image is properly stored."""
        assert outfit_search.image is not None
        assert outfit_search.image.name.startswith("uploads/")

    def test_outfit_search_fields_optional(self, sample_image):
        """Test that non-image fields are optional."""
        search = OutfitSearch.objects.create(image=sample_image)
        assert search.refined_label is None or search.refined_label == ""
        assert search.image is not None

    def test_outfit_search_string_representation(self, outfit_search):
        """Test model string representation."""
        label = str(outfit_search)
        assert label == "Men's navy blazer" or "OutfitSearch" in label
