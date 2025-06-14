import React, { useMemo, useState } from "react";
import { useGetRapportsDirection, useMarkRapportAsReadDirection } from "../../hooks/useRapportPedagogique";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Checkbox, CircularProgress, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { RapportPedagogique } from "../../types/rapportPedagogique.types";

const RapportPedagogiqueDirectionBoard: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Récupération des rapports (hook dédié direction)
  const { data: rapports, isLoading, isError } = useGetRapportsDirection();
  // Mutation pour marquer comme lu/non lu (hook dédié direction)
  const mutation = useMarkRapportAsReadDirection();

  // Filtrage local
  const filteredRapports = useMemo(() => {
    let filtered = (rapports || []) as RapportPedagogique[];
    if (search) {
      filtered = filtered.filter(
        (r: RapportPedagogique) =>
          r.tache?.toLowerCase().includes(search.toLowerCase()) ||
          r.auteur?.toLowerCase().includes(search.toLowerCase()) ||
          (r.commentaire ?? '').toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterDate) {
      filtered = filtered.filter((r: RapportPedagogique) => r.dateDuRapport === filterDate);
    }
    if (showUnreadOnly) {
      filtered = filtered.filter((r: RapportPedagogique) => !r.lu);
    }
    return filtered;
  }, [rapports, search, filterDate, showUnreadOnly]);

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Rapports pédagogiques
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Recherche"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ endAdornment: <SearchIcon /> }}
        />
        <TextField
          type="date"
          label="Date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant={showUnreadOnly ? "contained" : "outlined"}
          color="primary"
          startIcon={<FilterAltIcon />}
          onClick={() => setShowUnreadOnly((v) => !v)}
        >
          Non lus seulement
        </Button>
      </Box>
      {isError ? (
        <Typography color="error">Erreur lors du chargement des rapports pédagogiques.</Typography>
      ) : isLoading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Auteur</TableCell>
              <TableCell>Tâche</TableCell>
              <TableCell>Classe</TableCell>
              <TableCell>Matière</TableCell>
              <TableCell>Commentaire</TableCell>
              <TableCell>Lu</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRapports.map((rapport: RapportPedagogique) => (
              <TableRow key={rapport.id} sx={{ backgroundColor: rapport.lu ? "inherit" : "#e3f2fd" }}>
                <TableCell>{rapport.dateDuRapport}</TableCell>
                <TableCell>{rapport.auteur}</TableCell>
                <TableCell>{rapport.tache}</TableCell>
                <TableCell>{rapport.classe || "-"}</TableCell>
                <TableCell>{rapport.matiere || "-"}</TableCell>
                <TableCell>{rapport.commentaire || "-"}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={rapport.lu}
                    onChange={() => mutation.mutate({ id: rapport.id, lu: !rapport.lu })}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => mutation.mutate({ id: rapport.id, lu: !rapport.lu })}
                  >
                    Marquer comme {rapport.lu ? "non lu" : "lu"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredRapports.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Aucun rapport trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default RapportPedagogiqueDirectionBoard;
