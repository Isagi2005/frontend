"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useAddPresEtudiant } from "../../../../hooks/usePresence"
import { toast } from "react-toastify"
import type { coursProfile, presenceEtudiantProfile } from "../../../../api/presenceApi"
import type { StudentProfile } from "../../../../api/studentApi"
import {
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Avatar,
} from "@mui/material"
import { Check } from "lucide-react"

interface Props {
  etudiant: StudentProfile
  cours: coursProfile
}

const PresenceCard = ({ etudiant, cours }: Props) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<presenceEtudiantProfile>({
    defaultValues: {
      statut: "P",
    },
  })
  const { mutate, isPending } = useAddPresEtudiant()
  const [showHeureA, setShowHeureA] = useState(false)
  const [showRaison, setShowRaison] = useState(false)

  const statut = watch("statut")

  const handleStatusChange = (value: "P" | "A" | "R") => {
    if (value === "R") {
      setShowHeureA(true)
      setShowRaison(false)
      setValue("heureA", "")
      setValue("raison", "")
    } else if (value === "A") {
      setShowHeureA(false)
      setShowRaison(true)
      setValue("heureA", "")
    } else {
      setShowHeureA(false)
      setShowRaison(false)
      setValue("heureA", "")
      setValue("raison", "")
    }
  }

  const onSubmit = (data: presenceEtudiantProfile) => {
    // Nettoyage des champs selon le statut
    const payload: Partial<presenceEtudiantProfile> = {
      ...data,
      etudiant: etudiant.id,
      cours: cours.id,
    }

    if (data.statut === "A") {
      delete payload.heureA
    }
    if (data.statut === "P") {
      delete payload.heureA
      delete payload.raison
    }

    mutate(payload as presenceEtudiantProfile, {
      onSuccess: () => {
        toast.success(`Présence enregistrée pour ${etudiant.nom} ${etudiant.prenom}`)
        reset({ statut: "P" })
        setShowHeureA(false)
        setShowRaison(false)
      },
      onError: () => {
        toast.error(`Erreur lors de l'enregistrement pour ${etudiant.nom} ${etudiant.prenom}`)
      },
    })
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {etudiant.image && typeof etudiant.image === 'string' ? (
            <Avatar src={etudiant.image as string} alt={`${etudiant.prenom} ${etudiant.nom}`} sx={{ mr: 2 }} />
          ) : (
            <Avatar sx={{ bgcolor: "primary.light", mr: 2 }}>{getInitials(etudiant.prenom, etudiant.nom)}</Avatar>
          )}
          <Typography variant="h6">{`${etudiant.nom} ${etudiant.prenom}`}</Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Cours
            </Typography>
            <Typography>{cours.matiere}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Statut
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={statut}
                {...register("statut", { required: true })}
                onChange={(e) => {
                  handleStatusChange(e.target.value as "P" | "A" | "R")
                  setValue("statut", e.target.value as "P" | "A" | "R")
                }}
              >
                <MenuItem value="P">Présent</MenuItem>
                <MenuItem value="A">Absent</MenuItem>
                <MenuItem value="R">Retard</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {showHeureA && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Heure d'arrivée
              </Typography>
              <TextField
                type="time"
                {...register("heureA", { required: showHeureA })}
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          )}

          {showRaison && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Justification
              </Typography>
              <TextField
                {...register("raison", { required: showRaison })}
                placeholder="Motif de l'absence"
                size="small"
                fullWidth
                multiline
                rows={2}
              />
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={16} /> : <Check size={16} />}
            sx={{ mt: 1 }}
          >
            {isPending ? "Envoi..." : "Valider la présence"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default PresenceCard
