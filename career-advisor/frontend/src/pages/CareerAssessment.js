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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getCareerSuggestions, parseSuggestions } from '../services/aiService';

const questions = [
  {
    section: 'Discover Yourself (Inner Compass)',
    description: 'Let\'s explore your true interests, values, and passions',
    questions: [
      {
        id: 'activities',
        question: 'What activities make you feel alive or excited?',
        type: 'text',
        placeholder: 'e.g., solving problems, helping others, designing, exploring, building',
      },
      {
        id: 'passionWork',
        question: 'What kind of work would you do even if it didn\'t pay much?',
        type: 'text',
        placeholder: 'Describe the work that truly motivates you',
      },
      {
        id: 'careerValues',
        question: 'Which of these matter most to you in a career? (Select top 3)',
        type: 'checkbox',
        options: [
          'Money',
          'Impact on society',
          'Work-life balance',
          'Prestige or recognition',
          'Continuous learning',
          'Creativity & freedom',
          'Stability & security',
          'Freedom from control',
        ],
        maxSelections: 3,
      },
      {
        id: 'problemInterests',
        question: 'What kind of problems are you naturally curious about?',
        type: 'text',
        placeholder: 'Describe the types of problems that intrigue you',
      },
      {
        id: 'workPreferences',
        question: 'Do you prefer working with... (Select all that apply)',
        type: 'checkbox',
        options: [
          'People',
          'Data',
          'Systems',
          'Ideas',
          'Nature',
          'Tools & Machines',
        ],
      },
      {
        id: 'dailyFeelings',
        question: 'How do you want to feel in your work daily?',
        type: 'text',
        placeholder: 'e.g., challenged, relaxed, creative, impactful, powerful, useful',
      },
    ],
  },
  {
    section: 'Social Influence Awareness',
    description: 'Let\'s understand external influences on your career choices',
    questions: [
      {
        id: 'externalSuggestions',
        question: 'What career paths have people around you encouraged you to consider?',
        type: 'text',
        placeholder: 'List the career suggestions you\'ve received from others',
      },
      {
        id: 'externalPressure',
        question: 'Do you feel pressure from parents/friends/society in choosing a career?',
        type: 'radio',
        options: [
          'Yes',
          'No',
          'Not Sure',
        ],
      },
      {
        id: 'admiredCareers',
        question: 'What careers do you admire mainly because others do?',
        type: 'text',
        placeholder: 'e.g., Tech entrepreneur, IAS officer, YouTuber',
      },
      {
        id: 'influences',
        question: 'Who are your biggest influences (people, creators, celebrities, etc.)?',
        type: 'text',
        placeholder: 'List the people who influence your career thinking',
      },
      {
        id: 'secretDream',
        question: 'Now... ignoring all of that — what career would YOU secretly love to pursue?',
        type: 'text',
        placeholder: 'Be honest about your dream career',
      },
    ],
  },
  {
    section: 'Skillset & Background',
    description: 'Let\'s understand your current skills and background',
    questions: [
      {
        id: 'educationLevel',
        question: 'Your highest education level?',
        type: 'radio',
        options: [
          'High School',
          'Diploma',
          'Bachelor\'s Degree',
          'Master\'s Degree',
          'Other',
        ],
      },
      {
        id: 'fieldOfStudy',
        question: 'Current field of study / specialization / degree',
        type: 'text',
        placeholder: 'e.g., Computer Science, Business Administration, Psychology',
      },
      {
        id: 'technicalSkills',
        question: 'Top 5 technical or domain-specific skills',
        type: 'text',
        placeholder: 'e.g., Python, UX Design, Marketing, Data Analysis',
      },
      {
        id: 'softSkills',
        question: 'Top 5 soft skills or strengths',
        type: 'text',
        placeholder: 'e.g., Communication, Leadership, Problem-solving, Empathy',
      },
      {
        id: 'tools',
        question: 'Tools/Software/Platforms you\'re comfortable with',
        type: 'text',
        placeholder: 'e.g., Figma, Canva, MATLAB, GitHub, Blender',
      },
      {
        id: 'experience',
        question: 'Any past projects, internships, or jobs worth mentioning?',
        type: 'text',
        placeholder: 'Briefly describe your relevant experience',
      },
    ],
  },
  {
    section: 'Career Preferences & Constraints',
    description: 'Let\'s understand your career preferences and constraints',
    questions: [
      {
        id: 'workEnvironment',
        question: 'Preferred Work Environment',
        type: 'radio',
        options: [
          'Remote',
          'Hybrid',
          'On-site',
          'No Preference',
        ],
      },
      {
        id: 'industries',
        question: 'Preferred Industries',
        type: 'checkbox',
        options: [
          'Technology',
          'Finance',
          'Healthcare',
          'Education',
          'Design',
          'Manufacturing',
          'Retail',
          'Entertainment',
          'Non-profit',
          'Government',
          'Other',
        ],
      },
      {
        id: 'roles',
        question: 'Preferred Roles / Domains (if any)',
        type: 'text',
        placeholder: 'e.g., Product Manager, Data Scientist, UI/UX Designer',
      },
      {
        id: 'learningNewSkills',
        question: 'Are you open to learning new skills for a better career fit?',
        type: 'radio',
        options: [
          'Yes',
          'Maybe',
          'No',
        ],
      },
      {
        id: 'location',
        question: 'Current Location & Willingness to Relocate',
        type: 'text',
        placeholder: 'Current city/country and relocation preference (Yes/No)',
      },
      {
        id: 'languages',
        question: 'Languages you speak fluently',
        type: 'text',
        placeholder: 'List the languages you are fluent in',
      },
      {
        id: 'salary',
        question: 'Expected Salary Range (Optional)',
        type: 'radio',
        options: [
          'Under $50,000',
          '$50,000 - $80,000',
          '$80,000 - $120,000',
          'Above $120,000',
        ],
      },
      {
        id: 'timeline',
        question: 'When are you planning to switch/start a job?',
        type: 'radio',
        options: [
          'Immediately',
          'In 3 months',
          'After graduation',
          'Not sure',
        ],
      },
    ],
  },
];

