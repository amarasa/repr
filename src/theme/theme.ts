import { createTheme } from '@mui/material/styles'

// Repr Color Palette from spec
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1A73E8', // Electric Blue
    },
    secondary: {
      main: '#00C49A', // Energized Green
    },
    background: {
      default: '#F9FAFB', // Soft Off-White
      paper: '#FFFFFF', // Pure White
    },
    divider: '#E0E0E0', // Light Gray
    text: {
      primary: '#212121', // Near Black
      secondary: '#616161', // Dim Gray
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
}) 