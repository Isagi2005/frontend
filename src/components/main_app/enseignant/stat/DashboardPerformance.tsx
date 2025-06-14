import React from "react";
import { Card, CardContent, Typography, Box, Grid, Paper, Chip } from "@mui/material";
import { CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, BarChart, Bar, Cell } from "recharts";

interface EvolutionMoyenne {
  mois: string;
  moyenne: number;
}

interface RepartitionNote {
  range: string;
  count: number;
  color: string;
}

interface DashboardPerformanceData {
  evolution_moyenne?: EvolutionMoyenne[];
  repartition_notes?: RepartitionNote[];
  meilleure_moyenne?: number;
  moyenne_generale?: number;
  moyenne_min?: number;
}

interface DashboardPerformanceProps {
  dashboardData: DashboardPerformanceData;
}

const DashboardPerformance: React.FC<DashboardPerformanceProps> = ({ dashboardData }) => {
  return (
    <Grid container spacing={3}>
      {/* Graphique d'évolution de la moyenne */}
      <Grid item xs={12} md={8}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Évolution de la moyenne générale
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dashboardData?.evolution_moyenne ?? []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
      <Grid item xs={12} md={4}>
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
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="range" type="category" />
                  <Tooltip />
                  <Bar dataKey="count" name="Nombre d'élèves">
                    {(dashboardData?.repartition_notes ?? []).map((entry: any, index: number) => (
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
      <Grid item xs={12} md={6}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Statistiques détaillées
            </Typography>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, textAlign: "center" }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Meilleure moyenne
                    </Typography>
                    <Typography variant="h4" color="success.main" sx={{ fontWeight: "bold", my: 1 }}>
                      {dashboardData?.meilleure_moyenne?.toFixed(1) ?? "--"}
                    </Typography>
                    
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, textAlign: "center" }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Moyenne générale
                    </Typography>
                    <Typography variant="h4" color="primary.main" sx={{ fontWeight: "bold", my: 1 }}>
                      {dashboardData?.moyenne_generale?.toFixed(1) ?? "--"}
                    </Typography>
                    
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, textAlign: "center" }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Moyenne minimale
                    </Typography>
                    <Typography variant="h4" color="error.main" sx={{ fontWeight: "bold", my: 1 }}>
                      {dashboardData?.moyenne_min?.toFixed(1) ?? "--"}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardPerformance;
