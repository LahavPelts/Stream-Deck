import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#006994', // Atlantis Blue / Ocean
      light: '#33bfff',
      dark: '#004c6d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff9100', // Contrast for actions
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },
  typography: {
    // Ensuring rem usage as per Page 22
    htmlFontSize: 16,
    h4: {
      fontSize: '2.125rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    button: {
      fontSize: '0.875rem',
      textTransform: 'none', // Modern look
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: '1rem',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;