import React from "react";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface CounterFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}

const CounterField: React.FC<CounterFieldProps> = ({ label, value, onChange, min = 0, max = 999 }) => {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <Box
      sx={{
        width: { xs: "48%", sm: "23%" },
        minWidth: 100,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: "clamp(6px,1.2vh,12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "clamp(4px,0.8vh,8px)",
        bgcolor: "background.paper",
        boxSizing: "border-box"
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: "clamp(11px,2.2vw,14px)", whiteSpace: "nowrap" }}>
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: "clamp(4px,0.8vh,8px)" }}>
        <Button 
            size="small" 
            variant="outlined" 
            onClick={dec} 
            sx={{ minWidth: "clamp(28px,6vw,40px)", p: 0, height: '32px' }}
        >
            <RemoveIcon fontSize="small" />
        </Button>
        <Typography variant="body1" sx={{ width: "clamp(30px,7vw,40px)", textAlign: "center", fontSize: "clamp(14px,3.4vw,18px)", fontWeight: 600 }}>
            {value}
        </Typography>
        <Button 
            size="small" 
            variant="outlined" 
            onClick={inc} 
            sx={{ minWidth: "clamp(28px,6vw,40px)", p: 0, height: '32px' }}
        >
            <AddIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
};

export default CounterField;