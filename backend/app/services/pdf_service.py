import pdfplumber
import PyPDF2


def extract_pdf_text(file_path: str) -> str:
    text = ""

    # Primary extraction using pdfplumber
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as err:
        print(f"pdfplumber extraction failed for {file_path}: {err}")

    # Fallback extraction using PyPDF2 if pdfplumber returns empty or fails
    if not text.strip():
        try:
            reader = PyPDF2.PdfReader(file_path)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        except Exception as err:
            print(f"PyPDF2 fallback extraction failed for {file_path}: {err}")

    return text