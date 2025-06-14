import React from 'react';
import { Card, CardContent, Typography, Box, Stack, Chip, Divider } from '@mui/material';
import { useAlertesDifficulte } from '../../../../hooks/useStatistiques';

export const AlertesDifficulte: React.FC = () => {
  const { data, isLoading, isError } = useAlertesDifficulte();

  if (isLoading) return <Typography>Chargement des alertes...</Typography>;
  if (isError) return <Typography color="error">Erreur lors du chargement des alertes</Typography>;
  if (!data || !data.alertes?.length) return <Typography>Aucune alerte détectée 🎉</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            Élèves en difficulté
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {data.alertes.map((alerte: any, idx: number) => (
              <Box key={idx} display="flex" alignItems="center" justifyContent="space-between" p={1} bgcolor="#f8f9fa" borderRadius={2}>
                <Typography variant="body1">{alerte.eleve}</Typography>
                <Chip
                  label={
                    alerte.raison === 'moyenne_basse'
                      ? 'Moyenne basse'
                      : 'Absences répétées'
                  }
                  color={alerte.raison === 'moyenne_basse' ? 'warning' : 'error'}
                  variant="outlined"
                />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
