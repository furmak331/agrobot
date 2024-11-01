from fastapi import APIRouter, HTTPException
from app.models.crop_recommendation import CropRecommendationRequest, CropRecommendationResponse
from app.services.crop_service import CropRecommender

router = APIRouter()
crop_recommender = CropRecommender()

@router.post("/recommend-crops", response_model=CropRecommendationResponse)
async def recommend_crops(request: CropRecommendationRequest):
    try:
        recommendations = crop_recommender.recommend_crops(
            soil_type=request.soil_type,
            region=request.region,
            month=request.month,
            rainfall=request.rainfall,
            temperature=request.temperature
        )
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
