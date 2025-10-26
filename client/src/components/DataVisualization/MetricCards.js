import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  alpha,
  LinearProgress,
  Chip,
  Stack,
  Divider,
  Avatar,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
} from '@mui/icons-material';

const MetricCard = ({ 
  title, 
  value, 
  unit = '', 
  subtitle, 
  trend, 
  trendValue, 
  color = 'primary',
  icon,
  progress,
  variant = 'standard',
  size = 'medium',
  onClick,
  loading = false
}) => {
  const theme = useTheme();

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUpIcon fontSize="small" />;
      case 'down': return <TrendingDownIcon fontSize="small" />;
      case 'flat': return <TrendingFlatIcon fontSize="small" />;
      default: return null;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return theme.palette.success.main;
      case 'down': return theme.palette.error.main;
      case 'flat': return theme.palette.text.secondary;
      default: return theme.palette.text.secondary;
    }
  };

  const cardHeight = {
    small: 120,
    medium: 160,
    large: 200,
  };

  if (loading) {
    return (
      <Card 
        sx={{ 
          height: cardHeight[size],
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box 
              sx={{ 
                width: 24, 
                height: 24, 
                borderRadius: 1, 
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                mr: 2 
              }} 
            />
            <Box 
              sx={{ 
                height: 16, 
                flex: 1, 
                borderRadius: 1, 
                backgroundColor: alpha(theme.palette.text.primary, 0.1) 
              }} 
            />
          </Box>
          <Box 
            sx={{ 
              height: 32, 
              width: '60%', 
              borderRadius: 1, 
              backgroundColor: alpha(theme.palette.text.primary, 0.1),
              mb: 'auto'
            }} 
          />
          <LinearProgress sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        height: cardHeight[size],
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: variant === 'gradient' ? 
          `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)}, ${alpha(theme.palette[color].main, 0.05)})` :
          'background.paper',
        border: variant === 'outlined' ? `2px solid ${alpha(theme.palette[color].main, 0.2)}` : undefined,
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
          borderColor: variant === 'outlined' ? alpha(theme.palette[color].main, 0.4) : undefined,
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon && (
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: alpha(theme.palette[color].main, 0.1),
                color: theme.palette[color].main,
                mr: 1.5,
              }}
            >
              {icon}
            </Avatar>
          )}
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontWeight: 500,
              flex: 1,
              lineHeight: 1.2
            }}
          >
            {title}
          </Typography>
          {trend && (
            <Chip
              size="small"
              icon={getTrendIcon(trend)}
              label={trendValue}
              sx={{
                height: 24,
                fontSize: '0.75rem',
                fontWeight: 600,
                color: getTrendColor(trend),
                backgroundColor: alpha(getTrendColor(trend), 0.1),
                border: `1px solid ${alpha(getTrendColor(trend), 0.2)}`,
                '& .MuiChip-icon': {
                  color: getTrendColor(trend),
                },
              }}
            />
          )}
        </Box>

        {/* Value */}
        <Box sx={{ mb: 'auto' }}>
          <Typography 
            variant={size === 'small' ? 'h5' : size === 'large' ? 'h3' : 'h4'} 
            component="div"
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              lineHeight: 1.2,
              mb: 0.5
            }}
          >
            {value}
            {unit && (
              <Typography 
                component="span" 
                variant="body2" 
                color="text.secondary"
                sx={{ ml: 0.5, fontWeight: 400 }}
              >
                {unit}
              </Typography>
            )}
          </Typography>
          
          {subtitle && (
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Progress bar */}
        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(theme.palette[color].main, 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  backgroundColor: theme.palette[color].main,
                }
              }}
            />
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ mt: 0.5, display: 'block' }}
            >
              {progress}% of target
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const StatsGrid = ({ stats, loading = false, columns = { xs: 1, sm: 2, md: 3, lg: 4 } }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: `repeat(${columns.xs}, 1fr)`,
          sm: `repeat(${columns.sm}, 1fr)`,
          md: `repeat(${columns.md}, 1fr)`,
          lg: `repeat(${columns.lg}, 1fr)`,
        },
      }}
    >
      {loading ? (
        Array.from({ length: 8 }).map((_, index) => (
          <MetricCard key={index} loading={true} />
        ))
      ) : (
        stats.map((stat, index) => (
          <MetricCard key={index} {...stat} />
        ))
      )}
    </Box>
  );
};

const ComparisonCard = ({ 
  title, 
  primaryValue, 
  primaryLabel, 
  secondaryValue, 
  secondaryLabel,
  color = 'primary',
  icon,
  variant = 'standard'
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        background: variant === 'gradient' ? 
          `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)}, ${alpha(theme.palette[color].main, 0.05)})` :
          'background.paper',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          {icon && (
            <Avatar
              sx={{
                backgroundColor: alpha(theme.palette[color].main, 0.1),
                color: theme.palette[color].main,
              }}
            >
              {icon}
            </Avatar>
          )}
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={4}>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color={`${color}.main`}>
              {primaryValue}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {primaryLabel}
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem />

          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="text.secondary">
              {secondaryValue}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {secondaryLabel}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export { MetricCard, StatsGrid, ComparisonCard };