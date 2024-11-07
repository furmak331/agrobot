import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import ChatInterface from '../components/ChatInterface';
import { styled } from '@mui/material/styles';

// Styled components
const GradientBackground = styled(Box)({
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  minHeight: '100vh',
  padding: '2rem 0',
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  padding: theme.spacing(4),
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: 'linear-gradient(45deg, #1a237e 30%, #4caf50 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  fontSize: '2.5rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  fontSize: '1.1rem',
}));

const HighlightBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #4caf50 0%, #1a237e 100%)',
  opacity: 0.1,
  filter: 'blur(60px)',
  zIndex: 0,
}));

function Home() {
  return (
    <GradientBackground>
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        {/* Decorative elements */}
        <HighlightBox sx={{ top: -100, left: -100 }} />
        <HighlightBox sx={{ bottom: -100, right: -100 }} />
        
        <StyledPaper elevation={0}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Title variant="h1">
              AgroBot Assistant
            </Title>
            
            <Subtitle variant="h6">
              Your intelligent farming companion powered by AI
            </Subtitle>

            <Box sx={{ 
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -20,
                left: -20,
                right: -20,
                bottom: -20,
                background: 'linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(26, 35, 126, 0.1))',
                borderRadius: '25px',
                zIndex: -1,
              }
            }}>
              <ChatInterface />
            </Box>
          </Box>
        </StyledPaper>

        {/* Optional: Add a footer or additional information */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center" 
          sx={{ mt: 4, opacity: 0.8 }}
        >
          Empowering farmers with intelligent solutions
        </Typography>
      </Container>
    </GradientBackground>
  );
}

export default Home; 