import React from 'react';
import { Container, Typography } from '@mui/material';
import ChatInterface from '../components/ChatInterface';

function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        AgroBot Chat Assistant
      </Typography>
      <ChatInterface />
    </Container>
  );
}

export default Home; 