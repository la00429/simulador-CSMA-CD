import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Fade,
  Container
} from '@mui/material';

const PresentacionBitsy = ({ onIniciar }) => {
  const [mostrar, setMostrar] = useState(true);

  const handleIniciar = () => {
    setMostrar(false);
    setTimeout(() => {
      onIniciar();
    }, 500);
  };

  return (
    <Fade in={mostrar}>
      <Container maxWidth="md">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            backgroundColor: '#fff',
            borderRadius: 2
          }}
        >
          <Typography variant="h3" gutterBottom sx={{ color: '#2196f3' }}>
            ¡Hola! Soy Bitsy 🐱
          </Typography>
          
          <Typography variant="h5" gutterBottom sx={{ mt: 3, color: '#666' }}>
            Tu guía en el mundo de las redes
          </Typography>

          <Typography variant="body1" sx={{ mt: 3, mb: 4, color: '#444' }}>
            Estoy aquí para ayudarte a entender el protocolo CSMA/CD y cómo funciona la transmisión de datos.
            Juntos exploraremos conceptos importantes y veremos una simulación interactiva que te ayudarán a comprender mejor estos temas.
          </Typography>

          <Button 
            variant="contained" 
            size="large"
            onClick={handleIniciar}
            sx={{ 
              mt: 2,
              backgroundColor: '#2196f3',
              '&:hover': {
                backgroundColor: '#1976d2'
              }
            }}
          >
            ¡Empecemos!
          </Button>
        </Paper>
      </Container>
    </Fade>
  );
};

export default PresentacionBitsy; 