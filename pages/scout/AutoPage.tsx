import React from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  Fab,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import MatchHeaderBox from "../../components/MatchHeaderBox";
import TopChipNav from "../../components/TopChipNav";
import CounterField from "../../components/CounterField";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import type { MatchData } from "../../types/schema";

interface Props {
  matchData: MatchData;
  updateNestedData: (path: string, value: any) => void;
}

const AutoPage: React.FC<Props> = ({ matchData, updateNestedData }) => {
  const nav = useNavigate();
  const canShowHeader = !!matchData.match.teamNumber;

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
              Auto Coral
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "clamp(8px,1.4vh,14px)" }}>
              {Object.entries(matchData.auto.coral)
               .filter(([key]) => !key.includes('missed'))
               .map(([key, value]) => (
                <CounterField
                  key={key}
                  label={key.toUpperCase()}
                  value={value as number}
                  onChange={(v) => updateNestedData(`auto.coral.${key}`, v)}
                />
              ))}
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, mb: "clamp(6px,1vh,12px)" }}
            >
              Auto Algae
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "clamp(8px,1.4vh,14px)" }}>
              {Object.entries(matchData.auto.algae)
                .filter(([key]) => !key.includes('missed'))
                .map(([key, value]) => (
                <CounterField
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={value as number}
                  onChange={(v) => updateNestedData(`auto.algae.${key}`, v)}
                />
              ))}
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, mb: "clamp(6px,1vh,12px)" }}
            >
              Start
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={matchData.auto.mobility}
                    onChange={(e) => updateNestedData('auto.mobility', e.target.checked)}
                    color="primary"
                  />
                }
                label="Mobility (Exited Zone)"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={matchData.auto.crossedLine}
                    onChange={(e) => updateNestedData('auto.crossedLine', e.target.checked)}
                    color="primary"
                  />
                }
                label="Crossed Line"
              />
            </Box>
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
          <Fab aria-label="back" onClick={() => nav("/info")}>
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
          <Fab color="primary" aria-label="next" onClick={() => nav("/teleop")}>
            <ArrowForwardIcon />
          </Fab>
        </Box>
      </Box>
    </Container>
  );
};

export default AutoPage;