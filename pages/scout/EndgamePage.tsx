import React, { useState } from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  Fab,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MatchHeaderBox from "../../components/MatchHeaderBox";
import TopChipNav from "../../components/TopChipNav";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { MatchData } from "../../types/schema";
import { QRCodeSVG } from 'qrcode.react';
import { saveMatch } from '../../services/storage';

interface Props {
  matchData: MatchData;
  updateNestedData: (path: string, value: any) => void;
  resetForm: () => void;
}

const endgameOptions = [
  { key: 0, label: "None" },
  { key: 1, label: "Parked" },
  { key: 3, label: "Shallow" },
  { key: 2, label: "Deep" },
];

const EndgamePage: React.FC<Props> = ({ matchData, updateNestedData, resetForm }) => {
  const nav = useNavigate();
  const [showQr, setShowQr] = useState(false);
  const canShowHeader = !!matchData.match.teamNumber;

  const handleFinish = () => {
      saveMatch(matchData);
      setShowQr(true);
  };

  const handleDone = () => {
      resetForm();
      setShowQr(false);
      nav('/info');
  }

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "stretch",
        pt: 0,
        pb: 10,
        bgcolor: 'background.default'
      }}
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
            overflowX: 'hidden',
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              alignItems: "center",
              gap: { xs: 1, sm: 1.5 },
            }}
          >
            <Box>
              {canShowHeader && (
                <MatchHeaderBox
                  teamNumber={matchData.match.teamNumber}
                  matchNumber={matchData.match.number}
                />
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", overflow: 'hidden' }}>
              <TopChipNav centered size="medium" />
            </Box>
            <Box sx={{ visibility: "hidden" }}>
              {canShowHeader && (
                <MatchHeaderBox
                  teamNumber={matchData.match.teamNumber}
                  matchNumber={matchData.match.number}
                />
              )}
            </Box>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, mb: "clamp(6px,1vh,12px)" }}
            >
              Endgame Result
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "clamp(8px,1.4vh,14px)",
              }}
            >
              {endgameOptions.map((opt) => {
                const active = matchData.endgame.endState === opt.key;
                return (
                  <Box
                    key={opt.key}
                    onClick={() => updateNestedData('endgame.endState', opt.key)}
                    sx={{
                      width: { xs: "48%", sm: "23%" },
                      minWidth: 100,
                      border: "2px solid",
                      borderColor: active ? "primary.main" : "divider",
                      bgcolor: active ? "action.selected" : "background.paper",
                      borderRadius: 2,
                      p: "clamp(8px,1.2vh,14px)",
                      textAlign: "center",
                      fontSize: "clamp(12px,2.2vw,14px)",
                      fontWeight: 600,
                      cursor: "pointer",
                      color: active ? "primary.main" : "text.primary",
                      "&:hover": {
                        borderColor: active ? "primary.dark" : "text.secondary",
                      },
                    }}
                  >
                    {opt.label}
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, mb: "clamp(6px,1vh,12px)" }}
            >
              Notes
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={6}
              value={matchData.endgame.comments}
              onChange={(e) => updateNestedData('endgame.comments', e.target.value)}
              placeholder="Driver skill, issues, mechanisms..."
              sx={{
                "& textarea": { fontSize: "clamp(12px,2.2vw,14px)" },
              }}
            />
          </Box>
        </Paper>

        <Box
          sx={{
            position: "fixed",
            bottom: "clamp(12px,3vw,24px)",
            left: "clamp(12px,3vw,24px)",
            zIndex: 1000
          }}
        >
          <Fab aria-label="back" onClick={() => nav("/teleop")}>
            <ArrowBackIcon />
          </Fab>
        </Box>
        <Box
          sx={{
            position: "fixed",
            bottom: "clamp(12px,3vw,24px)",
            right: "clamp(12px,3vw,24px)",
            zIndex: 1000
          }}
        >
          <Fab
            color="primary"
            aria-label="submit"
            onClick={handleFinish}
          >
            <ArrowForwardIcon />
          </Fab>
        </Box>
      </Box>

      {/* QR Code Dialog */}
      <Dialog open={showQr} onClose={handleDone} fullWidth maxWidth="sm">
        <DialogTitle>Match Saved!</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, py: 3 }}>
            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2 }}>
                <QRCodeSVG value={JSON.stringify(matchData)} size={256} />
            </Box>
            <Typography variant="body2" color="text.secondary">
                Scan this with the Master Tablet or Data Manager.
            </Typography>
            <Button variant="contained" onClick={handleDone} fullWidth>
                Start New Match
            </Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default EndgamePage;