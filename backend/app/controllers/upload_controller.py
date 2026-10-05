import os

from app.services.pdf_service import extract_pdf_text
from app.services.docx_service import extract_docx_text
from app.utils.text_cleaner import clean_text

from app.database.mongodb import documents_collection
from app.models.document_model import DocumentModel

UPLOAD_FOLDER = "app/uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def process_uploaded_file(upload_file):
    filename = upload_file.filename or "uploaded_contract.pdf"
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    # Read and store uploaded file
    file_bytes = upload_file.file.read()
    with open(file_path, "wb") as buffer:
        buffer.write(file_bytes)

    extension = filename.split(".")[-1].lower() if "." in filename else ""

    text = ""
    if extension == "pdf":
        text = extract_pdf_text(file_path)
    elif extension in ["docx", "doc"]:
        text = extract_docx_text(file_path)
    elif extension == "txt":
        try:
            text = file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            text = file_bytes.decode("latin-1", errors="ignore")
    else:
        # Fallback attempt for text files with uncommon extensions
        try:
            text = file_bytes.decode("utf-8", errors="ignore")
        except Exception:
            raise ValueError(f"Unsupported file format '.{extension}'. Please upload a PDF, DOCX, or TXT document.")

    cleaned = clean_text(text)

    if not cleaned or not cleaned.strip():
        raise ValueError(
            f"No text could be extracted from '{filename}'. "
            "If this document is a scanned PDF or image, please use the OCR Document Scanner tool."
        )

    # Attempt DB persistence safely
    inserted_id = "local_session"
    try:
        document = DocumentModel.create(filename, cleaned)
        inserted = documents_collection.insert_one(document)
        inserted_id = str(inserted.inserted_id)
    except Exception as db_err:
        print(f"MongoDB persistence notice (bypassed): {db_err}")

    return {
        "id": inserted_id,
        "filename": filename,
        "text": cleaned
    }