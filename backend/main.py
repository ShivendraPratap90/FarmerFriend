"""
FarmerFriend AI Crop Disease Detection & Bilingual Agronomic Assistant Backend
FastAPI server serving:
1. OpenPlants Vision Transformer for automatic crop & plant species identification
2. EfficientNet-B0 with Multimodal Lesion Localization & Grad-CAM visual overlays
3. Bilingual AI Agronomic Chat Engine powered by Google Gemini 2.5 Flash
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import os
import uvicorn
from model_loader import predictor, PLANT_VILLAGE_CLASSES, WEIGHTS_PATH_PTH, WEIGHTS_PATH_PT
from ai_chat_engine import chat_engine
from plant_identifier import plant_identifier
from gemini_service import gemini_service

app = FastAPI(
    title="FarmerFriend AI Agriculture API",
    description="Backend microservice using OpenPlants ViT, EfficientNet-B0, Grad-CAM, and Gemini 3.8 Flash",
    version="2.1.0"
)

# Enable CORS for local Vite dev server (and any other client)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en"
    cropContext: Optional[str] = None

@app.get("/")
def read_root():
    return {
        "service": "FarmerFriend AI Crop Disease Detection & Agronomic Assistant Backend",
        "status": "online",
        "diseaseModelLoaded": predictor.is_model_loaded,
        "plantIdentifierLoaded": plant_identifier.is_loaded,
        "gemini": gemini_service.get_status(),
        "device": str(predictor.device),
        "docsUrl": "/docs"
    }

@app.get("/api/health")
def health_check():
    weights_found = os.path.exists(WEIGHTS_PATH_PTH) or os.path.exists(WEIGHTS_PATH_PT)
    return {
        "status": "healthy",
        "diseaseModelLoaded": predictor.is_model_loaded,
        "plantIdentifierLoaded": plant_identifier.is_loaded,
        "weightsFilePresent": weights_found,
        "weightsDirectory": os.path.dirname(WEIGHTS_PATH_PTH),
        "device": str(predictor.device),
        "totalSupportedClasses": len(PLANT_VILLAGE_CLASSES),
        "gemini": gemini_service.get_status()
    }

@app.get("/api/ai-chat/status")
def ai_chat_status():
    return {
        "success": True,
        "data": gemini_service.get_status()
    }

@app.get("/api/classes")
def get_classes():
    """Returns the list of 38 plant disease classes."""
    return {
        "count": len(PLANT_VILLAGE_CLASSES),
        "classes": PLANT_VILLAGE_CLASSES
    }

@app.post("/api/identify-crop")
async def identify_crop_endpoint(file: UploadFile = File(...)):
    """
    Accepts an uploaded leaf/plant photo.
    Runs OpenPlants Vision Transformer (14,829 species) to automatically identify the crop species.
    """
    valid_content_types = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if file.content_type and file.content_type.lower() not in valid_content_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported format '{file.content_type}'."
        )

    try:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty.")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error reading image: {str(e)}")

    try:
        result = plant_identifier.identify_crop(contents)
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Crop identification error: {str(e)}"
        )

@app.post("/api/detect-disease")
async def detect_disease(
    crop: str = Form(""),
    file: UploadFile = File(...)
):
    """
    Accepts an uploaded crop image file and optional crop hint.
    Runs inference using EfficientNet-B0 + Grad-CAM lesion heatmap overlay.
    """
    valid_content_types = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if file.content_type and file.content_type.lower() not in valid_content_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{file.content_type}'. Please upload JPEG, PNG, or WebP."
        )

    try:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty.")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error reading image: {str(e)}")

    try:
        result = predictor.predict(contents, crop_hint=crop)
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {str(e)}"
        )

@app.post("/api/chat")
@app.post("/api/ai-chat")
async def chat_endpoint(req: ChatRequest):
    """
    Bilingual Agronomic AI Chatbot endpoint powered by Gemini 3.8 Flash.
    Strictly dedicated to agriculture.
    """
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message cannot be empty.")
    
    try:
        reply = chat_engine.answer_query(req.message, requested_lang=req.language or "en")
        return {
            "success": True,
            "data": {
                "message": reply,
                "type": "assistant",
                "model": gemini_service.model_name if gemini_service.is_configured else "Agronomic Engine",
                "language": req.language
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat error: {str(e)}"
        )

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host=host, port=port, reload=True)

