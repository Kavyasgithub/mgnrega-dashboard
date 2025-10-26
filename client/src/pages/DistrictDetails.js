import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  TrendingUp as TrendingUpIcon,
  Compare as CompareIcon
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useApp } from '../contexts/AppContext';
import { dataService, districtService } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import ErrorMessage from '../components/ErrorMessage';

function DistrictDetails() {
  const { districtCode } = useParams();
  const navigate = useNavigate();
  const { selectedFinancialYear, actions } = useApp();

  // Fetch district details
  const {
    data: districtInfo,
    isLoading: isLoadingDistrict,
    error: districtError
  } = useQuery(
    ['district', districtCode],
    () => districtService.getDistrictDetails(districtCode),
    {
      enabled: !!districtCode
    }
  );

  // Fetch district data
  const {
    data: districtData,
    isLoading: isLoadingData,
    error: dataError
  } = useQuery(
    ['districtData', districtCode, selectedFinancialYear],
    () => dataService.getDistrictData(districtCode, selectedFinancialYear),
    {
      enabled: !!districtCode && !!selectedFinancialYear
    }
  );

  if (isLoadingDistrict || isLoadingData) {
    return <LoadingScreen message="Loading district information..." />;
  }

  if (districtError || dataError) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <ErrorMessage 
          message={districtError?.message || dataError?.message || 'Failed to load district data'} 
          title="Error Loading District"
        />
      </Box>
    );
  }

  const district = districtInfo?.district;
  const data = districtData?.data;

  if (!district) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Alert severity="warning">
          District not found. Please select a valid district.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          {district.districtName}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {district.stateName}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip 
            label={`District Code: ${district.districtCode}`} 
            size="small" 
            variant="outlined" 
          />
          <Chip 
            label={`Financial Year: ${selectedFinancialYear}`} 
            size="small" 
            color="primary" 
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<CompareIcon />}
            onClick={() => {
              actions.addComparisonDistrict(district);
              navigate('/compare');
            }}
          >
            Add to Compare
          </Button>
          <Button
            variant="outlined"
            startIcon={<TrendingUpIcon />}
            onClick={() => navigate(`/analytics?district=${districtCode}`)}
          >
            View Analytics
          </Button>
        </Box>
      </Box>

      {/* Data Display */}
      {!data ? (
        <Alert severity="info">
          No data available for this district in {selectedFinancialYear}. 
          This could be because the data is still being collected or the district 
          did not participate in MGNREGA during this period.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Performance Score */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" gutterBottom>
                  {data.overallPerformanceScore || 0}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Overall Performance Score
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Out of 100
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Employment Statistics */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Employment Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Work Demand (Persons)
                    </Typography>
                    <Typography variant="h6">
                      {data.demandForWork?.persons?.toLocaleString() || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Work Provided (Persons)
                    </Typography>
                    <Typography variant="h6">
                      {data.workProvided?.persons?.toLocaleString() || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Budget Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Budget & Expenditure
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Approved Budget
                </Typography>
                <Typography variant="h6" gutterBottom>
                  ₹{(data.budget?.approved / 10000000)?.toFixed(2) || 0} Cr
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Expenditure
                </Typography>
                <Typography variant="h6">
                  ₹{(data.budget?.expenditure / 10000000)?.toFixed(2) || 0} Cr
                </Typography>
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                  Utilization: {data.performance?.utilizationRate || 0}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Works Completion */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Works Status
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed Works
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {data.worksCompleted?.total?.toLocaleString() || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ongoing Works
                </Typography>
                <Typography variant="h6">
                  {data.worksCompleted?.ongoing?.toLocaleString() || 0}
                </Typography>
                <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                  Completion Rate: {data.performance?.completionRate || 0}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Data Quality Information */}
      {data && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Data Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body2">
                  {new Date(data.dataQuality?.lastUpdated).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Data Source
                </Typography>
                <Typography variant="body2">
                  {data.dataQuality?.source || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Confidence Level
                </Typography>
                <Typography variant="body2">
                  {data.dataQuality?.confidence || 0}%
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Verified
                </Typography>
                <Chip
                  label={data.dataQuality?.isVerified ? 'Yes' : 'No'}
                  size="small"
                  color={data.dataQuality?.isVerified ? 'success' : 'default'}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default DistrictDetails;