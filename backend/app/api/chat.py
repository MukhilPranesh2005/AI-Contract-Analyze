from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.controllers.chat_controller import handle_chat

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    document_text: Optional[str] = ""
    history: Optional[List[Dict[str, Any]]] = []
    document_id: Optional[str] = None


@router.post("/chat")
def chat_endpoint(request: ChatRequest):
    try:
        reply = handle_chat(
            message=request.message,
            document_text=request.document_text or "",
            history=request.history or [],
            document_id=request.document_id
        )
        return {
            "reply": reply
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
