import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, Paper, Button, LinearProgress, Stack } from '@mui/material';

const RedVisualization = ({ paso, onSimulationEnd, onSimulationStart, estacionTransmitiendo, setEstacionTransmitiendo, intentos, onSiguientePaso, onPasoAnterior, onActualizarIntentos, titulo }) => {
  const [tiempoEsperaA, setTiempoEsperaA] = useState(0);
  const [tiempoEsperaB, setTiempoEsperaB] = useState(0);
  const [simulacionCompletada, setSimulacionCompletada] = useState(false);
  const [simulacionIniciada, setSimulacionIniciada] = useState(true);

  useEffect(() => {
    if (paso === 4 && intentos >= 3) {
      setSimulacionCompletada(true);
      onSimulationEnd && onSimulationEnd();
    }
  }, [paso, intentos, onSimulationEnd]);

  useEffect(() => {
    onSimulationStart && onSimulationStart();
    onActualizarIntentos(1);
  }, []);

  const handleReset = () => {
    setSimulacionIniciada(false);
    setSimulacionCompletada(false);
    onActualizarIntentos(1);
  };

  useEffect(() => {
    if (paso === 4) {
      // Simular el cálculo del tiempo de backoff
      const maxSlots = Math.pow(2, intentos) - 1;
      setTiempoEsperaA(Math.floor(Math.random() * maxSlots) * 51.2);
      setTiempoEsperaB(Math.floor(Math.random() * maxSlots) * 51.2);
    }
  }, [paso, intentos]);

  useEffect(() => {
    if (paso === 4) {
      // Después del backoff, la estación con menor tiempo de espera transmitirá
      const estacionGanadora = tiempoEsperaA < tiempoEsperaB ? 'A' : 'B';
      setEstacionTransmitiendo(estacionGanadora);
    }
  }, [paso, tiempoEsperaA, tiempoEsperaB, setEstacionTransmitiendo]);

  // Configuración de las animaciones según el paso actual
  const animaciones = {
    0: { // Escucha del Canal
      scale: [1, 1.1, 1],
      transition: { duration: 2, repeat: Infinity }
    },
    1: { // Canal Libre
      x: [0, 300],
      transition: { duration: 3, ease: "linear" }
    },
    2: { // Detección de Colisión
      scale: [1, 1.5],
      rotate: [0, 180],
      transition: { duration: 0.5 }
    },
    3: { // Jam Signal
      opacity: [1, 0, 1],
      transition: { duration: 1, repeat: 3 }
    },
    4: { // Backoff Exponencial
      y: [0, 20, 0],
      transition: { duration: 1, repeat: 2 }
    }
  };

  // Componente para las ondas de transmisión
  const OndasTransmision = ({ x, color }) => (
    <motion.div
      style={{
        position: 'absolute',
        width: 30,
        height: 30,
        borderRadius: '50%',
        border: `2px solid ${color}`,
        top: '50%',
        left: x,
        transform: 'translate(-50%, -50%)'
      }}
      animate={{
        scale: [1, 2, 1],
        opacity: [0.8, 0, 0.8],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
      }}
    />
  );

  const EstacionRed = ({ position, color, nombre }) => (
    <Box sx={{ position: 'absolute', ...position }}>
      <motion.div
        style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          backgroundColor: color,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: '24px'
        }}
        animate={animaciones[paso]}
      >
        💻
      </motion.div>
      <Typography 
        variant="caption" 
        sx={{ 
          position: 'absolute', 
          width: '100%', 
          textAlign: 'center',
          mt: 1
        }}
      >
        {nombre}
      </Typography>
    </Box>
  );

  const BackoffInfo = ({ estacion, tiempo, posicion }) => (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        ...posicion,
        p: 1,
        backgroundColor: '#fff',
        borderRadius: 2,
        minWidth: 180
      }}
    >
      <Typography variant="subtitle2" color="primary" gutterBottom>
        {estacion}
      </Typography>
      <Typography variant="body2">
        Tiempo de espera: {tiempo.toFixed(1)} µs
      </Typography>
      <Box sx={{ 
        mt: 1, 
        height: 4, 
        backgroundColor: '#e0e0e0',
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        <motion.div
          style={{
            height: '100%',
            backgroundColor: '#2196F3',
            width: '100%'
          }}
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          transition={{ duration: tiempo / 1000 }}
        />
      </Box>
    </Paper>
  );

  const PaqueteDatos = ({ origen, destino }) => (
    <motion.div
      style={{
        width: 30,
        height: 20,
        backgroundColor: '#FF9800',
        position: 'absolute',
        borderRadius: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '12px'
      }}
      initial={{ x: origen, y: '50%' }}
      animate={{ x: destino }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      📦
    </motion.div>
  );

  const Cable = () => (
    <Box
      sx={{
        width: '100%',
        height: 5,
        backgroundColor: '#666',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -2,
          left: 0,
          right: 0,
          height: 9,
          background: 'repeating-linear-gradient(90deg, #666, #666 5px, transparent 5px, transparent 10px)'
        }
      }}
    />
  );

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        border: '2px solid #ccc',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}
    >
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          borderRadius: '2px 2px 0 0',
          background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            color: 'primary.main',
            mb: 2
          }}
        >
          Paso {paso + 1}: {titulo}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={(paso / 5) * 100} 
          sx={{ 
            mb: 3,
            height: 8,
            borderRadius: 4,
            bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4
            }
          }}
        />
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            onClick={onPasoAnterior}
            disabled={paso === 0}
            sx={{ 
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 2
              }
            }}
          >
            Paso Anterior
          </Button>
          <Button
            variant="contained"
            onClick={onSiguientePaso}
            sx={{ 
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: 2,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}
          >
            {paso < 5 ? 'Siguiente Paso' : 'Finalizar Simulación'}
          </Button>
        </Stack>
      </Paper>

      <Box sx={{ height: 400, position: 'relative' }}>
        {simulacionCompletada ? (
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            width: '100%'
          }}>
            <Typography variant="h6" gutterBottom color="success.main" sx={{ fontWeight: 'bold' }}>
              ¡Simulación Completada!
            </Typography>
            <Typography variant="body1" gutterBottom>
              Se ha resuelto la colisión después de {intentos} intentos
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleReset}
              sx={{ mt: 2 }}
            >
              Reiniciar Simulación
            </Button>
          </Box>
        ) : (
          <>
            <Cable />
            <EstacionRed 
              position={{ left: 50, top: '50%', transform: 'translateY(-50%)' }} 
              color="#4CAF50"
              nombre="Estación A"
            />
            <EstacionRed 
              position={{ right: 50, top: '50%', transform: 'translateY(-50%)' }} 
              color="#2196F3"
              nombre="Estación B"
            />

            {/* Información del proceso actual */}
            <Paper
              elevation={3}
              sx={{
                position: 'absolute',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                p: 2,
                backgroundColor: '#fff',
                borderRadius: 2,
                minWidth: 200,
                textAlign: 'center'
              }}
            >
              {paso === 0 && (
                <Typography variant="body2">
                  Escuchando el canal...
                </Typography>
              )}
              {paso === 1 && (
                <Typography variant="body2">
                  Transmitiendo datos...
                </Typography>
              )}
              {paso === 2 && (
                <Typography variant="body2" color="error">
                  ¡Colisión detectada! 💥
                </Typography>
              )}
              {paso === 3 && (
                <Typography variant="body2" color="warning.main">
                  Enviando señal de jam...
                </Typography>
              )}
              {paso === 4 && (
                <>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Algoritmo de Backoff Exponencial
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Intento #{intentos}
                  </Typography>
                  <Typography variant="body2">
                    Rango de slots: 0 a {Math.pow(2, intentos) - 1}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Después del backoff:
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    La Estación {estacionTransmitiendo} transmitirá primero
                  </Typography>
                </>
              )}
              {paso === 5 && (
                <>
                  <Typography variant="subtitle2" color="success.main" gutterBottom>
                    ¡Transmisión Exitosa!
                  </Typography>
                  <Typography variant="body2">
                    La Estación {estacionTransmitiendo} completó su transmisión
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    La otra estación esperará y transmitirá después
                  </Typography>
                </>
              )}
            </Paper>

            {/* Visualización del Backoff */}
            {paso === 4 && (
              <>
                <BackoffInfo 
                  estacion="Estación A"
                  tiempo={tiempoEsperaA}
                  posicion={{ left: 20, top: 100 }}
                />
                <BackoffInfo 
                  estacion="Estación B"
                  tiempo={tiempoEsperaB}
                  posicion={{ right: 20, top: 100 }}
                />
                
                {/* Línea temporal */}
                <Box sx={{ 
                  position: 'absolute',
                  bottom: 40,
                  left: '10%',
                  width: '80%',
                  height: 2,
                  backgroundColor: '#666'
                }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      position: 'absolute',
                      bottom: 10,
                      left: 0
                    }}
                  >
                    0 µs
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      position: 'absolute',
                      bottom: 10,
                      right: 0
                    }}
                  >
                    {Math.max(tiempoEsperaA, tiempoEsperaB).toFixed(1)} µs
                  </Typography>
                </Box>
              </>
            )}

            {/* Ondas de escucha */}
            {paso === 0 && (
              <>
                <motion.div
                  style={{
                    position: 'absolute',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    border: '2px solid #4CAF50',
                    left: 45,
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.8, 0, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
                <motion.div
                  style={{
                    position: 'absolute',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    border: '2px solid #2196F3',
                    right: 45,
                    top: '50%',
                    transform: 'translate(50%, -50%)'
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.8, 0, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 0.5
                  }}
                />
              </>
            )}

            {/* Transmisión de datos */}
            {paso === 1 && (
              <motion.div
                style={{
                  width: 30,
                  height: 20,
                  backgroundColor: '#4CAF50',
                  position: 'absolute',
                  left: 80,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  borderRadius: 4,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                animate={{
                  x: [0, window.innerWidth - 200]
                }}
                transition={{
                  duration: 3,
                  ease: "linear",
                  repeat: Infinity
                }}
              >
                📦
              </motion.div>
            )}

            {/* Colisión */}
            {paso === 2 && (
              <motion.div
                style={{
                  width: 60,
                  height: 60,
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                animate={{
                  scale: [1, 2, 1],
                  opacity: [1, 0, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity
                }}
              >
                💥
              </motion.div>
            )}

            {/* Señal de jam */}
            {paso === 3 && (
              <motion.div
                style={{
                  width: '100%',
                  height: 20,
                  backgroundColor: '#f44336',
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  opacity: 0.5
                }}
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                }}
              />
            )}

            {/* Visualización de la transmisión exitosa */}
            {paso === 5 && (
              <motion.div
                style={{
                  width: 30,
                  height: 20,
                  backgroundColor: estacionTransmitiendo === 'A' ? '#4CAF50' : '#2196F3',
                  position: 'absolute',
                  left: estacionTransmitiendo === 'A' ? 80 : 'auto',
                  right: estacionTransmitiendo === 'B' ? 80 : 'auto',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  borderRadius: 4,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                animate={{
                  x: estacionTransmitiendo === 'A' 
                    ? [0, window.innerWidth - 200] 
                    : [0, -(window.innerWidth - 200)]
                }}
                transition={{
                  duration: 3,
                  ease: "linear"
                }}
              >
                📦
              </motion.div>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default RedVisualization; 