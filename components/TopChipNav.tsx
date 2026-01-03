import React from "react";
import { Chip, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  disabled?: boolean;
  centered?: boolean;
  size?: "small" | "medium";
}

const TopChipNav: React.FC<Props> = ({ disabled, centered = true, size = "medium" }) => {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const chips = [
    { label: "Info", path: "/info" },
    { label: "Auto", path: "/auto" },
    { label: "Teleop", path: "/teleop" },
    { label: "Endgame", path: "/endgame" },
  ];

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        // Reduced gap for better fit
        gap: { xs: 0.5, sm: 1 },
        flexWrap: "nowrap",
        justifyContent: centered ? "center" : "flex-end",
        maxWidth: "100%",
        // While we want to avoid scrolling, having overflow: auto is a safety net. 
        // We'll trust the reduced gap and padding to fit them.
        overflowX: "auto", 
        scrollbarWidth: 'none',
        px: 1
      }}
    >
      {chips.map((c) => {
        const selected = pathname === c.path;
        return (
          <Chip
            key={c.path}
            label={c.label}
            size={size}
            color={selected ? "primary" : "default"}
            variant={selected ? "filled" : "outlined"}
            onClick={() => !disabled && nav(c.path)}
            disabled={disabled}
            sx={{
              fontWeight: selected ? 600 : 400,
              // Reduced padding to ensure 4 items fit on small screens
              '& .MuiChip-label': {
                  px: { xs: 1, sm: 1.5 },
                  fontSize: { xs: '0.8rem', sm: '0.9rem' }
              },
              height: { xs: 28, sm: 32 }
            }}
          />
        );
      })}
    </Stack>
  );
};

export default TopChipNav;