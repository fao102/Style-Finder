import os
from PIL import Image


def resize_image(image_path, max_size=720):
    img = Image.open(image_path)
    img = img.convert("RGB")
    img.thumbnail((max_size, max_size))
    base, _ = os.path.splitext(image_path)
    resized_path = f"{base}_resized.jpg"
    img.save(resized_path, "JPEG", quality=90)
    return resized_path
