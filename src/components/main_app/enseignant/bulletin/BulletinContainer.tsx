"use client"

import type React from "react"

import { useState } from "react"
import BulletinForm from "./BulletinForm"
import BulletinSearchBoard from "./BulletinSearchBoard"
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Fade,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { FileText, Plus, Search, School } from "lucide-react"

const BulletinContainer = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* En-tête */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: "linear-gradient(90deg, #1976d2 0%, #2196f3 100%)",
          color: "white",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <School size={36} style={{ marginRight: 16 }} />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
              Gestion des Bulletins
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 0.5, opacity: 0.9 }}>
              Créez, consultez et gérez les bulletins des élèves
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: isMobile ? 2 : 0, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color={activeTab === 1 ? "primary" : "inherit"}
            startIcon={<Plus />}
            onClick={() => setActiveTab(1)}
            sx={{
              bgcolor: activeTab === 1 ? "white" : "rgba(255, 255, 255, 0.2)",
              color: activeTab === 1 ? "primary.main" : "white",
              "&:hover": {
                bgcolor: activeTab === 1 ? "white" : "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            Créer un bulletin
          </Button>
          <Button
            variant="contained"
            color={activeTab === 0 ? "primary" : "inherit"}
            startIcon={<Search />}
            onClick={() => setActiveTab(0)}
            sx={{
              bgcolor: activeTab === 0 ? "white" : "rgba(255, 255, 255, 0.2)",
              color: activeTab === 0 ? "primary.main" : "white",
              "&:hover": {
                bgcolor: activeTab === 0 ? "white" : "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            Rechercher
          </Button>
        </Box>
      </Paper>

      {/* Navigation par onglets */}
      <Paper sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? "fullWidth" : "standard"}
          sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}
        >
          <Tab
            icon={<Search size={16} />}
            iconPosition="start"
            label="Recherche de bulletins"
            sx={{ textTransform: "none", py: 2 }}
          />
          <Tab
            icon={<FileText size={16} />}
            iconPosition="start"
            label="Création de bulletin"
            sx={{ textTransform: "none", py: 2 }}
          />
        </Tabs>

        <Divider />

        {/* Contenu des onglets */}
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Fade in={activeTab === 0} timeout={500} unmountOnExit>
            <Box sx={{ display: activeTab === 0 ? "block" : "none" }}>
              <BulletinSearchBoard />
            </Box>
          </Fade>
          <Fade in={activeTab === 1} timeout={500} unmountOnExit>
            <Box sx={{ display: activeTab === 1 ? "block" : "none" }}>
              <BulletinForm onClose={() => setActiveTab(0)} />
            </Box>
          </Fade>
        </Box>
      </Paper>
    </Container>
  )
}

export default BulletinContainer
