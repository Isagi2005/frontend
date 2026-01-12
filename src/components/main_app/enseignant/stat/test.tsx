import type React from "react"
import { useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Paper,
  Avatar,
  Chip,
  Tab,
  Tabs,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Button,
  Menu,
  MenuItem,
} from "@mui/material"
import Grid from "@mui/material/Grid2"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import {
  Users,
  Award,
  TrendingUp,
  Clock,
  Calendar,
  AlertTriangle,
  BookOpen,
  BarChart2,
  PieChartIcon,
  Filter,
  ChevronDown,
  RefreshCw,
} from "lucide-react"
import { useGetDashEnseignant } from "../../../../hooks/useDashboard"

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

export const EnseignantDashboard: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [tabValue, setTabValue] = useState(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const { data: dashboardData, isLoading: loading, isError: error } = useGetDashEnseignant();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setAnchorEl(null)
  }

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Chargement des données du tableau de bord...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "error.main" }}>
        <Typography variant="h6">{error}</Typography>
        <Button startIcon={<RefreshCw />} variant="outlined" color="primary" sx={{ mt: 2 }}>
          Réessayer
        </Button>
      </Box>
    )
  }

  if (!dashboardData) return null

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
            Tableau de bord enseignant
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Classe: <Chip label={dashboardData.classe_nom} color="primary" size="small" />
          </Typography>
        </Box>

        <Box sx={{ mt: isMobile ? 2 : 0, display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Filter />}
            endIcon={<ChevronDown />}
            onClick={handleFilterClick}
            size="small"
          >
            Filtrer
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleFilterClose}>
            <MenuItem onClick={handleFilterClose}>Tous les élèves</MenuItem>
            <MenuItem onClick={handleFilterClose}>Élèves en difficulté</MenuItem>
            <MenuItem onClick={handleFilterClose}>Élèves excellents</MenuItem>
            <Divider />
            <MenuItem onClick={handleFilterClose}>Ce mois</MenuItem>
            <MenuItem onClick={handleFilterClose}>Ce trimestre</MenuItem>
            <MenuItem onClick={handleFilterClose}>Cette année</MenuItem>
          </Menu>
          
        </Box>
      </Box>

      {/* Cartes de statistiques principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card
            sx={{ background: "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)", color: "white", borderRadius: 2 }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
                    Élèves
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
                    {dashboardData.total_etudiants}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    sur {dashboardData.nombre_eleve_classe} inscrits
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                  <Users size={20} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card
            sx={{ background: "linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)", color: "white", borderRadius: 2 }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
                    Moyenne générale
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
                    {dashboardData.moyenne_generale?.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    sur 20 points
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                  <Award size={20} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card
            sx={{ background: "linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)", color: "white", borderRadius: 2 }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
                    Taux de réussite
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
                    {dashboardData?.taux_reussite ?? "--"}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    moyenne ≥ 10/20
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                  <TrendingUp size={20} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card
            sx={{ background: "linear-gradient(45deg, #f44336 30%, #ff7043 90%)", color: "white", borderRadius: 2 }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
                    Élèves en difficulté
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
                    {dashboardData?.eleves_en_difficulte ?? "--"}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    moyenne &lt; 10/20
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                  <AlertTriangle size={20} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
          <Grid container spacing={3}>
            {/* Graphique d'évolution de la moyenne */}
            <Grid xs={12} md={8}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Évolution de la moyenne générale
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dashboardData?.evolution_moyenne ?? []}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mois" />
                        <YAxis domain={[0, 20]} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="moyenne"
                          name="Moyenne générale"
                          stroke="#4caf50"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Répartition des notes */}
            <Grid xs={12} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Répartition des moyennes
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
  data={dashboardData?.repartition_notes ?? []}
  layout="vertical"
  margin={{
    top: 5,
    right: 30,
    left: 20,
    bottom: 5,
  }}
>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis type="number" />
  <YAxis dataKey="range" type="category" />
  <Tooltip />
  <Bar dataKey="count" name="Nombre d'élèves">
    {(dashboardData?.repartition_notes ?? []).map((entry, index) => (
      <Cell key={`cell-${index}`} fill={entry.color} />
    ))}
  </Bar>
