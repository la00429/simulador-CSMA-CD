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
  Tooltip
} from '@mui/material';

const ProtocolosInfo = () => {
  const [expandedLayer, setExpandedLayer] = useState(null);

  const protocolos = {
    'Capa Física (1)': {
      color: '#795548',
      protocolos: [
        {
          nombre: 'Frame Relay',
          descripcion: 'Protocolo de conmutación de paquetes para redes WAN. Opera a nivel físico para la transmisión de tramas.',
          interferencia: 'Opera en la capa física junto con CSMA/CD, pero en diferentes tipos de redes (WAN vs LAN).'
        }
      ]
    },
    'Capa de Enlace (2)': {
      color: '#E91E63',
      protocolos: [
        {
          nombre: 'STP',
          descripcion: 'Spanning Tree Protocol (Protocolo del árbol esparcido). Previene bucles en redes con múltiples enlaces.',
          interferencia: 'Trabaja en conjunto con CSMA/CD en la capa de enlace, ayudando a mantener una topología libre de bucles.'
        },
        {
          nombre: 'CSMA/CD',
          descripcion: 'Carrier Sense Multiple Access with Collision Detection. Protocolo de acceso al medio en redes Ethernet.',
          interferencia: 'Es el protocolo principal en esta capa para la detección y manejo de colisiones.'
        }
      ]
    },
    'Capa de Red (3)': {
      color: '#FFC107',
      protocolos: [
        {
          nombre: 'IPX',
          descripcion: 'Internetwork Packet Exchange (Red interna del intercambio del paquete). Protocolo de red utilizado por Novell NetWare.',
          interferencia: 'Utiliza los servicios de CSMA/CD en la capa inferior para la transmisión de paquetes.'
        }
      ]
    },
    'Capa de Transporte (4)': {
      color: '#4CAF50',
      protocolos: [
        {
          nombre: 'iSCSI',
          descripcion: 'Internet Small Computer System Interface. Protocolo para sistemas de almacenamiento en red que opera sobre TCP/IP.',
          interferencia: 'Utiliza indirectamente CSMA/CD a través de las capas inferiores cuando opera sobre Ethernet.'
        }
      ]
    },
    'Capa de Sesión (5)': {
      color: '#2196F3',
      protocolos: [
        {
          nombre: 'NetBEUI',
          descripcion: 'NetBIOS Enhanced User Interface. Protocolo simple para redes pequeñas que proporciona servicios de sesión.',
          interferencia: 'Depende de CSMA/CD en las capas inferiores para la transmisión confiable de datos.'
        }
      ]
    },
    'Capa de Presentación (6)': {
      color: '#9C27B0',
      protocolos: [
        {
          nombre: 'ICA',
          descripcion: 'Independent Computing Architecture. Protocolo propietario de Citrix para la virtualización de aplicaciones.',
          interferencia: 'Utiliza los servicios de las capas inferiores, incluyendo CSMA/CD, para la transmisión de datos.'
        }
      ]
    },
    'Capa de Aplicación (7)': {
      color: '#FF9800',
      protocolos: [
        {
          nombre: 'SMTP',
          descripcion: 'Simple Mail Transfer Protocol (Protocolo de transferencia simple de correo). Gestiona el envío de correos electrónicos.',
          interferencia: 'Depende de todas las capas inferiores, incluyendo CSMA/CD, para la entrega confiable de correos.'
        }
      ]
    }
  };

  const handleLayerClick = (layer) => {
    setExpandedLayer(expandedLayer === layer ? null : layer);
  };

  return (
    <Box sx={{ m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Protocolos y su Relación con CSMA/CD
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '50px' }} />
              <TableCell>Capa OSI</TableCell>
              <TableCell>Protocolos</TableCell>
              <TableCell>Detalles</TableCell>
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
                  <TableCell>
                    {data.protocolos.length > 0 ? (
                      <Tooltip title="Click para ver detalles">
                        <span style={{ 
                          cursor: 'pointer',
                          color: data.color,
                          fontSize: '1.2rem'
                        }}>
                          ℹ️
                        </span>
                      </Tooltip>
                    ) : '-'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell 
                    style={{ paddingBottom: 0, paddingTop: 0 }} 
                    colSpan={4}
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
                              backgroundColor: `${data.color}08`
                            }}
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
    </Box>
  );
};

export default ProtocolosInfo; 