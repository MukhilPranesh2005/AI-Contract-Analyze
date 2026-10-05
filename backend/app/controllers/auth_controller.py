import hashlib
import time
import secrets
from typing import Dict, Optional

# In-memory storage for persistent demo & registered accounts
USERS_DB: Dict[str, dict] = {
    "demo@lexitwin.ai": {
        "id": "usr_demo123",
        "name": "Sarah Jenkins, Esq.",
        "email": "demo@lexitwin.ai",
        "password_hash": hashlib.sha256("demo123".encode()).hexdigest(),
        "role": "Senior Legal Counsel",
        "organization": "Enterprise Legal Ops",
        "created_at": time.time(),
        "token": "tok_demo_live_session_123"
    },
    "alex.morgan@lexitwin.ai": {
        "id": "usr_legal_lead",
        "name": "Alex Morgan",
        "email": "alex.morgan@lexitwin.ai",
        "password_hash": hashlib.sha256("password123".encode()).hexdigest(),
        "role": "Compliance Officer",
        "organization": "Global Ventures Law",
        "created_at": time.time(),
        "token": "tok_alex_live_session_456"
    }
}

ACTIVE_TOKENS: Dict[str, str] = {
    "tok_demo_live_session_123": "demo@lexitwin.ai",
    "tok_alex_live_session_456": "alex.morgan@lexitwin.ai"
}

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def register_user(name: str, email: str, password: str, role: Optional[str] = "Legal Analyst", organization: Optional[str] = "LexiTwin Enterprise"):
    email_clean = email.strip().lower()
    if email_clean in USERS_DB:
        raise ValueError("An account with this email address already exists.")
    
    if len(password) < 6:
        raise ValueError("Password must be at least 6 characters long.")
    
    user_id = f"usr_{secrets.token_hex(6)}"
    token = f"tok_{secrets.token_hex(16)}"
    
    user_data = {
        "id": user_id,
        "name": name.strip(),
        "email": email_clean,
        "password_hash": hash_password(password),
        "role": role or "Legal Analyst",
        "organization": organization or "LexiTwin Enterprise",
        "created_at": time.time(),
        "token": token
    }
    
    USERS_DB[email_clean] = user_data
    ACTIVE_TOKENS[token] = email_clean
    
    return {
        "id": user_data["id"],
        "name": user_data["name"],
        "email": user_data["email"],
        "role": user_data["role"],
        "organization": user_data["organization"],
        "token": token
    }

def login_user(email: str, password: str):
    email_clean = email.strip().lower()
    user = USERS_DB.get(email_clean)
    if not user:
        raise ValueError("Invalid email or password.")
    
    if user["password_hash"] != hash_password(password):
        raise ValueError("Invalid email or password.")
    
    token = f"tok_{secrets.token_hex(16)}"
    user["token"] = token
    ACTIVE_TOKENS[token] = email_clean
    
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "organization": user["organization"],
        "token": token
    }

def get_demo_user():
    email_clean = "demo@lexitwin.ai"
    user = USERS_DB[email_clean]
    token = f"tok_{secrets.token_hex(16)}"
    user["token"] = token
    ACTIVE_TOKENS[token] = email_clean
    
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "organization": user["organization"],
        "token": token
    }

def verify_token(token: str):
    if not token:
        return None
    email = ACTIVE_TOKENS.get(token)
    if not email or email not in USERS_DB:
        return None
    user = USERS_DB[email]
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "organization": user["organization"]
    }
