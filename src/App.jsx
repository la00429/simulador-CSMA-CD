import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { CssBaseline, Container, Paper, Tabs, Tab, Box } from '@mui/material';
import TopologiaBus from './components/TopologiaBus';
import TopologiaEstrella from './components/TopologiaEstrella';
import PresentacionBitsy from './components/PresentacionBitsy';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#fff'
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
      contrastText: '#fff'
    },
    background: {
      default: '#f8fafb',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
      fontSize: '2.5rem'
    },
    h4: {
      fontWeight: 600,
      fontSize: '2rem'
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem'
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 24px'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500
        }
      }
    }
  }
});

function App() {
  const [tabActual, setTabActual] = useState(0);
  const [mostrarPresentacion, setMostrarPresentacion] = useState(true);

  const handleCambioTab = (event, newValue) => {
    setTabActual(newValue);
  };

  const handleIniciarSimulacion = () => {
    setMostrarPresentacion(false);
  };

  if (mostrarPresentacion) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'background.default'
        }}>
          <PresentacionBitsy onIniciar={handleIniciarSimulacion} />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ mb: 2 }}>
          <Tabs 
            value={tabActual} 
            onChange={handleCambioTab}
            centered
            sx={{
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Tab label="Topología Bus (Coaxial)" />
            <Tab label="Topología Estrella (Hub)" />
          </Tabs>
        </Paper>
        {tabActual === 0 && <TopologiaBus />}
        {tabActual === 1 && <TopologiaEstrella />}
      </Container>
    </ThemeProvider>
  );
}

export default App; 