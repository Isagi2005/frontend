"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  useGetEmployees,
  useCreateCongeForEmployee,
  useGetCongesByEmployee,
  useUpdateConge,
  useDeleteConge,
} from "../../../hooks/useConges"
import type { Conge } from "../../../api/congeApi"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  ChevronRight,
  User,
  Briefcase,
  Clock,
  CalendarDays,
  CalendarClock,
  FileText,
  AlertTriangle,
  Loader2,
} from "lucide-react"

// Composant pour le bouton Google Calendar avec animation
const GoogleCalendarButton = ({ conge, employee }: { conge: Conge; employee: any }) => {
  const createGoogleCalendarEvent = () => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toISOString().replace(/-|:|\.\d+/g, "")
    }

    const startDate = formatDate(conge.date_debut)
    const endDate = formatDate(conge.date_fin)

    const eventDetails = {
      action: "TEMPLATE",
      text: `Congé ${conge.type_conge} - ${employee.prenom} ${employee.nom}`,
      dates: `${startDate}/${endDate}`,
      details: `Employé: ${employee.prenom} ${employee.nom}\nType: ${conge.type_conge}\nRaison: ${
        conge.raison || "Non spécifiée"
      }`,
      location: "",
      trp: false,
      sprop: "name:Congés Entreprise",
      spropName: "Congés Entreprise",
    }

    const queryString = new URLSearchParams(eventDetails as any).toString()
    window.open(`https://calendar.google.com/calendar/render?${queryString}`, "_blank")
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={createGoogleCalendarEvent}
      className="inline-flex items-center px-3 py-1.5 rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm transition-all duration-200"
    >
      <Calendar className="h-4 w-4 mr-2" />
      <span className="text-xs font-medium">Google Calendar</span>
    </motion.button>
  )
}

// Fonction pour obtenir la couleur de badge selon le type de congé
const getCongeTypeColor = (type: string) => {
  switch (type) {
    case "annuel":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    case "maladie":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "maternité":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "paternité":
      return "bg-indigo-100 text-indigo-800 border-indigo-200"
    case "exceptionnel":
      return "bg-rose-100 text-rose-800 border-rose-200"
    default:
      return "bg-slate-100 text-slate-800 border-slate-200"
  }
}

// Fonction pour calculer la durée du congé en jours
const calculateDuration = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 pour inclure le jour de début
  return diffDays
}

