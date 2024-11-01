import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';

const soilTypes = ['Clay', 'Sandy', 'Loamy', 'Black', 'Red'];
const regions = ['North', 'South', 'East', 'West'];

function CropRecommendation() {
  const [formData, setFormData] = useState({
    soil_type: '',
    region: '',
    month: new Date().getMonth() + 1,
    rainfall: '',
    temperature: '',
  });
  const [recommendations, setRecommendations] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/recommend-crops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Crop Recommendation System
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Soil Type</InputLabel>
            <Select
              value={formData.soil_type}
              label="Soil Type"
              onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
            >
              {soilTypes.map((soil) => (
                <MenuItem key={soil} value={soil.toLowerCase()}>
                  {soil}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Region</InputLabel>
            <Select
              value={formData.region}
              label="Region"
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            >
              {regions.map((region) => (
                <MenuItem key={region} value={region.toLowerCase()}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
          >
            Get Recommendations
          </Button>
        </form>

        {recommendations && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Recommended Crops
            </Typography>
            <List>
              {recommendations.recommended_crops.map((crop) => (
                <ListItem key={crop}>
                  <ListItemText 
                    primary={crop.charAt(0).toUpperCase() + crop.slice(1)}
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 2 }}>
              <Chip 
                label={`Season: ${recommendations.season}`}
                sx={{ mr: 1, mb: 1 }}
              />
              <Chip 
                label={`Confidence: ${(recommendations.confidence_score * 100).toFixed(0)}%`}
                color="primary"
                sx={{ mr: 1, mb: 1 }}
              />
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default CropRecommendation;
