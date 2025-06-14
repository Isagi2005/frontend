import React from "react";
import { Box, CircularProgress } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line
} from "recharts";
import { useGetPerformanceEleve } from "../../../hooks/useDashboard";

interface EtudiantPerformanceProps {
  eleveId: number;
  selectedTrimestre: number | undefined;
  setSelectedTrimestre: (id: number | undefined) => void;
}

const EtudiantPerformance: React.FC<EtudiantPerformanceProps> = ({
  eleveId,
  selectedTrimestre,
  setSelectedTrimestre
}) => {
  const {
    data: performanceData,
    isLoading: isLoadingPerf,
    isError: isErrorPerf
  } = useGetPerformanceEleve(eleveId, selectedTrimestre);

  const handleTrimestreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedTrimestre(value ? Number(value) : undefined);
  };

  // Gestion loading / erreur / no data
  if (isLoadingPerf) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height={120}>
        <CircularProgress />
      </Box>
    );
  }
  if (isErrorPerf) {
    return (
      <Box color="error.main" textAlign="center" py={2}>
        Erreur lors du chargement des performances.
      </Box>
    );
  }
  if (!performanceData || !performanceData.matieres || performanceData.matieres.length === 0) {
    return (
      <Box textAlign="center" py={2}>
        Aucune donnée de performance disponible.
      </Box>
    );
  }

  return (
    <>
      {/* Sélecteur de trimestre */}
      {performanceData.trimestres_disponibles && performanceData.trimestres_disponibles.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="trimestre-select" style={{ marginRight: 8 }}>Trimestre :</label>
          <select
            id="trimestre-select"
            value={selectedTrimestre ?? performanceData.trimestre_selectionne ?? ""}
            onChange={handleTrimestreChange}
          >
            <option value="">Dernier trimestre</option>
            {performanceData.trimestres_disponibles.map((trim) => (
              <option key={trim.id} value={trim.id}>{trim.nom}</option>
            ))}
          </select>
        </div>
      )}

      {/* Résumé général */}
      <div style={{
        display: "flex",
        justifyContent: "space-around",
        marginBottom: "24px",
        padding: "16px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "36px", fontWeight: "bold", color: "#4caf50" }}>
            {performanceData?.moyenne_generale !== null && performanceData?.moyenne_generale !== undefined
              ? performanceData.moyenne_generale.toFixed(1)
              : "-"}
          </div>
          <div style={{ fontSize: "14px", color: "#666" }}>Moyenne générale</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "36px", fontWeight: "bold", color: "#2196f3" }}>
            {performanceData?.rang_classe ?? "-"}
            <span style={{ fontSize: "20px" }}>
              /{performanceData?.total_eleves ?? "-"}
            </span>
          </div>
          <div style={{ fontSize: "14px", color: "#666" }}>Rang dans la classe</div>
        </div>
      </div>

      {/* Tableau matières */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        padding: "16px",
        marginBottom: "24px",
      }}>
        <div style={{ marginBottom: "12px", fontWeight: "bold" }}>Résultats par matière</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>
                  Domaine d'enseignement
                </th>
                <th style={{ padding: "10px", textAlign: "center", borderBottom: "1px solid #e0e0e0" }}>
                  Moyenne
                </th>
                <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>
                  Appréciation
                </th>
              </tr>
            </thead>
            <tbody>
              {performanceData.matieres.map((matiere, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#f9f9f9" }}>
                  <td style={{ padding: "10px", borderBottom: "1px solid #e0e0e0" }}>{matiere.nom}</td>
                  <td style={{ padding: "10px", textAlign: "center", borderBottom: "1px solid #e0e0e0" }}>
                    <span
                      style={{
                        fontWeight: "bold",
                        color:
                          matiere.moyenne >= 14 ? "#4caf50" : matiere.moyenne >= 10 ? "#ff9800" : "#f44336",
                      }}
                    >
                      {typeof matiere.moyenne === 'number' ? matiere.moyenne.toFixed(1) : "-"}
                    </span>
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #e0e0e0" }}>
                    {matiere.appreciation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Graphique d'évolution */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
          padding: "16px",
        }}
      >
        <div style={{ marginBottom: "12px", fontWeight: "bold" }}>Évolution de la moyenne générale</div>
        <div style={{ height: "250px" }}>
          {performanceData.evolution && performanceData.evolution.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData.evolution} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="trimestre" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[
                    Math.floor(Math.min(...performanceData.evolution.map((item) => item.moyenne)) - 1),
                    Math.ceil(Math.max(...performanceData.evolution.map((item) => item.moyenne)) + 1),
                  ]}
                />
                <Tooltip formatter={(value: number) => [`${value.toFixed(1)}`, "Moyenne"]} />
                <Line
                  type="monotone"
                  dataKey="moyenne"
                  name="Moyenne"
                  stroke="#4caf50"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#4caf50" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Box textAlign="center" py={2}>Aucune évolution disponible.</Box>
          )}
        </div>
      </div>
    </>
  );
};

export default EtudiantPerformance;