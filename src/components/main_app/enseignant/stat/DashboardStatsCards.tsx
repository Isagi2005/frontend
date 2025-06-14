import React from "react";
import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Users, Award, TrendingUp, AlertTriangle } from "lucide-react";

interface DashboardStatsCardsProps {
  totalEtudiants: number;
  nombreEleveClasse: number;
  moyenneGenerale?: number | null;
  tauxReussite?: number | null;
  elevesEnDifficulte?: number | null;
  showMoyenneError?: boolean;
}

const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({
  totalEtudiants,
  nombreEleveClasse,
  moyenneGenerale,
  tauxReussite,
  elevesEnDifficulte,
  showMoyenneError = false,
}) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ background: "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)", color: "white", borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
                  Élèves
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
                  {totalEtudiants}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  sur {nombreEleveClasse} inscrits
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                <Users size={20} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ background: "linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)", color: "white", borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
                  Moyenne générale
                </Typography>
                {showMoyenneError ? (
                  <Typography variant="body2" color="warning.main" sx={{ fontWeight: "bold", my: 1 }}>
                    Pas encore de données pour la moyenne
                  </Typography>
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
                    {moyenneGenerale !== null && moyenneGenerale !== undefined ? moyenneGenerale.toFixed(1) : "--"}
                  </Typography>
                )}
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
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ background: "linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)", color: "white", borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
                  Taux de réussite
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
                  {tauxReussite !== null && tauxReussite !== undefined ? tauxReussite + "%" : "--"}
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
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ background: "linear-gradient(45deg, #f44336 30%, #ff7043 90%)", color: "white", borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
                  Élèves en difficulté
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
                  {elevesEnDifficulte !== null && elevesEnDifficulte !== undefined ? elevesEnDifficulte : "--"}
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
  );
};

export default DashboardStatsCards;
