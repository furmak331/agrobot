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
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Container,
  Slider
} from '@mui/material';
import GrassIcon from '@mui/icons-material/Grass';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import LandscapeIcon from '@mui/icons-material/Landscape';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const soilTypes = ['Clay', 'Sandy', 'Loamy', 'Black', 'Red'];
const regions = ['North', 'South', 'East', 'West'];
const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

function CropRecommendation() {
  const [formData, setFormData] = useState({
    soil_type: '',
    region: '',
    month: new Date().getMonth() + 1,
    rainfall: 50,
    temperature: 25,
  });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/recommend-crops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Server error: ' + response.statusText);
      }
      
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCropIcon = (cropName) => {
    // This is a simple function to provide a consistent color for each crop
    const colors = ['#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800'];
    const index = cropName.length % colors.length;
    return colors[index];
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom fontWeight="medium" color="primary">
              Crop Recommendation System
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Fill in the details below to get personalized crop recommendations based on your soil type, region, and current climate conditions.
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Soil Type</InputLabel>
                    <Select
                      value={formData.soil_type}
                      label="Soil Type"
                      onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                      required
                      startAdornment={<LandscapeIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                    >
                      {soilTypes.map((soil) => (
                        <MenuItem key={soil} value={soil.toLowerCase()}>
                          {soil}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Region</InputLabel>
                    <Select
                      value={formData.region}
                      label="Region"
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      required
                      startAdornment={<PlaceIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                    >
                      {regions.map((region) => (
                        <MenuItem key={region} value={region.toLowerCase()}>
                          {region}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Month</InputLabel>
                    <Select
                      value={formData.month}
                      label="Month"
                      onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                      required
                      startAdornment={<CalendarMonthIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                    >
                      {months.map((month, index) => (
                        <MenuItem key={month} value={index + 1}>
                          {month}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography gutterBottom>
                    Average Rainfall (mm)
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WaterDropIcon sx={{ color: '#2196f3', mr: 2 }} />
                    <Slider
                      value={formData.rainfall}
                      onChange={(e, newValue) => setFormData({ ...formData, rainfall: newValue })}
                      min={0}
                      max={500}
                      step={10}
                      valueLabelDisplay="auto"
                      sx={{ color: '#2196f3' }}
                    />
                    <Typography sx={{ ml: 2, minWidth: 40 }}>
                      {formData.rainfall}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography gutterBottom>
                    Average Temperature (°C)
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ThermostatIcon sx={{ color: '#ff9800', mr: 2 }} />
                    <Slider
                      value={formData.temperature}
                      onChange={(e, newValue) => setFormData({ ...formData, temperature: newValue })}
                      min={-10}
                      max={50}
                      valueLabelDisplay="auto"
                      sx={{ color: '#ff9800' }}
                    />
                    <Typography sx={{ ml: 2, minWidth: 40 }}>
                      {formData.temperature}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    disabled={loading || !formData.soil_type || !formData.region}
                    sx={{ mt: 1, borderRadius: 2, py: 1.5 }}
                  >
                    {loading ? <CircularProgress size={24} /> : "Get Recommendations"}
                  </Button>
                </Grid>
              </Grid>
            </form>
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          {recommendations ? (
            <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" color="primary" fontWeight="medium">
                  Recommended Crops
                </Typography>
                <Chip 
                  label={`Confidence: ${Math.round(recommendations.confidence_score * 100)}%`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                <Chip 
                  icon={<CalendarMonthIcon />}
                  label={`Season: ${recommendations.season.charAt(0).toUpperCase() + recommendations.season.slice(1)}`}
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
                <Chip 
                  icon={<LandscapeIcon />}
                  label={`Soil: ${recommendations.soil_type.charAt(0).toUpperCase() + recommendations.soil_type.slice(1)}`}
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
                <Chip 
                  icon={<PlaceIcon />}
                  label={`Region: ${recommendations.region.charAt(0).toUpperCase() + recommendations.region.slice(1)}`}
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
              </Box>
              
              {recommendations.recommended_crops.length > 0 ? (
                <Grid container spacing={2}>
                  {recommendations.recommended_crops.map((crop) => (
                    <Grid item xs={12} sm={6} key={crop}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: '50%',
                              bgcolor: getCropIcon(crop),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              flexShrink: 0
                            }}
                          >
                            <GrassIcon />
                          </Box>
                          <Box>
                            <Typography variant="h6">
                              {crop.charAt(0).toUpperCase() + crop.slice(1)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Recommended for {recommendations.season} season
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">
                  No specific crops match all your criteria. Try adjusting your parameters for better recommendations.
                </Alert>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Additional Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardHeader title="Soil-Suitable" titleTypographyProps={{ variant: 'subtitle2' }} />
                    <Divider />
                    <CardContent sx={{ maxHeight: 150, overflow: 'auto', pt: 1 }}>
                      <List dense>
                        {recommendations.additional_info.soil_suitable.map((crop) => (
                          <ListItem key={crop} disablePadding>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <GrassIcon fontSize="small" sx={{ color: getCropIcon(
