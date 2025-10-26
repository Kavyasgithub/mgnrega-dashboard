import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  AlertTitle,
  Container,
  Stack,
  Avatar,
  LinearProgress,
  IconButton,
  useTheme,
  alpha,
  Fade,
  Grow,
  Badge
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Compare as CompareIcon,
  LocationOn as LocationIcon,
  Analytics as AnalyticsIcon,
  WorkOutline as WorkIcon,
  AccountBalance as BudgetIcon,
  Group as GroupIcon,
  Assessment as ReportIcon,
  Notifications as NotificationIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import DistrictSelector from '../components/DistrictSelector/DistrictSelector';
import LoadingScreen from '../components/LoadingScreen';
import { MetricCard, StatsGrid } from '../components/DataVisualization/MetricCards';

function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { selectedDistrict, actions } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const nationalStats = [
    {
      title: 'Total Job Cards',
      value: '14.2Cr',
      icon: <GroupIcon />,
      color: 'primary',
      trend: 'up',
      trendValue: '+2.5%',
      subtitle: 'Active households',
    },
    {
      title: 'Work Completion',
      value: '87%',
      icon: <WorkIcon />,
      color: 'success',
      progress: 87,
      subtitle: 'This financial year',
    },
    {
      title: 'Budget Utilized',
      value: '₹73,000Cr',
      icon: <BudgetIcon />,
      color: 'secondary',
      trend: 'up',
      trendValue: '+12%',
      subtitle: 'Out of ₹84,000Cr allocated',
    },
    {
      title: 'Active Districts',
      value: '685',
      icon: <LocationIcon />,
      color: 'info',
      subtitle: 'Across all states',
    },
  ];

  const quickActions = [
    {
      title: 'Compare Districts',
      description: 'Performance across multiple districts',
      icon: <CompareIcon />,
      action: () => navigate('/compare'),
      color: 'primary',
      gradient: true,
    },
    {
      title: 'View Analytics',
      description: 'Deep dive into trends and insights',
      icon: <AnalyticsIcon />,
      action: () => navigate('/analytics'),
      color: 'secondary',
      gradient: true,
    },
    {
      title: 'State Overview',
      description: 'See state-wide performance metrics',
      icon: <TrendingUpIcon />,
      action: () => navigate('/analytics?view=state'),
      color: 'success',
      gradient: true,
    }
  ];

  const featuredStates = [
    { name: 'Rajasthan', performance: 95, color: 'success' },
    { name: 'Telangana', performance: 88, color: 'primary' },
    { name: 'Kerala', performance: 82, color: 'secondary' },
  ];

  const handleDistrictSelect = (district) => {
    setIsLoading(true);
    actions.setSelectedDistrict(district);
    setTimeout(() => {
      setIsLoading(false);
      if (district) {
        navigate(`/district/${district.districtCode}`);
      }
    }, 1500);
  };

  if (isLoading) {
    return <LoadingScreen variant="logo" message="Loading district data..." fullscreen />;
  }

  return (
    <Fade in timeout={600}>
      <Box>
        {/* Hero Section */}
        <Box 
          sx={{ 
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
            borderRadius: 4,
            p: 4,
            mb: 6,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -50,
              right: -50,
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
            }
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      backgroundColor: theme.palette.primary.main,
                    }}
                  >
                    <DashboardIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
                      MGNREGA Dashboard
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      District Performance Analytics Platform
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
                  Comprehensive analytics for the Mahatma Gandhi National Rural Employment 
                  Guarantee Act program. Monitor employment generation, budget utilization, 
                  and performance metrics across all districts in India.
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    startIcon={<LocationIcon />}
                    onClick={() => document.getElementById('district-selector')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Select District
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    startIcon={<AnalyticsIcon />}
                    onClick={() => navigate('/analytics')}
                  >
                    View Analytics
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <WorkIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Real-time Data
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Updated daily from official government sources
                  </Typography>
                  <Chip 
                    label="Live" 
                    color="success" 
                    size="small" 
                    sx={{ mt: 2 }}
                    icon={<Badge color="success" variant="dot" />}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* National Statistics */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            National Overview
          </Typography>
          <StatsGrid stats={nationalStats} />
        </Box>

        {/* District Selection Section */}
        <Card 
          id="district-selector"
          sx={{ 
            mb: 6,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.background.paper, 1)})`,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ mr: 2, color: 'primary.main' }} />
                  Select Your District
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Choose a district to explore detailed MGNREGA performance data, historical trends, 
                  and comparative insights. Get access to employment statistics, budget allocation, 
                  and project completion rates.
                </Typography>
                
                <Box sx={{ maxWidth: 500, mb: 3 }}>
                  <DistrictSelector
                    value={selectedDistrict}
                    onChange={handleDistrictSelect}
                    label="Search for a district"
                    placeholder="Type district name..."
                    fullWidth
                  />
                </Box>

                {selectedDistrict && (
                  <Grow in timeout={500}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Chip
                        icon={<StarIcon />}
                        label={`${selectedDistrict.districtName}, ${selectedDistrict.stateName}`}
                        color="primary"
                        variant="filled"
                        onDelete={() => actions.setSelectedDistrict(null)}
                        sx={{ fontWeight: 600 }}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate(`/district/${selectedDistrict.districtCode}`)}
                      >
                        View Details
                      </Button>
                    </Stack>
                  </Grow>
                )}
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Top Performing States
                  </Typography>
                  <Stack spacing={2}>
                    {featuredStates.map((state, index) => (
                      <Box key={state.name} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ minWidth: 80 }}>
                          {state.name}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={state.performance}
                          sx={{
                            flex: 1,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: alpha(theme.palette[state.color].main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              backgroundColor: theme.palette[state.color].main,
                            }
                          }}
                        />
                        <Typography variant="caption" fontWeight={600} color={`${state.color}.main`}>
                          {state.performance}%
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            Quick Actions
          </Typography>
          
          <Grid container spacing={3}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Grow in timeout={600 + index * 100}>
                  <Card 
                    sx={{ 
                      height: 200,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: action.gradient ? 
                        `linear-gradient(135deg, ${alpha(theme.palette[action.color].main, 0.1)}, ${alpha(theme.palette[action.color].main, 0.05)})` :
                        'background.paper',
                      border: `2px solid transparent`,
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[4],
                        borderColor: alpha(theme.palette[action.color].main, 0.3),
                      }
                    }}
                    onClick={action.action}
                  >
                    <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            backgroundColor: theme.palette[action.color].main,
                            mr: 2,
                          }}
                        >
                          {action.icon}
                        </Avatar>
                        <Typography variant="h6" fontWeight={600}>
                          {action.title}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 'auto' }}>
                        {action.description}
                      </Typography>
                      
                      <Button
                        variant="outlined"
                        color={action.color}
                        endIcon={<ArrowForwardIcon />}
                        sx={{ alignSelf: 'flex-start', mt: 2 }}
                      >
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Information Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Grow in timeout={800}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ backgroundColor: 'primary.main', mr: 2 }}>
                      <ReportIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight={600} color="primary">
                      About MGNREGA
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) 
                    is India's flagship social security scheme that guarantees 100 days of 
                    wage employment per year to rural households whose adult members volunteer 
                    to do unskilled manual work.
                  </Typography>
                  
                  <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                    <Chip label="100 Days Guarantee" size="small" color="primary" variant="outlined" />
                    <Chip label="Rural Focus" size="small" color="secondary" variant="outlined" />
                    <Chip label="Demand-Driven" size="small" color="success" variant="outlined" />
                  </Stack>
                  
                  <Button
                    variant="text"
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/about')}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Grow in timeout={900}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ backgroundColor: 'secondary.main', mr: 2 }}>
                      <NotificationIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight={600} color="secondary">
                      Data Source & Updates
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    All data is sourced from official government APIs including data.gov.in, 
                    MGNREGA official portals, and state government databases. The dashboard 
                    updates daily with the latest available information.
                  </Typography>
                  
                  <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                    <Chip label="Daily Updates" size="small" color="success" variant="outlined" />
                    <Chip label="Official Sources" size="small" color="primary" variant="outlined" />
                    <Chip label="Verified Data" size="small" color="warning" variant="outlined" />
                  </Stack>
                  
                  <Button
                    variant="text"
                    color="secondary"
                    endIcon={<ArrowForwardIcon />}
                    href="https://data.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit data.gov.in
                  </Button>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
}

export default Dashboard;