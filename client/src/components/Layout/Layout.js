import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  useMediaQuery,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Chip,
  alpha,
  Badge,
  Avatar,
  Switch,
  FormControlLabel,
  Tooltip,
  Stack,
  useTheme as useMuiTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  LocationOn as LocationIcon,
  Compare as CompareIcon,
  Analytics as AnalyticsIcon,
  Info as InfoIcon,
  GitHub as GitHubIcon,
  Settings as SettingsIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Notifications as NotificationIcon,
  WorkOutline as WorkIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import ErrorMessage from '../ErrorMessage';
import DistrictSelector from '../DistrictSelector/DistrictSelector';

const drawerWidth = 280;

const navigationItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
    description: 'Overview and quick insights'
  },
  {
    text: 'Compare Districts',
    icon: <CompareIcon />,
    path: '/compare',
    description: 'Side-by-side comparison'
  },
  {
    text: 'Analytics',
    icon: <AnalyticsIcon />,
    path: '/analytics',
    description: 'Deep insights and trends'
  },
  {
    text: 'About',
    icon: <InfoIcon />,
    path: '/about',
    description: 'About MGNREGA & this tool'
  }
];

function Layout({ children }) {
  const muiTheme = useMuiTheme();
  const { isDarkMode, toggleTheme } = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDistrict, comparisonDistricts, error, actions } = useApp();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const currentPage = navigationItems.find(item => 
    location.pathname.startsWith(item.path)
  );

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo and Title */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            backgroundColor: 'primary.main',
            mx: 'auto',
            mb: 2,
          }}
        >
          <WorkIcon sx={{ fontSize: 28 }} />
        </Avatar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 700,
            color: 'primary.main',
            mb: 1
          }}
        >
          MGNREGA Dashboard
        </Typography>
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ 
            fontSize: '0.75rem',
            display: 'block',
            fontWeight: 500
          }}
        >
          District Performance Analytics
        </Typography>
      </Box>

      <Divider />

      {/* District Selector */}
      <Box sx={{ p: 2 }}>
        <DistrictSelector
          value={selectedDistrict}
          onChange={actions.setSelectedDistrict}
          size="small"
          fullWidth
        />
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1 }}>
        {navigationItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          
          return (
            <ListItem key={item.text} sx={{ px: 0, mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  backgroundColor: isActive ? alpha(muiTheme.palette.primary.main, 0.1) : 'transparent',
                  color: isActive ? 'primary.main' : 'text.primary',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: alpha(muiTheme.palette.primary.main, 0.05),
                    transform: 'translateX(4px)',
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive ? 'primary.main' : 'text.secondary',
                    minWidth: 40
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  secondary={item.description}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400
                  }}
                  secondaryTypographyProps={{
                    fontSize: '0.75rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Theme Toggle */}
      <Box sx={{ px: 2, mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              size="small"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isDarkMode ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
              <Typography variant="caption">
                {isDarkMode ? 'Dark' : 'Light'} Mode
              </Typography>
            </Box>
          }
          sx={{ 
            ml: 0,
            '& .MuiFormControlLabel-label': {
              fontSize: '0.75rem',
            }
          }}
        />
      </Box>

      <Divider />

      {/* Footer */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        {comparisonDistricts.length > 0 && (
          <Chip 
            label={`${comparisonDistricts.length} districts to compare`}
            size="small"
            color="primary"
            variant="outlined"
            onClick={() => navigate('/compare')}
            sx={{ mb: 2, cursor: 'pointer' }}
          />
        )}
        
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
          Data from data.gov.in
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Built for citizens of India 🇮🇳
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: alpha(muiTheme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: `1px solid ${muiTheme.palette.divider}`
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Page Title */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="h1" sx={{ fontWeight: 600 }}>
              {currentPage?.text || 'MGNREGA Dashboard'}
            </Typography>
            {selectedDistrict && (
              <Typography variant="body2" color="text.secondary">
                {selectedDistrict.districtName}, {selectedDistrict.stateName}
              </Typography>
            )}
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip title="Notifications">
              <IconButton size="small">
                <Badge badgeContent={2} color="error" variant="dot">
                  <NotificationIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
              <IconButton size="small" onClick={toggleTheme}>
                {isDarkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="View source code">
              <IconButton
                size="small"
                href="https://github.com/mgnrega-dashboard"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Settings">
              <IconButton size="small">
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'background.paper'
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'background.paper',
              borderRight: `1px solid ${muiTheme.palette.divider}`
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default'
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        
        {/* Error Display */}
        {error && (
          <Container maxWidth="lg" sx={{ py: 2 }}>
            <ErrorMessage 
              message={error} 
              onClose={actions.clearError}
            />
          </Container>
        )}

        {/* Page Content */}
        <Container maxWidth="lg" sx={{ py: 3 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}

export default Layout;