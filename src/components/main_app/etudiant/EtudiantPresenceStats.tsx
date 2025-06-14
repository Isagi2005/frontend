import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

interface PresenceData {
  mois: string;
  retards_30mn?: number;
  absences_demi_journee?: number;
  heures_retard?: number; // en heures, optionnel
  heures_absence?: number; // en heures, optionnel
}

interface EtudiantPresenceStatsProps {
  presenceData: PresenceData[];
  isLoading: boolean;
  isError: boolean;
  formatMonth: (dateStr: string) => string;
}

const EtudiantPresenceStats: React.FC<EtudiantPresenceStatsProps> = ({ presenceData, isLoading, isError, formatMonth }) => {
  const statData = Array.isArray(presenceData) ? presenceData : [];
  const totalRetards = statData.reduce((acc, cur) => acc + (cur.retards_30mn || 0), 0);
  const totalAbsences = statData.reduce((acc, cur) => acc + (cur.absences_demi_journee || 0), 0);

  // Calcul du total d'heures de retard et d'absence (somme sur tous les mois)
  const totalHeuresRetard = statData.reduce((acc, cur) => acc + (cur.heures_retard || 0), 0);
  const totalHeuresAbsence = statData.reduce((acc, cur) => acc + (cur.heures_absence || 0), 0);

  const pieData = [
    { name: "Retards >30mn", value: totalRetards, color: "#fbbf24" },
    { name: "Absences ½j", value: totalAbsences, color: "#60a5fa" },
  ];

  const monthlyData = statData.map((item) => ({
    mois: formatMonth(item.mois),
    retards: item.retards_30mn || 0,
    absences: item.absences_demi_journee || 0,
  }));

  if (isLoading) {
    return <Box display="flex" alignItems="center" justifyContent="center" height={120}><CircularProgress /></Box>;
  }
  if (isError) {
    return <Box color="error.main" textAlign="center" py={2}>Erreur lors du chargement des statistiques de présence.</Box>;
  }
  if (!statData.length) {
    return <Box textAlign="center" py={2}>Aucune donnée de présence disponible.</Box>;
  }

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Statistiques de présence
      </Typography>
      {/* Affichage des totaux d'heures de retard et d'absence */}
      <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
        <Box>
          <Typography variant="subtitle1" color="text.secondary">Total heures de retard</Typography>
          <Typography variant="h5" fontWeight="bold" color="#fbbf24">
  {totalHeuresRetard < 1 && totalHeuresRetard > 0
    ? `${Math.round(totalHeuresRetard * 60)} min`
    : `${totalHeuresRetard.toFixed(2)} h`}
</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1" color="text.secondary">Total heures d'absence</Typography>
          <Typography variant="h5" fontWeight="bold" color="#60a5fa">
  {totalHeuresAbsence < 1 && totalHeuresAbsence > 0
    ? `${Math.round(totalHeuresAbsence * 60)} min`
    : `${totalHeuresAbsence.toFixed(2)} h`}
</Typography>
        </Box>
      </Box>
      <Box sx={{
        display: "flex",
        justifyContent: "space-around",
        marginBottom: "24px",
        padding: "16px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Box sx={{ fontSize: "36px", fontWeight: "bold", color: "#fbbf24" }}>{totalRetards}</Box>
          <Box sx={{ fontSize: "14px", color: "#666" }}>Retards &gt;30mn</Box>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Box sx={{ fontSize: "36px", fontWeight: "bold", color: "#60a5fa" }}>{totalAbsences}</Box>
          <Box sx={{ fontSize: "14px", color: "#666" }}>Absences ½j</Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-around", marginBottom: "24px" }}>
        <Box sx={{ width: "40%" }}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box flex={1} minWidth={220}>
          <Typography variant="subtitle1" fontWeight="bold">Évolution mensuelle</Typography>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="retards" name="Retards" stroke="#fbbf24" strokeWidth={2} />
              <Line type="monotone" dataKey="absences" name="Absences" stroke="#60a5fa" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default EtudiantPresenceStats;
