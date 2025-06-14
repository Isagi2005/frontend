import React from "react";
import { Card, CardHeader, CardContent, Grid, Box, Typography } from "@mui/material";
import { User, Calendar, Home, MapPin, Phone, Mail } from "lucide-react";
import type { StudentProfile } from "../../../api/studentApi";

interface EtudiantInfosProps {
  eleve: StudentProfile;
  formatDate: (dateString: string) => string;
}

const EtudiantInfos: React.FC<EtudiantInfosProps> = ({ eleve, formatDate }) => (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardHeader
          title="Informations personnelles"
          sx={{ bgcolor: "primary.light", color: "primary.contrastText", pb: 1 }}
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <User size={20} color="#1976d2" />
                <Typography variant="subtitle1" fontWeight="medium">
                  Genre:
                </Typography>
                <Typography>
                  {eleve.sexe === "M"
                    ? "Masculin"
                    : eleve.sexe === "F"
                    ? "Féminin"
                    : eleve.sexe || "-"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Calendar size={20} color="#1976d2" />
                <Typography variant="subtitle1" fontWeight="medium">
                  Date de naissance:
                </Typography>
                <Typography>
                  {formatDate(eleve.dateDeNaissance)} ({eleve.age} ans)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Home size={20} color="#1976d2" />
                <Typography variant="subtitle1" fontWeight="medium">
                  Religion:
                </Typography>
                <Typography>{eleve.religion || "-"}</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={6}>
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardHeader
          title="Coordonnées"
          sx={{ bgcolor: "primary.light", color: "primary.contrastText", pb: 1 }}
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <MapPin size={20} color="#1976d2" style={{ marginTop: 4 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Adresse:
                  </Typography>
                  <Typography>{eleve.adresse || "-"}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone size={20} color="#1976d2" />
                <Typography variant="subtitle1" fontWeight="medium">
                  Téléphone:
                </Typography>
                <Typography>{eleve.telephone || "-"}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Mail size={20} color="#1976d2" />
                <Typography variant="subtitle1" fontWeight="medium">
                  Email:
                </Typography>
                <Typography>{eleve.email || "-"}</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

export default EtudiantInfos;
