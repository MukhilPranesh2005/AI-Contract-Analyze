from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import HTTPException

from app.controllers.upload_controller import process_uploaded_file

router = APIRouter()


@router.post("/upload")

async def upload_document(file: UploadFile = File(...)):

    try:

        result = process_uploaded_file(file)

        return result

    except Exception as e:

        raise HTTPException(status_code=400, detail=str(e))