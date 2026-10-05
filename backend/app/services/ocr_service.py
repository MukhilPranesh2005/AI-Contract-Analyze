import base64
import io
from google import genai
from google.genai import types

from app.config import GEMINI_API_KEY
from app.utils.prompts import OCR_EXTRACTION_PROMPT
from app.utils.text_cleaner import clean_text

client = genai.Client(api_key=GEMINI_API_KEY)


def extract_ocr_from_image_bytes(image_bytes: bytes, mime_type: str = "image/jpeg") -> dict:
    """
    Extracts text from an image using Gemini Multimodal Vision OCR.
    Preserves document structure, clauses, headings, and legal formatting.
    """
    if not image_bytes:
        raise ValueError("No image data provided for OCR extraction.")

    # Normalize mime type if needed
    if not mime_type or mime_type == "application/octet-stream":
        mime_type = "image/jpeg"

    models_to_try = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-3-flash-preview",
        "gemini-3.5-flash",
        "gemini-3.6-flash"
    ]

    response = None
    last_err = None

    image_part = types.Part.from_bytes(
        data=image_bytes,
        mime_type=mime_type
    )

    contents = [
        image_part,
        OCR_EXTRACTION_PROMPT
    ]

    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=contents
            )
            if response and response.text:
                break
        except Exception as err:
            last_err = err

    if response is None or not response.text:
        if last_err:
            raise last_err
        raise RuntimeError("No text could be extracted from the document image.")

    raw_text = response.text.strip()
    
    # Clean up formatting artifacts if enclosed in markdown code fences
    if raw_text.startswith("```"):
        lines = raw_text.splitlines()
        if len(lines) >= 2 and lines[0].startswith("```"):
            raw_text = "\n".join(lines[1:-1] if lines[-1].strip() == "```" else lines[1:])

    cleaned = clean_text(raw_text)
    word_count = len(cleaned.split())
    char_count = len(cleaned)
    line_count = len(cleaned.splitlines())

    return {
        "text": cleaned,
        "raw_text": raw_text,
        "word_count": word_count,
        "char_count": char_count,
        "line_count": line_count,
        "mime_type": mime_type
    }


def extract_ocr_from_base64(base64_str: str) -> dict:
    """
    Extracts text from a base64 encoded image string (e.g. data:image/png;base64,...).
    """
    mime_type = "image/jpeg"
    if "," in base64_str:
        header, base64_data = base64_str.split(",", 1)
        if "data:" in header and ";base64" in header:
            mime_type = header.split("data:")[1].split(";base64")[0]
    else:
        base64_data = base64_str

    image_bytes = base64.b64decode(base64_data)
    return extract_ocr_from_image_bytes(image_bytes, mime_type=mime_type)
