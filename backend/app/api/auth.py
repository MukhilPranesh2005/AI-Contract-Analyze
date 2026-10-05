from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.controllers.auth_controller import (
    register_user,
    login_user,
    get_demo_user,
    verify_token
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "Legal Analyst"
    organization: Optional[str] = "LexiTwin Enterprise"

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(req: RegisterRequest):
    try:
        user_data = register_user(
            name=req.name,
            email=req.email,
            password=req.password,
            role=req.role,
            organization=req.organization
        )
        return {"success": True, "user": user_data}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error during registration.")

@router.post("/login")
def login(req: LoginRequest):
    try:
        user_data = login_user(email=req.email, password=req.password)
        return {"success": True, "user": user_data}
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error during login.")

@router.post("/demo")
def demo_login():
    try:
        user_data = get_demo_user()
        return {"success": True, "user": user_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to initialize demo account.")

@router.get("/me")
def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    token = authorization.replace("Bearer ", "").strip()
    user = verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired session token")
    
    return {"success": True, "user": user}
