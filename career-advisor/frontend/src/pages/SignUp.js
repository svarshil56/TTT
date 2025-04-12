import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Avatar,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PhotoCamera } from '@mui/icons-material';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setError('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some(user => user.email === formData.email);
      
      if (userExists) {
        setError('An account with this email already exists');
        return;
      }

      // Create user data object
      const userData = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password, // Note: In a real app, this should be hashed
        profileImage: profileImage || null,
        createdAt: new Date().toISOString(),
        careerAssessment: false,
        skills: [],
        experience: [],
        education: [],
      };

      // Store user data in localStorage
      users.push(userData);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Store current user (without password)
      const { password, ...userWithoutPassword } = userData;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Navigate to profile page
      navigate('/profile');
    } catch (err) {
      console.error('Error creating account:', err);
      setError('Error creating account. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, marginBottom: 8 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h5" gutterBottom>
              Create Your Account
            </Typography>

            {/* Profile Image Upload */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mb: 2,
                  bgcolor: profileImage ? 'transparent' : 'primary.main',
                }}
                src={profileImage}
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="profile-image-upload">
                <IconButton
                  color="primary"
                  aria-label="upload profile picture"
                  component="span"
                >
                  <PhotoCamera />
                </IconButton>
              </label>
            </Box>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="firstName"
                label="First Name"
                autoFocus
                value={formData.firstName}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Link href="#" variant="body2" onClick={() => navigate('/login')}>
                  Already have an account? Sign in
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp; 