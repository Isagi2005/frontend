"use client"

import type React from "react"

import { useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  Container,
  Paper,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material"
import {
  Menu as MenuIcon,
  School as SchoolIcon,
  Payment as PaymentIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
} from "@mui/icons-material"
import ResultatsPedagogiques from "./affichagePedagogique"
import StatusPaiement from "./StatutPaiements"
import ParentChat from "./ParentChat" // à créer


interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      className="py-4"
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `dashboard-tab-${index}`,
    "aria-controls": `dashboard-tabpanel-${index}`,
  }
}

export default function DashboardContainer() {
  const [tabValue, setTabValue] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  // Onglets : Résultats, Paiements, Messages
  const tabs = [
    { label: "Résultats", icon: <SchoolIcon /> },
    { label: "Paiements", icon: <PaymentIcon /> },
    { label: "Messages", icon: <DashboardIcon /> },
  ]

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const drawerContent = (
    <Box sx={{ width: 500 }} role="presentation">
      <Box className="p-4 bg-transparent text-black">
        <Typography variant="h6" className="flex items-center gap-2">
          <DashboardIcon /> Tableau de Bord
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem
          button
          onClick={() => {
            setTabValue(0)
            setDrawerOpen(false)
          }}
        >
          <ListItemIcon>
            <SchoolIcon className={tabValue === 0 ? "text-primary" : ""} />
          </ListItemIcon>
          <ListItemText primary="Résultats Pédagogiques" className={tabValue === 0 ? "text-primary font-medium" : ""} />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            setTabValue(1)
            setDrawerOpen(false)
          }}
        >
          <ListItemIcon>
            <PaymentIcon className={tabValue === 1 ? "text-primary" : ""} />
          </ListItemIcon>
          <ListItemText primary="Statut des Paiements" className={tabValue === 1 ? "text-primary font-medium" : ""} />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Mon Profil" />
        </ListItem>
      </List>
    </Box>
  )

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <AppBar position="static" className="bg-white text-gray-800 shadow-md">
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer} className="mr-2">
              <MenuIcon />
            </IconButton>
          )}
          
          {!isMobile && (
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="dashboard tabs"
              textColor="primary"
              indicatorColor="primary"
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : false}
            >
              {tabs.map((tab, idx) => (
                <Tab key={tab.label} label={tab.label} icon={tab.icon} {...a11yProps(idx)} />
              ))}
            </Tabs>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        {drawerContent}
      </Drawer>

      <Container maxWidth="xl" className="py-6">
        <Paper elevation={0} className="bg-transparent">
          <TabPanel value={tabValue} index={0}>
            <ResultatsPedagogiques />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <StatusPaiement />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <ParentChat />
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  )
}
