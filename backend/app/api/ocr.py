from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.controllers.ocr_controller import process_ocr_upload, process_ocr_base64

router = APIRouter()


class Base64ImageRequest(BaseModel):
    image: str
    filename: Optional[str] = "image.png"


@router.post("/ocr/extract")
async def extract_ocr_from_file(file: UploadFile = File(...)):
    try:
        result = process_ocr_upload(file)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR extraction failed: {str(e)}")


@router.post("/ocr/extract-base64")
async def extract_ocr_from_base64_payload(payload: Base64ImageRequest):
    try:
        result = process_ocr_base64(payload.image, filename=payload.filename or "image.png")
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR extraction failed: {str(e)}")
