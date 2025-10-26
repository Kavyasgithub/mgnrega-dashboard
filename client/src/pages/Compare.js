import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Stack,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  alpha,
  Fade,
  Grow,
  IconButton
} from '@mui/material';
import {
  Compare as CompareIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  WorkOutline as WorkIcon,
  AccountBalance as BudgetIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useApp } from '../contexts/AppContext';
import DistrictSelector from '../components/DistrictSelector/DistrictSelector';
import { ComparisonCard } from '../components/DataVisualization/MetricCards';

function Compare() {
  const theme = useTheme();
  const { comparisonDistricts, actions } = useApp();
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // Mock comparison data
  const mockDistrictData = {
    'DL01': {
      name: 'Central Delhi',
      state: 'Delhi',
      jobCards: '1.2L',
      employment: '2.8M',
      budget: '₹450Cr',
      utilization: 87,
      wageRate: '₹235',
      completion: 92,
      womenParticipation: 68,
      performance: 'Excellent'
    },
    'MH01': {
      name: 'Mumbai',
      state: 'Maharashtra',
      jobCards: '2.1L',
      employment: '4.2M',
      budget: '₹680Cr',
      utilization: 91,
      wageRate: '₹198',
      completion: 89,
      womenParticipation: 54,
      performance: 'Good'
    },
    'KA01': {
      name: 'Bangalore Rural',
      state: 'Karnataka',
      jobCards: '1.8L',
      employment: '3.5M',
      budget: '₹520Cr',
      utilization: 85,
      wageRate: '₹210',
      completion: 88,
      womenParticipation: 62,
      performance: 'Good'
    }
  };

  const comparisonMetrics = [
    { key: 'jobCards', label: 'Job Cards', icon: <GroupIcon /> },
    { key: 'employment', label: 'Employment Generated', icon: <WorkIcon /> },
    { key: 'budget', label: 'Budget Allocated', icon: <BudgetIcon /> },
    { key: 'utilization', label: 'Budget Utilization %', icon: <AssessmentIcon /> },
    { key: 'wageRate', label: 'Average Wage Rate', icon: <TrendingUpIcon /> },
    { key: 'completion', label: 'Work Completion %', icon: <AssessmentIcon /> },
    { key: 'womenParticipation', label: 'Women Participation %', icon: <GroupIcon /> },
  ];

  const handleAddDistrict = () => {
    if (selectedDistrict && !comparisonDistricts.find(d => d.districtCode === selectedDistrict.districtCode)) {
      actions.addComparisonDistrict(selectedDistrict);
      setSelectedDistrict(null);
    }
  };

  const handleRemoveDistrict = (districtCode) => {
    actions.removeComparisonDistrict(districtCode);
  };

  const getPerformanceColor = (performance) => {
    switch (performance.toLowerCase()) {
      case 'excellent': return 'success';
      case 'good': return 'primary';
      case 'average': return 'warning';
      case 'poor': return 'error';
      default: return 'default';
    }
  };

  return (
    <Fade in timeout={600}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                backgroundColor: 'primary.main',
              }}
            >
              <CompareIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 800 }}>
                Compare Districts
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Side-by-side comparison of MGNREGA performance metrics
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* District Selection */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Add Districts to Compare
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Select up to 5 districts to compare their MGNREGA performance metrics side by side.
            </Typography>
            
            <Grid container spacing={3} alignItems="end">
              <Grid item xs={12} md={8}>
                <DistrictSelector
                  value={selectedDistrict}
                  onChange={setSelectedDistrict}
                  label="Select a district to add"
                  placeholder="Search for a district..."
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddDistrict}
                  disabled={!selectedDistrict || comparisonDistricts.length >= 5}
                  fullWidth
                >
                  Add to Comparison
                </Button>
              </Grid>
            </Grid>

            {/* Selected Districts */}
            {comparisonDistricts.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                  Selected Districts ({comparisonDistricts.length}/5)
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {comparisonDistricts.map((district) => (
                    <Chip
                      key={district.districtCode}
                      label={`${district.districtName}, ${district.stateName}`}
                      onDelete={() => handleRemoveDistrict(district.districtCode)}
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Comparison Results */}
        {comparisonDistricts.length > 0 ? (
          <Box>
            {/* Performance Overview Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {comparisonDistricts.slice(0, 3).map((district, index) => {
                const data = mockDistrictData[district.districtCode] || {
                  name: district.districtName,
                  state: district.stateName,
                  performance: 'Good',
                  utilization: 85,
                  completion: 88
                };
                
                return (
                  <Grid item xs={12} md={4} key={district.districtCode}>
                    <Grow in timeout={600 + index * 100}>
                      <Card
                        sx={{
                          height: 200,
                          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                        }}
                      >
                        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" fontWeight={600}>
                              {data.name}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveDistrict(district.districtCode)}
                              color="error"
                            >
                              <RemoveIcon />
                            </IconButton>
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {data.state}
                          </Typography>
                          
                          <Box sx={{ mb: 'auto' }}>
                            <Chip
                              label={data.performance}
                              color={getPerformanceColor(data.performance)}
                              size="small"
                              sx={{ mb: 2 }}
                            />
                          </Box>
                          
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">
                                Budget Utilization
                              </Typography>
                              <Typography variant="h6" fontWeight={600} color="primary.main">
                                {data.utilization}%
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">
                                Work Completion
                              </Typography>
                              <Typography variant="h6" fontWeight={600} color="success.main">
                                {data.completion}%
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grow>
                  </Grid>
                );
              })}
            </Grid>

            {/* Detailed Comparison Table */}
            <Card>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, pb: 0 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Detailed Comparison
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Compare key performance metrics across selected districts
                  </Typography>
                </Box>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Metric</TableCell>
                        {comparisonDistricts.map((district) => (
                          <TableCell key={district.districtCode} align="center" sx={{ fontWeight: 600 }}>
                            {district.districtName}
                            <Typography variant="caption" display="block" color="text.secondary">
                              {district.stateName}
                            </Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {comparisonMetrics.map((metric) => (
                        <TableRow key={metric.key} hover>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                  color: 'primary.main',
                                }}
                              >
                                {metric.icon}
                              </Avatar>
                              <Typography variant="body2" fontWeight={500}>
                                {metric.label}
                              </Typography>
                            </Stack>
                          </TableCell>
                          {comparisonDistricts.map((district) => {
                            const data = mockDistrictData[district.districtCode] || {};
                            const value = data[metric.key] || 'N/A';
                            
                            return (
                              <TableCell key={district.districtCode} align="center">
                                <Typography variant="body2" fontWeight={600}>
                                  {value}
                                </Typography>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Box>
        ) : (
          /* Empty State */
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <CompareIcon sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Start Comparing Districts
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 500, mx: 'auto' }}>
                Select districts from the dropdown above to compare their MGNREGA performance metrics. 
                You can compare employment generation, budget utilization, work completion rates, and more.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add your first district to get started!
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Fade>
  );
}

export default Compare;