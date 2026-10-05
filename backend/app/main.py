from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.analyze import router as analyze_router
from app.api.upload import router as upload_router
from app.api.chat import router as chat_router
from app.api.ocr import router as ocr_router
from app.api.digital_twin import router as digital_twin_router
from app.api.auth import router as auth_router

app = FastAPI(
    title="AI Contract Analyzer",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(analyze_router)
app.include_router(chat_router)
app.include_router(ocr_router)
app.include_router(digital_twin_router)


@app.get("/")
def home():
    return {
        "message": "Backend Running Successfully"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }