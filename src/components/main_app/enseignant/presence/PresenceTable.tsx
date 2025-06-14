"use client"
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import type { StudentProfile } from "../../../../api/studentApi"
import type { coursProfile } from "../../../../api/presenceApi"
import PresenceRow from "./PresenceRow"
import PresenceCard from "./PresenceCard"

interface Props {
  students: StudentProfile[]
  cours: coursProfile
}

const PresenceTable = ({ students, cours }: Props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  if (students.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">Aucun étudiant à afficher</Typography>
      </Box>
    )
  }

  return (
    <>
      {isMobile ? (
        // Vue mobile - cartes
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {students.map((etudiant) => (
            <PresenceCard key={etudiant.id} etudiant={etudiant} cours={cours} />
          ))}
        </Box>
      ) : (
        // Vue desktop - tableau
        <TableContainer component={Paper} sx={{ boxShadow: 1, borderRadius: 2, overflow: "hidden" }}>
          <Table>
            <TableHead sx={{ bgcolor: "primary.light" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Étudiant</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Heure d'arrivée</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Justification</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Cours</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((etudiant) => (
                <PresenceRow key={etudiant.id} etudiant={etudiant} cours={cours} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  )
}

export default PresenceTable
