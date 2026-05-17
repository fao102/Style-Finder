import os
import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
from io import BytesIO
from app.models import OutfitSearch


@pytest.fixture
def sample_image():
    """Create a sample test image."""
    image = Image.new("RGB", (100, 100), color="red")
    image_io = BytesIO()
    image.save(image_io, format="JPEG")
    image_io.seek(0)
    return SimpleUploadedFile(
        "test_image.jpg", image_io.getvalue(), content_type="image/jpeg"
    )


@pytest.fixture
def gemini_mock_response():
    """Mock response from Gemini API."""
    return {
        "refined_label": "Men's navy blazer",
        "type": "blazer",
        "gender": "men",
        "color": "navy",
        "fit": "slim",
    }


@pytest.fixture
def serp_api_mock_response():
    """Mock response from SerpAPI."""
    return {
        "shopping_results": [
            {
                "title": "Blue Blazer",
                "price": "89.99",
                "link": "https://example.com/blazer1",
                "thumbnail": "https://example.com/img1.jpg",
                "source": "Amazon",
            },
            {
                "title": "Navy Blazer Premium",
                "price": "119.99",
                "link": "https://example.com/blazer2",
                "thumbnail": "https://example.com/img2.jpg",
                "source": "Amazon",
            },
        ]
    }


@pytest.fixture
def outfit_search(sample_image):
    """Create a test OutfitSearch object."""
    return OutfitSearch.objects.create(
        image=sample_image,
        refined_label="Men's navy blazer",
        type="blazer",
        gender="men",
        color="navy",
        fit="slim",
    )
