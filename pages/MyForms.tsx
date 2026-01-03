import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, ButtonBase, TextField } from '@mui/material';
import { getMatches } from '../services/storage';
import { MatchData } from '../types/schema';
import { QRCodeSVG } from 'qrcode.react';
import SearchIcon from '@mui/icons-material/Search';

interface Props {
  onEditMatch: (match: MatchData) => void;
}

const MyForms: React.FC<Props> = ({ onEditMatch }) => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setMatches(getMatches());
  }, []);

  const filteredMatches = matches.filter(m => 
    m.match.teamNumber.includes(search) || 
    m.match.number.toString().includes(search)
  );

  return (
    <Box sx={{ p: '1rem' }}>
      <Typography variant="h4" color="primary" sx={{ mb: '1.5rem', fontWeight: 700 }}>
        My Forms
      </Typography>

      <Box sx={{ mb: '2rem' }}>
        <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by Team # or Match #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
                input: {
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }
            }}
        />
      </Box>

      {filteredMatches.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
            {matches.length === 0 ? "No matches scouted yet." : "No matches found."}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredMatches.map((match) => (
            // Adjusted breakpoints for bigger cards (xs=12, sm=6 instead of 6/4)
            <Grid item xs={12} sm={6} md={4} key={match.id}>
              <ButtonBase
                onClick={() => onEditMatch(match)}
                sx={{
                  width: '100%',
                  display: 'block',
                  textAlign: 'inherit',
                  borderRadius: '1rem',
                  overflow: 'hidden'
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: '1.5rem', // Increased padding
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-0.25rem)',
                      boxShadow: 4
                    }
                  }}
                >
                  {/* QR Code Cube */}
                  <Box
                    sx={{
                      p: '0.5rem',
                      bgcolor: 'white',
                      borderRadius: '0.5rem',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <QRCodeSVG value={JSON.stringify(match)} size={140} />
                  </Box>

                  {/* Match Info */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Match: {match.match.number}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Team: {match.match.teamNumber}
                    </Typography>
                  </Box>
                </Paper>
              </ButtonBase>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyForms;