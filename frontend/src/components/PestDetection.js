import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Container,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function PestDetection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/api/detect-pest', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Pest Detection
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={handleFileSelect}
          />
          <label htmlFor="raised-button-file">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 2 }}
            >
              Upload Image
            </Button>
          </label>

          {preview && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <img
                src={preview}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '300px' }}
              />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!selectedFile || loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Analyze Image'}
          </Button>

          {result && (
            <Box sx={{ mt: 4, width: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Detection Results
              </Typography>
              <Typography variant="subtitle1" color="primary">
                Detected Pest: {result.pest_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Confidence: {(result.confidence * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {result.description}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Recommended Treatment
              </Typography>
              <List>
                {result.treatment.map((step, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`${index + 1}. ${step}`} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default PestDetection;
