import React, { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, useMediaQuery, IconButton, AppBar, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import FolderIcon from '@mui/icons-material/Folder';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import StorageIcon from '@mui/icons-material/Storage';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';

const DRAWER_WIDTH = 240;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  // Define scouting routes where sidebar/header should be hidden
  const isScouting = ['/info', '/auto', '/teleop', '/endgame'].includes(location.pathname);

  // Drawer state - Default to closed to allow "closing on computer screen"
  const [open, setOpen] = useState(false);

  // Automatically close sidebar when entering scouting pages
  useEffect(() => {
    if (isScouting) {
      setOpen(false);
    }
  }, [location.pathname, isScouting]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Scouter', icon: <NoteAddIcon />, path: '/info' },
    { text: 'My Forms', icon: <FolderIcon />, path: '/forms' },
    { text: 'Scans', icon: <QrCodeScannerIcon />, path: '/scans' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Games', icon: <SportsEsportsIcon />, path: '/games' },
    { text: 'Data Manager', icon: <StorageIcon />, path: '/data' },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: '1.5rem', display: 'flex', alignItems: 'center', gap: 1 }}>
        <img src="/logo.png" alt="Logo" style={{ width: 40, height: 40, borderRadius: '50%' }} />
        <Typography variant="h6" fontWeight="bold" color="primary">
          Team 2230
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path || (item.path === '/info' && isScouting);
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={isSelected}
                onClick={() => {
                  navigate(item.path);
                  setOpen(false); // Close drawer on navigation
                }}
                sx={{
                  borderRadius: '0 2rem 2rem 0',
                  mr: 2,
                  '&.Mui-selected': {
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      '& .MuiListItemIcon-root': {
                          color: 'primary.contrastText',
                      }
                  }
                }}
              >
                <ListItemIcon sx={{ color: isSelected ? 'inherit' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          v1.3.0 - Atlantis
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      
      {/* Top App Bar - Hidden on Scouting Pages */}
      {!isScouting && (
        <AppBar 
          position="fixed" 
          sx={{ 
            // Z-index higher than drawer to sit "on top"
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: 'primary.main' 
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              General Scouter
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Drawer
        // Temporary variant allows it to close on all screen sizes
        variant="temporary"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          // Ensure the drawer backdrop/paper sits below the AppBar z-index
          zIndex: (theme) => theme.zIndex.drawer, 
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: 'none',
            boxShadow: 3,
            // Add top padding if AppBar is visible so content isn't hidden behind it
            pt: !isScouting ? '64px' : 0
          },
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawerContent}
      </Drawer>

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 0, 
          width: '100%',
        }}
      >
        {/* Spacer for Fixed AppBar */}
        {!isScouting && <Toolbar />}
        {children}
      </Box>
    </Box>
  );
};

export default Layout;