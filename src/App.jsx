import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { CssBaseline, Container, Paper, Tabs, Tab, Box } from '@mui/material';
import SimuladorCSMACD from './components/SimuladorCSMACD';
import ProtocolosInfo from './components/ProtocolosInfo';

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

  const handleCambioTab = (event, newValue) => {
    setTabActual(newValue);
  };

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

        <Box sx={{ mt: 2 }}>
          {tabActual === 0 ? (
            <SimuladorCSMACD />
          ) : (
            <ProtocolosInfo />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 