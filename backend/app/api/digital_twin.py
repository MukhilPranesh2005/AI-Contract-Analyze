from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.controllers.digital_twin_controller import (
    get_sample_digital_twins,
    analyze_for_digital_twin,
)
from app.services.ai_service import analyze_contract

router = APIRouter(prefix="/digital-twin", tags=["Digital Twin"])


class DigitalTwinRequest(BaseModel):
    text: str


@router.get("/templates")
def list_digital_twin_templates():
    return {
        "templates": get_sample_digital_twins()
    }


@router.post("/extract")
def extract_digital_twin(request: DigitalTwinRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Contract text is required.")
    
    try:
        full_analysis = analyze_contract(request.text)
        return {
            "digital_twin": full_analysis.get("digital_twin", {}),
            "analysis": full_analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
