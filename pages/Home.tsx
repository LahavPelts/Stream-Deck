import React from 'react';
import { Box, Typography, Button, Stack, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: '30rem', width: '100%', borderRadius: '2rem' }}>
        <img
            src="https://picsum.photos/100/100"
            alt="Atlantis Logo"
            style={{ borderRadius: '50%', marginBottom: '1.5rem' }}
        />
        <Typography variant="h4" color="primary" gutterBottom>
          General Scouter
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Team 2230 | Season 2025
        </Typography>

        <Stack spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<NoteAddIcon />}
            onClick={() => navigate('/scouter')}
            sx={{ py: 1.5, fontSize: '1.1rem' }}
          >
            Start Scouting
          </Button>
          <Button variant="outlined" onClick={() => navigate('/dashboard')}>
            View Dashboard
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Home;