</BarChart>
</ResponsiveContainer>
</Box>
</CardContent>
</Card>
</Grid>

{/* Statistiques détaillées */}
<Grid xs={12} md={6}>
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Statistiques détaillées
      </Typography>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3}>
          <Grid xs={12} sm={4}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, textAlign: "center" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Meilleure moyenne
              </Typography>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: "bold", my: 1 }}>
                {dashboardData?.meilleure_moyenne?.toFixed(1) ?? "--"}
              </Typography>
              <Chip label="Excellent" color="success" size="small" />
            </Paper>
          </Grid>
          <Grid xs={12} sm={4}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, textAlign: "center" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Moyenne générale
              </Typography>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: "bold", my: 1 }}>
                {dashboardData?.moyenne_generale?.toFixed(1) ?? "--"}
              </Typography>
              <Chip label="Satisfaisant" color="primary" size="small" />
            </Paper>
          </Grid>
          <Grid xs={12} sm={4}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, textAlign: "center" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Moyenne minimale
              </Typography>
              <Typography variant="h4" color="error.main" sx={{ fontWeight: "bold", my: 1 }}>
                {dashboardData?.moyenne_min?.toFixed(1) ?? "--"}
              </Typography>
              <Chip label="En difficulté" color="error" size="small" />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </CardContent>
  </Card>
</Grid>
          </Grid>
        </TabPanel>

        {/* Contenu de l'onglet Présence */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Répartition des présences
                  </Typography>
                  <Box sx={{ height: 300, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={presencePieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          fill="#8884d8"
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {presencePieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Statistiques de présence
                  </Typography>
                  <Box sx={{ p: 2 }}>
                    <Grid container spacing={3}>
                      <Grid xs={12}>
                        <Paper elevation={0} sx={{ p: 3, bgcolor: "background.default", borderRadius: 2, mb: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar sx={{ bgcolor: "#4caf50", mr: 2 }}>
                              <Users size={20} />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Élèves présents
                              </Typography>
                              <Typography variant="h6">
                                {dashboardData.total_etudiants -
                                  dashboardData.retards_30plus -
                                  dashboardData.absences_demi_journee}{" "}
                                élèves
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid xs={12}>
                        <Paper elevation={0} sx={{ p: 3, bgcolor: "background.default", borderRadius: 2, mb: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar sx={{ bgcolor: "#ff9800", mr: 2 }}>
                              <Clock size={20} />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Retards supérieurs à 30 minutes
                              </Typography>
                              <Typography variant="h6">{dashboardData.retards_30plus} élèves</Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid xs={12}>
                        <Paper elevation={0} sx={{ p: 3, bgcolor: "background.default", borderRadius: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar sx={{ bgcolor: "#e53935", mr: 2 }}>
                              <Calendar size={20} />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Absences (demi-journée)
                              </Typography>
                              <Typography variant="h6">{dashboardData.absences_demi_journee} élèves</Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Contenu de l'onglet Par matière */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance par matière
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dashboardData?.matieres ?? []}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nom" />
                        <YAxis domain={[0, 20]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="moyenne" name="Moyenne" fill="#4caf50" />
                        <Bar dataKey="meilleure" name="Meilleure note" fill="#2196f3" />
                        <Bar dataKey="min" name="Note minimale" fill="#f44336" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid xs={12}>
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
                              <Chip
                                label={
                                  matiere.moyenne >= 14
                                    ? "Très bien"
                                    : matiere.moyenne >= 12
                                      ? "Bien"
                                      : matiere.moyenne >= 10
                                        ? "Moyen"
                                        : "À améliorer"
                                }
                                color={
                                  matiere.moyenne >= 14
                                    ? "success"
                                    : matiere.moyenne >= 12
                                      ? "primary"
                                      : matiere.moyenne >= 10
                                        ? "warning"
                                        : "error"
                                }
                                size="small"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  )
}

export default EnseignantDashboard
