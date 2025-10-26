import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Tab,
  Tabs,
  Stack,
  Avatar,
  Chip,
  LinearProgress,
  useTheme,
  alpha,
  Fade,
  Grow
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Insights as InsightsIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { MetricCard, StatsGrid } from '../components/DataVisualization/MetricCards';
import LoadingScreen from '../components/LoadingScreen';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function Analytics() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Mock analytics data
  const analyticsOverview = [
    {
      title: 'Employment Generated',
      value: '285M',
      unit: 'person-days',
      icon: <TrendingUpIcon />,
      color: 'success',
      trend: 'up',
      trendValue: '+15.2%',
      subtitle: 'Last financial year',
    },
    {
      title: 'Average Wage Rate',
      value: '₹202',
      icon: <BarChartIcon />,
      color: 'primary',
      trend: 'up',
      trendValue: '+8.5%',
      subtitle: 'Per person per day',
    },
    {
      title: 'Work Completion Rate',
      value: '89.2%',
      icon: <AssessmentIcon />,
      color: 'secondary',
      progress: 89.2,
      subtitle: 'On-time project completion',
    },
    {
      title: 'Women Participation',
      value: '56.8%',
      icon: <PieChartIcon />,
      color: 'info',
      trend: 'up',
      trendValue: '+3.2%',
      subtitle: 'Of total employment',
    },
  ];

  const trendingInsights = [
    {
      title: 'Rural Road Construction',
      description: 'Highest growth sector in Q3 2024',
      growth: '+42%',
      color: 'success',
      icon: <TrendingUpIcon />,
    },
    {
      title: 'Water Conservation',
      description: 'Improved efficiency in project completion',
      growth: '+28%',
      color: 'primary',
      icon: <InsightsIcon />,
    },
    {
      title: 'Digital Payments',
      description: 'Increased adoption across states',
      growth: '+65%',
      color: 'secondary',
      icon: <TimelineIcon />,
    },
  ];

  const statePerformance = [
    { state: 'Rajasthan', score: 95, employment: '45M', budget: '₹12,500Cr' },
    { state: 'Uttar Pradesh', score: 88, employment: '52M', budget: '₹15,200Cr' },
    { state: 'Madhya Pradesh', score: 85, employment: '38M', budget: '₹9,800Cr' },
    { state: 'West Bengal', score: 82, employment: '35M', budget: '₹8,900Cr' },
    { state: 'Odisha', score: 79, employment: '28M', budget: '₹7,400Cr' },
  ];

  if (loading) {
    return <LoadingScreen variant="logo" message="Loading analytics data..." />;
  }

  return (
    <Fade in timeout={600}>
      <Box>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                backgroundColor: 'primary.main',
              }}
            >
              <AnalyticsIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 800 }}>
                Analytics & Insights
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Deep dive into MGNREGA performance trends and patterns
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Key Metrics */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Key Performance Indicators
          </Typography>
          <StatsGrid stats={analyticsOverview} />
        </Box>

        {/* Analytics Tabs */}
        <Card sx={{ mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  minHeight: 60,
                },
              }}
            >
              <Tab label="Overview" icon={<AssessmentIcon />} iconPosition="start" />
              <Tab label="Trends" icon={<TimelineIcon />} iconPosition="start" />
              <Tab label="State Analysis" icon={<BarChartIcon />} iconPosition="start" />
              <Tab label="Insights" icon={<InsightsIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card
                  sx={{
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <BarChartIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Interactive Charts Coming Soon
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Employment trends, budget utilization, and performance metrics visualization
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <Typography variant="h6" fontWeight={600}>
                    Trending Insights
                  </Typography>
                  {trendingInsights.map((insight, index) => (
                    <Grow key={index} in timeout={600 + index * 100}>
                      <Card
                        sx={{
                          background: `linear-gradient(135deg, ${alpha(theme.palette[insight.color].main, 0.1)}, ${alpha(theme.palette[insight.color].main, 0.05)})`,
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar
                              sx={{
                                width: 36,
                                height: 36,
                                backgroundColor: theme.palette[insight.color].main,
                              }}
                            >
                              {insight.icon}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {insight.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {insight.description}
                              </Typography>
                            </Box>
                            <Chip
                              label={insight.growth}
                              color={insight.color}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grow>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Card
              sx={{
                height: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)}, ${alpha(theme.palette.info.main, 0.05)})`,
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <TimelineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Trend Analysis Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Historical data analysis, seasonal patterns, and predictive insights
                </Typography>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                State Performance Ranking
              </Typography>
              <Stack spacing={2}>
                {statePerformance.map((state, index) => (
                  <Grow key={state.state} in timeout={400 + index * 100}>
                    <Card>
                      <CardContent sx={{ p: 3 }}>
                        <Grid container alignItems="center" spacing={3}>
                          <Grid item xs={12} sm={3}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  backgroundColor: 'primary.main',
                                  fontSize: '1rem',
                                  fontWeight: 600,
                                }}
                              >
                                {index + 1}
                              </Avatar>
                              <Typography variant="h6" fontWeight={600}>
                                {state.state}
                              </Typography>
                            </Stack>
                          </Grid>
                          
                          <Grid item xs={12} sm={3}>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Performance Score
                              </Typography>
                              <Typography variant="h6" color="primary.main" fontWeight={600}>
                                {state.score}%
                              </Typography>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} sm={3}>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Employment Generated
                              </Typography>
                              <Typography variant="h6" fontWeight={600}>
                                {state.employment}
                              </Typography>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} sm={3}>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Budget Utilized
                              </Typography>
                              <Typography variant="h6" fontWeight={600}>
                                {state.budget}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                        
                        <LinearProgress
                          variant="determinate"
                          value={state.score}
                          sx={{
                            mt: 2,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                            }
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grow>
                ))}
              </Stack>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Card
              sx={{
                height: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)}, ${alpha(theme.palette.warning.main, 0.05)})`,
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <InsightsIcon sx={{ fontSize: 80, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  AI-Powered Insights
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Machine learning recommendations and performance optimization suggestions
                </Typography>
              </CardContent>
            </Card>
          </TabPanel>
        </Card>

        {/* Call to Action */}
        <Card
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
          }}
        >
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Want More Detailed Analytics?
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Access advanced reporting features, custom dashboards, and detailed insights 
              with our premium analytics suite.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AssessmentIcon />}
              sx={{ mt: 2 }}
            >
              Upgrade to Pro Analytics
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
}

export default Analytics;