from PIL import Image


def resize_image(image_path, max_size=720):
    img = Image.open(image_path)
    img.convert()
    img.thumbnail((max_size, max_size))
    resized_path = image_path.replace(".jpg", "_resized.jpg")
    img.save(resized_path, "PNG", quality=90)
    return resized_path


def analyze_outfit_image(image_path, model):
    try:
        with open(image_path, "rb") as img:
            response = model.generate_content(
                [
                    {
                        "role": "user",
                        "parts": [
                            {"mime_type": "image/jpeg", "data": img.read()},
                            {"text": prompt},
                        ],
                    }
                ]
            )
        return json.loads(response.text)
    except Exception as e:
        return {"error": f"Gemini analysis failed: {e}"}
