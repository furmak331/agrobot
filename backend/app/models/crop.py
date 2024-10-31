from app import db

class Crop(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    season = db.Column(db.String(50), nullable=False)
    min_temp = db.Column(db.Float)
    max_temp = db.Column(db.Float)
    rainfall = db.Column(db.Float)
    soil_type = db.Column(db.String(100))
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'season': self.season,
            'min_temp': self.min_temp,
            'max_temp': self.max_temp,
            'rainfall': self.rainfall,
            'soil_type': self.soil_type
        }
