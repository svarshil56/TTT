import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Your AI Career Partner
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.8 }}>
            Make informed career decisions with personalized guidance and insights
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/skills')}
            sx={{ mr: 2 }}
          >
            Start Assessment
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            onClick={() => navigate('/market')}
          >
            Explore Features
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 