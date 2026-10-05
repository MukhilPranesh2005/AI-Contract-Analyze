from datetime import datetime
from app.services.ai_service import chat_with_contract
from app.database.mongodb import chat_collection


def handle_chat(message: str, document_text: str = "", history: list = None, document_id: str = None):
    reply = chat_with_contract(
        question=message,
        document_text=document_text,
        history=history
    )

    try:
        chat_entry = {
            "document_id": document_id,
            "message": message,
            "reply": reply,
            "created_at": datetime.utcnow()
        }
        chat_collection.insert_one(chat_entry)
    except Exception:
        # Chat logging is non-blocking if MongoDB is unreachable
        pass

    return reply
