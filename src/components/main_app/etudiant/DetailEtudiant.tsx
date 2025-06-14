import React from "react"
import { usePresenceStatsEleve } from "../../../hooks/useStatistiques"
import {
  Box,
  Paper,
  Modal,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import type { StudentProfile } from "../../../api/studentApi"
import EtudiantPerformance from "./EtudiantPerformance"
import EtudiantHeader from "./EtudiantHeader"
import EtudiantTabs from "./EtudiantTabs"
import EtudiantInfos from "./EtudiantInfos"
import EtudiantPresenceStats from "./EtudiantPresenceStats"

interface DetailEtudiantProps {
  eleve: StudentProfile
  open: boolean
  onClose: () => void
}

const DetailEtudiant: React.FC<DetailEtudiantProps> = ({ eleve, open, onClose }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [tabValue, setTabValue] = React.useState(0)

  const { data, isLoading, isError } = usePresenceStatsEleve(eleve.id)

  // Gestion du trimestre sélectionné
  const [selectedTrimestre, setSelectedTrimestre] = React.useState<number | undefined>(undefined)

  // Données pour les statistiques
  const statData = Array.isArray(data) ? data : []


  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Formater les dates pour l'affichage
  const formatMonth = (dateStr: string) => {
    if (!dateStr) return ""
    const [year, month] = dateStr.split("-")
    const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"]
    return `${monthNames[Number.parseInt(month) - 1]} ${year.slice(2)}`
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="detail-etudiant-modal"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 1,
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 1200,
          maxHeight: "95vh",
          overflow: "auto",
          borderRadius: 2,
          boxShadow: 24,
          p: 0,
        }}
      >
        {/* Header */}
        <EtudiantHeader eleve={eleve} onClose={onClose} isMobile={isMobile} />
        {/* Tabs */}
        <EtudiantTabs tabValue={tabValue} onTabChange={handleTabChange} isMobile={isMobile} />
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <EtudiantInfos eleve={eleve} formatDate={formatDate} />
          )}
          {tabValue === 1 && (
            <EtudiantPresenceStats
              presenceData={statData}
              isLoading={isLoading}
              isError={isError}
              formatMonth={formatMonth}
            />
          )}
          {tabValue === 2 && (
            <EtudiantPerformance
              eleveId={eleve.id}
              selectedTrimestre={selectedTrimestre}
              setSelectedTrimestre={setSelectedTrimestre}
            />
          )}
        </Box>
      </Paper>
    </Modal>
  )
}

export default DetailEtudiant
