import pytest
import tempfile
import os
from PIL import Image
from io import BytesIO
from app.api.helper import resize_image


@pytest.mark.unit
class TestResizeImage:
    """Tests for resize_image helper function."""

    def test_resize_image_creates_file(self):
        """Test that resize_image creates a resized file."""
        # Create a temporary image
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
            image = Image.new("RGB", (2000, 2000), color="blue")
            image.save(tmp.name, format="JPEG")
            tmp_path = tmp.name

        try:
            resized_path = resize_image(tmp_path, max_size=720)
            assert os.path.exists(resized_path)

            # Check that resized image is smaller
            original_size = os.path.getsize(tmp_path)
            resized_size = os.path.getsize(resized_path)
            assert resized_size < original_size

            # Check dimensions are within max_size
            resized_img = Image.open(resized_path)
            assert resized_img.width <= 720
            assert resized_img.height <= 720
        finally:
            # Cleanup
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
            if "resized_path" in locals() and os.path.exists(resized_path):
                os.unlink(resized_path)

    def test_resize_image_maintains_aspect_ratio(self):
        """Test that resize maintains aspect ratio."""
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
            # Create 16:9 aspect ratio image
            image = Image.new("RGB", (1600, 900), color="green")
            image.save(tmp.name, format="JPEG")
            tmp_path = tmp.name

        try:
            resized_path = resize_image(tmp_path, max_size=720)
            resized_img = Image.open(resized_path)

            # Check aspect ratio is preserved (within tolerance)
            original_ratio = 1600 / 900
            resized_ratio = resized_img.width / resized_img.height
            assert abs(original_ratio - resized_ratio) < 0.1
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
            if "resized_path" in locals() and os.path.exists(resized_path):
                os.unlink(resized_path)
