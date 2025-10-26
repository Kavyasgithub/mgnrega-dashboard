import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Custom color palette inspired by Indian flag and MGNREGA branding
const colors = {
  primary: {
    50: '#e8f4fd',
    100: '#c3e2fa',
    200: '#9acef6',
    300: '#6bb6f2',
    400: '#42a5f0',
    500: '#1976d2', // Main primary
    600: '#1565c0',
    700: '#0d47a1',
    800: '#0a3d91',
    900: '#042e7a',
  },
  secondary: {
    50: '#fff8e1',
    100: '#ffecb3',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffca28',
    500: '#ff9800', // Main secondary (saffron)
    600: '#fb8c00',
    700: '#f57c00',
    800: '#ef6c00',
    900: '#e65100',
  },
  success: {
    50: '#e8f5e8',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50', // Green from flag
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  }
};

// Light theme configuration
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[600],
      light: colors.primary[400],
      dark: colors.primary[800],
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondary[500],
      light: colors.secondary[300],
      dark: colors.secondary[700],
      contrastText: '#ffffff',
    },
    success: {
      main: colors.success[500],
      light: colors.success[300],
      dark: colors.success[700],
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#ef5350',
      dark: '#d32f2f',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
      accent: colors.primary[50],
    },
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[600],
      disabled: colors.neutral[400],
    },
    divider: colors.neutral[200],
    action: {
      hover: alpha(colors.primary[500], 0.04),
      selected: alpha(colors.primary[500], 0.08),
      disabled: colors.neutral[300],
      disabledBackground: colors.neutral[100],
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      fontWeight: 400,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
    '0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10)',
    '0 15px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.05)',
    '0 20px 40px rgba(0, 0, 0, 0.1)',
    ...Array(19).fill('0 20px 40px rgba(0, 0, 0, 0.1)'),
  ],
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
});

// Dark theme configuration
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary[400],
      light: colors.primary[300],
      dark: colors.primary[600],
      contrastText: colors.neutral[900],
    },
    secondary: {
      main: colors.secondary[400],
      light: colors.secondary[200],
      dark: colors.secondary[600],
      contrastText: colors.neutral[900],
    },
    success: {
      main: colors.success[400],
      light: colors.success[300],
      dark: colors.success[600],
    },
    warning: {
      main: '#ffb74d',
      light: '#ffe082',
      dark: '#ff9800',
    },
    error: {
      main: '#ef5350',
      light: '#ff7961',
      dark: '#d32f2f',
    },
    background: {
      default: '#0a0e1a',
      paper: '#1a1f2e',
      accent: alpha(colors.primary[400], 0.08),
    },
    text: {
      primary: '#ffffff',
      secondary: colors.neutral[300],
      disabled: colors.neutral[500],
    },
    divider: colors.neutral[700],
    action: {
      hover: alpha(colors.primary[400], 0.08),
      selected: alpha(colors.primary[400], 0.12),
      disabled: colors.neutral[600],
      disabledBackground: colors.neutral[800],
    },
  },
  typography: lightTheme.typography,
  shape: lightTheme.shape,
  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)',
    '0 3px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
    '0 10px 20px rgba(0, 0, 0, 0.4), 0 3px 6px rgba(0, 0, 0, 0.3)',
    '0 15px 25px rgba(0, 0, 0, 0.4), 0 5px 10px rgba(0, 0, 0, 0.2)',
    '0 20px 40px rgba(0, 0, 0, 0.3)',
    ...Array(19).fill('0 20px 40px rgba(0, 0, 0, 0.3)'),
  ],
  transitions: lightTheme.transitions,
});

// Enhanced component overrides for both themes
const createComponentOverrides = (theme) => ({
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        padding: '10px 24px',
        fontSize: '0.875rem',
        fontWeight: 500,
        textTransform: 'none',
        boxShadow: 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: theme.shadows[2],
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      },
      contained: {
        '&:hover': {
          boxShadow: theme.shadows[3],
        },
      },
      outlined: {
        borderWidth: '2px',
        '&:hover': {
          borderWidth: '2px',
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
        },
      },
      text: {
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 20,
        boxShadow: theme.shadows[1],
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: theme.shadows[3],
          transform: 'translateY(-2px)',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        backgroundImage: 'none',
      },
      elevation1: {
        boxShadow: theme.shadows[1],
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(8px)',
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRadius: 0,
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundImage: 'none',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '2px',
          },
        },
      },
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      paper: {
        borderRadius: 16,
        marginTop: 8,
        boxShadow: theme.shadows[3],
        border: `1px solid ${theme.palette.divider}`,
      },
      listbox: {
        padding: 8,
      },
      option: {
        borderRadius: 8,
        margin: '2px 0',
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
        },
        '&[aria-selected="true"]': {
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        fontWeight: 500,
        '&:hover': {
          boxShadow: theme.shadows[1],
        },
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        border: `1px solid transparent`,
      },
      standardSuccess: {
        backgroundColor: alpha(theme.palette.success.main, 0.1),
        color: theme.palette.success.dark,
        borderColor: alpha(theme.palette.success.main, 0.2),
      },
      standardError: {
        backgroundColor: alpha(theme.palette.error.main, 0.1),
        color: theme.palette.error.dark,
        borderColor: alpha(theme.palette.error.main, 0.2),
      },
      standardWarning: {
        backgroundColor: alpha(theme.palette.warning.main, 0.1),
        color: theme.palette.warning.dark,
        borderColor: alpha(theme.palette.warning.main, 0.2),
      },
      standardInfo: {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.dark,
        borderColor: alpha(theme.palette.primary.main, 0.2),
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        height: 8,
      },
    },
  },
  MuiCircularProgress: {
    styleOverrides: {
      root: {
        animationDuration: '1.2s',
      },
    },
  },
});

// Apply component overrides to both themes
lightTheme.components = createComponentOverrides(lightTheme);
darkTheme.components = createComponentOverrides(darkTheme);

export { lightTheme, darkTheme, colors };
export default lightTheme;