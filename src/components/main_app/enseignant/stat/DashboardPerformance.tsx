import React from "react";
import { Card, CardContent, Typography, Box, Paper } from "@mui/material";
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
  meilleure_moyenne?: number | null;
  moyenne_generale?: number | null;
  moyenne_min?: number | null;
}

interface DashboardPerformanceProps {
  dashboardData: DashboardPerformanceData;
}

const DashboardPerformance: React.FC<DashboardPerformanceProps> = ({ dashboardData }) => {
  return (
    <Box display="flex" flexWrap="wrap" gap={3}>
      {/* Graphique d'évolution de la moyenne */}
      <Box flex="1 0 66.66%" maxWidth="md">
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
      </Box>

      {/* Répartition des notes */}
      <Box flex="1 0 33.33%" maxWidth="sm">
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
                    {(dashboardData?.repartition_notes ?? []).map((entry: RepartitionNote, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Statistiques détaillées */}
      <Box flex="1 0 50%" maxWidth="sm">
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Statistiques détaillées
            </Typography>
            <Box sx={{ p: 2 }}>
              <Box display="flex" flexWrap="wrap" gap={3}>
                <Box flex="1 0 100%" sx={{ sm: { flex: '1 0 50%' } }}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, textAlign: "center" }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Meilleure moyenne
                    </Typography>
                    <Typography variant="h4" color="success.main" sx={{ fontWeight: "bold", my: 1 }}>
                      {dashboardData?.meilleure_moyenne?.toFixed(1) ?? "--"}
                    </Typography>
                    
                  </Paper>
                </Box>
                <Box flex="1 0 100%" sx={{ sm: { flex: '1 0 50%' } }}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, textAlign: "center" }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Moyenne générale
                    </Typography>
                    <Typography variant="h4" color="primary.main" sx={{ fontWeight: "bold", my: 1 }}>
                      {dashboardData?.moyenne_generale?.toFixed(1) ?? "--"}
                    </Typography>
                    
                  </Paper>
                </Box>
                <Box flex="1 0 100%" sx={{ sm: { flex: '1 0 50%' } }}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, textAlign: "center" }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Moyenne minimale
                    </Typography>
                    <Typography variant="h4" color="error.main" sx={{ fontWeight: "bold", my: 1 }}>
                      {dashboardData?.moyenne_min?.toFixed(1) ?? "--"}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardPerformance;
