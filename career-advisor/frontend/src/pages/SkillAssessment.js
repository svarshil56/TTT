import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const SkillAssessment = () => {
  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Skill Assessment
        </Typography>
        <Typography variant="body1">
          Evaluate your current skills and discover areas for growth.
        </Typography>
      </Box>
    </Container>
  );
};

export default SkillAssessment; 