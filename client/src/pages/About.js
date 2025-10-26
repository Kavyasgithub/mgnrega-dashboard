import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Link,
  Chip,
  Divider,
  Avatar,
  Stack,
  Button,
  useTheme,
  alpha,
  Fade,
  Grow
} from '@mui/material';
import {
  Info as InfoIcon,
  GitHub as GitHubIcon,
  DataUsage as DataIcon,
  Security as SecurityIcon,
  WorkOutline as WorkIcon,
  Timeline as TimelineIcon,
  Public as PublicIcon
} from '@mui/icons-material';

function About() {
  const theme = useTheme();

  const features = [
    {
      icon: <WorkIcon />,
      title: 'Employment Tracking',
      description: 'Monitor job creation and employment generation across districts',
      color: 'primary'
    },
    {
      icon: <DataIcon />,
      title: 'Real-time Data',
      description: 'Updated daily from official government sources and APIs',
      color: 'secondary'
    },
    {
      icon: <TimelineIcon />,
      title: 'Trend Analysis',
      description: 'Historical data analysis and performance trend visualization',
      color: 'success'
    },
    {
      icon: <PublicIcon />,
      title: 'Transparency',
      description: 'Open data platform promoting government transparency',
      color: 'info'
    }
  ];

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
            textAlign: 'center'
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: 'primary.main',
              mx: 'auto',
              mb: 3,
            }}
          >
            <InfoIcon sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2 }}>
            About MGNREGA Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 600, mx: 'auto' }}>
            A comprehensive analytics platform for understanding MGNREGA program performance 
            across India, built with transparency and accessibility in mind.
          </Typography>
          
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<GitHubIcon />}
              href="https://github.com/mgnrega-dashboard"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Source Code
            </Button>
            <Button
              variant="outlined"
              startIcon={<DataIcon />}
              href="https://data.gov.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              Data Sources
            </Button>
          </Stack>
        </Box>

        {/* Key Features */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
            Key Features
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Grow in timeout={600 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      background: `linear-gradient(135deg, ${alpha(theme.palette[feature.color].main, 0.1)}, ${alpha(theme.palette[feature.color].main, 0.05)})`,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          backgroundColor: theme.palette[feature.color].main,
                          mx: 'auto',
                          mb: 2,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Grid container spacing={4}>
          {/* About MGNREGA */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Avatar sx={{ backgroundColor: 'primary.main' }}>
                    <InfoIcon />
                  </Avatar>
                  <Typography variant="h5" fontWeight={600}>
                    About MGNREGA
                  </Typography>
                </Stack>
                
                <Typography variant="body1" paragraph>
                  The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) is 
                  India's flagship social security scheme that guarantees 100 days of wage 
                  employment per year to rural households whose adult members volunteer to do 
                  unskilled manual work.
                </Typography>
                
                <Typography variant="body1" paragraph>
                  This dashboard empowers citizens, officials, and researchers to understand 
                  program performance through comprehensive analytics and visualizations.
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip label="100 Days Guarantee" color="primary" variant="outlined" />
                  <Chip label="Rural Focus" color="secondary" variant="outlined" />
                  <Chip label="Demand-Driven" color="success" variant="outlined" />
                  <Chip label="Rights-Based" color="info" variant="outlined" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Data Sources */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Avatar sx={{ backgroundColor: 'secondary.main' }}>
                    <DataIcon />
                  </Avatar>
                  <Typography variant="h5" fontWeight={600}>
                    Data Sources
                  </Typography>
                </Stack>
                
                <Typography variant="body1" paragraph>
                  All data is sourced from official government APIs and databases:
                </Typography>
                
                <Stack spacing={1} sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    • <Link href="https://data.gov.in" target="_blank" rel="noopener noreferrer">
                        data.gov.in
                      </Link> - Primary data source
                  </Typography>
                  <Typography variant="body2">
                    • MGNREGA Official Portal - Real-time updates
                  </Typography>
                  <Typography variant="body2">
                    • State Government Databases - Regional data
                  </Typography>
                  <Typography variant="body2">
                    • Census Data - Demographic context
                  </Typography>
                </Stack>
                
                <Typography variant="caption" color="text.secondary">
                  Data is cached locally for reliability when APIs are unavailable.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Technical Features */}
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
                  Technical Features
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Production Ready
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Built with React and Node.js, featuring rate limiting, caching, 
                      error handling, and fallback mechanisms for unreliable APIs.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom color="secondary">
                      Data Reliability
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Multi-layered caching (Redis + in-memory + database) ensures 
                      data availability even when government APIs are down.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom color="success.main">
                      Mobile Responsive
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Optimized for all devices with Material-UI components and 
                      responsive design principles.
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Privacy & Security */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Avatar sx={{ backgroundColor: 'success.main' }}>
                    <SecurityIcon />
                  </Avatar>
                  <Typography variant="h5" fontWeight={600}>
                    Privacy & Security
                  </Typography>
                </Stack>
                
                <Typography variant="body1" paragraph>
                  We take data privacy seriously:
                </Typography>
                
                <Stack spacing={1}>
                  <Typography variant="body2">• No personal data collection</Typography>
                  <Typography variant="body2">• Only public government data displayed</Typography>
                  <Typography variant="body2">• Local storage for preferences only</Typography>
                  <Typography variant="body2">• Secure HTTPS connections</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Open Source */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Avatar sx={{ backgroundColor: 'info.main' }}>
                    <GitHubIcon />
                  </Avatar>
                  <Typography variant="h5" fontWeight={600}>
                    Open Source
                  </Typography>
                </Stack>
                
                <Typography variant="body1" paragraph>
                  This project is open source and available on GitHub. Contributions 
                  are welcome from developers, data scientists, and policy researchers.
                </Typography>
                
                <Typography variant="body2" paragraph>
                  Built with modern technologies:
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip label="React 18" size="small" variant="outlined" />
                  <Chip label="Node.js" size="small" variant="outlined" />
                  <Chip label="Material-UI" size="small" variant="outlined" />
                  <Chip label="MongoDB" size="small" variant="outlined" />
                  <Chip label="Redis" size="small" variant="outlined" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Disclaimer */}
          <Grid item xs={12}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)}, ${alpha(theme.palette.warning.main, 0.05)})`,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Disclaimer & Feedback
                </Typography>
                <Typography variant="body1" paragraph>
                  This dashboard is built to serve citizens and improve transparency in 
                  government programs. Your feedback helps us improve the platform.
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="text.secondary">
                  <strong>Disclaimer:</strong> This is an independent project created for educational and 
                  research purposes. It is not officially affiliated with the Government 
                  of India or MGNREGA administration.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
}

export default About;