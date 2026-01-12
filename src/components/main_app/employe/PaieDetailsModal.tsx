"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useGetPaiesByEmploye, useUpdatePaie, useDeletePaie } from "../../../hooks/usePaie"
import type { Paie } from "../../../api/paieApi"
import { Pencil, Trash2, Check, X, FileText, DollarSign, Calendar, AlertCircle, Loader2 } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import FactureForm from "./FactureForm"
import { motion, AnimatePresence } from "framer-motion"

interface PaieDetailsProps {
  employeId: number
  employeNom: string
  employePrenom: string
  onClose: () => void
}

const PaieDetailsModal: React.FC<PaieDetailsProps> = ({ employeId, employeNom, employePrenom, onClose }) => {
  const queryClient = useQueryClient()

  const { data: paies, isLoading, isError } = useGetPaiesByEmploye(employeId)
  const updatePaieMutation = useUpdatePaie()
  const deletePaieMutation = useDeletePaie()

  const [editId, setEditId] = useState<number | null>(null)
  const [editedPaieData, setEditedPaieData] = useState<any>({})
  const [selectedPaieForFacture, setSelectedPaieForFacture] = useState<any | null>(null)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)

  // Fermer le modal avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  // Empêcher le scroll du body quand le modal est ouvert
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  // Effacer le message après 3 secondes
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleEditClick = (paie: Paie) => {
    setEditId(paie.id!)
    setEditedPaieData((prev: any) => ({
      ...prev,
      [paie.id!]: { mois: paie.mois, montant: paie.montant },
    }))
  }

  const handleCancelEdit = () => {
    setEditId(null)
  }

  const handleSave = async () => {
    if (editId !== null && editedPaieData[editId]) {
      try {
        const updatedData = editedPaieData[editId]
        await updatePaieMutation.mutateAsync({ id: editId, paie: updatedData })
        await queryClient.invalidateQueries({ queryKey: ["paies", employeId] })
        setMessage({ text: "Paiement mis à jour avec succès", type: "success" })
        setEditId(null)
      } catch (error) {
        setMessage({ text: "Erreur lors de la mise à jour", type: "error" })
      }
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deletePaieMutation.mutateAsync(id)
      await queryClient.invalidateQueries({ queryKey: ["paies", employeId] })
      setMessage({ text: "Paiement supprimé avec succès", type: "success" })
      setConfirmDelete(null)
    } catch (error) {
      setMessage({ text: "Erreur lors de la suppression", type: "error" })
    }
  }

  const handleFactureClick = (paie: Paie) => {
    if (selectedPaieForFacture?.id === paie.id) {
      setSelectedPaieForFacture(null)
    } else {
      setSelectedPaieForFacture(paie)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const { name, value } = e.target
    setEditedPaieData((prev: any) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [name]: name === "montant" ? Number.parseFloat(value) || 0 : value,
      },
    }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MG", {
      style: "currency",
      currency: "MGA",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Tri des données
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const getSortedData = () => {
    if (!paies) return []
    if (!sortConfig) return paies

    return [...paies].sort((a: any, b: any) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
  }

  const sortedData = getSortedData()

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null
    }
    return sortConfig.direction === "ascending" ? "↑" : "↓"
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
        <div className="min-h-screen px-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[85vh] overflow-hidden relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <DollarSign className="h-7 w-7" />
                Historique des paiements
              </h2>
              <p className="mt-1 opacity-90 font-medium">
                {employeNom} {employePrenom}
              </p>
            </div>

            {/* Notification */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`absolute top-20 right-6 z-50 px-4 py-3 rounded-lg shadow-lg ${
                    message.type === "success"
                      ? "bg-green-500 text-white"
                      : message.type === "error"
                        ? "bg-red-500 text-white"
                        : "bg-blue-500 text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {message.type === "success" ? (
                      <Check className="h-5 w-5" />
                    ) : message.type === "error" ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : (
                      <Calendar className="h-5 w-5" />
                    )}
                    <span>{message.text}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                  <p className="text-slate-600">Chargement des paiements...</p>
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center py-12 text-red-500">
                  <AlertCircle className="h-12 w-12 mb-4" />
                  <p className="font-medium">Erreur lors du chargement des données</p>
                  <button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["paies", employeId] })}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              ) : !paies || paies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <DollarSign className="h-12 w-12 mb-4 opacity-30" />
                  <p className="font-medium">Aucun paiement enregistré</p>
                  <p className="text-sm mt-1">Cet employé n'a pas encore reçu de paiement</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
                    <table className="w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                            onClick={() => requestSort("mois")}
                          >
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>Mois</span>
                              <span className="text-slate-400">{getSortIcon("mois")}</span>
                            </div>
                          </th>
                          <th
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                            onClick={() => requestSort("montant")}
                          >
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              <span>Montant</span>
                              <span className="text-slate-400">{getSortIcon("montant")}</span>
                            </div>
                          </th>
                          <th
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                            onClick={() => requestSort("datePaiement")}
                          >
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>Date de paiement</span>
                              <span className="text-slate-400">{getSortIcon("datePaiement")}</span>
                            </div>
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        <AnimatePresence>
                          {sortedData.map((paie: Paie) => (
                            <motion.tr
                              key={paie.id}
                              initial={{ opacity: 0, backgroundColor: "#f0f9ff" }}
                              animate={{ opacity: 1, backgroundColor: "#ffffff" }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className={`hover:bg-slate-50 ${
                                selectedPaieForFacture?.id === paie.id ? "bg-blue-50" : ""
                              }`}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editId === paie.id ? (
                                  <input
                                    name="mois"
                                    value={editedPaieData[paie.id!]?.mois || ""}
                                    onChange={(e) => handleChange(e, paie.id!)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                ) : (
                                  <div className="font-medium text-slate-900">{paie.mois}</div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editId === paie.id ? (
                                  <div className="relative">
                                    <DollarSign
                                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                                      size={16}
                                    />
                                    <input
                                      type="number"
                                      name="montant"
                                      value={editedPaieData[paie.id!]?.montant || ""}
                                      onChange={(e) => handleChange(e, paie.id!)}
                                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                ) : (
                                  <div className="text-slate-900 font-medium">{formatCurrency(paie.montant)}</div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-slate-500">{formatDate(paie.datePaiement || "")}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="flex items-center justify-center space-x-2">
                                  {editId === paie.id ? (
                                    <>
                                      <button
                                        onClick={handleSave}
                                        className="p-1.5 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                                        title="Enregistrer"
                                      >
                                        <Check size={18} />
                                      </button>
                                      <button
                                        onClick={handleCancelEdit}
                                        className="p-1.5 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                                        title="Annuler"
                                      >
                                        <X size={18} />
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => handleEditClick(paie)}
                                        className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                                        title="Modifier"
                                      >
                                        <Pencil size={18} />
                                      </button>
                                      <button
                                        onClick={() => setConfirmDelete(paie.id!)}
                                        className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                                        title="Supprimer"
                                      >
                                        <Trash2 size={18} />
                                      </button>
                                      <button
                                        onClick={() => handleFactureClick(paie)}
                                        className={`p-1.5 rounded-full transition-colors ${
                                          selectedPaieForFacture?.id === paie.id
                                            ? "bg-indigo-500 text-white"
                                            : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                                        }`}
                                        title="Générer une facture"
                                      >
                                        <FileText size={18} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>

                  {/* Facture section */}
                  <AnimatePresence>
                    {selectedPaieForFacture && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border border-indigo-200 rounded-lg bg-indigo-50 overflow-hidden"
                      >
                        <div className="bg-indigo-600 text-white px-6 py-3 flex items-center justify-between">
                          <h3 className="font-medium flex items-center gap-2">
                            <FileText size={18} />
                            Génération de facture
                          </h3>
                          <button
                            onClick={() => setSelectedPaieForFacture(null)}
                            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="p-6">
                          <FactureForm paie={selectedPaieForFacture} onClose={() => setSelectedPaieForFacture(null)} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Confirmation de suppression */}
      <AnimatePresence>
        {confirmDelete !== null && (
          <div className="fixed inset-0 z-[60] overflow-y-auto" onClick={() => setConfirmDelete(null)}>
            <div className="min-h-screen px-4 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto relative z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4 text-red-600">
                    <div className="p-2 bg-red-100 rounded-full">
                      <Trash2 size={24} />
                    </div>
                    <h3 className="text-xl font-semibold">Confirmer la suppression</h3>
                  </div>
                  <p className="text-slate-600 mb-6">
                    Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action est irréversible.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="px-4 py-2 border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => confirmDelete && handleDelete(confirmDelete)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  )
}

export default PaieDetailsModal
