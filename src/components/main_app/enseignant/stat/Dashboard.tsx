import type React from "react"
import { useState } from "react"
import { Card, CardContent, Typography, Box, Paper, Tab, Tabs, LinearProgress, useTheme, useMediaQuery, Button, Chip } from "@mui/material";
import {
  BookOpen,
  BarChart2,
  PieChartIcon,
  RefreshCw,
} from "lucide-react";
import { useGetDashDirection, useGetDirFilters } from "../../../../hooks/useDashboard";
import DashboardStatsCards from "./DashboardStatsCards";
import DashboardPresence from "./DashboardPresence";
import DashboardPerformance from "./DashboardPerformance";

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `dashboard-tab-${index}`,
    "aria-controls": `dashboard-tabpanel-${index}`,
  }
}

export const DirectionDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [tabValue, setTabValue] = useState(0);

  // --- Filtres dynamiques ---
  const [selectedClasse, setSelectedClasse] = useState<number | undefined>(undefined);
  const [selectedAnnee, setSelectedAnnee] = useState<number | undefined>(undefined);
  const [selectedPeriode, setSelectedPeriode] = useState<number | undefined>(undefined);

  // Récupération des options de filtres
  const { data: filters, isLoading: filtersLoading, isError: filtersError } = useGetDirFilters();

  // Récupération des stats dashboard filtrées
  const {
    data: dashboardData,
    isLoading: loading,
    isError: error,
  } = useGetDashDirection({
    classe_id: selectedClasse,
    annee_id: selectedAnnee,
    trimestre_id: selectedPeriode,
  });

  // Gestion du changement d'onglet
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Gestion loading/erreur pour les filtres
  if (filtersLoading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Chargement des filtres...</Typography>
      </Box>
    );
  }
  if (filtersError || !filters) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "error.main" }}>
        <Typography variant="h6">Erreur lors du chargement des filtres</Typography>
        <Button startIcon={<RefreshCw />} variant="outlined" color="primary" sx={{ mt: 2 }}>
          Réessayer
        </Button>
      </Box>
    );
  }

  // Gestion loading/erreur pour les données dashboard
  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Chargement des données du tableau de bord...</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "error.main" }}>
        <Typography variant="h6">Erreur lors du chargement des statistiques</Typography>
        <Button startIcon={<RefreshCw />} variant="outlined" color="primary" sx={{ mt: 2 }}>
          Réessayer
        </Button>
      </Box>
    );
  }
  if (!dashboardData) {
    return null;
  }

  // Préparation des données pour le camembert de présence
  const presencePieData = [
    {
      name: "Présents",
      value: dashboardData.total_etudiants - dashboardData.retards_30plus - dashboardData.absences_demi_journee,
      color: "#4caf50",
    },
    { name: "Retards > 30mn", value: dashboardData.retards_30plus, color: "#ff9800" },
    { name: "Absences 1/2 journée", value: dashboardData.absences_demi_journee, color: "#e53935" },
  ]

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
      {/* En-tête du dashboard */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            Tableau de bord pédagogique
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Classe: <Chip label={dashboardData.classe_nom} color="primary" size="small" />
          </Typography>
        </Box>

        {/* Filtres dynamiques */}
        <Box sx={{ mt: isMobile ? 2 : 0, display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Classe */}
          <Box>
            <Typography variant="caption">Classe</Typography>
            <select
              value={selectedClasse ?? ''}
              onChange={e => setSelectedClasse(e.target.value ? Number(e.target.value) : undefined)}
              style={{ padding: 6, borderRadius: 6, minWidth: 120 }}
              disabled={filtersLoading || !filters}
            >
              <option value="">Toutes</option>
              {filters?.classes.map(classe => (
                <option key={classe.id} value={classe.id}>{classe.nom}</option>
              ))}
            </select>
          </Box>
          {/* Année */}
          <Box>
            <Typography variant="caption">Année</Typography>
            <select
              value={selectedAnnee ?? ''}
              onChange={e => setSelectedAnnee(e.target.value ? Number(e.target.value) : undefined)}
              style={{ padding: 6, borderRadius: 6, minWidth: 120 }}
              disabled={filtersLoading || !filters}
            >
              <option value="">Toutes</option>
              {filters?.annees.map(annee => (
                <option key={annee.id} value={annee.id}>{annee.nom}</option>
              ))}
            </select>
          </Box>
          {/* Période */}
          <Box>
            <Typography variant="caption">Période</Typography>
            <select
              value={selectedPeriode ?? ''}
              onChange={e => setSelectedPeriode(e.target.value ? Number(e.target.value) : undefined)}
              style={{ padding: 6, borderRadius: 6, minWidth: 120 }}
              disabled={filtersLoading || !filters}
            >
              <option value="">Toutes</option>
              {filters?.periodes.map(periode => (
                <option key={periode.id} value={periode.id}>{periode.nom}</option>
              ))}
            </select>
          </Box>
        </Box>
      </Box>

      {/* Cartes de statistiques principales */}
      <DashboardStatsCards
        totalEtudiants={dashboardData.total_etudiants}
        nombreEleveClasse={dashboardData.nombre_eleve_classe}
        moyenneGenerale={dashboardData?.moyenne_generale}
        tauxReussite={dashboardData?.taux_reussite}
        elevesEnDifficulte={dashboardData?.eleves_en_difficulte}
        showMoyenneError={dashboardData?.moyenne_generale === null || dashboardData?.moyenne_generale === undefined || isNaN(Number(dashboardData?.moyenne_generale))}
      />

      {/* Onglets du dashboard */}
      <Paper sx={{ borderRadius: 2, overflow: "hidden", mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="dashboard tabs"
            variant={isMobile ? "fullWidth" : "standard"}
          >
            <Tab
              icon={<BarChart2 size={16} />}
              iconPosition="start"
              label="Performance"
              {...a11yProps(0)}
              sx={{ textTransform: "none" }}
            />
            <Tab
              icon={<PieChartIcon size={16} />}
              iconPosition="start"
              label="Présence"
              {...a11yProps(1)}
              sx={{ textTransform: "none" }}
            />
            <Tab
              icon={<BookOpen size={16} />}
              iconPosition="start"
              label="Par matière"
              {...a11yProps(2)}
              sx={{ textTransform: "none" }}
            />
          </Tabs>
        </Box>

        {/* Contenu de l'onglet Performance */}
        <TabPanel value={tabValue} index={0}>
          <DashboardPerformance dashboardData={dashboardData} />
        </TabPanel>

        {/* Contenu de l'onglet Présence */}
        <TabPanel value={tabValue} index={1}>
          <DashboardPresence presencePieData={presencePieData} dashboardData={dashboardData} />
        </TabPanel>

        {/* Contenu de l'onglet Par matière */}
        <TabPanel value={tabValue} index={2}>
          <Box mt={2}>
            <Box display="flex" flexDirection="column">
              <Box width="100%">
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Détail par matière
                    </Typography>
                    <Box sx={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#f5f5f5" }}>
                            <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>
                              Matière
                            </th>
                            <th style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid #e0e0e0" }}>
                              Moyenne
                            </th>
                            <th style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid #e0e0e0" }}>
                              Meilleure note
                            </th>
                            <th style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid #e0e0e0" }}>
                              Note minimale
                            </th>
                            <th style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid #e0e0e0" }}>
                              Statut
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData?.matieres?.map((matiere, index) => (
                            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#f9f9f9" }}>
                              <td style={{ padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <BookOpen size={16} color="#1976d2" style={{ marginRight: 8 }} />
                                  <span style={{ fontWeight: "medium" }}>{matiere.nom}</span>
                                </Box>
                              </td>
                              <td
                                style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid #e0e0e0" }}
                              >
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: "bold",
                                    color:
                                      matiere.moyenne >= 14 ? "#4caf50" : matiere.moyenne >= 10 ? "#ff9800" : "#f44336",
                                  }}
                                >
                                  {matiere.moyenne.toFixed(1)}
                                </Typography>
                              </td>
                              <td
                                style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid #e0e0e0" }}
                              >
                                <Typography variant="body1" sx={{ color: "#2196f3", fontWeight: "medium" }}>
                                  {matiere.meilleure.toFixed(1)}
                                </Typography>
                              </td>
                              <td
                                style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid #e0e0e0" }}
                              >
                                <Typography
                                  variant="body1"
                                  sx={{
                                    color: matiere.min >= 10 ? "#4caf50" : matiere.min >= 8 ? "#ff9800" : "#f44336",
                                  }}
                                >
                                  {matiere.min.toFixed(1)}
                                </Typography>
                              </td>
                              <td
                                style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid #e0e0e0" }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: "bold",
                                    color:
                                      matiere.moyenne >= 14
                                        ? "#388e3c"
                                        : matiere.moyenne >= 10
                                        ? "#fbc02d"
                                        : "#d32f2f",
                                  }}
                                >
                                  {matiere.moyenne >= 14
                                    ? "Excellent"
                                    : matiere.moyenne >= 10
                                    ? "Satisfaisant"
                                    : "En difficulté"}
                                </Typography>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  )
}

export default DirectionDashboard
