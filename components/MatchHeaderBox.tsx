import React from "react";
import { Paper, Typography } from "@mui/material";

interface Props {
  teamNumber: string | number;
  matchNumber: number;
}

const MatchHeaderBox: React.FC<Props> = ({ teamNumber, matchNumber }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        px: { xs: 1.25, sm: "clamp(10px,2vw,20px)" },
        py: { xs: 0.75, sm: "clamp(6px,1.2vh,10px)" },
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
        T: {teamNumber || "-"}
        <br />
        M: #{matchNumber || "-"}
      </Typography>
    </Paper>
  );
};

export default MatchHeaderBox;