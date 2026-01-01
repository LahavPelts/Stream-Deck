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
        gap: { xs: 1, sm: 1.5 },
        flexWrap: "nowrap",
        justifyContent: centered ? "center" : "flex-end",
        maxWidth: "100%",
        overflowX: "auto",
        scrollbarWidth: 'none'
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
            }}
          />
        );
      })}
    </Stack>
  );
};

export default TopChipNav;