import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Collapse,
  Chip,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Tooltip,
  Alert
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const mensajesBitsy = {
  directa: '¡Este protocolo trabaja directamente con CSMA/CD! Son inseparables en la red Ethernet.',
  dependiente: 'Este protocolo depende de CSMA/CD para funcionar correctamente en redes Ethernet.',
  indirecta: 'Este protocolo solo utiliza CSMA/CD de forma indirecta, a través de otras capas.'
};

const BitsyMensaje = ({ tipo, nombre }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, mb: 2 }}>
    <span style={{ fontSize: '2.5rem', marginRight: 12 }}>🐱</span>
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2, bgcolor: '#e3f2fd', minWidth: 220 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Bitsy dice:
      </Typography>
      <Typography variant="body2">
        {mensajesBitsy[tipo] || '¡Selecciona un protocolo para ver cómo se relaciona con CSMA/CD!'}
      </Typography>
      {nombre && (
        <Typography variant="caption" sx={{ color: '#888' }}>
          (Protocolo: {nombre})
        </Typography>
      )}
    </Paper>
  </Box>
);

const ProtocolosInfo = () => {
  const [expandedLayer, setExpandedLayer] = useState(null);
  const [protocoloSeleccionado, setProtocoloSeleccionado] = useState(null);
  const [mostrarInfoCSMACD, setMostrarInfoCSMACD] = useState(false);

  const protocolos = {
    'Capa Física (1)': {
      color: '#795548',
      protocolos: [
        {
          nombre: 'Frame Relay',
          descripcion: 'Protocolo de conmutación de paquetes para redes WAN. Opera a nivel físico para la transmisión de tramas.',
          interferencia: 'Opera en la capa física junto con CSMA/CD, pero en diferentes tipos de redes (WAN vs LAN).',
          relacionCSMACD: {
            tipo: 'indirecta',
            nivel: 20,
            explicacion: 'No interactúa directamente con CSMA/CD ya que opera en redes WAN, mientras que CSMA/CD es para LAN.'
          }
        }
      ]
    },
    'Capa de Enlace (2)': {
      color: '#E91E63',
      protocolos: [
        {
          nombre: 'STP',
          descripcion: 'Spanning Tree Protocol (Protocolo del árbol esparcido). Previene bucles en redes con múltiples enlaces.',
          interferencia: 'Trabaja en conjunto con CSMA/CD en la capa de enlace, ayudando a mantener una topología libre de bucles.',
          relacionCSMACD: {
            tipo: 'directa',
            nivel: 90,
            explicacion: 'Trabaja directamente con CSMA/CD para mantener la integridad de la red Ethernet.'
          }
        }
      ]
    },
    'Capa de Red (3)': {
      color: '#FFC107',
      protocolos: [
        {
          nombre: 'IPX',
          descripcion: 'Internetwork Packet Exchange (Red interna del intercambio del paquete). Protocolo de red utilizado por Novell NetWare.',
          interferencia: 'Utiliza los servicios de CSMA/CD en la capa inferior para la transmisión de paquetes.',
          relacionCSMACD: {
            tipo: 'dependiente',
            nivel: 60,
            explicacion: 'Depende de CSMA/CD para la transmisión de paquetes en redes Ethernet.'
          }
        }
      ]
    },
    'Capa de Transporte (4)': {
      color: '#4CAF50',
      protocolos: [
        {
          nombre: 'iSCSI',
          descripcion: 'Internet Small Computer System Interface. Protocolo para sistemas de almacenamiento en red que opera sobre TCP/IP.',
          interferencia: 'Utiliza indirectamente CSMA/CD a través de las capas inferiores cuando opera sobre Ethernet.',
          relacionCSMACD: {
            tipo: 'indirecta',
            nivel: 40,
            explicacion: 'Utiliza CSMA/CD a través de las capas inferiores cuando opera sobre Ethernet.'
          }
        }
      ]
    },
    'Capa de Sesión (5)': {
      color: '#2196F3',
      protocolos: [
        {
          nombre: 'NetBEUI',
          descripcion: 'NetBIOS Enhanced User Interface. Protocolo simple para redes pequeñas que proporciona servicios de sesión.',
          interferencia: 'Depende de CSMA/CD en las capas inferiores para la transmisión confiable de datos.',
          relacionCSMACD: {
            tipo: 'dependiente',
            nivel: 50,
            explicacion: 'Depende de CSMA/CD para la transmisión de datos en redes Ethernet.'
          }
        }
      ]
    },
    'Capa de Presentación (6)': {
      color: '#9C27B0',
      protocolos: [
        {
          nombre: 'ICA',
          descripcion: 'Independent Computing Architecture. Protocolo propietario de Citrix para la virtualización de aplicaciones.',
          interferencia: 'Utiliza los servicios de las capas inferiores, incluyendo CSMA/CD, para la transmisión de datos.',
          relacionCSMACD: {
            tipo: 'indirecta',
            nivel: 30,
            explicacion: 'Utiliza CSMA/CD a través de las capas inferiores para la transmisión de datos.'
          }
        }
      ]
    },
    'Capa de Aplicación (7)': {
      color: '#FF9800',
      protocolos: [
        {
          nombre: 'SMTP',
          descripcion: 'Simple Mail Transfer Protocol (Protocolo de transferencia simple de correo). Gestiona el envío de correos electrónicos.',
          interferencia: 'Depende de todas las capas inferiores, incluyendo CSMA/CD, para la entrega confiable de correos.',
          relacionCSMACD: {
            tipo: 'indirecta',
            nivel: 20,
            explicacion: 'Utiliza CSMA/CD a través de todas las capas inferiores para la transmisión de correos.'
          }
        }
      ]
    }
  };

  const handleLayerClick = (layer) => {
    setExpandedLayer(expandedLayer === layer ? null : layer);
  };

  const handleProtocoloClick = (protocolo) => {
    setProtocoloSeleccionado(protocolo);
  };

  const getColorByTipo = (tipo) => {
    switch(tipo) {
      case 'directa': return 'success';
      case 'dependiente': return 'warning';
      case 'indirecta': return 'info';
      default: return 'default';
    }
  };

  const renderRelacionCSMACD = () => {
    if (!protocoloSeleccionado) return (
      <BitsyMensaje tipo={null} nombre={null} />
    );

    const { relacionCSMACD, nombre } = protocoloSeleccionado;
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <BitsyMensaje tipo={relacionCSMACD.tipo} nombre={nombre} />
        <Card sx={{ mt: 2, mb: 2, backgroundColor: '#f8f9fa', minWidth: 320, maxWidth: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom align="center">
              Relación con CSMA/CD
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Nivel de Interacción
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={relacionCSMACD.nivel} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getColorByTipo(relacionCSMACD.tipo)
                  }
                }} 
              />
              <Typography variant="body2" sx={{ mt: 1, textAlign: 'right' }}>
                {relacionCSMACD.nivel}%
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Tipo de Relación
              </Typography>
              <Chip 
                label={relacionCSMACD.tipo.toUpperCase()} 
                color={getColorByTipo(relacionCSMACD.tipo)}
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            <Typography variant="subtitle1" gutterBottom>
              Explicación
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {relacionCSMACD.explicacion}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  };

  return (
    <Box sx={{ m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Protocolos y su Relación con CSMA/CD
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '50px' }} />
                  <TableCell>Capa OSI</TableCell>
                  <TableCell>Protocolos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(protocolos).map(([layer, data]) => (
                  <React.Fragment key={layer}>
                    <TableRow 
                      sx={{ 
                        '& > *': { borderBottom: 'unset' },
                        backgroundColor: `${data.color}15`
                      }}
                    >
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleLayerClick(layer)}
                          disabled={data.protocolos.length === 0}
                        >
                          {data.protocolos.length > 0 && (
                            <span style={{ fontSize: '1.5rem' }}>
                              {expandedLayer === layer ? '▼' : '▶'}
                            </span>
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Typography 
                          sx={{ 
                            color: data.color,
                            fontWeight: 'bold'
                          }}
                        >
                          {layer}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {data.protocolos.map(p => p.nombre).join(', ') || '-'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell 
                        style={{ paddingBottom: 0, paddingTop: 0 }} 
                        colSpan={3}
                      >
                        <Collapse 
                          in={expandedLayer === layer} 
                          timeout="auto" 
                          unmountOnExit
                        >
                          <Box sx={{ margin: 1 }}>
                            {data.protocolos.map((protocolo) => (
                              <Paper 
                                key={protocolo.nombre}
                                sx={{ 
                                  p: 2, 
                                  mb: 1,
                                  backgroundColor: `${data.color}08`,
                                  cursor: 'pointer',
                                  '&:hover': {
                                    backgroundColor: `${data.color}15`
                                  }
                                }}
                                onClick={() => handleProtocoloClick(protocolo)}
                              >
                                <Typography variant="subtitle1" gutterBottom>
                                  {protocolo.nombre}
                                </Typography>
                                <Typography variant="body2" paragraph>
                                  {protocolo.descripcion}
                                </Typography>
                                <Typography 
                                  variant="body2"
                                  sx={{ 
                                    fontStyle: 'italic',
                                    color: 'text.secondary'
                                  }}
                                >
                                  Interferencia con CSMA/CD: {protocolo.interferencia}
                                </Typography>
                              </Paper>
                            ))}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {renderRelacionCSMACD()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProtocolosInfo; 