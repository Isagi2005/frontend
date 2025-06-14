import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

interface EtudiantTabsProps {
  tabValue: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  isMobile: boolean;
}

const EtudiantTabs: React.FC<EtudiantTabsProps> = ({ tabValue, onTabChange, isMobile }) => (
  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
    <Tabs
      value={tabValue}
      onChange={onTabChange}
      variant={isMobile ? "fullWidth" : "standard"}
      centered={!isMobile}
    >
      <Tab label="Informations" />
      <Tab label="Statistiques de présence" />
      <Tab label="Performances" />
    </Tabs>
  </Box>
);

export default EtudiantTabs;
