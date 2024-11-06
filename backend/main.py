from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from app.services.pest_detection_service import PestDetectionService
from app.services.chat_service import ChatService
from typing import Dict

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
pest_service = PestDetectionService()
chat_service = ChatService()

@app.post("/api/chat")
async def chat(message: Dict[str, str]):
    try:
        response = chat_service.get_response(message["message"])
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/detect-pest")
async def detect_pest(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        result = await pest_service.detect_pest(contents)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/")
async def root():
    return {"message": "AgroBot API is running"}