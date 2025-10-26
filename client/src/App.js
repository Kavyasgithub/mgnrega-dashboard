import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout/Layout';
import LoadingScreen from './components/LoadingScreen';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const DistrictDetails = React.lazy(() => import('./pages/DistrictDetails'));
const Compare = React.lazy(() => import('./pages/Compare'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const About = React.lazy(() => import('./pages/About'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Loading fallback component
const SuspenseFallback = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="60vh"
  >
    <CircularProgress size={40} />
  </Box>
);

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Home redirects to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Main dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* District details */}
            <Route path="/district/:districtCode" element={<DistrictDetails />} />
            
            {/* Compare districts */}
            <Route path="/compare" element={<Compare />} />
            
            {/* Analytics and insights */}
            <Route path="/analytics" element={<Analytics />} />
            
            {/* About page */}
            <Route path="/about" element={<About />} />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;