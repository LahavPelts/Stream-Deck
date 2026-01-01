import React, { useState, useEffect } from 'react';
import { Box, Paper, Chip, Stack, Typography, Fab, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import { GAME_CONFIG, SectionType } from '../config/gameConfig';
import { MatchData, INITIAL_MATCH_DATA } from '../types/schema';
import { setByPath } from '../utils/calculations';
import FormGenerator from '../components/FormGenerator';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SaveIcon from '@mui/icons-material/Save';
import { saveMatch } from '../services/storage';
import { QRCodeSVG } from 'qrcode.react';

const SECTIONS: SectionType[] = ['Match', 'Auto', 'Teleop', 'Endgame'];

const Scouter: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionType>('Match');
  const [data, setData] = useState<MatchData>(INITIAL_MATCH_DATA);
  const [showQr, setShowQr] = useState(false);

  // Initialize timestamp on mount
  useEffect(() => {
    setData(prev => ({ ...prev, timestamp: Date.now(), id: `match_${Date.now()}` }));
  }, []);

  const handleChange = (path: string, value: any) => {
    const newData = setByPath(data, path, value);
    setData(newData);
  };

  const handleNext = () => {
    const currentIndex = SECTIONS.indexOf(activeSection);
    if (currentIndex < SECTIONS.length - 1) {
      setActiveSection(SECTIONS[currentIndex + 1]);
      window.scrollTo(0,0);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    saveMatch(data);
    setShowQr(true);
  };

  const resetForm = () => {
      setData({ ...INITIAL_MATCH_DATA, timestamp: Date.now(), id: `match_${Date.now()}` });
      setActiveSection('Match');
      setShowQr(false);
  }

  return (
    <Box sx={{ pb: '5rem' }}>
      {/* Sticky Header with Match Info */}
      <Paper
        elevation={2}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          borderRadius: 0,
          mx: '-1rem', // Counteract container padding
          mt: '-1rem',
          mb: '1rem',
          p: '1rem',
          bgcolor: 'background.paper',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
                M: {data.match.number} | T: {data.match.teamNumber}
            </Typography>
             <Chip
                label={data.match.alliance === 'R' ? 'Red' : 'Blue'}
                color={data.match.alliance === 'R' ? 'error' : 'primary'}
                size="small"
             />
        </Stack>
        
        {/* Chip Navigation */}
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
          {SECTIONS.map((sec) => (
            <Chip
              key={sec}
              label={sec}
              onClick={() => setActiveSection(sec)}
              color={activeSection === sec ? 'primary' : 'default'}
              variant={activeSection === sec ? 'filled' : 'outlined'}
              clickable
            />
          ))}
        </Stack>
      </Paper>

      {/* Form Content */}
      <FormGenerator
        config={GAME_CONFIG}
        data={data}
        onChange={handleChange}
        section={activeSection}
      />

      {/* Floating Action Button (Bottom Right) */}
      <Fab
        color="primary"
        aria-label="next"
        onClick={handleNext}
        sx={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
        }}
      >
        {activeSection === 'Endgame' ? <SaveIcon /> : <NavigateNextIcon />}
      </Fab>

      {/* QR Code Dialog */}
      <Dialog open={showQr} onClose={() => setShowQr(false)} fullWidth maxWidth="sm">
        <DialogTitle>Match Saved!</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, py: 3 }}>
            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2 }}>
                <QRCodeSVG value={JSON.stringify(data)} size={256} />
            </Box>
            <Typography variant="body2" color="text.secondary">
                Scan this with the Master Tablet or Data Manager.
            </Typography>
            <Button variant="contained" onClick={resetForm} fullWidth>
                Start New Match
            </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Scouter;