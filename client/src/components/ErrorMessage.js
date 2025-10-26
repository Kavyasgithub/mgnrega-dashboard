import React, { useState } from 'react';
import { 
  Alert, 
  AlertTitle, 
  Box, 
  IconButton, 
  Collapse, 
  Button,
  Typography,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Close as CloseIcon,
  Refresh as RefreshIcon,
  ErrorOutline as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircleOutline as SuccessIcon
} from '@mui/icons-material';

const severityIcons = {
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
  success: SuccessIcon,
};

function ErrorMessage({ 
  message, 
  title, 
  severity = 'error', 
  onClose,
  onRetry,
  variant = 'standard', // 'standard', 'filled', 'outlined'
  persistent = false,
  showIcon = true,
  actions = [],
  sx = {} 
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    if (!persistent) {
      setOpen(false);
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 200);
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  if (!message) return null;

  const SeverityIcon = severityIcons[severity];

  // Enhanced alert for critical errors
  if (variant === 'enhanced') {
    return (
      <Box sx={{ width: '100%', ...sx }}>
        <Collapse in={open}>
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              border: `2px solid ${alpha(theme.palette[severity].main, 0.3)}`,
              backgroundColor: alpha(theme.palette[severity].main, 0.05),
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                backgroundColor: theme.palette[severity].main,
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-start">
              {showIcon && (
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette[severity].main, 0.1),
                    color: theme.palette[severity].main,
                    flexShrink: 0,
                  }}
                >
                  <SeverityIcon />
                </Box>
              )}
              
              <Box sx={{ flex: 1 }}>
                {title && (
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: theme.palette[severity].main,
                      mb: 1
                    }}
                  >
                    {title}
                  </Typography>
                )}
                
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mb: actions.length > 0 || onRetry ? 2 : 0 }}
                >
                  {message}
                </Typography>

                {/* Action Buttons */}
                {(actions.length > 0 || onRetry) && (
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {onRetry && (
                      <Button
                        size="small"
                        variant="outlined"
                        color={severity}
                        startIcon={<RefreshIcon />}
                        onClick={handleRetry}
                      >
                        Try Again
                      </Button>
                    )}
                    {actions.map((action, index) => (
                      <Button
                        key={index}
                        size="small"
                        variant={action.variant || 'text'}
                        color={action.color || severity}
                        startIcon={action.icon}
                        onClick={action.onClick}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </Stack>
                )}
              </Box>

              {onClose && !persistent && (
                <IconButton
                  size="small"
                  onClick={handleClose}
                  sx={{ 
                    color: theme.palette[severity].main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette[severity].main, 0.1),
                    }
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </Box>
        </Collapse>
      </Box>
    );
  }

  // Standard Material-UI Alert
  return (
    <Box sx={{ width: '100%', ...sx }}>
      <Collapse in={open}>
        <Alert
          severity={severity}
          variant={variant}
          icon={showIcon ? undefined : false}
          action={
            <Stack direction="row" spacing={1} alignItems="center">
              {onRetry && (
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={handleRetry}
                  title="Retry"
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              )}
              {onClose && !persistent && (
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={handleClose}
                  title="Close"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          }
          sx={{ 
            mb: 2,
            '& .MuiAlert-action': {
              alignItems: 'center',
            }
          }}
        >
          {title && <AlertTitle>{title}</AlertTitle>}
          {message}
          
          {/* Custom actions in standard variant */}
          {actions.length > 0 && (
            <Box sx={{ mt: 1, pt: 1, borderTop: `1px solid ${alpha(theme.palette[severity].main, 0.2)}` }}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    size="small"
                    variant={action.variant || 'text'}
                    color={action.color || severity}
                    startIcon={action.icon}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                ))}
              </Stack>
            </Box>
          )}
        </Alert>
      </Collapse>
    </Box>
  );
}

export default ErrorMessage;