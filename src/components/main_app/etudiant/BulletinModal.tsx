import React, { useState } from 'react';
import { BulletinView } from '../enseignant/bulletin';
import { Dialog, DialogTitle, DialogContent, IconButton, MenuItem, Select, FormControl, InputLabel, CircularProgress, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useGetPeriode, useGenericsBulletin } from '../../../hooks/useBulletin';

interface BulletinModalProps {
  eleveId: number | null;
  open: boolean;
  onClose: () => void;
}

const BulletinModal: React.FC<BulletinModalProps> = ({ eleveId, open, onClose }) => {
  const { data: periodes, isLoading: periodesLoading }: { data?: import('../../../api/bulletinApi').PeriodeType[]; isLoading: boolean } = useGetPeriode();
  const [periodeId, setPeriodeId] = useState<number | ''>('');
  // Récupérer le bulletin de l'élève pour la période sélectionnée
  const {
    data: bulletins,
    isLoading: bulletinsLoading
  }: { data?: import('../../../api/bulletinApi').BulletinType[]; isLoading: boolean } = useGenericsBulletin('eleve', eleveId && periodeId ? `${eleveId}&periode=${periodeId}` : '');

  // Il est possible que l'API retourne un tableau, on prend le premier bulletin si trouvé
  const bulletin = bulletins && bulletins.length > 0 ? bulletins[0] : undefined;
  

  if (!eleveId) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Bulletin et évaluations
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="periode-select-label">Période</InputLabel>
          <Select
            labelId="periode-select-label"
            value={periodeId}
            label="Période"
            onChange={e => setPeriodeId(Number(e.target.value))}
            disabled={periodesLoading}
          >
            {periodes?.map((periode) => (
              <MenuItem key={periode.id} value={periode.id}>{periode.nom}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {(periodesLoading || bulletinsLoading) && <CircularProgress />}
        {bulletin ? (
          <BulletinView bulletinId={bulletin.id} />
        ) : !bulletin && !bulletinsLoading ? (
          
          <Typography color="text.secondary">Aucun bulletin trouvé pour cette période.</Typography>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default BulletinModal;
