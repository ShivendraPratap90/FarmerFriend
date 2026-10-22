"""
FarmerFriend AI Crop Disease Detection Backend
FastAPI server serving EfficientNet-B0 trained on PlantVillage
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import uvicorn
from model_loader import predictor, PLANT_VILLAGE_CLASSES, WEIGHTS_PATH_PTH, WEIGHTS_PATH_PT

app = FastAPI(
    title="FarmerFriend AI Disease Detection API",
    description="Backend microservice using EfficientNet-B0 for plant disease classification on PlantVillage",
    version="1.0.0"
)

# Enable CORS for local Vite dev server (and any other client)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "service": "FarmerFriend AI Crop Disease Detection Backend",
        "status": "online",
        "modelLoaded": predictor.is_model_loaded,
        "device": str(predictor.device),
        "docsUrl": "/docs"
    }

@app.get("/api/health")
def health_check():
    weights_found = os.path.exists(WEIGHTS_PATH_PTH) or os.path.exists(WEIGHTS_PATH_PT)
    return {
        "status": "healthy",
        "modelLoaded": predictor.is_model_loaded,
        "weightsFilePresent": weights_found,
        "weightsDirectory": os.path.dirname(WEIGHTS_PATH_PTH),
        "device": str(predictor.device),
        "totalSupportedClasses": len(PLANT_VILLAGE_CLASSES)
    }

@app.get("/api/classes")
def get_classes():
    """Returns the list of 38 plant disease classes."""
    return {
        "count": len(PLANT_VILLAGE_CLASSES),
        "classes": PLANT_VILLAGE_CLASSES
    }

@app.post("/api/detect-disease")
async def detect_disease(
    crop: str = Form(""),
    file: UploadFile = File(...)
):
    """
    Accepts an uploaded crop image file and optional crop hint.
    Runs inference using EfficientNet-B0 and returns agronomic diagnosis and recommendations.
    """
    # 1. Validate file type
    valid_content_types = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if file.content_type and file.content_type.lower() not in valid_content_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{file.content_type}'. Please upload JPEG, PNG, or WebP."
        )

    # 2. Read file bytes
    try:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty.")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error reading image: {str(e)}")

    # 3. Run prediction & retrieve advisory details
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

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
