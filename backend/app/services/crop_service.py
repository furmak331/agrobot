class CropRecommender:
    def __init__(self):
        # Define soil types and their characteristics
        self.soil_types = {
            "clay": ["rice", "wheat", "maize"],
            "sandy": ["potatoes", "carrots", "peanuts"],
            "loamy": ["cotton", "soybeans", "vegetables"],
            "black": ["cotton", "sugarcane", "sunflower"],
            "red": ["groundnut", "millet", "pulses"]
        }

        # Define seasonal crops
        self.seasonal_crops = {
            "winter": ["wheat", "peas", "mustard"],
            "summer": ["maize", "cotton", "sunflower"],
            "monsoon": ["rice", "soybeans", "pulses"]
        }

        # Define region-specific crops
        self.regional_crops = {
            "north": ["wheat", "rice", "sugarcane"],
            "south": ["rice", "coconut", "spices"],
            "east": ["rice", "jute", "tea"],
            "west": ["cotton", "groundnut", "dates"]
        }

    def get_season(self, month: int) -> str:
        if month in [12, 1, 2]:
            return "winter"
        elif month in [3, 4, 5]:
            return "summer"
        else:
            return "monsoon"

    def recommend_crops(self, soil_type: str, region: str, month: int,
                       rainfall: float = None, temperature: float = None):
        current_season = self.get_season(month)
        
        soil_suitable = set(self.soil_types.get(soil_type.lower(), []))
        season_suitable = set(self.seasonal_crops.get(current_season, []))
        region_suitable = set(self.regional_crops.get(region.lower(), []))

        recommended_crops = list(soil_suitable.intersection(season_suitable, region_suitable))

        if not recommended_crops:
            recommended_crops = list(soil_suitable.intersection(season_suitable))

        return {
            "recommended_crops": recommended_crops,
            "season": current_season,
            "soil_type": soil_type,
            "region": region,
            "confidence_score": len(recommended_crops) / 10,
            "additional_info": {
                "soil_suitable": list(soil_suitable),
                "season_suitable": list(season_suitable),
                "region_suitable": list(region_suitable)
            }
        }
