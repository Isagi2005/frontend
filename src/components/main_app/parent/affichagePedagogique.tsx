import { useState, useEffect } from "react"
import {
  Select, MenuItem, FormControl, InputLabel, Card, CardContent,
  Typography, Divider, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Skeleton
} from "@mui/material"
import { 
  School as SchoolIcon, 
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon
} from "@mui/icons-material"
import { useGetParentPedagogique } from "../../../hooks/useDashboard"

export default function ResultatsPedagogiques() {
  const { data: enfants, isLoading, error } = useGetParentPedagogique()
  const [enfantSelectionne, setEnfantSelectionne] = useState<number | null>(null)
  const [trimestreSelectionne, setTrimestreSelectionne] = useState<number | null>(null)

  useEffect(() => {
    if (enfants && enfants.length > 0) {
      setEnfantSelectionne((prev) => prev ?? enfants[0].id)
      setTrimestreSelectionne((prev) => {
        const enfant = enfants[0]
        if (enfant && enfant.trimestres.length > 0) {
          return prev ?? enfant.trimestres[0].id
        }
        return null
      })
    }
  }, [enfants])

  if (isLoading) {
    return (
      <Box className="p-6 max-w-4xl mx-auto">
        <Typography variant="h5" className="mb-6 text-gray-800">Résultats Pédagogiques</Typography>
        <Box display="flex" flexWrap="wrap" gap={3}>
          <Box flex="1 0 250px" maxWidth="sm">
            <Skeleton variant="rectangular" height={60} className="mb-4" />
          </Box>
          <Box flex="1 0 250px" maxWidth="sm">
            <Skeleton variant="rectangular" height={60} className="mb-4" />
          </Box>
          <Box flex="1 0 250px" maxWidth="sm">
            <Skeleton variant="rectangular" height={200} />
          </Box>
          <Box flex="1 0 250px" maxWidth="sm">
            <Skeleton variant="rectangular" height={200} />
          </Box>
          <Box flex="1 1 100%">
            <Skeleton variant="rectangular" height={300} />
          </Box>
        </Box>
      </Box>
    )
  }

  if (error) {
    return (
      <Card className="p-6 max-w-4xl mx-auto bg-red-50 border border-red-200">
        <CardContent>
          <Typography variant="h6" className="text-red-600 flex items-center gap-2">
            <span className="material-icons">error</span>
            Erreur lors du chargement des données pédagogiques
          </Typography>
          <Typography variant="body2" className="mt-2 text-red-500">
            Veuillez réessayer plus tard ou contacter le support technique.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  if (!enfants || enfants.length === 0) {
    return (
      <Card className="p-6 max-w-4xl mx-auto bg-blue-50 border border-blue-200">
        <CardContent>
          <Typography variant="h6" className="text-blue-600 flex items-center gap-2">
            <SchoolIcon />
            Aucun résultat pédagogique disponible
          </Typography>
          <Typography variant="body2" className="mt-2 text-blue-500">
            Les résultats pédagogiques seront disponibles prochainement.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  const enfant = enfants.find((e) => e.id === enfantSelectionne)
  const trimestres = enfant?.trimestres || [];
  const trimestre = trimestres.find((t) => t.id === trimestreSelectionne)

  const getColorClass = (valeur: number, seuil1: number, seuil2: number) => {
    if (valeur >= seuil2) return "text-green-600"
    if (valeur >= seuil1) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Box className="max-w-6xl mx-auto">
      <Typography variant="h5" className="mb-6 font-bold text-gray-800 flex items-center gap-2">
        <SchoolIcon className="text-primary" />
        Résultats Pédagogiques
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={3} className="mb-6">
        <Box flex="1 0 250px" maxWidth="sm">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="enfant-select-label">Enfant</InputLabel>
            <Select
              labelId="enfant-select-label"
              id="enfant-select"
              value={enfantSelectionne || ""}
              label="Enfant"
              onChange={(e) => setEnfantSelectionne(Number(e.target.value))}
              className="bg-white"
            >
              {enfants.map((enfant) => (
                <MenuItem key={enfant.id} value={enfant.id}>
                  {enfant.prenom} {enfant.nom} - {enfant.classe}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box flex="1 0 250px" maxWidth="sm">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="trimestre-select-label">Trimestre</InputLabel>
            <Select
              labelId="trimestre-select-label"
              id="trimestre-select"
              value={trimestreSelectionne || ""}
              label="Trimestre"
              onChange={(e) => setTrimestreSelectionne(Number(e.target.value))}
              className="bg-white"
            >
              {enfant?.trimestres.map((trimestre) => (
                <MenuItem key={trimestre.id} value={trimestre.id}>
                  {trimestre.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {enfant && trimestre && (
        <>
          <Box display="flex" flexWrap="wrap" gap={3} className="mb-6">
            <Box flex="1 0 250px" maxWidth="sm">
              <Card className="shadow-md h-full bg-white border-t-4 border-t-blue-500">
                <CardContent>
                  <Typography variant="h6" className="font-bold mb-4 flex items-center gap-2">
                    <GradeIcon className="text-blue-500" />
                    Moyenne Générale
                  </Typography>
                  <Typography variant="h4" className="mb-2 text-blue-700 font-bold">
                    {trimestre.bulletin?.moyenneGenerale !== undefined && 
                     trimestre.bulletin?.moyenneGenerale !== null && 
                     !isNaN(Number(trimestre.bulletin.moyenneGenerale))
                      ? Number(trimestre.bulletin.moyenneGenerale).toFixed(2)
                      : "-"} / 20
                  </Typography>
                  <Divider className="my-4" />
                  <Typography variant="subtitle1" className="font-semibold mb-2">
                    Appréciation Générale
                  </Typography>
                  <Typography variant="body1" className="italic text-gray-700 bg-gray-50 p-3 rounded-md">
                    {trimestre.bulletin?.appreciationGenerale || "Aucune appréciation pour ce trimestre."}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box flex="1 0 250px" maxWidth="sm">
              <Card className="shadow-md h-full bg-white border-t-4 border-t-amber-500">
                <CardContent>
                  <Typography variant="h6" className="font-bold mb-4 flex items-center gap-2">
                    <AccessTimeIcon className="text-amber-500" />
                    Absences &amp; Retards
                  </Typography>
                  <Box className="flex flex-col gap-4">
                    <Box className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                      <Box className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <Typography variant="h6" className="text-red-600 font-bold">
                          {trimestre.absences}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" className="text-gray-500">
                          Absences
                        </Typography>
                        <Typography variant="body2" className="text-gray-700">
                          {trimestre.absences > 5 
                            ? "Nombre d'absences élevé" 
                            : trimestre.absences > 0 
                              ? "Quelques absences" 
                              : "Aucune absence"}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                      <Box className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                        <Typography variant="h6" className="text-amber-600 font-bold">
                          {trimestre.retards}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" className="text-gray-500">
                          Retards
                        </Typography>
                        <Typography variant="body2" className="text-gray-700">
                          {trimestre.retards > 5 
                            ? "Nombre de retards élevé" 
                            : trimestre.retards > 0 
                              ? "Quelques retards" 
                              : "Aucun retard"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {(((trimestre.bulletin as any)?.evaluations) || (trimestre.bulletin as any)?.notes) && (
            <Card className="shadow-md mt-8 bg-white border-t-4 border-t-green-500">
              <CardContent>
                <Typography variant="h6" className="font-bold mb-4 flex items-center gap-2">
                  <AssignmentIcon className="text-green-500" />
                  Détail des évaluations
                </Typography>
                <TableContainer component={Paper} className="border border-gray-100">
                  <Table>
                    <TableHead className="bg-gray-50">
                      <TableRow>
                        <TableCell className="font-medium">Matière</TableCell>
                        <TableCell className="font-medium">Note</TableCell>
                        <TableCell className="font-medium">Appréciation</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(((trimestre.bulletin as any).evaluations || (trimestre.bulletin as any).notes) || []).map((note: any, idx: number) => (
                        <TableRow key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                          <TableCell className="font-medium">{note.matiere || note.domaine || "-"}</TableCell>
                          <TableCell>
                            <Box className={`font-bold ${getColorClass(note.valeur ?? note.valeurNote, 10, 14)} px-2 py-1 rounded-full inline-block ${
                              (note.valeur ?? note.valeurNote) >= 14 ? "bg-green-100" : 
                              (note.valeur ?? note.valeurNote) >= 10 ? "bg-yellow-100" : "bg-red-100"
                            }`}>
                              {(note.valeur ?? note.valeurNote) !== undefined ? (note.valeur ?? note.valeurNote) : "-"} / 20
                            </Box>
                          </TableCell>
                          <TableCell className="italic">{note.appreciation || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  )
}
