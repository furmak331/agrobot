class WeatherAPIException(Exception):
    """Exception raised when weather API requests fail"""
    pass

class PestDetectionException(Exception):
    """Exception raised when pest detection fails"""
    pass

class CropRecommendationException(Exception):
    """Exception raised when crop recommendation fails"""
    pass
