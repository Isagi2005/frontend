import React from 'react';
import { EnseignantDashboard, AlertesDifficulte } from '../components/main_app/enseignant/stat';
import { Box, Typography, Divider } from '@mui/material';

const StatistiquesClassePage: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Statistiques de la classe & Alertes
      </Typography>
      <Divider sx={{ mb: 4 }} />
      <EnseignantDashboard />
      <Box mt={6}>
        <AlertesDifficulte />
      </Box>
    </Box>
  );
};

export default StatistiquesClassePage;
