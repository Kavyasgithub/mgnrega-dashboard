import React from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Fade, 
  LinearProgress,
  Stack,
  useTheme,
  alpha,
  keyframes
} from '@mui/material';
import { WorkOutline as WorkIcon } from '@mui/icons-material';

// Animated pulse keyframe
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// Floating animation
const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

function LoadingScreen({ 
  message = 'Loading MGNREGA data...', 
  size = 60,
  variant = 'circular', // 'circular', 'linear', 'logo'
  fullscreen = false 
}) {
  const theme = useTheme();

  const LoadingContent = () => {
    switch (variant) {
      case 'linear':
        return (
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <LinearProgress 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                }
              }} 
            />
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ mt: 2, textAlign: 'center', fontWeight: 500 }}
            >
              {message}
            </Typography>
          </Box>
        );
      
      case 'logo':
        return (
          <Stack alignItems="center" spacing={3}>
            <Box
              sx={{
                p: 3,
                borderRadius: '50%',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                animation: `${pulse} 2s ease-in-out infinite`,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <WorkIcon 
                sx={{ 
                  fontSize: size, 
                  color: 'primary.main',
                  animation: `${float} 3s ease-in-out infinite`,
                }} 
              />
            </Box>
            
            <Box textAlign="center">
              <Typography 
                variant="h6" 
                color="text.primary"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                MGNREGA Dashboard
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontWeight: 400 }}
              >
                {message}
              </Typography>
            </Box>

            {/* Animated dots */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    animation: `${pulse} 1.4s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </Box>
          </Stack>
        );
      
      default: // circular
        return (
          <Stack alignItems="center" spacing={2}>
            <Box sx={{ position: 'relative' }}>
              <CircularProgress 
                size={size} 
                thickness={4}
                sx={{
                  color: 'primary.main',
                  animationDuration: '1.2s',
                }}
              />
              <CircularProgress 
                size={size + 10} 
                thickness={2}
                variant="determinate"
                value={25}
                sx={{
                  color: alpha(theme.palette.secondary.main, 0.3),
                  position: 'absolute',
                  top: -5,
                  left: -5,
                  animationDuration: '2s',
                  transform: 'rotate(90deg)',
                }}
              />
            </Box>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ textAlign: 'center', fontWeight: 500 }}
            >
              {message}
            </Typography>
          </Stack>
        );
    }
  };

  return (
    <Fade in={true} timeout={300}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight={fullscreen ? '100vh' : '60vh'}
        sx={{ 
          p: 4,
          background: fullscreen ? 
            `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.secondary.main, 0.02)})` :
            'transparent'
        }}
      >
        <LoadingContent />
      </Box>
    </Fade>
  );
}

export default LoadingScreen;