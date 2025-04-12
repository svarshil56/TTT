import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
  FormGroup,
  Checkbox,
  CircularProgress,
  Card,
  CardContent,
  FormLabel,
  LinearProgress,
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getCareerSuggestions, parseSuggestions } from '../services/aiService';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaLaptopCode, FaChartLine, FaUserTie, FaArrowRight, FaArrowLeft, FaQuestionCircle, FaLightbulb } from 'react-icons/fa';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const steps = [
  { label: 'Discover Yourself', icon: <FaUserTie /> },
  { label: 'Skills & Interests', icon: <FaChartLine /> },
  { label: 'Career Goals', icon: <FaLightbulb /> }
];

const questions = {
  'Discover Yourself': [
    {
      id: 'interests',
      question: 'What activities make you feel most engaged?',
      type: 'text',
      placeholder: 'Describe activities that energize you...'
    },
    {
      id: 'values',
      question: 'What values are most important to you in a career?',
      type: 'checkbox',
      options: [
        'Work-life balance',
        'High salary',
        'Making an impact',
        'Continuous learning',
        'Creativity',
        'Stability'
      ]
    }
  ],
  'Skills & Interests': [
    {
      id: 'skills',
      question: 'What are your strongest skills?',
      type: 'text',
      placeholder: 'List your top skills...'
    },
    {
      id: 'interests',
      question: 'What subjects or topics interest you most?',
      type: 'text',
      placeholder: 'Describe your interests...'
    }
  ],
  'Career Goals': [
    {
      id: 'shortTerm',
      question: 'What are your short-term career goals?',
      type: 'text',
      placeholder: 'Goals for the next 1-2 years...'
    },
    {
      id: 'longTerm',
      question: 'What are your long-term career aspirations?',
      type: 'text',
      placeholder: 'Where do you see yourself in 5-10 years?'
    }
  ]
};

const CareerAssessment = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.careerAssessment) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Starting to save answers:', answers);

      // Get current user
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        throw new Error('User not found');
      }
      console.log('Current user:', user);

      let suggestions = null;
      try {
        // Get AI suggestions
        console.log('Getting AI suggestions...');
        const aiResponse = await getCareerSuggestions(answers);
        console.log('AI Response:', aiResponse);
        suggestions = parseSuggestions(aiResponse);
        console.log('Parsed suggestions:', suggestions);
      } catch (aiError) {
        console.warn('AI Service Error:', aiError);
        // Continue without AI suggestions if the service fails
        suggestions = {
          careers: [],
          skills: [],
          message: 'AI suggestions are currently unavailable. Your answers have been saved successfully.'
        };
      }

      // Update user data
      const updatedUser = {
        ...user,
        careerAssessment: true,
        assessmentAnswers: answers,
        aiSuggestions: suggestions
      };
      console.log('Updated user:', updatedUser);

      // Update users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('Current users:', users);
      const updatedUsers = users.map(u => 
        u.email === user.email ? updatedUser : u
      );
      console.log('Updated users:', updatedUsers);
      
      // Save updates
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Save to profile
      const profileKey = `profile_${user.email}`;
      const profile = JSON.parse(localStorage.getItem(profileKey)) || {};
      console.log('Current profile:', profile);
      const updatedProfile = {
        ...profile,
        careerAssessment: answers,
        aiSuggestions: suggestions
      };
      console.log('Updated profile:', updatedProfile);
      localStorage.setItem(profileKey, JSON.stringify(updatedProfile));

      // Show success message
      setError('Your answers have been saved successfully. ' + (suggestions?.message || ''));
      
      // Navigate to profile after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 2000);

    } catch (error) {
      console.error('Detailed error:', error);
      setError(`Error saving your answers: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    const currentStepQuestions = questions[steps[activeStep].label];
    const answeredQuestions = currentStepQuestions.filter(
      q => answers[q.id] !== undefined && answers[q.id] !== ''
    ).length;
    return (answeredQuestions / currentStepQuestions.length) * 100;
  };

  return (
    <Container maxWidth="md">
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{ py: 4 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700 }}
          >
            Career Assessment
          </Typography>
          <Tooltip title="Need help?">
            <IconButton onClick={() => setShowTips(!showTips)}>
              <FaQuestionCircle />
            </IconButton>
          </Tooltip>
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                icon={step.icon}
                sx={{
                  '& .MuiStepLabel-label': {
                    fontWeight: activeStep === index ? 600 : 400
                  }
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <LinearProgress
          variant="determinate"
          value={calculateProgress()}
          sx={{ height: 8, borderRadius: 4, mb: 4 }}
        />

        <AnimatePresence mode="wait">
          <MotionCard
            key={activeStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            sx={{
              borderRadius: 4,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              mb: 4
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {questions[steps[activeStep].label].map((q, index) => (
                <MotionBox
                  key={q.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  sx={{ mb: 4 }}
                >
                  <Typography variant="h6" gutterBottom>
                    {q.question}
                  </Typography>
                  {q.type === 'text' ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder={q.placeholder}
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswer(q.id, e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                          }
                        }
                      }}
                    />
                  ) : q.type === 'checkbox' ? (
                    <FormGroup>
                      {q.options.map((option) => (
                        <FormControlLabel
                          key={option}
                          control={
                            <Checkbox
                              checked={answers[q.id]?.includes(option) || false}
                              onChange={(e) => {
                                const currentAnswers = answers[q.id] || [];
                                const newAnswers = e.target.checked
                                  ? [...currentAnswers, option]
                                  : currentAnswers.filter((ans) => ans !== option);
                                handleAnswer(q.id, newAnswers);
                              }}
                            />
                          }
                          label={option}
                        />
                      ))}
                    </FormGroup>
                  ) : null}
                </MotionBox>
              ))}
            </CardContent>
          </MotionCard>
        </AnimatePresence>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<FaArrowLeft />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: '50px',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            endIcon={<FaArrowRight />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: '50px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)'
              }
            }}
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </MotionBox>
    </Container>
  );
};

export default CareerAssessment; 