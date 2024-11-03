from pydantic import BaseModel
from typing import List

class PestDetectionResponse(BaseModel):
    pest_name: str
    confidence: float
    description: str
    treatment: List[str]
