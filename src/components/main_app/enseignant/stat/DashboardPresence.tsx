import React from "react";
import { Card, CardContent, Typography, Box, Grid, Paper, Avatar } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, Clock, Calendar } from "lucide-react";

interface PresencePieData {
  name: string;
  value: number;
  color: string;
}

interface DashboardPresenceProps {
  presencePieData: PresencePieData[];
  dashboardData: any;
}

const DashboardPresence: React.FC<DashboardPresenceProps> = ({ presencePieData, dashboardData }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
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
      <Grid item xs={12} md={6}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Statistiques de présence
            </Typography>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
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
                          {dashboardData.total_etudiants - dashboardData.retards_30plus - dashboardData.absences_demi_journee} élèves
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
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
                <Grid item xs={12}>
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
  );
};

export default DashboardPresence;
