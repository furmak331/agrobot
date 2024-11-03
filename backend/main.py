from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from app.models.crop_recommendation import CropRecommendationRequest, CropRecommendationResponse
from app.services.pest_detection_service import PestDetectionService
from app.models.pest_detection import PestDetectionResponse

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crop recommendation data
SOIL_TYPES = {
    "clay": ["rice", "wheat", "maize"],
    "sandy": ["potatoes", "carrots", "peanuts"],
    "loamy": ["cotton", "soybeans", "vegetables"],
    "black": ["cotton", "sugarcane", "sunflower"],
    "red": ["groundnut", "millet", "pulses"]
}

SEASONAL_CROPS = {
    "winter": ["wheat", "peas", "mustard"],
    "summer": ["maize", "cotton", "sunflower"],
    "monsoon": ["rice", "soybeans", "pulses"]
}

REGIONAL_CROPS = {
    "north": ["wheat", "rice", "sugarcane"],
    "south": ["rice", "coconut", "spices"],
    "east": ["rice", "jute", "tea"],
    "west": ["cotton", "groundnut", "dates"]
}

def get_season(month: int) -> str:
    if month in [12, 1, 2]:
        return "winter"
    elif month in [3, 4, 5]:
        return "summer"
    else:
        return "monsoon"

@app.post("/api/recommend-crops", response_model=CropRecommendationResponse)
async def recommend_crops(request: CropRecommendationRequest):
    try:
        current_season = get_season(request.month)
        
        soil_suitable = set(SOIL_TYPES.get(request.soil_type.lower(), []))
        season_suitable = set(SEASONAL_CROPS.get(current_season, []))
        region_suitable = set(REGIONAL_CROPS.get(request.region.lower(), []))

        recommended_crops = list(soil_suitable.intersection(season_suitable, region_suitable))

        if not recommended_crops:
            recommended_crops = list(soil_suitable.intersection(season_suitable))

        return {
            "recommended_crops": recommended_crops,
            "season": current_season,
            "soil_type": request.soil_type,
            "region": request.region,
            "confidence_score": len(recommended_crops) / 10,
            "additional_info": {
                "soil_suitable": list(soil_suitable),
                "season_suitable": list(season_suitable),
                "region_suitable": list(region_suitable)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Hello World"}

pest_service = PestDetectionService()

@app.post("/api/detect-pest", response_model=PestDetectionResponse)
async def detect_pest(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        result = pest_service.detect_pest(contents)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))