import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";

interface MatiereData {
  nom: string;
  moyenne: number;
  meilleure: number;
  min: number;
}

interface DashboardMatiereProps {
  matieres: MatiereData[];
}

const DashboardMatiere: React.FC<DashboardMatiereProps> = ({ matieres }) => {
  return (
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
                  data={matieres ?? []}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
    </Grid>
  );
};

export default DashboardMatiere;
