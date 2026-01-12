"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useAddPresEtudiant } from "../../../../hooks/usePresence"
import { toast } from "react-toastify"
import type { coursProfile, presenceEtudiantProfile } from "../../../../api/presenceApi"
import type { StudentProfile } from "../../../../api/studentApi"
import { TableRow, TableCell, Select, MenuItem, TextField, Button, CircularProgress, FormControl } from "@mui/material"
import { Check } from "lucide-react"

interface Props {
  etudiant: StudentProfile
  cours: coursProfile
}

const PresenceRow = ({ etudiant, cours }: Props) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<presenceEtudiantProfile>({
    defaultValues: {
      statut: "P",
    },
  })
  const { mutate, isPending } = useAddPresEtudiant()
  const [showHeureA, setShowHeureA] = useState(false)
  const [showRaison, setShowRaison] = useState(false)

  const statut = watch("statut")

  const handleStatusChange = (value: string) => {
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

  return (
    <TableRow sx={{ "&:hover": { bgcolor: "action.hover" } }}>
      <TableCell>{`${etudiant.nom} ${etudiant.prenom}`}</TableCell>
      <TableCell>
        <FormControl size="small" fullWidth>
          <Select
            value={statut}
            {...register("statut", { required: true })}
            onChange={(e) => {
              handleStatusChange(e.target.value)
              setValue("statut", e.target.value as "P" | "A" | "R")
            }}
            size="small"
          >
            <MenuItem value="P">Présent</MenuItem>
            <MenuItem value="A">Absent</MenuItem>
            <MenuItem value="R">Retard</MenuItem>
          </Select>
        </FormControl>
      </TableCell>
      <TableCell>
        {showHeureA && (
          <TextField
            type="time"
            {...register("heureA", { required: showHeureA })}
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        )}
      </TableCell>
      <TableCell>
        {showRaison && (
          <TextField
            {...register("raison", { required: showRaison })}
            placeholder="Justification"
            size="small"
            fullWidth
          />
        )}
      </TableCell>
      <TableCell>{cours.matiere}</TableCell>
      <TableCell>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleSubmit(onSubmit)}
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={16} /> : <Check size={16} />}
        >
          {isPending ? "Envoi..." : "Valider"}
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default PresenceRow
