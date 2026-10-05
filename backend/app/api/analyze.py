from fastapi import APIRouter
from pydantic import BaseModel

from app.controllers.ai_controller import analyze

router = APIRouter()


class Contract(BaseModel):

    text: str


@router.post("/analyze")

def analyze_document(contract: Contract):

    return {

        "analysis": analyze(contract.text)

    }