import os
import tempfile
from PIL import Image


def resize_image(image_source, max_size=720):
    if hasattr(image_source, "seek"):
        image_source.seek(0)

    with Image.open(image_source) as img:
        img = img.convert("RGB")
        img.thumbnail((max_size, max_size))

        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
            img.save(tmp.name, "JPEG", quality=90)
            return tmp.name
