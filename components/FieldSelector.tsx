import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

// Assuming the user places the image here. 
// If using Vite/Webpack, this import works if the file exists. 
// For now, we will use a reliable placeholder or simple styling if image is missing.
const FIELD_IMAGE_URL = "/field.png"; // Public folder path

interface FieldSelectorProps {
  value: number;
  onChange: (val: number) => void;
  label: string;
}

const FieldSelector: React.FC<FieldSelectorProps> = ({ value, onChange, label }) => {
  return (
    <Box sx={{ mb: '1rem', width: '100%' }}>
      <Typography variant="subtitle2" sx={{ mb: '0.5rem', fontWeight: 600 }}>
        {label}
      </Typography>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          // Aspect ratio container trick or fixed height
          height: '0',
          paddingBottom: '50%', // 2:1 Aspect Ratio (approximate for field view)
          position: 'relative',
          border: '2px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          backgroundImage: `url(${FIELD_IMAGE_URL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#e0e0e0', // Fallback
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column', // 5 Rows vertically
          }}
        >
          {[5, 4, 3, 2, 1].map((position) => (
            <Box
              key={position}
              onClick={() => onChange(position)}
              sx={{
                flex: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                // Default transparent, color on hover or selection
                bgcolor: value === position ? 'rgba(0, 105, 148, 0.6)' : 'transparent',
                color: value === position ? 'white' : 'transparent',
                transition: 'all 0.2s ease',
                borderBottom: position !== 1 ? '1px dashed rgba(255,255,255,0.3)' : 'none',
                '&:hover': {
                  bgcolor: value === position ? 'rgba(0, 105, 148, 0.8)' : 'rgba(179, 229, 252, 0.5)', // Light blue hover
                  color: 'white',
                  fontWeight: 'bold',
                  textShadow: '0px 0px 4px black'
                },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold', textShadow: '0px 0px 2px black', opacity: (value === position) ? 1 : 0, '&:hover': { opacity: 1 } }}>
                Pos {position}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default FieldSelector;