const CongesManagement = () => {
  const { data: employees } = useGetEmployees()
  const { mutate: createConge, isPending: isCreating } = useCreateCongeForEmployee()
  const { mutate: updateConge, isPending: isUpdating } = useUpdateConge()
  const { mutate: deleteConge, isPending: isDeleting } = useDeleteConge()

  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showSuivi, setShowSuivi] = useState(false)
  const [editingConge, setEditingConge] = useState<Conge | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const [formData, setFormData] = useState({
    date_debut: "",
    date_fin: "",
    raison: "",
    type_conge: "",
  })

  const { data: suiviConges, isLoading: isLoadingSuivi } = useGetCongesByEmployee(selectedEmployee || 0)

  const filteredEmployees = employees?.filter((employee) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      employee.nom.toLowerCase().includes(searchLower) ||
      employee.prenom.toLowerCase().includes(searchLower) ||
      (employee.poste && employee.poste.toLowerCase().includes(searchLower))
    )
  })

  useEffect(() => {
    if (editingConge) {
      setFormData({
        date_debut: editingConge.date_debut,
        date_fin: editingConge.date_fin,
        raison: editingConge.raison,
        type_conge: editingConge.type_conge,
      })
      setShowForm(true)
    }
  }, [editingConge])

  // Effet pour fermer la notification après 3 secondes
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedEmployee || !formData.date_debut || !formData.date_fin || !formData.type_conge) {
      setNotification({
        message: "Veuillez remplir tous les champs obligatoires",
        type: "error",
      })
      return
    }

    const congePayload = {
      date_debut: formData.date_debut,
      date_fin: formData.date_fin,
      raison: formData.raison,
      type_conge: formData.type_conge,
    }

    if (editingConge) {
      updateConge(
        { ...editingConge, ...congePayload },
        {
          onSuccess: () => {
            resetForm()
            setNotification({
              message: "Congé modifié avec succès",
              type: "success",
            })
          },
          onError: () => {
            setNotification({
              message: "Erreur lors de la modification du congé",
              type: "error",
            })
          },
        },
      )
    } else {
      createConge(
        {
          employeeId: selectedEmployee,
          congeData: congePayload,
        },
        {
          onSuccess: () => {
            resetForm()
            setNotification({
              message: "Congé ajouté avec succès",
              type: "success",
            })
          },
          onError: () => {
            setNotification({
              message: "Erreur lors de l'ajout du congé",
              type: "error",
            })
          },
        },
      )
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingConge(null)
    setFormData({
      date_debut: "",
      date_fin: "",
      raison: "",
      type_conge: "",
    })
  }

  const handleDelete = (id: number) => {
    deleteConge(id, {
      onSuccess: () => {
        setConfirmDelete(null)
        setNotification({
          message: "Congé supprimé avec succès",
          type: "success",
        })
      },
      onError: () => {
        setNotification({
          message: "Erreur lors de la suppression du congé",
          type: "error",
        })
      },
    })
  }

  const isLoading = isCreating || isUpdating || isDeleting

  // Formatage de la date en format lisible
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }
    return new Date(dateString).toLocaleDateString("fr-FR", options)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
                notification.type === "success" ? "bg-emerald-500" : "bg-rose-500"
              } text-white flex items-center gap-2`}
            >
              {notification.type === "success" ? <Check className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
              <span>{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <CalendarClock className="h-7 w-7 text-blue-600" />
                Gestion des Congés
              </h1>

              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher par nom, prénom ou poste..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>

          {/* Liste des employés */}
          <div className="p-6">
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Nom</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Prénom</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>Poste</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Actions</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  <AnimatePresence>
                    {filteredEmployees?.length ? (
                      filteredEmployees.map((employee) => (
                        <motion.tr
                          key={employee.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-slate-50 transition-all duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-slate-800">{employee.nom}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-slate-600">{employee.prenom}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {employee.poste ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                {employee.poste}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedEmployee(employee.id)
                                setShowForm(true)
                                setEditingConge(null)
                              }}
                              className="inline-flex items-center px-3 py-1.5 rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm transition-all duration-200"
                              disabled={isLoading}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              <span className="text-xs font-medium">Ajouter congé</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedEmployee(employee.id)
                                setShowSuivi(true)
                              }}
                              className="inline-flex items-center px-3 py-1.5 rounded-md text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-sm transition-all duration-200"
                              disabled={isLoading}
                            >
                              <CalendarDays className="h-4 w-4 mr-1" />
                              <span className="text-xs font-medium">Voir le suivi</span>
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center">
                          <div className="flex flex-col items-center justify-center text-slate-500">
                            <Search className="h-10 w-10 text-slate-300 mb-2" />
                            <p className="font-medium">
                              {searchTerm
                                ? "Aucun employé ne correspond à votre recherche"
                                : "Aucun employé disponible"}
                            </p>
                            {searchTerm && (
                              <button
                                onClick={() => setSearchTerm("")}
                                className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
                              >
                                Effacer la recherche
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Formulaire congé - Modal */}
        <AnimatePresence>
          {showForm && selectedEmployee && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                      {editingConge ? (
                        <>
                          <Edit className="h-5 w-5 text-amber-500" />
                          <span>Modifier le congé</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-5 w-5 text-blue-500" />
                          <span>Ajouter un congé</span>
                        </>
                      )}
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={resetForm}
                      className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
                      disabled={isLoading}
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Date de début *</label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="date"
                          name="date_debut"
                          value={formData.date_debut}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Date de fin *</label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="date"
                          name="date_fin"
                          value={formData.date_fin}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      {formData.date_debut && formData.date_fin && (
                        <div className="mt-1 text-xs text-blue-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            Durée: {calculateDuration(formData.date_debut, formData.date_fin)}{" "}
                            {calculateDuration(formData.date_debut, formData.date_fin) > 1 ? "jours" : "jour"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Type de congé *</label>
                      <div className="relative">
                        <FileText
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <select
                          name="type_conge"
                          value={formData.type_conge}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                          required
                          disabled={isLoading}
                        >
                          <option value="">-- Sélectionner --</option>
                          <option value="annuel">Congé annuel</option>
                          <option value="maladie">Congé maladie</option>
                          <option value="maternité">Congé maternité</option>
                          <option value="paternité">Congé paternité</option>
                          <option value="exceptionnel">Congé exceptionnel</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Raison (optionnel)</label>
                      <textarea
                        name="raison"
                        value={formData.raison}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        disabled={isLoading}
                        placeholder="Précisez la raison du congé..."
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all duration-200"
                        disabled={isLoading}
                      >
                        Annuler
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>{editingConge ? "Modification..." : "Enregistrement..."}</span>
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            <span>{editingConge ? "Modifier" : "Ajouter"}</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Suivi des congés - Modal */}
        <AnimatePresence>
          {showSuivi && selectedEmployee && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <CalendarDays className="h-6 w-6" />
                      <span>
                        Suivi des congés - {employees?.find((e) => e.id === selectedEmployee)?.prenom}{" "}
                        {employees?.find((e) => e.id === selectedEmployee)?.nom}
                      </span>
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowSuivi(false)}
                      className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20"
                      disabled={isLoading}
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
                  {isLoadingSuivi ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
                        <p className="text-slate-500">Chargement des congés...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto rounded-lg border border-slate-200">
                        <table className="w-full divide-y divide-slate-200">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>Début</span>
                                </div>
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>Fin</span>
                                </div>
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  <span>Durée</span>
                                </div>
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span>Type</span>
                                </div>
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span>Raison</span>
                                </div>
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  <span>Actions</span>
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-200">
                            <AnimatePresence>
                              {suiviConges?.length ? (
                                suiviConges.map((conge) => {
                                  const employee = employees?.find((e) => e.id === selectedEmployee)
                                  const durationDays = calculateDuration(conge.date_debut, conge.date_fin)
                                  return (
                                    <motion.tr
                                      key={conge.id}
                                      initial={{ opacity: 0, backgroundColor: "#f0f9ff" }}
                                      animate={{ opacity: 1, backgroundColor: "#ffffff" }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="hover:bg-slate-50 transition-all duration-200"
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-slate-800 font-medium">{formatDate(conge.date_debut)}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-slate-600">{formatDate(conge.date_fin)}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-slate-600">
                                          {durationDays} {durationDays > 1 ? "jours" : "jour"}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getCongeTypeColor(
                                            conge.type_conge,
                                          )}`}
                                        >
                                          {conge.type_conge}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4">
                                        <div className="text-slate-600 line-clamp-2 max-w-xs">
                                          {conge.raison || "-"}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                        <div className="flex items-center gap-2">
                                          <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                              setEditingConge(conge)
                                              setShowSuivi(false)
                                            }}
                                            className="p-1.5 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all duration-200"
                                            disabled={isLoading}
                                            title="Modifier"
                                          >
                                            <Edit size={16} />
                                          </motion.button>
                                          <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setConfirmDelete(conge.id)}
                                            className="p-1.5 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 transition-all duration-200"
                                            disabled={isLoading}
                                            title="Supprimer"
                                          >
                                            <Trash2 size={16} />
                                          </motion.button>
                                          {employee && <GoogleCalendarButton conge={conge} employee={employee} />}
                                        </div>
                                      </td>
                                    </motion.tr>
                                  )
                                })
                              ) : (
                                <tr>
                                  <td colSpan={6} className="px-6 py-10 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-500">
                                      <CalendarDays className="h-10 w-10 text-slate-300 mb-2" />
                                      <p className="font-medium">Aucun congé enregistré pour cet employé</p>
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                          setShowSuivi(false)
                                          setShowForm(true)
                                        }}
                                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
                                      >
                                        <Plus className="h-4 w-4" />
                                        <span>Ajouter un congé</span>
                                      </motion.button>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </AnimatePresence>
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => setShowSuivi(false)}
                          className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all duration-200"
                          disabled={isLoading}
                        >
                          Fermer
                        </motion.button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal de confirmation de suppression */}
        <AnimatePresence>
          {confirmDelete !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4 text-rose-600">
                    <div className="p-2 bg-rose-100 rounded-full">
                      <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-xl font-semibold">Confirmer la suppression</h3>
                  </div>
                  <p className="text-slate-600 mb-6">
                    Êtes-vous sûr de vouloir supprimer ce congé ? Cette action est irréversible.
                  </p>
                  <div className="flex justify-end gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setConfirmDelete(null)}
                      className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all duration-200"
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => confirmDelete && handleDelete(confirmDelete)}
                      className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-lg shadow-sm transition-all duration-200"
                    >
                      Supprimer
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CongesManagement
