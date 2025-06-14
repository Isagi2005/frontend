"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  Skeleton,
  Chip,
} from "@mui/material"
import {
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  CalendarMonth as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material"
import { motion } from "framer-motion"
import api from "../../../api/api" // ou ton instance axios

interface StatutPaiement {
  enfant_id: number
  nom_complet: string
  classe: string
  statuts_paiement: { [mois: string]: boolean }
  total_paye: number
}

const StatusPaiement = () => {
  const [data, setData] = useState<StatutPaiement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedChild, setSelectedChild] = useState<number | null>(null)

  useEffect(() => {
    setIsLoading(true)
    api
      .get("/api/statut_paiements/")
      .then((res) => {
        setData(res.data)
        if (res.data.length > 0) {
          setSelectedChild(res.data[0].enfant_id)
        }
      })
      .catch((err) => console.error("Erreur:", err))
      .finally(() => setIsLoading(false))
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MG", {
      style: "currency",
      currency: "MGA",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getMonthColor = (isPaid: boolean) => {
    return isPaid
      ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-sm"
      : "bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-sm"
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  const selectedChildData = data.find((child) => child.enfant_id === selectedChild)

  if (isLoading) {
    return (
      <Box className="max-w-6xl mx-auto">
        <Typography variant="h5" className="mb-6 font-bold text-gray-800 flex items-center gap-2">
          <PaymentIcon className="text-primary" />
          Statut des Paiements
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Skeleton variant="rectangular" height={120} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton variant="rectangular" height={120} />
              </Grid>
              <Grid item xs={12}>
                <Skeleton variant="rectangular" height={200} />
              </Grid>
              <Grid item xs={12}>
                <Skeleton variant="rectangular" height={100} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    )
  }

  return (
    <Box className="max-w-6xl mx-auto">
      <Typography variant="h5" className="mb-6 font-bold text-gray-800 flex items-center gap-2">
        <PaymentIcon className="text-primary" />
        Statut des Paiements
      </Typography>

      <Grid container spacing={3}>
        {/* Sidebar with student list */}
        <Grid item xs={12} md={4}>
          <motion.div variants={container} initial="hidden" animate="show" className="h-full">
            <Card className="shadow-md h-full bg-white border-t-4 border-t-primary">
              <CardContent className="p-0">
                <Box className="p-4 bg-gradient-to-r from-primary to-primary/80 text-white">
                  <Typography variant="h6" className="font-semibold flex items-center gap-2">
                    <PersonIcon /> Élèves
                  </Typography>
                </Box>
                <List className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                  {data.map((item) => (
                    <motion.div key={item.enfant_id} variants={item}>
                      <ListItem
                        button
                        onClick={() => setSelectedChild(item.enfant_id)}
                        selected={selectedChild === item.enfant_id}
                        className={`transition-all hover:bg-slate-50 ${
                          selectedChild === item.enfant_id ? "bg-slate-100" : ""
                        }`}
                      >
                        <ListItemAvatar>
                          <Avatar className="bg-primary/10 text-primary">{item.nom_complet.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body1" className="font-medium text-slate-800">
                              {item.nom_complet}
                            </Typography>
                          }
                          secondary={
                            <Box className="flex items-center gap-1 text-slate-500">
                              <SchoolIcon fontSize="small" className="text-primary" />
                              {item.classe}
                            </Box>
                          }
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Main content */}
        <Grid item xs={12} md={8}>
          {selectedChildData && (
            <Grid container spacing={3}>
              {/* Summary cards */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="shadow-md bg-white border-t-4 border-t-blue-500">
                    <CardContent>
                      <Box className="flex items-center gap-4">
                        <Box className="p-3 rounded-full bg-blue-100">
                          <PersonIcon className="text-blue-500" />
                        </Box>
                        <Box>
                          <Typography variant="caption" className="text-slate-500">
                            Élève
                          </Typography>
                          <Typography variant="h6" className="font-semibold text-slate-800">
                            {selectedChildData.nom_complet}
                          </Typography>
                          <Box className="flex items-center gap-1 text-slate-500 mt-1">
                            <SchoolIcon fontSize="small" />
                            <Typography variant="body2">{selectedChildData.classe}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="shadow-md bg-white border-t-4 border-t-green-500">
                    <CardContent>
                      <Box className="flex items-center gap-4">
                        <Box className="p-3 rounded-full bg-green-100">
                          <PaymentIcon className="text-green-500" />
                        </Box>
                        <Box>
                          <Typography variant="caption" className="text-slate-500">
                            Total Payé
                          </Typography>
                          <Typography variant="h6" className="font-semibold text-slate-800">
                            {formatCurrency(selectedChildData.total_paye)}
                          </Typography>
                          <Typography variant="body2" className="text-slate-500 mt-1">
                            {Object.values(selectedChildData.statuts_paiement).filter(Boolean).length} mois payés
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              {/* Payment status calendar */}
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card className="shadow-md bg-white border-t-4 border-t-purple-500">
                    <CardContent className="p-0">
                      <Box className="p-4 bg-gradient-to-r from-purple-500 to-purple-400 text-white flex items-center gap-2">
                        <CalendarIcon />
                        <Typography variant="h6" className="font-semibold">
                          Statut des Paiements Mensuels
                        </Typography>
                      </Box>

                      <Box className="p-6">
                        <Grid container spacing={2}>
                          {Object.entries(selectedChildData.statuts_paiement).map(([mois, status], idx) => (
                            <Grid item xs={6} sm={4} md={2} key={mois}>
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                              >
                                <Paper
                                  elevation={2}
                                  className={`${status ? "bg-green-500" : "bg-red-500"} text-white rounded-lg overflow-hidden`}
                                >
                                  <Box className="p-3 text-center">
                                    <Typography variant="subtitle1" className="font-medium">
                                      {mois}
                                    </Typography>
                                    <Box className="mt-2 text-lg">
                                      {status ? <CheckCircleIcon fontSize="large" /> : <CancelIcon fontSize="large" />}
                                    </Box>
                                  </Box>
                                </Paper>
                              </motion.div>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              {/* Payment progress */}
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Card className="shadow-md bg-white border-t-4 border-t-amber-500">
                    <CardContent>
                      <Typography variant="h6" className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <DashboardIcon className="text-amber-500" />
                        Progression des Paiements
                      </Typography>

                      <Box className="mb-2">
                        <LinearProgress
                          variant="determinate"
                          value={
                            (Object.values(selectedChildData.statuts_paiement).filter(Boolean).length /
                              Object.values(selectedChildData.statuts_paiement).length) *
                            100
                          }
                          className="h-2 rounded-full"
                          color="primary"
                        />
                      </Box>

                      <Box className="flex justify-between items-center mt-4">
                        <Chip
                          label={`${Object.values(selectedChildData.statuts_paiement).filter(Boolean).length} mois payés`}
                          color="success"
                          size="small"
                          icon={<CheckCircleIcon />}
                        />
                        <Typography variant="body2" className="text-slate-600">
                          {Object.values(selectedChildData.statuts_paiement).length} mois au total
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default StatusPaiement
