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

const TopologiaBus = () => {
  const [simulacionActiva, setSimulacionActiva] = useState(false);
  const [pasoActual, setPasoActual] = useState(0);
  const [colisionDetectada, setColisionDetectada] = useState(false);
  const [transmisionExitosa, setTransmisionExitosa] = useState(false);
  const [estacionTransmitiendo, setEstacionTransmitiendo] = useState(null);
  const [progreso, setProgreso] = useState(0);
  const [estacionesQueQuierenTransmitir, setEstacionesQueQuierenTransmitir] = useState([]);
  const [medioOcupado, setMedioOcupado] = useState(false);
  const [estacionesEsperando, setEstacionesEsperando] = useState([]);

  const pasos = [
    {
      titulo: "1. Carrier Sense (Escuchar el Bus)",
      descripcion: "Las estaciones que quieren transmitir 'levantan la mano' y escuchan el cable coaxial",
      detalle: "🙋‍♂️ Las estaciones verifican si el medio está libre antes de transmitir"
    },
    {
      titulo: "2. Multiple Access (Decisión de Transmitir)",
      descripcion: "Si el bus está libre, la estación puede transmitir. Si está ocupado, debe esperar",
      detalle: "✅ Medio libre = Puede transmitir | ❌ Medio ocupado = Debe esperar"
    },
    {
      titulo: "3. Transmisión en el Bus",
      descripcion: "Los datos viajan por todo el cable coaxial en ambas direcciones",
      detalle: "📡 La señal se propaga desde el transceptor AUI hacia ambos extremos del bus"
    },
    {
      titulo: "4. Collision Detection",
      descripcion: "Si dos estaciones transmiten simultáneamente, se detecta una colisión",
      detalle: "💥 Los transceptores AUI detectan voltajes anómalos que indican colisión"
    },
    {
      titulo: "5. Jam Signal y Backoff",
      descripcion: "Se envía señal de interferencia y las estaciones esperan tiempo aleatorio",
      detalle: "⏰ Backoff exponencial: cada intento duplica el tiempo de espera máximo"
    }
  ];

  const iniciarSimulacion = () => {
    setSimulacionActiva(true);
    setPasoActual(0);
    setColisionDetectada(false);
    setTransmisionExitosa(false);
    setProgreso(0);
    setMedioOcupado(false);
    
    // Simular que varias estaciones quieren transmitir
    const estacionesInteresadas = [];
    for (let i = 1; i <= 5; i++) {
      if (Math.random() > 0.6) {
        estacionesInteresadas.push(i);
      }
    }
    // Asegurar que al menos 2 estaciones quieran transmitir
    if (estacionesInteresadas.length < 2) {
      estacionesInteresadas.push(1, 3);
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
          setMedioOcupado(false);
          break;
        case 2: // Multiple Access
          setMedioOcupado(true);
          break;
        case 3: // Transmisión
          // Simular colisión si hay múltiples estaciones esperando
          if (estacionesEsperando.length > 0 && Math.random() > 0.5) {
            setColisionDetectada(true);
            setEstacionTransmitiendo(null);
          }
          break;
        case 4: // Collision Detection
          if (colisionDetectada) {
            setMedioOcupado(false);
          }
          break;
        case 5: // Jam Signal y Backoff
          if (!colisionDetectada) {
            setTransmisionExitosa(true);
          }
          setMedioOcupado(false);
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
      if (medioOcupado) return "#fdcb6e"; // Amarillo - quiere transmitir pero debe esperar
      return "#fd79a8"; // Rosa - quiere transmitir y puede
    }
    return "#74b9ff"; // Azul - no quiere transmitir
  };

  const getEstacionEstado = (estacionId) => {
    if (!simulacionActiva) return "";
    if (estacionTransmitiendo === estacionId) return "📡";
    if (estacionesQueQuierenTransmitir.includes(estacionId)) {
      if (medioOcupado) return "⏳";
      return "🙋‍♂️";
    }
    return "😴";
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Topología Ethernet en Bus (10BASE5 y 10BASE2)
      </Typography>
      
      {/* Simulación Interactiva */}
      <Paper sx={{ p: 4, mb: 4, bgcolor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Simulación CSMA/CD en Bus
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
              Observa cómo las estaciones "levantan la mano" para transmitir en el bus coaxial
            </Typography>
          </Box>
        ) : (
          <Box>
            <LinearProgress 
              variant="determinate" 
              value={progreso} 
              sx={{ mb: 3, height: 8, borderRadius: 4 }}
            />
            
            {/* Estado del medio */}
            <Alert 
              severity={medioOcupado ? "warning" : "success"} 
              sx={{ mb: 2 }}
            >
              <strong>Estado del Bus:</strong> {medioOcupado ? "🔴 OCUPADO - Las estaciones deben esperar" : "🟢 LIBRE - Las estaciones pueden transmitir"}
            </Alert>
            
            {colisionDetectada && (
              <Alert severity="error" sx={{ mb: 2 }}>
                💥 ¡Colisión detectada en el bus coaxial! Aplicando backoff exponencial...
              </Alert>
            )}
            
            {transmisionExitosa && (
              <Alert severity="success" sx={{ mb: 2 }}>
                ✅ ¡Transmisión exitosa! Los datos llegaron a todas las estaciones del bus.
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
        
        {/* SVG de la topología en bus con animación mejorada */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <svg width="800" height="300" viewBox="0 0 800 300">
            {/* Cable coaxial principal (backbone) */}
            <line 
              x1="50" 
              y1="150" 
              x2="750" 
              y2="150" 
              stroke={medioOcupado ? "#e17055" : "#333"} 
              strokeWidth="8" 
            />
            <text x="400" y="140" textAnchor="middle" fontSize="12" fill="#666">
              Cable Coaxial (Backbone) - {medioOcupado ? "OCUPADO" : "LIBRE"}
            </text>
            
            {/* Animación de señal si está transmitiendo */}
            {simulacionActiva && pasoActual >= 2 && !colisionDetectada && (
              <circle r="10" fill="#00b894" opacity="0.7">
                <animate attributeName="cx" values="50;750;50" dur="2s" repeatCount="indefinite" />
                <animate attributeName="cy" values="150;150;150" dur="2s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Animación de colisión */}
            {colisionDetectada && (
              <>
                <circle r="15" fill="#e17055" opacity="0.8">
                  <animate attributeName="cx" values="200;600" dur="0.5s" repeatCount="indefinite" />
                  <animate attributeName="cy" values="150;150" dur="0.5s" repeatCount="indefinite" />
                </circle>
                <circle r="15" fill="#e17055" opacity="0.8">
                  <animate attributeName="cx" values="600;200" dur="0.5s" repeatCount="indefinite" />
                  <animate attributeName="cy" values="150;150" dur="0.5s" repeatCount="indefinite" />
                </circle>
              </>
            )}
            
            {/* Terminadores */}
            <rect x="30" y="140" width="20" height="20" fill="#ff6b6b" />
            <text x="40" y="130" textAnchor="middle" fontSize="10" fill="#ff6b6b">50Ω</text>
            <rect x="750" y="140" width="20" height="20" fill="#ff6b6b" />
            <text x="760" y="130" textAnchor="middle" fontSize="10" fill="#ff6b6b">50Ω</text>
            
            {/* Estaciones con transceptores AUI */}
            {[120, 250, 380, 510, 640].map((x, i) => (
              <g key={i}>
                {/* Transceptor AUI */}
                <rect 
                  x={x-10} 
                  y="140" 
                  width="20" 
                  height="20" 
                  fill="#4ecdc4"
                />
                <text x={x} y="175" textAnchor="middle" fontSize="10" fill="#4ecdc4">AUI</text>
                
                {/* Cable drop */}
                <line x1={x} y1="160" x2={x} y2="220" stroke="#666" strokeWidth="3" />
                
                {/* Estación con color dinámico */}
                <rect 
                  x={x-25} 
                  y="220" 
                  width="50" 
                  height="30" 
                  fill={getEstacionColor(i + 1)}
                  rx="5" 
                />
                <text x={x} y="240" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">PC-{i+1}</text>
                
                {/* Estado de la estación */}
                <text x={x} y="210" textAnchor="middle" fontSize="16">
                  {getEstacionEstado(i + 1)}
                </text>
                
                {/* Indicador de "levantar la mano" */}
                {estacionesQueQuierenTransmitir.includes(i + 1) && !estacionTransmitiendo && (
                  <circle cx={x + 20} cy="200" r="8" fill="#ffd93d" opacity="0.9">
                    <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0.5;0.9" dur="1s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            ))}
            
            {/* Indicadores de distancia */}
            <text x="185" y="120" textAnchor="middle" fontSize="10" fill="#999">2.5m mín</text>
            <text x="315" y="120" textAnchor="middle" fontSize="10" fill="#999">2.5m mín</text>
            <text x="445" y="120" textAnchor="middle" fontSize="10" fill="#999">2.5m mín</text>
            <text x="575" y="120" textAnchor="middle" fontSize="10" fill="#999">2.5m mín</text>
          </svg>
        </Box>
        
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          🎯 Observa cómo las estaciones "levantan la mano" (🙋‍♂️) cuando quieren transmitir y esperan (⏳) cuando el medio está ocupado
        </Typography>
      </Paper>

      {/* Características técnicas */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                10BASE5 (Thick Ethernet)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Chip label="500m máximo" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="10 Mbps" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="RG-8 Coaxial" size="small" sx={{ mr: 1, mb: 1 }} />
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Cable:</strong> RG-8 (grosor de 10mm)
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Conectores:</strong> Transceptores AUI (Attachment Unit Interface)
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Distancia mínima:</strong> 2.5 metros entre transceptores
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Estaciones máximas:</strong> 100 por segmento
              </Typography>
              <Typography variant="body2">
                <strong>Impedancia:</strong> 50 ohmios con terminadores
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom color="secondary">
                10BASE2 (Thin Ethernet)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Chip label="185m máximo" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="10 Mbps" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="RG-58 Coaxial" size="small" sx={{ mr: 1, mb: 1 }} />
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Cable:</strong> RG-58 (grosor de 5mm)
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Conectores:</strong> BNC (Bayonet Neill-Concelman)
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Distancia mínima:</strong> 0.5 metros entre estaciones
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Estaciones máximas:</strong> 30 por segmento
              </Typography>
              <Typography variant="body2">
                <strong>Impedancia:</strong> 50 ohmios con terminadores
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom color="info.main">
                Algoritmo CSMA/CD Paso a Paso
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    1. Carrier Sense
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>🙋‍♂️ Estación quiere transmitir</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>👂 Escucha el medio</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>🟢 Medio libre → Puede transmitir</Typography>
                  <Typography variant="body2">🔴 Medio ocupado → Debe esperar</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="warning.main" gutterBottom>
                    2. Collision Detection
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>📡 Transmite mientras escucha</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>💥 Detecta voltajes anómalos</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>🚨 Envía señal de jam (32 bits)</Typography>
                  <Typography variant="body2">⏹️ Detiene transmisión</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="error.main" gutterBottom>
                    3. Backoff Exponencial
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>⏰ Espera tiempo aleatorio</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>📈 Duplica ventana cada intento</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>🔄 Máximo 16 intentos</Typography>
                  <Typography variant="body2">🔁 Reinicia el proceso</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TopologiaBus; 