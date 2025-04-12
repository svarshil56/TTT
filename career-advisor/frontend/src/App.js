import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import CareerAssessment from './pages/CareerAssessment';
import SkillAssessment from './pages/SkillAssessment';
import JobMarket from './pages/JobMarket';
import CareerPath from './pages/CareerPath';
import ResumeCoach from './pages/ResumeCoach';
import NetworkInsights from './pages/NetworkInsights';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#0F172A', // navy
    },
    secondary: {
      main: '#3B82F6', // blue
    },
    background: {
      default: '#F1F5F9', // light gray
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", sans-serif',
  },
});

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect to career assessment if not completed
  if (!user.careerAssessment && window.location.pathname !== '/career-assessment') {
    return <Navigate to="/career-assessment" replace />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename="/">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route
            path="/career-assessment"
            element={
              <ProtectedRoute>
                <Layout>
                  <CareerAssessment />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <Layout>
                  <SkillAssessment />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/market"
            element={
              <ProtectedRoute>
                <Layout>
                  <JobMarket />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/career-path"
            element={
              <ProtectedRoute>
                <Layout>
                  <CareerPath />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume"
            element={
              <ProtectedRoute>
                <Layout>
                  <ResumeCoach />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/network"
            element={
              <ProtectedRoute>
                <Layout>
                  <NetworkInsights />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 