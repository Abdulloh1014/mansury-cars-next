import { createTheme } from '@mui/material/styles';

// Dark mode sozlamalari (Mansory uslubida)
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#060404', // To'q qora fon
      paper: '#111111',
    },
    primary: {
      main: '#d4af37', // Oltin rang aksent
    },
  },
});

// Light mode sozlamalari
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#ffffff',
    },
  },
});