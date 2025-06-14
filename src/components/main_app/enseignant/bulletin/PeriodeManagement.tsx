import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useGetPeriode, useAddPeriode, useUpdatePeriode, useDeletePeriode } from "../../../../hooks/useBulletin";
import { useForm } from "react-hook-form";
import { useGet as useGetAnnees } from "../../../../hooks/useAnnee";
import { toast } from "react-toastify";
import type { PeriodeType } from "../../../../api/bulletinApi";
import { MenuItem, Select, FormControl, InputLabel, FormHelperText } from "@mui/material";
import type { UseFormRegister } from "react-hook-form";
import type { AnneeProfile } from "../../../../api/anneeApi";

interface SelectAnneeScolaireProps {
  register: UseFormRegister<any>;
  error: boolean;
  helperText?: string;
  defaultValue?: string | number;
}
const SelectAnneeScolaire: React.FC<SelectAnneeScolaireProps> = ({ register, error, helperText, defaultValue }) => {
  const { data: annees, isLoading } = useGetAnnees();
  return (
    <FormControl fullWidth margin="normal" error={error}>
      <InputLabel id="annee-scolaire-label">Année scolaire</InputLabel>
      <Select
        labelId="annee-scolaire-label"
        label="Année scolaire"
        defaultValue={defaultValue}
        {...register("anneeScolaire", { required: "L'année scolaire est requise" })}
      >
        {annees && annees.map((annee: AnneeProfile) => (
          <MenuItem key={annee.id} value={annee.id}>{annee.anneeScolaire}</MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

const PeriodeManagement: React.FC = () => {
  const { data: periodes } = useGetPeriode();
  const addPeriode = useAddPeriode();
  const updatePeriode = useUpdatePeriode();
  const deletePeriode = useDeletePeriode();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPeriode, setEditingPeriode] = useState<PeriodeType | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Partial<PeriodeType>>();

  const openAddDialog = () => {
    setEditingPeriode(null);
    reset({ nom: '', ordre: '', annee_id: '' });
    setDialogOpen(true);
  };

  const openEditDialog = (periode: PeriodeType) => {
    setEditingPeriode(periode);
    reset({ nom: periode.nom, ordre: periode.ordre, annee_id: periode.annee_id });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingPeriode(null);
    reset();
  };

  const onSubmit = (values: any) => {
    // anneeScolaire doit être envoyé comme id (number)
    const payload = {
      ...values,
      anneeScolaire: Number(values.anneeScolaire)
    };
    if (editingPeriode) {
      updatePeriode.mutate(
        { ...editingPeriode, ...payload },
        {
          onSuccess: () => {
            toast.success("Période modifiée avec succès");
            closeDialog();
          },
          onError: () => toast.error("Erreur lors de la modification")
        }
      );
    } else {
      addPeriode.mutate(payload, {
        onSuccess: () => {
          toast.success("Période créée avec succès");
          closeDialog();
        },
        onError: () => toast.error("Erreur lors de la création")
      });
    }
  };


  const confirmDelete = (id: number) => {
    setDeleteId(id);
    deletePeriode.mutate(id, {
      onSuccess: () => {
        toast.success("Période supprimée avec succès");
        setDeleteId(null);
      },
      onError: () => {
        toast.error("Erreur lors de la suppression");
        setDeleteId(null);
      }
    });
  };

  return (
    <Box className="ml-10 mr-10">
      <Box display="flex"  justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Gestion des Périodes</Typography>
        <Button variant="contained" color="primary" onClick={openAddDialog}>
          Nouvelle période
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Ordre</TableCell>
              <TableCell>Date début</TableCell>
              <TableCell>Date fin</TableCell>
              <TableCell>Année scolaire</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(periodes || []).map((periode) => (
              <TableRow key={periode.id}>
                <TableCell>{periode.id}</TableCell>
                <TableCell>{periode.nom}</TableCell>
                <TableCell>{periode.typePeriode}</TableCell>
                <TableCell>{periode.ordre}</TableCell>
                <TableCell>{periode.dateDebut}</TableCell>
                <TableCell>{periode.dateFin}</TableCell>
                <TableCell>{periode.anneeScolaireNom || ''}</TableCell>
                <TableCell align="right">
                  <IconButton aria-label="edit" color="primary" onClick={() => openEditDialog(periode)} size="small">
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => confirmDelete(periode.id)}
                    size="small"
                    disabled={deletePeriode.isLoading && deleteId === periode.id}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{editingPeriode ? "Modifier la période" : "Créer une période"}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              label="Nom"
              fullWidth
              margin="normal"
              {...register("nom", { required: "Le nom est requis" })}
              error={!!errors.nom}
              helperText={errors.nom?.message}
            />
            <FormControl fullWidth margin="normal" error={!!errors.typePeriode}>
              <InputLabel id="type-periode-label">Type de période</InputLabel>
              <Select
                labelId="type-periode-label"
                label="Type de période"
                defaultValue={editingPeriode?.typePeriode || ''}
                {...register("typePeriode", { required: "Le type est requis" })}
              >
                <MenuItem value="TRIM">Trimestre</MenuItem>
                <MenuItem value="SEM">Semestre</MenuItem>
                <MenuItem value="SEQ">Séquence</MenuItem>
              </Select>
              {errors.typePeriode && <FormHelperText>{errors.typePeriode.message}</FormHelperText>}
            </FormControl>
            <TextField
              label="Ordre"
              type="number"
              fullWidth
              margin="normal"
              {...register("ordre", { required: "L'ordre est requis" })}
              error={!!errors.ordre}
              helperText={errors.ordre?.message}
            />
            <TextField
              label="Date de début"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              {...register("dateDebut", { required: "La date de début est requise" })}
              error={!!errors.dateDebut}
              helperText={errors.dateDebut?.message}
            />
            <TextField
              label="Date de fin"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              {...register("dateFin", { required: "La date de fin est requise" })}
              error={!!errors.dateFin}
              helperText={errors.dateFin?.message}
            />
            {/* Sélection année scolaire */}
            <SelectAnneeScolaire
              register={register}
              error={!!errors.anneeScolaire}
              helperText={errors.anneeScolaire?.message}
              defaultValue={editingPeriode?.anneeScolaire?.id || ""}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Annuler</Button>
            <Button type="submit" variant="contained" color="primary" disabled={addPeriode.isLoading || updatePeriode.isLoading}>
              {editingPeriode ? "Enregistrer" : "Créer"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PeriodeManagement;
