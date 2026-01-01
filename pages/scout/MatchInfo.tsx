import React from 'react';
import {
  Container, Typography, Box, FormControl, InputLabel, Select, MenuItem,
  TextField, ToggleButton, ToggleButtonGroup, Fab, Paper, Divider, Autocomplete
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FieldSelector from '../../components/FieldSelector';
import { useNavigate } from 'react-router-dom';
import MatchHeaderBox from '../../components/MatchHeaderBox';
import TopChipNav from '../../components/TopChipNav';
import type { MatchData } from "../../types/schema";
import { israelTeams } from '../../data/israelTeams';

interface Props {
  matchData: MatchData;
  updateMatchData: (data: Partial<MatchData>) => void;
  updateNestedData: (path: string, value: any) => void;
}

const MatchInfo: React.FC<Props> = ({ matchData, updateMatchData, updateNestedData }) => {
  const nav = useNavigate();
  const isValidTeam = !!matchData.match.teamNumber && matchData.match.teamNumber.length <= 5;
  const canProceed = isValidTeam && !!matchData.match.startingPosition;

  const showHeader = !!matchData.match.teamNumber && (matchData.match.number ?? 0) > 0;

  const handleMatchNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val.length > 3) val = val.slice(0, 3);
    updateNestedData('match.number', parseInt(val) || 0);
  };

  const handleTeamChange = (event: any, newValue: string | null) => {
     if (newValue) {
         updateNestedData('match.teamNumber', newValue);
     } else {
         updateNestedData('match.teamNumber', '');
     }
  };

  const handleTeamInputChange = (event: React.SyntheticEvent, newInputValue: string) => {
      if (newInputValue.length <= 5) {
          updateNestedData('match.teamNumber', newInputValue);
      }
  };

  return (
    <Container
      disableGutters
      maxWidth={false} // Allow full width but controlled by inner box
      sx={{ minHeight: '100svh', display: 'flex', alignItems: 'stretch', pt: 0, pb: 10, bgcolor: 'background.default' }}
    >
      <Box sx={{ width: "100%", maxWidth: 'md', mx: 'auto', display: "flex", flexDirection: "column" }}>
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            p: "clamp(12px,2.2vh,26px)",
            borderRadius: { xs: 0, md: 2 },
            mt: { xs: 0, md: 2 },
            display: "flex",
            flexDirection: "column",
            gap: "clamp(12px,1.6vh,20px)",
            minHeight: "100%",
            bgcolor: 'background.paper',
            overflowX: 'hidden'
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
            <Box>{showHeader && (<MatchHeaderBox teamNumber={matchData.match.teamNumber} matchNumber={matchData.match.number} />)}</Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
              <TopChipNav centered size='medium' disabled />
            </Box>
            <Box sx={{ visibility: 'hidden' }}>
              {showHeader && (<MatchHeaderBox teamNumber={matchData.match.teamNumber} matchNumber={matchData.match.number} />)}
            </Box>
          </Box>

          <Typography variant='h6' align='center' sx={{ fontWeight: 700 }}>General Scouter</Typography>
          <Divider />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl sx={{ flex: '1 1 100px' }}>
              <InputLabel id='match-type-label'>Type</InputLabel>
              <Select
                labelId='match-type-label'
                label='Type'
                value={matchData.match.type}
                onChange={(e) => updateNestedData('match.type', e.target.value)}
              >
                <MenuItem value='Q'>Qual</MenuItem>
                <MenuItem value='P'>Prac</MenuItem>
                <MenuItem value='E'>Elim</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label='Match #'
              type='number'
              sx={{ flex: '1 1 80px' }}
              value={matchData.match.number || ''}
              onChange={handleMatchNumberChange}
              slotProps={{ htmlInput: { max: 999 } }}
            />
             
             <Autocomplete
                freeSolo
                options={israelTeams}
                sx={{ flex: '1 1 120px' }}
                value={matchData.match.teamNumber}
                onChange={handleTeamChange}
                inputValue={matchData.match.teamNumber}
                onInputChange={handleTeamInputChange}
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        label="Team #" 
                        type="number"
                    />
                )}
             />
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 700 }}>Alliance</Typography>
            <ToggleButtonGroup
              exclusive
              value={matchData.match.alliance}
              onChange={(_, val) => val && updateNestedData('match.alliance', val)}
              sx={{ display: 'flex', width: '100%' }}
            >
              <ToggleButton
                value='R'
                sx={{
                  flex: 1,
                  fontWeight: 600,
                  border: '2px solid',
                  borderColor: matchData.match.alliance === 'R' ? 'error.main' : 'divider',
                  '&.Mui-selected': {
                    bgcolor: 'error.main',
                    color: '#fff',
                    '&:hover': { bgcolor: 'error.dark' }
                  }
                }}
              >
                Red
              </ToggleButton>
              <ToggleButton
                value='B'
                sx={{
                  flex: 1,
                  fontWeight: 600,
                  border: '2px solid',
                  borderColor: matchData.match.alliance === 'B' ? 'primary.main' : 'divider',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: '#fff',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }
                }}
              >
                Blue
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>


          <Box>
            <FieldSelector
              label="Starting Position"
              value={matchData.match.startingPosition}
              onChange={(pos) => updateNestedData('match.startingPosition', pos)}
            />
          </Box>
        </Paper>

        <Box sx={{ position: 'fixed', bottom: 'clamp(12px,3vw,24px)', right: 'clamp(12px,3vw,24px)', zIndex: 1000 }}>
          <Fab color='primary' onClick={() => nav('/auto')} disabled={!canProceed}>
            <ArrowForwardIcon />
          </Fab>
        </Box>
      </Box>
    </Container>
  );
};

export default MatchInfo;