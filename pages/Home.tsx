import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DashboardIcon from '@mui/icons-material/Dashboard';

const LOGO_BLUE = '/logo.png'; 

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '100%',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.paper', // Clean white background
        px: '1rem'
      }}
    >
      <Box sx={{ textAlign: 'center', width: '100%', maxWidth: '20rem' }}>
        
        {/* Main Logo */}
        <Box 
            component="img" 
            src={LOGO_BLUE} 
            alt="General Angels Logo"
            sx={{ 
                width: '180px', 
                height: 'auto', 
                mb: '2rem',
                display: 'block',
                mx: 'auto'
            }} 
        />

        {/* Title */}
        <Typography 
            variant="h4" 
            color="primary" 
            sx={{ 
                mb: '3rem', 
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1rem'
            }}
        >
            General Scouter
        </Typography>

        <Stack spacing={3}>
          <Button
            variant="contained"
            size="large"
            startIcon={<NoteAddIcon />}
            onClick={() => navigate('/scouter')}
            sx={{ 
                py: '1rem', 
                fontSize: '1.2rem', 
                fontWeight: 'bold',
                boxShadow: 3
            }}
          >
            Scouter
          </Button>
          
          <Button 
            variant="outlined" 
            size="large"
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ 
                py: '1rem', 
                fontSize: '1.2rem',
                fontWeight: 'bold',
                borderWidth: 2,
                '&:hover': { borderWidth: 2 }
            }}
          >
            Dashboard
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Home;