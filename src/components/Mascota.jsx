import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, Paper, IconButton } from '@mui/material';

const Mascota = ({ mensaje, estado, paso }) => {
  const [mostrarMensaje, setMostrarMensaje] = useState(true);
  const [mensajeDetallado, setMensajeDetallado] = useState(false);

  const mensajesDetallados = {
    0: "En la escucha del canal, las estaciones utilizan la técnica de 'carrier sense' para detectar si hay alguna transmisión en curso. Esto es fundamental para evitar colisiones.",
    1: "Cuando el canal está libre, la estación espera un tiempo IFS (Inter-Frame Spacing) antes de transmitir. Esto da prioridad a ciertos tipos de tramas.",
    2: "La colisión ocurre cuando dos estaciones transmiten simultáneamente. La señal se distorsiona y aumenta el voltaje en el cable.",
    3: "La señal de jam es una señal especial de 32 bits que asegura que todas las estaciones detecten la colisión.",
    4: "En el backoff exponencial, cada estación espera un tiempo aleatorio basado en la fórmula: tiempo = random(0..2^n - 1) × 51.2 microsegundos, donde n es el número de intentos.",
    5: "¡Transmisión exitosa! Después del backoff, la estación con el menor tiempo de espera transmite primero, mientras que las otras esperan su turno."
  };

  // Estados de ánimo de la mascota según la situación
  const estadosAnimo = {
    normal: {
      emoji: '🐱',
      color: '#4CAF50',
      animation: {
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0]
      },
      mensajeExtra: 'Haz clic aquí para saber más...'
    },
    feliz: {
      emoji: '😺',
      color: '#2196F3',
      animation: {
        scale: [1, 1.2, 1],
        rotate: [0, 10, -10, 0]
      },
      mensajeExtra: 'Haz clic aquí para saber más...'
    },
    preocupado: {
      emoji: '😿',
      color: '#FFC107',
      animation: {
        x: [-5, 5, -5],
        rotate: [-5, 5, -5]
      },
      mensajeExtra: 'Haz clic aquí para saber más...'
    },
    alerta: {
      emoji: '🙀',
      color: '#F44336',
      animation: {
        scale: [1, 1.3, 1],
        rotate: [-15, 15, -15]
      },
      mensajeExtra: 'Haz clic aquí para saber más...'
    }
  };

  const estadoActual = estadosAnimo[estado] || estadosAnimo.normal;

  const toggleMensaje = () => {
    setMostrarMensaje(!mostrarMensaje);
    setMensajeDetallado(false);
  };

  const toggleMensajeDetallado = () => {
    setMensajeDetallado(!mensajeDetallado);
  };

  return (
    <Box
      component={motion.div}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        display: 'flex',
        alignItems: 'flex-end',
        zIndex: 1000
      }}
    >
      <AnimatePresence>
        {mostrarMensaje && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <Paper 
              elevation={6}
              sx={{
                p: 2,
                mb: 2,
                mr: 2,
                maxWidth: 350,
                borderRadius: 3,
                backgroundColor: '#ffffff',
                border: `2px solid ${estadoActual.color}`,
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  right: '-10px',
                  bottom: '20px',
                  width: 0,
                  height: 0,
                  borderTop: '10px solid transparent',
                  borderBottom: '10px solid transparent',
                  borderLeft: `10px solid ${estadoActual.color}`
                }
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#333',
                  fontWeight: 500,
                  lineHeight: 1.6
                }}
              >
                {mensajeDetallado ? mensajesDetallados[paso] : mensaje}
                <Box
                  onClick={toggleMensajeDetallado}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                >
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block',
                      mt: 1,
                      color: estadoActual.color,
                      fontStyle: 'italic'
                    }}
                  >
                    {mensajeDetallado ? '← Volver al mensaje anterior' : estadoActual.mensajeExtra}
                  </Typography>
                </Box>
              </Typography>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        animate={estadoActual.animation}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{
          fontSize: '5rem',
          cursor: 'pointer',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
          transformOrigin: 'bottom'
        }}
        whileHover={{
          scale: 1.1,
          transition: { duration: 0.2 }
        }}
        whileTap={{
          scale: 0.9
        }}
        onClick={toggleMensaje}
      >
        {estadoActual.emoji}
      </motion.div>
    </Box>
  );
};

export default Mascota; 