import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, useMediaQuery, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NoteAddIcon from '@mui/icons-material/NoteAdd'; // Scouter
import FolderIcon from '@mui/icons-material/Folder'; // My Forms
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'; // Scans
import StorageIcon from '@mui/icons-material/Storage'; // Data Manager
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

const DRAWER_WIDTH = 240;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Scouter', icon: <NoteAddIcon />, path: '/' },
    { text: 'My Forms', icon: <FolderIcon />, path: '/forms' },
    { text: 'Scans', icon: <QrCodeScannerIcon />, path: '/scans' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Games', icon: <SportsEsportsIcon />, path: '/games' },
    { text: 'Data Manager', icon: <StorageIcon />, path: '/data' },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: '1.5rem', display: 'flex', alignItems: 'center', gap: 1 }}>
        <img src="https://picsum.photos/40/40" alt="Logo" style={{ borderRadius: '50%' }} />
        <Typography variant="h6" fontWeight="bold" color="primary">
          Team 2230
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
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
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'inherit' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          v1.0.0 - Atlantis
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Persistent Sidebar on Desktop, maybe hidden on mobile but for this prompt we assume sidebar is key */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        sx={{
          width: isMobile ? 'auto' : DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: 'none',
            boxShadow: 3,
          },
        }}
        open={!isMobile} // Simply force open on desktop
      >
        {drawerContent}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: '1rem', width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;