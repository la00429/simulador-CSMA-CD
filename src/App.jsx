import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { CssBaseline, Container, Paper, Tabs, Tab, Box, Typography, IconButton, Tooltip, Alert } from '@mui/material';
import SimuladorCSMACD from './components/SimuladorCSMACD';
import ProtocolosInfo from './components/ProtocolosInfo';
import PresentacionBitsy from './components/PresentacionBitsy';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
  const [mostrarInfoCSMACD, setMostrarInfoCSMACD] = useState(false);

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
            <Tab label="Simulador CSMA/CD" />
            <Tab label="Protocolos y Capas OSI" />
          </Tabs>
        </Paper>
        {/* Título y botón de info solo en la simulación */}
        {tabActual === 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mr: 1 }}>
              Simulador CSMA/CD
            </Typography>
            <Tooltip title="¿Dónde funciona CSMA/CD?">
              <IconButton size="small" onClick={() => setMostrarInfoCSMACD(v => !v)}>
                <InfoOutlinedIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        {mostrarInfoCSMACD && (
          <Alert severity="info" sx={{ mb: 2 }} onClose={() => setMostrarInfoCSMACD(false)}>
            <strong>Nota:</strong> CSMA/CD (Carrier Sense Multiple Access with Collision Detection) es un mecanismo diseñado exclusivamente para redes Ethernet cableadas (IEEE 802.3). No se utiliza en redes inalámbricas (WiFi), redes WAN, ni en Ethernet con switches modernos, donde las colisiones ya no ocurren.
          </Alert>
        )}
        {tabActual === 0 ? (
          <SimuladorCSMACD />
        ) : (
          <ProtocolosInfo />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App; 