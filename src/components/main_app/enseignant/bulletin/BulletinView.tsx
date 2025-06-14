import React from 'react';
import { Box, Typography, Divider, Stack, Paper } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { useRetrieveBulletin } from '../../../../hooks/useBulletin';

interface BulletinViewProps {
  bulletinId: number;
  onClose?: () => void;
}

const BulletinView: React.FC<BulletinViewProps> = ({ bulletinId, onClose }) => {
  const { data: bulletin, isLoading, isError } = useRetrieveBulletin(String(bulletinId));

  if (isLoading) return <Typography>Chargement du bulletin...</Typography>;
  if (isError || !bulletin) return <Typography color="error">Erreur lors du chargement du bulletin</Typography>;

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      {/* En-tête du bulletin */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, position: 'relative' }}>
        {onClose && (
          <IconButton
            aria-label="fermer"
            onClick={onClose}
            sx={{ position: 'absolute', top: 8, right: 8 }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        )}
        <Typography variant="h5" gutterBottom>
          Bulletin de l'élève : <b>{bulletin.eleve_nom || bulletin.eleve}</b>
        </Typography>
        <Typography variant="subtitle1">
          Classe : <b>{bulletin.classe_nom}</b> | Période : <b>{bulletin.periode_nom}</b>
        </Typography>
      </Paper>

      {/* Tableau des évaluations */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Évaluations</Typography>
        <Divider sx={{ mb: 2 }} />
        <table className="min-w-full border mt-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">N°</th>
              <th className="border px-2 py-1">Domaine</th>
              <th className="border px-2 py-1">Note /20</th>
              <th className="border px-2 py-1">Appréciation</th>
              <th className="border px-2 py-1">Observations</th>
            </tr>
          </thead>
          <tbody>
            {bulletin.evaluations && bulletin.evaluations.length > 0 ? (
              bulletin.evaluations.map((ev, idx) => (
                <tr key={ev.domaine?.id || idx}>
                  <td className="border px-2 py-1">{idx + 1}</td>
                  <td className="border px-2 py-1">{ev.domaine?.nom}</td>
                  <td className="border px-2 py-1">{ev.valeurNote}</td>
                  <td className="border px-2 py-1">{ev.appreciation}</td>
                  <td className="border px-2 py-1">{ev.observations}</td>
                </tr>
              ))
            ) : (
              <tr><td className="border px-2 py-1" colSpan={5}>Aucune évaluation disponible</td></tr>
            )}
          </tbody>
        </table>
      </Paper>

      {/* Informations générales en bas de page */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={1}>
          <Typography><b>Moyenne générale:</b> {bulletin.moyenneGenerale}</Typography>
          <Typography><b>Appréciation générale:</b> {bulletin.appreciationGenerale}</Typography>
          <Typography><b>Points forts:</b> {bulletin.pointsForts}</Typography>
          <Typography><b>Besoins:</b> {bulletin.besoins}</Typography>
          <Typography><b>Projet:</b> {bulletin.projet}</Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default BulletinView;
