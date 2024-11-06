from pydantic import BaseModel
from typing import Optional, List

class CropRecommendationRequest(BaseModel):
    soil_type: str
    region: str
    month: int
    rainfall: Optional[float] = None
    temperature: Optional[float] = None

class CropRecommendationResponse(BaseModel):
    recommended_crops: List[str]
    season: str
    soil_type: str
    region: str
    confidence_score: float
    additional_info: dict 