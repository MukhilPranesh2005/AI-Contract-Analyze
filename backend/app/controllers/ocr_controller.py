import os
import mimetypes
from app.services.ocr_service import extract_ocr_from_image_bytes, extract_ocr_from_base64
from app.database.mongodb import documents_collection
from app.models.document_model import DocumentModel

UPLOAD_FOLDER = "app/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "bmp", "tiff", "tif", "heic", "gif"}


def process_ocr_upload(upload_file):
    filename = upload_file.filename
    extension = filename.split(".")[-1].lower() if "." in filename else ""

    if extension not in ALLOWED_IMAGE_EXTENSIONS and not upload_file.content_type.startswith("image/"):
        raise ValueError(
            f"Unsupported file format '{extension}'. Please upload an image file ({', '.join(ALLOWED_IMAGE_EXTENSIONS)})."
        )

    file_path = os.path.join(UPLOAD_FOLDER, f"ocr_{filename}")
    file_bytes = upload_file.file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(file_bytes)

    mime_type = upload_file.content_type or mimetypes.guess_type(filename)[0] or "image/jpeg"

    ocr_result = extract_ocr_from_image_bytes(file_bytes, mime_type=mime_type)
    cleaned_text = ocr_result["text"]

    document = DocumentModel.create(
        filename,
        cleaned_text
    )
    document["is_ocr"] = True
    document["word_count"] = ocr_result["word_count"]
    document["char_count"] = ocr_result["char_count"]

    inserted_id = "local_ocr_session"
    try:
        inserted = documents_collection.insert_one(document)
        inserted_id = str(inserted.inserted_id)
    except Exception as db_err:
        print(f"MongoDB persistence notice (bypassed): {db_err}")

    return {
        "id": inserted_id,
        "filename": filename,
        "text": cleaned_text,
        "word_count": ocr_result["word_count"],
        "char_count": ocr_result["char_count"],
        "line_count": ocr_result["line_count"],
        "mime_type": mime_type
    }


def process_ocr_base64(base64_data: str, filename: str = "pasted_image.png"):
    ocr_result = extract_ocr_from_base64(base64_data)
    cleaned_text = ocr_result["text"]

    document = DocumentModel.create(
        filename,
        cleaned_text
    )
    document["is_ocr"] = True
    document["word_count"] = ocr_result["word_count"]
    document["char_count"] = ocr_result["char_count"]

    inserted_id = "local_ocr_session"
    try:
        inserted = documents_collection.insert_one(document)
        inserted_id = str(inserted.inserted_id)
    except Exception as db_err:
        print(f"MongoDB persistence notice (bypassed): {db_err}")

    return {
        "id": inserted_id,
        "filename": filename,
        "text": cleaned_text,
        "word_count": ocr_result["word_count"],
        "char_count": ocr_result["char_count"],
        "line_count": ocr_result["line_count"],
        "mime_type": ocr_result.get("mime_type", "image/png")
    }
