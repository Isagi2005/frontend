import React from "react";
import { Box, Avatar, Chip, IconButton, Typography } from "@mui/material";
import { X } from "lucide-react";
import type { StudentProfile } from "../../../api/studentApi";

interface EtudiantHeaderProps {
  eleve: StudentProfile;
  onClose: () => void;
  isMobile: boolean;
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const EtudiantHeader: React.FC<EtudiantHeaderProps> = ({ eleve, onClose, isMobile }) => (
  <Box
    sx={{
      p: 3,
      background: "linear-gradient(90deg, #1976d2 0%, #2196f3 100%)",
      color: "white",
      position: "relative",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "center" : "flex-start",
      gap: 2,
    }}
  >
    <IconButton
      onClick={onClose}
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
        color: "white",
        bgcolor: "rgba(255,255,255,0.2)",
        "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
      }}
    >
      <X size={20} />
    </IconButton>
    {eleve.image ? (
      <Avatar
        src={eleve.image}
        alt={`${eleve.prenom} ${eleve.nom}`}
        sx={{ width: 100, height: 100, border: "4px solid white", boxShadow: 2 }}
      />
    ) : (
      <Avatar
        sx={{
          width: 100,
          height: 100,
          bgcolor: "white",
          color: "primary.main",
          fontSize: "2rem",
          fontWeight: "bold",
          border: "4px solid white",
          boxShadow: 2,
        }}
      >
        {getInitials(eleve.prenom, eleve.nom)}
      </Avatar>
    )}
    <Box sx={{ mt: isMobile ? 2 : 0 }}>
      <Typography variant="h4" fontWeight="bold">
        {eleve.prenom} {eleve.nom}
      </Typography>
      <Typography variant="h6">{eleve.classeName || "Classe non assignée"}</Typography>
      <Chip
        label={`ID: ${eleve.id}`}
        size="small"
        sx={{ mt: 1, bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: "medium" }}
      />
    </Box>
  </Box>
);

export default EtudiantHeader;