const CareerAssessment = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.careerAssessment) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleNext = () => {
    const currentSection = questions[activeSection];
    const currentQuestion = currentSection.questions[activeQuestion];
    
    if (!answers[currentQuestion.id]) {
      setError('Please answer the question before proceeding.');
      return;
    }
    setError('');
    
    if (activeQuestion === currentSection.questions.length - 1) {
      if (activeSection === questions.length - 1) {
        saveAnswers();
      } else {
        setActiveSection(prev => prev + 1);
        setActiveQuestion(0);
      }
    } else {
      setActiveQuestion(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeQuestion === 0) {
      if (activeSection > 0) {
        setActiveSection(prev => prev - 1);
        setActiveQuestion(questions[activeSection - 1].questions.length - 1);
      }
    } else {
      setActiveQuestion(prev => prev - 1);
    }
    setError('');
  };

  const handleSkip = () => {
    const currentQuestion = questions[activeSection].questions[activeQuestion];
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: 'Skipped'
    }));
    handleNext();
  };

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    setError('');
  };

  const saveAnswers = async () => {
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

      // Get AI suggestions
      console.log('Getting AI suggestions...');
      const aiResponse = await getCareerSuggestions(answers);
      console.log('AI Response:', aiResponse);
      const suggestions = parseSuggestions(aiResponse);
      console.log('Parsed suggestions:', suggestions);

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

      // Navigate to profile
      navigate('/profile');
    } catch (error) {
      console.error('Detailed error:', error);
      setError(`Error saving your answers: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const currentSection = questions[activeSection];
  const currentQuestion = currentSection.questions[activeQuestion];
  const totalQuestions = questions.reduce((sum, section) => sum + section.questions.length, 0);
  const currentQuestionNumber = questions
    .slice(0, activeSection)
    .reduce((sum, section) => sum + section.questions.length, 0) + activeQuestion + 1;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Career Assessment
          </Typography>
          <Typography variant="h6" gutterBottom align="center" color="primary">
            {currentSection.section}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }} align="center" color="text.secondary">
            {currentSection.description}
          </Typography>

          <Stepper activeStep={activeSection} sx={{ mb: 4 }}>
            {questions.map((section, index) => (
              <Step key={index}>
                <StepLabel>{section.section}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Question {currentQuestionNumber} of {totalQuestions}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {currentQuestion.question}
            </Typography>

            {currentQuestion.type === 'text' ? (
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder={currentQuestion.placeholder}
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              />
            ) : currentQuestion.type === 'radio' ? (
              <FormControl component="fieldset">
                <RadioGroup
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                >
                  {currentQuestion.options.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            ) : currentQuestion.type === 'checkbox' ? (
              <FormControl component="fieldset">
                <FormGroup>
                  {currentQuestion.options.map((option) => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          checked={answers[currentQuestion.id]?.includes(option) || false}
                          onChange={(e) => {
                            const currentAnswers = answers[currentQuestion.id] || [];
                            const newAnswers = e.target.checked
                              ? [...currentAnswers, option]
                              : currentAnswers.filter((ans) => ans !== option);
                            
                            if (currentQuestion.maxSelections && newAnswers.length > currentQuestion.maxSelections) {
                              return;
                            }
                            
                            handleAnswer(currentQuestion.id, newAnswers);
                          }}
                        />
                      }
                      label={option}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            ) : null}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeSection === 0 && activeQuestion === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            <Box>
              <Button
                variant="outlined"
                onClick={handleSkip}
                sx={{ mr: 2 }}
              >
                Skip
              </Button>
              <Button
                variant="contained"
                onClick={activeSection === questions.length - 1 && activeQuestion === currentSection.questions.length - 1
                  ? saveAnswers
                  : handleNext}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : activeSection === questions.length - 1 && activeQuestion === currentSection.questions.length - 1
                  ? 'Finish'
                  : 'Next'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CareerAssessment; 