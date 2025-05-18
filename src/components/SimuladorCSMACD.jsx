import React, { useState } from 'react';
import { Box, Button, Paper, Typography, Grid, Chip, Divider, Accordion, AccordionSummary, AccordionDetails, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import Mascota from './Mascota';
import RedVisualization from './RedVisualization';

const SimuladorCSMACD = () => {
  const [paso, setPaso] = useState(0);
  const [simulacionCompletada, setSimulacionCompletada] = useState(false);
  const [estacionTransmitiendo, setEstacionTransmitiendo] = useState(null);
  const [intentos, setIntentos] = useState(1);
  const [mostrarTodasCapas, setMostrarTodasCapas] = useState(true);

  const estadosMascota = {
    0: { estado: 'normal', mensaje: 'Observemos cómo las estaciones escuchan el canal...' },
    1: { estado: 'feliz', mensaje: '¡El canal está libre! Podemos transmitir.' },
    2: { estado: 'alerta', mensaje: '¡Oh no! Se ha detectado una colisión.' },
    3: { estado: 'preocupado', mensaje: 'Enviando señal de jam para alertar a todos.' },
    4: { estado: 'normal', mensaje: 'Calculando tiempo de backoff...' },
    5: { estado: 'feliz', mensaje: '¡Éxito! La transmisión se completó correctamente.' }
  };

  const capasOSI = {
    'Capa de Aplicación': {
      numero: 7,
      protocolos: ['HTTP', 'FTP', 'SMTP', 'DNS'],
      descripcion: 'Proporciona la interfaz entre las aplicaciones y la red.',
      relevancia: 'No está directamente involucrada en CSMA/CD, pero genera los datos a transmitir.'
    },
    'Capa de Presentación': {
      numero: 6,
      protocolos: ['SSL/TLS', 'JPEG', 'ASCII'],
      descripcion: 'Maneja la representación de datos.',
      relevancia: 'No participa directamente en CSMA/CD.'
    },
    'Capa de Sesión': {
      numero: 5,
      protocolos: ['NetBIOS', 'RPC'],
      descripcion: 'Gestiona las sesiones entre aplicaciones.',
      relevancia: 'No participa directamente en CSMA/CD.'
    },
    'Capa de Transporte': {
      numero: 4,
      protocolos: ['TCP', 'UDP'],
      descripcion: 'Garantiza la entrega confiable de datos.',
      relevancia: 'Proporciona control de flujo pero no está directamente involucrada en CSMA/CD.'
    },
    'Capa de Red': {
      numero: 3,
      protocolos: ['IP', 'ICMP', 'ARP'],
      descripcion: 'Maneja el enrutamiento y direccionamiento.',
      relevancia: 'Proporciona direccionamiento pero no participa directamente en CSMA/CD.'
    },
    'Capa de Enlace de Datos': {
      numero: 2,
      protocolos: ['Ethernet', 'CSMA/CD', 'MAC'],
      descripcion: 'Gestiona el acceso al medio y la detección de errores.',
      relevancia: 'CSMA/CD opera en esta capa, controlando el acceso al medio compartido.'
    },
    'Capa Física': {
      numero: 1,
      protocolos: ['IEEE 802.3', '10BASE-T', '100BASE-TX'],
      descripcion: 'Transmite bits a través del medio físico.',
      relevancia: 'Detecta las colisiones a nivel eléctrico y transmite la señal de jam.'
    }
  };

  const pasos = [
    {
      titulo: 'Escucha del Canal',
      descripcion: 'En CSMA/CD, antes de transmitir, las estaciones escuchan el canal para verificar si está libre. Las ondas alrededor de las estaciones representan esta escucha activa.',
      capaOSI: 'Capa de Enlace de Datos',
      capasInvolucradas: ['Capa de Enlace de Datos', 'Capa Física'],
      protocolos: ['Ethernet IEEE 802.3', 'CSMA/CD'],
      detallesTecnicos: {
        proceso: 'La estación monitorea la portadora (carrier sense) para detectar transmisiones en curso.',
        parametros: [
          'Tiempo de bit: 100 nanosegundos para 10Mbps Ethernet',
          'Voltaje de portadora: Entre -2.5V y +2.5V',
          'Umbral de detección: ±0.6V'
        ],
        implementacion: 'Se utiliza un circuito de detección de portadora que monitorea el voltaje en el medio.'
      }
    },
    {
      titulo: 'Canal Libre',
      descripcion: 'El canal está libre, así que la Estación A comienza a transmitir sus datos. Observa cómo los paquetes (📦) viajan a través del cable.',
      capaOSI: 'Capa de Enlace de Datos',
      capasInvolucradas: ['Capa de Enlace de Datos', 'Capa Física'],
      protocolos: ['Ethernet IEEE 802.3', 'MAC'],
      detallesTecnicos: {
        proceso: 'Se inicia la transmisión de tramas Ethernet con preámbulo y delimitador.',
        parametros: [
          'Preámbulo: 7 bytes de 10101010',
          'Delimitador: 1 byte de 10101011',
          'Velocidad de transmisión: 10/100/1000 Mbps'
        ],
        implementacion: 'La trama incluye direcciones MAC origen y destino, tipo/longitud, datos y FCS.'
      }
    },
    {
      titulo: 'Detección de Colisión',
      descripcion: 'Ops... ¡Ambas estaciones intentaron transmitir al mismo tiempo! Los paquetes chocan en el medio del cable, produciendo una colisión (💥).',
      capaOSI: 'Capa Física',
      capasInvolucradas: ['Capa de Enlace de Datos', 'Capa Física'],
      protocolos: ['Ethernet IEEE 802.3', 'CSMA/CD', 'PLS'],
      detallesTecnicos: {
        proceso: 'Se detecta una colisión cuando la señal medida excede el umbral normal de transmisión.',
        parametros: [
          'Ventana de colisión: 51.2 µs para 10Mbps',
          'Umbral de colisión: > ±1.5V',
          'Tiempo de propagación máximo: 25.6 µs'
        ],
        implementacion: 'Los transceivers detectan niveles de voltaje anormales que indican colisión.'
      }
    },
    {
      titulo: 'Jam Signal',
      descripcion: 'Al detectar la colisión, las estaciones envían una señal de jam (la línea roja parpadeante) para asegurar que todas las estaciones detecten el problema.',
      capaOSI: 'Capa Física',
      capasInvolucradas: ['Capa Física'],
      protocolos: ['Ethernet IEEE 802.3', 'PLS', 'Jam Signal'],
      detallesTecnicos: {
        proceso: 'Se transmite una señal de 32 bits para reforzar la detección de colisión en todas las estaciones.',
        parametros: [
          'Duración de jam: 3.2 µs (32 bits)',
          'Patrón de jam: 0101010101...',
          'Amplitud: ±1.5V'
        ],
        implementacion: 'La señal de jam es un patrón de bits que garantiza la detección de la colisión.'
      }
    },
    {
      titulo: 'Backoff Exponencial',
      descripcion: 'Las estaciones esperan un tiempo aleatorio (⏳) antes de intentar transmitir nuevamente. Este tiempo de espera ayuda a evitar nuevas colisiones.',
      capaOSI: 'Capa de Enlace de Datos',
      capasInvolucradas: ['Capa de Enlace de Datos'],
      protocolos: ['Ethernet IEEE 802.3', 'Binary Exponential Backoff'],
      detallesTecnicos: {
        proceso: 'El tiempo de espera se calcula usando el algoritmo de retroceso exponencial binario.',
        parametros: [
          'Slot time: 51.2 µs',
          'Máximo intentos: 16',
          'Rango de espera: 0 a (2^n - 1) slots, donde n es el número de colisiones'
        ],
        implementacion: 'Se usa un generador de números aleatorios para seleccionar el tiempo de espera dentro del rango calculado.'
      }
    }
  ];

  const handleSiguientePaso = () => {
    if (paso < 5) {
      setPaso(paso + 1);
      if (paso === 4) {
        setIntentos(prev => prev + 1);
      }
    } else if (!simulacionCompletada) {
      setSimulacionCompletada(true);
    }
  };

  const handlePasoAnterior = () => {
    if (paso > 0) {
      setPaso(paso - 1);
      if (paso === 5) {
        setIntentos(prev => Math.max(1, prev - 1));
      }
    }
  };

  const handleReiniciar = () => {
    setPaso(0);
    setSimulacionCompletada(false);
    setEstacionTransmitiendo(null);
    setIntentos(1);
  };

  const handleActualizarIntentos = (nuevoIntento) => {
    setIntentos(nuevoIntento);
  };

  const renderDetallesPaso = () => {
    const pasoActual = pasos[paso];
    if (!pasoActual) return null;

    return (
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {pasoActual.titulo}
          </Typography>
          <Typography variant="body1" paragraph>
            {pasoActual.descripcion}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Capas OSI Involucradas:
          </Typography>
          <Box sx={{ mb: 2 }}>
            {pasoActual.capasInvolucradas.map((capa, index) => (
              <Chip
                key={index}
                label={capa}
                color="primary"
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
          
          <Typography variant="subtitle1" gutterBottom>
            Protocolos:
          </Typography>
          <Box sx={{ mb: 2 }}>
            {pasoActual.protocolos.map((protocolo, index) => (
              <Chip
                key={index}
                label={protocolo}
                color="secondary"
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
          
          <Accordion>
            <AccordionSummary expandIcon="▼">
              <Typography>Detalles Técnicos</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                <strong>Proceso:</strong> {pasoActual.detallesTecnicos.proceso}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Parámetros:
              </Typography>
              <ul>
                {pasoActual.detallesTecnicos.parametros.map((param, index) => (
                  <li key={index}>
                    <Typography variant="body2">{param}</Typography>
                  </li>
                ))}
              </ul>
              <Typography variant="body2">
                <strong>Implementación:</strong> {pasoActual.detallesTecnicos.implementacion}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Box>
    );
  };

  const renderModeloOSI = () => {
    const pasoActual = pasos[paso];
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3,
          mb: 2, 
          width: '100%',
          borderRadius: 2,
          background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
          position: 'sticky',
          top: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography 
            variant="h6" 
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            Modelo OSI
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setMostrarTodasCapas(!mostrarTodasCapas)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '0.85rem'
            }}
          >
            {mostrarTodasCapas ? 'Mostrar Solo Relevantes' : 'Mostrar Todas'}
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ 
          maxHeight: 'calc(100vh - 200px)', 
          overflowY: 'auto', 
          pr: 1,
          '&::-webkit-scrollbar': {
            width: '8px'
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
            '&:hover': {
              background: '#555'
            }
          }
        }}>
          {Object.entries(capasOSI).reverse().map(([nombre, capa], index) => {
            const estaInvolucrada = pasoActual?.capasInvolucradas.includes(nombre);
            
            if (!mostrarTodasCapas && !estaInvolucrada) {
              return null;
            }

            return (
              <Paper
                key={nombre}
                elevation={estaInvolucrada ? 3 : 1}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  position: 'relative',
                  backgroundColor: estaInvolucrada ? 'primary.light' : 'background.paper',
                  border: '1px solid',
                  borderColor: estaInvolucrada ? 'primary.main' : 'grey.200',
                  transition: 'all 0.3s ease',
                  transform: estaInvolucrada ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 4
                  },
                  overflow: 'hidden',
                  opacity: estaInvolucrada || mostrarTodasCapas ? 1 : 0.7
                }}
              >
                {/* Número de capa como círculo */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: estaInvolucrada ? 'primary.main' : 'grey.300',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: estaInvolucrada ? 'white' : 'text.primary',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    boxShadow: 2,
                    zIndex: 1
                  }}
                >
                  {capa.numero}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: estaInvolucrada ? 'primary.contrastText' : 'text.primary',
                      mb: 1
                    }}
                  >
                    {nombre}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    {capa.protocolos.map((protocolo, i) => (
                      <Chip
                        key={i}
                        label={protocolo}
                        size="small"
                        variant={estaInvolucrada ? "filled" : "outlined"}
                        color={estaInvolucrada ? "primary" : "default"}
                        sx={{ 
                          borderRadius: '4px',
                          '& .MuiChip-label': {
                            px: 1
                          }
                        }}
                      />
                    ))}
                  </Box>

                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: estaInvolucrada ? 'primary.contrastText' : 'text.secondary',
                      opacity: 0.9,
                      fontSize: '0.85rem'
                    }}
                  >
                    {capa.descripcion}
                  </Typography>

                  {estaInvolucrada && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 1,
                        color: 'primary.contrastText',
                        fontStyle: 'italic',
                        fontSize: '0.85rem',
                        borderLeft: '3px solid',
                        borderColor: 'primary.contrastText',
                        pl: 1
                      }}
                    >
                      {capa.relevancia}
                    </Typography>
                  )}
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Paper>
    );
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8f9fa' }}>
      {simulacionCompletada ? (
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
            maxWidth: 500,
            width: '90%',
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="h4" 
            color="success.main" 
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            ¡Simulación Completada!
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            Has aprendido el funcionamiento completo del protocolo CSMA/CD.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReiniciar}
            sx={{ 
              mt: 2,
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
            Reiniciar Simulación
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              {renderModeloOSI()}
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 4 }}>
                <RedVisualization 
                  paso={paso}
                  estacionTransmitiendo={estacionTransmitiendo}
                  setEstacionTransmitiendo={setEstacionTransmitiendo}
                  intentos={intentos}
                  onSiguientePaso={handleSiguientePaso}
                  onPasoAnterior={handlePasoAnterior}
                  onActualizarIntentos={handleActualizarIntentos}
                  titulo={pasos[paso]?.titulo}
                />
              </Box>
              {renderDetallesPaso()}
            </Grid>
          </Grid>

          <Mascota
            mensaje={estadosMascota[paso].mensaje}
            estado={estadosMascota[paso].estado}
            paso={paso}
          />
        </>
      )}
    </Box>
  );
};

export default SimuladorCSMACD; 