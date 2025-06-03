import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Grid, Card, CardContent, Chip, Divider, Button, Alert, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import Mascota from './Mascota';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  }
}));

const TopologiaEstrella = () => {
  const [simulacionActiva, setSimulacionActiva] = useState(false);
  const [pasoActual, setPasoActual] = useState(0);
  const [colisionDetectada, setColisionDetectada] = useState(false);
  const [transmisionExitosa, setTransmisionExitosa] = useState(false);
  const [estacionTransmitiendo, setEstacionTransmitiendo] = useState(null);
  const [progreso, setProgreso] = useState(0);
  const [estacionesQueQuierenTransmitir, setEstacionesQueQuierenTransmitir] = useState([]);
  const [hubOcupado, setHubOcupado] = useState(false);
  const [estacionesEsperando, setEstacionesEsperando] = useState([]);

  const pasos = [
    {
      titulo: "1. Carrier Sense (Escuchar el Hub)",
      descripcion: "Las estaciones que quieren transmitir 'levantan la mano' y escuchan su puerto del hub",
      detalle: "🙋‍♂️ Cada estación verifica si el hub está libre antes de transmitir"
    },
    {
      titulo: "2. Multiple Access (Decisión de Transmitir)",
      descripcion: "Si el hub está libre, la estación puede transmitir. Si está ocupado, debe esperar",
      detalle: "✅ Hub libre = Puede transmitir | ❌ Hub ocupado = Debe esperar"
    },
    {
      titulo: "3. Retransmisión del Hub",
      descripcion: "El hub retransmite la señal a TODOS los demás puertos simultáneamente",
      detalle: "📡 El hub actúa como repetidor multipuerto, creando un dominio de colisión único"
    },
    {
      titulo: "4. Collision Detection en Hub",
      descripcion: "Si dos estaciones transmiten al hub simultáneamente, se detecta colisión",
      detalle: "💥 El hub detecta señales simultáneas en múltiples puertos y genera una colisión"
    },
    {
      titulo: "5. Jam Signal desde Hub",
      descripcion: "El hub envía señal de jam a TODOS los puertos y se aplica backoff exponencial",
      detalle: "⏰ Todas las estaciones reciben la señal de jam y esperan tiempo aleatorio"
    }
  ];

  const iniciarSimulacion = () => {
    setSimulacionActiva(true);
    setPasoActual(0);
    setColisionDetectada(false);
    setTransmisionExitosa(false);
    setProgreso(0);
    setHubOcupado(false);
    
    // Simular que varias estaciones quieren transmitir
    const estacionesInteresadas = [];
    for (let i = 1; i <= 6; i++) {
      if (Math.random() > 0.6) {
        estacionesInteresadas.push(i);
      }
    }
    // Asegurar que al menos 2 estaciones quieran transmitir
    if (estacionesInteresadas.length < 2) {
      estacionesInteresadas.push(2, 5);
    }
    
    setEstacionesQueQuierenTransmitir(estacionesInteresadas);
    setEstacionTransmitiendo(estacionesInteresadas[0]);
    setEstacionesEsperando(estacionesInteresadas.slice(1));
  };

  const siguientePaso = () => {
    if (pasoActual < pasos.length - 1) {
      setPasoActual(pasoActual + 1);
      setProgreso((pasoActual + 1) * 20);
      
      // Lógica específica para cada paso
      switch (pasoActual + 1) {
        case 1: // Carrier Sense
          setHubOcupado(false);
          break;
        case 2: // Multiple Access
          setHubOcupado(true);
          break;
        case 3: // Retransmisión del Hub
          // Simular colisión si hay múltiples estaciones esperando
          if (estacionesEsperando.length > 0 && Math.random() > 0.6) {
            setColisionDetectada(true);
            setEstacionTransmitiendo(null);
          }
          break;
        case 4: // Collision Detection
          if (colisionDetectada) {
            setHubOcupado(false);
          }
          break;
        case 5: // Jam Signal y Backoff
          if (!colisionDetectada) {
            setTransmisionExitosa(true);
          }
          setHubOcupado(false);
          break;
      }
    } else {
      // Reiniciar simulación
      setTimeout(() => {
        setSimulacionActiva(false);
        setPasoActual(0);
        setProgreso(0);
        setEstacionesQueQuierenTransmitir([]);
        setEstacionesEsperando([]);
        setEstacionTransmitiendo(null);
      }, 2000);
    }
  };

  useEffect(() => {
    if (simulacionActiva && pasoActual < pasos.length) {
      const timer = setTimeout(siguientePaso, 3000);
      return () => clearTimeout(timer);
    }
  }, [simulacionActiva, pasoActual]);

  const getEstacionColor = (estacionId) => {
    if (!simulacionActiva) return "#74b9ff";
    if (estacionTransmitiendo === estacionId) return "#00b894"; // Verde - transmitiendo
    if (estacionesQueQuierenTransmitir.includes(estacionId)) {
      if (hubOcupado) return "#fdcb6e"; // Amarillo - quiere transmitir pero debe esperar
      return "#fd79a8"; // Rosa - quiere transmitir y puede
    }
    return "#74b9ff"; // Azul - no quiere transmitir
  };

  const getEstacionEstado = (estacionId) => {
    if (!simulacionActiva) return "";
    if (estacionTransmitiendo === estacionId) return "📡";
    if (estacionesQueQuierenTransmitir.includes(estacionId)) {
      if (hubOcupado) return "⏳";
      return "🙋‍♂️";
    }
    return "😴";
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Topología Ethernet en Estrella (10BASE-T con Hub)
      </Typography>
      
      {/* Simulación Interactiva */}
      <Paper sx={{ p: 4, mb: 4, bgcolor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Simulación CSMA/CD en Estrella
          </Typography>
          <Mascota 
            expresion={simulacionActiva ? (colisionDetectada ? "preocupado" : "feliz") : "neutral"}
            size={60}
          />
        </Box>
        
        {!simulacionActiva ? (
          <Box sx={{ textAlign: 'center' }}>
            <Button 
              variant="contained" 
              size="large" 
              onClick={iniciarSimulacion}
              sx={{ mb: 2 }}
            >
              Iniciar Simulación CSMA/CD
            </Button>
            <Typography variant="body2" color="text.secondary">
              Observa cómo las estaciones "levantan la mano" para transmitir al hub central
            </Typography>
          </Box>
        ) : (
          <Box>
            <LinearProgress 
              variant="determinate" 
              value={progreso} 
              sx={{ mb: 3, height: 8, borderRadius: 4 }}
            />
            
            {/* Estado del hub */}
            <Alert 
              severity={hubOcupado ? "warning" : "success"} 
              sx={{ mb: 2 }}
            >
              <strong>Estado del Hub:</strong> {hubOcupado ? "🔴 OCUPADO - Las estaciones deben esperar" : "🟢 LIBRE - Las estaciones pueden transmitir"}
            </Alert>
            
            {colisionDetectada && (
              <Alert severity="error" sx={{ mb: 2 }}>
                💥 ¡Colisión detectada en el hub! El hub envía jam signal a todos los puertos...
              </Alert>
            )}
            
            {transmisionExitosa && (
              <Alert severity="success" sx={{ mb: 2 }}>
                ✅ ¡Transmisión exitosa! El hub retransmitió los datos a todas las estaciones.
              </Alert>
            )}
            
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  {pasos[pasoActual]?.titulo}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {pasos[pasoActual]?.descripcion}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {pasos[pasoActual]?.detalle}
                </Typography>
              </CardContent>
            </Card>

            {/* Leyenda de estados */}
            <Card sx={{ mb: 3, bgcolor: '#f0f8ff' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🎯 Estados de las Estaciones
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 20, height: 20, bgcolor: '#74b9ff', mr: 1, borderRadius: 1 }} />
                      <Typography variant="body2">😴 Inactiva</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 20, height: 20, bgcolor: '#fd79a8', mr: 1, borderRadius: 1 }} />
                      <Typography variant="body2">🙋‍♂️ Quiere transmitir</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 20, height: 20, bgcolor: '#fdcb6e', mr: 1, borderRadius: 1 }} />
                      <Typography variant="body2">⏳ Esperando</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 20, height: 20, bgcolor: '#00b894', mr: 1, borderRadius: 1 }} />
                      <Typography variant="body2">📡 Transmitiendo</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )}
        
        {/* SVG de la topología en estrella con animación mejorada */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <svg width="600" height="400" viewBox="0 0 600 400">
            {/* Hub central */}
            <rect 
              x="275" 
              y="175" 
              width="50" 
              height="50" 
              fill={simulacionActiva && pasoActual >= 2 ? (colisionDetectada ? "#e17055" : (hubOcupado ? "#fdcb6e" : "#4ecdc4")) : "#4ecdc4"} 
              rx="8" 
            />
            <text x="300" y="200" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">HUB</text>
            <text x="300" y="215" textAnchor="middle" fontSize="8" fill="white">
              {hubOcupado ? "OCUPADO" : "LIBRE"}
            </text>
            
            {/* Animación del hub cuando está activo */}
            {simulacionActiva && pasoActual >= 2 && (
              <circle cx="300" cy="200" r="30" fill="none" stroke={colisionDetectada ? "#e17055" : "#4ecdc4"} strokeWidth="2" opacity="0.6">
                <animate attributeName="r" values="30;50;30" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Animación de colisión en el hub */}
            {colisionDetectada && (
              <>
                <circle cx="300" cy="200" r="25" fill="#e17055" opacity="0.8">
                  <animate attributeName="r" values="25;40;25" dur="0.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.5s" repeatCount="indefinite" />
                </circle>
                <text x="300" y="205" textAnchor="middle" fontSize="16" fill="white">💥</text>
              </>
            )}
            
            {/* Puertos del hub */}
            <circle cx="285" cy="175" r="3" fill="#fff" />
            <circle cx="300" cy="175" r="3" fill="#fff" />
            <circle cx="315" cy="175" r="3" fill="#fff" />
            <circle cx="285" cy="225" r="3" fill="#fff" />
            <circle cx="300" cy="225" r="3" fill="#fff" />
            <circle cx="315" cy="225" r="3" fill="#fff" />
            
            {/* Estaciones y conexiones */}
            {/* PC-1 (arriba izquierda) */}
            <rect 
              x="100" 
              y="50" 
              width="60" 
              height="40" 
              fill={getEstacionColor(1)} 
              rx="5" 
            />
            <text x="130" y="75" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">PC-1</text>
            <line x1="160" y1="70" x2="285" y2="175" stroke="#666" strokeWidth="3" />
            <text x="220" y="120" textAnchor="middle" fontSize="9" fill="#666">Cat 5 UTP</text>
            
            {/* Estado de la estación */}
            <text x="130" y="40" textAnchor="middle" fontSize="16">
              {getEstacionEstado(1)}
            </text>
            
            {/* Indicador de "levantar la mano" */}
            {estacionesQueQuierenTransmitir.includes(1) && !estacionTransmitiendo && (
              <circle cx="150" cy="30" r="8" fill="#ffd93d" opacity="0.9">
                <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.5;0.9" dur="1s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Animación de señal en el cable */}
            {simulacionActiva && estacionTransmitiendo === 1 && pasoActual >= 1 && (
              <circle r="4" fill="#00b894">
                <animate attributeName="cx" values="160;285" dur="1s" repeatCount="indefinite" />
                <animate attributeName="cy" values="70;175" dur="1s" repeatCount="indefinite" />
              </circle>
            )}
            
            {/* PC-2 (arriba) */}
            <rect 
              x="270" 
              y="30" 
              width="60" 
              height="40" 
              fill={getEstacionColor(2)} 
              rx="5" 
            />
            <text x="300" y="55" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">PC-2</text>
            <line x1="300" y1="70" x2="300" y2="175" stroke="#666" strokeWidth="3" />
            <text x="310" y="120" textAnchor="middle" fontSize="9" fill="#666">Cat 5 UTP</text>
            
            <text x="300" y="20" textAnchor="middle" fontSize="16">
              {getEstacionEstado(2)}
            </text>
            
            {estacionesQueQuierenTransmitir.includes(2) && !estacionTransmitiendo && (
              <circle cx="320" cy="10" r="8" fill="#ffd93d" opacity="0.9">
                <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.5;0.9" dur="1s" repeatCount="indefinite" />
              </circle>
            )}

            {simulacionActiva && estacionTransmitiendo === 2 && pasoActual >= 1 && (
              <circle r="4" fill="#00b894">
                <animate attributeName="cx" values="300;300" dur="1s" repeatCount="indefinite" />
                <animate attributeName="cy" values="70;175" dur="1s" repeatCount="indefinite" />
              </circle>
            )}
            
            {/* PC-3 (arriba derecha) */}
            <rect 
              x="440" 
              y="50" 
              width="60" 
              height="40" 
              fill={getEstacionColor(3)} 
              rx="5" 
            />
            <text x="470" y="75" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">PC-3</text>
            <line x1="440" y1="70" x2="315" y2="175" stroke="#666" strokeWidth="3" />
            <text x="380" y="120" textAnchor="middle" fontSize="9" fill="#666">Cat 5 UTP</text>
            
            <text x="470" y="40" textAnchor="middle" fontSize="16">
              {getEstacionEstado(3)}
            </text>
            
            {estacionesQueQuierenTransmitir.includes(3) && !estacionTransmitiendo && (
              <circle cx="490" cy="30" r="8" fill="#ffd93d" opacity="0.9">
                <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.5;0.9" dur="1s" repeatCount="indefinite" />
              </circle>
            )}

            {simulacionActiva && estacionTransmitiendo === 3 && pasoActual >= 1 && (
              <circle r="4" fill="#00b894">
                <animate attributeName="cx" values="440;315" dur="1s" repeatCount="indefinite" />
                <animate attributeName="cy" values="70;175" dur="1s" repeatCount="indefinite" />
              </circle>
            )}
            
            {/* PC-4 (abajo izquierda) */}
            <rect 
              x="100" 
              y="310" 
              width="60" 
              height="40" 
              fill={getEstacionColor(4)} 
              rx="5" 
            />
            <text x="130" y="335" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">PC-4</text>
            <line x1="160" y1="330" x2="285" y2="225" stroke="#666" strokeWidth="3" />
            <text x="220" y="280" textAnchor="middle" fontSize="9" fill="#666">Cat 5 UTP</text>
            
            <text x="130" y="360" textAnchor="middle" fontSize="16">
              {getEstacionEstado(4)}
            </text>
            
            {estacionesQueQuierenTransmitir.includes(4) && !estacionTransmitiendo && (
              <circle cx="150" cy="370" r="8" fill="#ffd93d" opacity="0.9">
                <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.5;0.9" dur="1s" repeatCount="indefinite" />
              </circle>
            )}

            {simulacionActiva && estacionTransmitiendo === 4 && pasoActual >= 1 && (
              <circle r="4" fill="#00b894">
                <animate attributeName="cx" values="160;285" dur="1s" repeatCount="indefinite" />
                <animate attributeName="cy" values="330;225" dur="1s" repeatCount="indefinite" />
              </circle>
            )}
            
            {/* PC-5 (abajo) */}
            <rect 
              x="270" 
              y="330" 
              width="60" 
              height="40" 
              fill={getEstacionColor(5)} 
              rx="5" 
            />
            <text x="300" y="355" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">PC-5</text>
            <line x1="300" y1="330" x2="300" y2="225" stroke="#666" strokeWidth="3" />
            <text x="310" y="280" textAnchor="middle" fontSize="9" fill="#666">Cat 5 UTP</text>
            
            <text x="300" y="380" textAnchor="middle" fontSize="16">
              {getEstacionEstado(5)}
            </text>
            
            {estacionesQueQuierenTransmitir.includes(5) && !estacionTransmitiendo && (
              <circle cx="320" cy="390" r="8" fill="#ffd93d" opacity="0.9">
                <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.5;0.9" dur="1s" repeatCount="indefinite" />
              </circle>
            )}

            {simulacionActiva && estacionTransmitiendo === 5 && pasoActual >= 1 && (
              <circle r="4" fill="#00b894">
                <animate attributeName="cx" values="300;300" dur="1s" repeatCount="indefinite" />
                <animate attributeName="cy" values="330;225" dur="1s" repeatCount="indefinite" />
              </circle>
            )}
            
            {/* PC-6 (abajo derecha) */}
            <rect 
              x="440" 
              y="310" 
              width="60" 
              height="40" 
              fill={getEstacionColor(6)} 
              rx="5" 
            />
            <text x="470" y="335" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">PC-6</text>
            <line x1="440" y1="330" x2="315" y2="225" stroke="#666" strokeWidth="3" />
            <text x="380" y="280" textAnchor="middle" fontSize="9" fill="#666">Cat 5 UTP</text>
            
            <text x="470" y="360" textAnchor="middle" fontSize="16">
              {getEstacionEstado(6)}
            </text>
            
            {estacionesQueQuierenTransmitir.includes(6) && !estacionTransmitiendo && (
              <circle cx="490" cy="370" r="8" fill="#ffd93d" opacity="0.9">
                <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.5;0.9" dur="1s" repeatCount="indefinite" />
              </circle>
            )}

            {simulacionActiva && estacionTransmitiendo === 6 && pasoActual >= 1 && (
              <circle r="4" fill="#00b894">
                <animate attributeName="cx" values="440;315" dur="1s" repeatCount="indefinite" />
                <animate attributeName="cy" values="330;225" dur="1s" repeatCount="indefinite" />
              </circle>
            )}
            
            {/* Conectores RJ-45 */}
            <circle cx="285" cy="175" r="5" fill="#ffd93d" stroke="#333" strokeWidth="1" />
            <circle cx="300" cy="175" r="5" fill="#ffd93d" stroke="#333" strokeWidth="1" />
            <circle cx="315" cy="175" r="5" fill="#ffd93d" stroke="#333" strokeWidth="1" />
            <circle cx="285" cy="225" r="5" fill="#ffd93d" stroke="#333" strokeWidth="1" />
            <circle cx="300" cy="225" r="5" fill="#ffd93d" stroke="#333" strokeWidth="1" />
            <circle cx="315" cy="225" r="5" fill="#ffd93d" stroke="#333" strokeWidth="1" />
          </svg>
        </Box>
        
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          🎯 Observa cómo las estaciones "levantan la mano" (🙋‍♂️) para transmitir al hub y esperan (⏳) cuando está ocupado
        </Typography>
      </Paper>

      {/* Características técnicas */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                10BASE-T con Hub
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Chip label="100m máximo" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="10 Mbps" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Par Trenzado UTP" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="CSMA/CD Requerido" size="small" color="warning" sx={{ mr: 1, mb: 1 }} />
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Cable:</strong> UTP Categoría 3 o superior (4 pares)
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Conectores:</strong> RJ-45 (8 pines)
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Distancia máxima:</strong> 100 metros por segmento
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Puertos por hub:</strong> Típicamente 4, 8, 12, 16 o 24
              </Typography>
              <Typography variant="body2">
                <strong>Dominio de colisión:</strong> Todo el hub (compartido)
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom color="secondary">
                ¿Por qué CSMA/CD en Estrella?
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Chip label="Hub = Repetidor" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Medio Compartido" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Half-Duplex" size="small" sx={{ mr: 1, mb: 1 }} />
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>El hub NO es inteligente:</strong> Solo repite señales
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Retransmisión a todos:</strong> Envía a todos los puertos
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Colisiones posibles:</strong> Si dos PC transmiten simultáneamente
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Un dominio de colisión:</strong> Todo el hub es un solo segmento
              </Typography>
              <Typography variant="body2">
                <strong>CSMA/CD obligatorio:</strong> Para detectar y manejar colisiones
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom color="info.main">
                Algoritmo CSMA/CD en Topología Estrella
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    1. Carrier Sense
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>🙋‍♂️ Estación quiere transmitir</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>👂 Escucha su puerto del hub</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>🟢 Hub libre → Puede transmitir</Typography>
                  <Typography variant="body2">🔴 Hub ocupado → Debe esperar</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="warning.main" gutterBottom>
                    2. Hub Collision Detection
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>📡 Hub recibe múltiples señales</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>💥 Detecta colisión interna</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>🚨 Envía jam a TODOS los puertos</Typography>
                  <Typography variant="body2">⏹️ Todas las estaciones paran</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="error.main" gutterBottom>
                    3. Backoff Distribuido
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>⏰ Cada estación espera tiempo aleatorio</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>📈 Ventana de backoff exponencial</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>🔄 Reintentos independientes</Typography>
                  <Typography variant="body2">🔁 Vuelta al paso 1</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom color="info.main">
                Comparación: Hub vs Switch en Topología Estrella
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="warning.main" gutterBottom>
                    Hub Ethernet (CSMA/CD Necesario)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• Un solo dominio de colisión</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• Ancho de banda compartido (10 Mbps total)</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• Half-duplex obligatorio</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• CSMA/CD requerido</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• Retransmite a todos los puertos</Typography>
                  <Typography variant="body2">• Colisiones aumentan con más nodos</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="success.main" gutterBottom>
                    Switch Ethernet (Sin CSMA/CD)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• Dominio de colisión por puerto</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• Ancho de banda dedicado (10 Mbps por puerto)</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• Full-duplex posible</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• CSMA/CD innecesario</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• Envío inteligente (tabla MAC)</Typography>
                  <Typography variant="body2">• Sin colisiones (microsegmentación)</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom color="info.main">
                Evolución: De Hub a Switch
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Años 1990s - Hubs
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• Topología estrella física</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• Lógicamente como bus</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• CSMA/CD obligatorio</Typography>
                  <Typography variant="body2">• Colisiones frecuentes</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="warning.main" gutterBottom>
                    Transición - Bridges
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• Segmentación de dominios</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• Reducción de colisiones</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• Aprendizaje de direcciones</Typography>
                  <Typography variant="body2">• CSMA/CD aún necesario</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="success.main" gutterBottom>
                    Actualidad - Switches
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• Microsegmentación total</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• Full-duplex estándar</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• CSMA/CD obsoleto</Typography>
                  <Typography variant="body2">• Gigabit+ velocidades</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TopologiaEstrella; 