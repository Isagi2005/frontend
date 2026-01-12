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
import { toast } from "react-toastify";
import {
  useGetRapportsGenerics,
  useAddRapport,
  useUpdateRapport,
  useDeleteRapport,
} from "../../../hooks/useRapportPedagogique";
import { RapportPedagogique } from "../../../types/rapportPedagogique.types";
import { useGetClass } from '../../../hooks/useClass';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const initialForm: Partial<RapportPedagogique> = {
  tache: "",
  heureDebut: "",
  heureFin: "",
  classe: null,
  matiere: "",
  commentaire: "",
};

const RapportPedagogiqueBoard: React.FC = () => {
  const { data: classesList, isLoading: classesLoading, isError: classesError } = useGetClass();
  const [date, setDate] = useState("");
  const [form, setForm] = useState<Partial<RapportPedagogique>>(initialForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filtre par date et recherche
  const params: Record<string, string> = {};
  if (date) params["dateDuRapport"] = date;
  if (search) params["tache"] = search;
  params["auteur"] = "me";

  const { data: rapports, refetch, isError } = useGetRapportsGenerics(params);
  const addRapport = useAddRapport();
  const updateRapport = useUpdateRapport();
  const deleteRapport = useDeleteRapport();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenDialog = (rapport?: RapportPedagogique) => {
    if (rapport) {
      setForm(rapport);
      setEditId(rapport.id!);
    } else {
      setForm(initialForm);
      setEditId(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setForm(initialForm);
    setEditId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateRapport.mutate(
        { ...form, id: editId } as RapportPedagogique,
        {
          onSuccess: () => {
            toast.success("Rapport modifié avec succès !");
            setForm(initialForm);
            setEditId(null);
            setDialogOpen(false);
            refetch();
          },
          onError: () => toast.error("Erreur lors de la modification du rapport."),
        }
      );
    } else {
      addRapport.mutate(form as RapportPedagogique, {
        onSuccess: () => {
          toast.success("Rapport créé avec succès !");
          setForm(initialForm);
          setDialogOpen(false);
          refetch();
        },
        onError: () => toast.error("Erreur lors de la création du rapport."),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Supprimer ce rapport ?")) {
      deleteRapport.mutate(id, {
        onSuccess: () => {
          toast.success("Rapport supprimé.");
          refetch();
        },
        onError: () => toast.error("Erreur lors de la suppression."),
      });
      if (editId === id) {
        setForm(initialForm);
        setEditId(null);
      }
    }
  };


  return (
    <Box className="max-w-3xl mx-auto py-8">
      <Typography variant="h4" className="mb-4 font-bold text-center">Mes Rapports Pédagogiques</Typography>
      <Box className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <TextField
          type="date"
          label="Filtrer par date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="flex-1"
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="text"
          label="Recherche par tâche"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1"
          size="small"
        />
        <Button onClick={() => { setDate(""); setSearch(""); refetch(); }} color="secondary" variant="outlined">
          Réinitialiser
        </Button>
        <Button onClick={() => handleOpenDialog()} color="primary" variant="contained">
          Nouveau rapport
        </Button>
      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editId ? "Modifier" : "Créer"} un rapport</DialogTitle>
          <DialogContent className="flex flex-col gap-3">
            <TextField
              name="tache"
              label="Tâche réalisée"
              value={form.tache || ""}
              onChange={handleChange}
              required
              fullWidth
              className="mb-2"
            />
            <Box className="flex gap-4">
              <TextField
                name="heureDebut"
                label="Heure début"
                type="time"
                value={form.heureDebut || ""}
                onChange={handleChange}
                required
                className="flex-1"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="heureFin"
                label="Heure fin"
                type="time"
                value={form.heureFin || ""}
                onChange={handleChange}
                required
                className="flex-1"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            {/* Sélecteur déroulant pour la classe */}
            <Select
              name="classe"
              value={form.classe || ''}
              onChange={e => setForm({ ...form, classe: e.target.value })}
              required
              fullWidth
              displayEmpty
              sx={{ mb: 2 }}
            >
              <MenuItem value="" disabled>
                Sélectionnez une classe
              </MenuItem>
              {classesLoading && (
                <MenuItem value="" disabled>Chargement...</MenuItem>
              )}
              {classesError && (
                <MenuItem value="" disabled>Erreur de chargement</MenuItem>
              )}
              {classesList && classesList.map((classe) => (
                <MenuItem key={classe.id} value={classe.id}>{classe.nom}</MenuItem>
              ))}
            </Select>
            <TextField
              name="matiere"
              label="Matière (optionnel)"
              value={form.matiere || ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="commentaire"
              label="Commentaire (optionnel)"
              value={form.commentaire || ""}
              onChange={handleChange}
              multiline
              minRows={2}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">Annuler</Button>
            <Button type="submit" color="primary" variant="contained" disabled={addRapport.isPending || updateRapport.isPending}>
              {editId ? "Enregistrer" : "Créer"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Typography variant="h6" className="mt-8 mb-2 font-semibold">Liste de mes rapports</Typography>
      {isError ? (
        <Typography color="error">Erreur lors du chargement des rapports pédagogiques.</Typography>
      ) : rapports === undefined ? (
        <Typography>Chargement...</Typography>
      ) : (
        <TableContainer component={Paper} className="shadow">
          <Table>
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell>Date</TableCell>
                <TableCell>Tâche</TableCell>
                <TableCell>Début</TableCell>
                <TableCell>Fin</TableCell>
                <TableCell>Classe</TableCell>
                <TableCell>Matière</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rapports && rapports.length ? (
                rapports.map((rapport) => (
                  <TableRow key={rapport.id}>
                    <TableCell>{rapport.dateDuRapport}</TableCell>
                    <TableCell>{rapport.tache}</TableCell>
                    <TableCell>{rapport.heureDebut}</TableCell>
                    <TableCell>{rapport.heureFin}</TableCell>
                    <TableCell>{rapport.classe}</TableCell>
                    <TableCell>{rapport.matiere}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenDialog(rapport)} size="small">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(rapport.id!)} size="small">
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>Aucun rapport trouvé</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default RapportPedagogiqueBoard;
