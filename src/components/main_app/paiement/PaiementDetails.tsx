"use client"

import React, { useState, useEffect } from "react"
import { useGetPaiementsByStudent, useDeletePaiement, useUpdatePaiement } from "../../../hooks/usePaiement"
import {
  Pencil,
  Trash2,
  Check,
  X,
  Calendar,
  DollarSign,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader,
} from "lucide-react"
import FactureForm from "./FactureForm"
import "../../../../paiement-details.css"

interface PaiementDetailsProps {
  etudiantId: number
  etudiantNom: string
  etudiantPrenom: string
  onClose: () => void
}

const PaiementDetails: React.FC<PaiementDetailsProps> = ({ etudiantId, etudiantNom, etudiantPrenom, onClose }) => {
  const { data: paiements, isLoading, isError } = useGetPaiementsByStudent(etudiantId)
  const deletePaiement = useDeletePaiement()
  const updatePaiement = useUpdatePaiement()

  const [editId, setEditId] = useState<number | null>(null)
  const [editedPaiementData, setEditedPaiementData] = useState<any>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" })
  const [selectedPaiementForFacture, setSelectedPaiementForFacture] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState<"Ecolage" | "Certificat" | "Autre">("Ecolage")
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleDelete = (id: number) => {
    setIsDeleting(id)
    deletePaiement.mutate(id, {
      onSuccess: () => {
        setMessage({ text: "Paiement supprimé avec succès", type: "success" })
        setIsDeleting(null)
      },
      onError: () => {
        setMessage({
          text: "Ce paiement a déjà été envoyé à la direction et ne peut pas être supprimé.",
          type: "error",
        })
        setIsDeleting(null)
      },
    })
  }

  const confirmDelete = (id: number) => {
    const modal = document.getElementById("deleteModal")
    if (modal) {
      modal.classList.remove("hidden")
      modal.setAttribute("data-id", id.toString())
    }
  }

  const handleEditClick = (paiement: any) => {
    setEditId(paiement.id)
    setEditedPaiementData((prev: any) => ({
      ...prev,
      [paiement.id]: { ...paiement },
    }))
  }

  const handleCancelEdit = () => {
    setEditId(null)
  }

  const handleSave = () => {
    if (editId !== null && editedPaiementData[editId]) {
      setIsSaving(true)
      const paiementToUpdate = editedPaiementData[editId]
      const paiementPayload = {
        id: editId,
        etudiant: etudiantId,
        mois: paiementToUpdate.mois,
        montant: Number.parseFloat(paiementToUpdate.montant),
        modePaiement: paiementToUpdate.modePaiement,
        description: paiementToUpdate.description,
        categorie: paiementToUpdate.categorie,
        datePaiement: paiementToUpdate.datePaiement,
      }

      updatePaiement.mutate(paiementPayload, {
        onSuccess: () => {
          setEditId(null)
          setMessage({ text: "Paiement mis à jour avec succès", type: "success" })
          setIsSaving(false)
        },
        onError: () => {
          setMessage({
            text: "Ce paiement a déjà été envoyé à la direction et ne peut pas être modifié.",
            type: "error",
          })
          setIsSaving(false)
        },
      })
    }
  }

  const handleFactureClick = (paiement: any) => {
    if (selectedPaiementForFacture?.id === paiement.id) {
      setSelectedPaiementForFacture(null)
    } else {
      setSelectedPaiementForFacture(paiement)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, id: number) => {
    const { name, value } = e.target
    setEditedPaiementData((prev: any) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [name]: value,
      },
    }))
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  const getTabColor = (tab: string) => {
    switch (tab) {
      case "Ecolage":
        return "indigo"
      case "Certificat":
        return "purple"
      case "Autre":
        return "pink"
      default:
        return "indigo"
    }
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "Ecolage":
        return <DollarSign className="w-4 h-4" />
      case "Certificat":
        return <FileText className="w-4 h-4" />
      case "Autre":
        return <CreditCard className="w-4 h-4" />
      default:
        return <DollarSign className="w-4 h-4" />
    }
  }

  if (isLoading)
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-lg text-indigo-800 font-medium">Chargement des paiements...</p>
          <p className="text-sm text-gray-500 mt-2">Veuillez patienter un instant</p>
        </div>
      </div>
    )

  if (isError)
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <p className="text-xl text-red-700 font-bold">Erreur lors du chargement</p>
          <p className="text-gray-600 mt-2 mb-6">Impossible de récupérer les paiements de l'étudiant.</p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    )

  if (!paiements || paiements.length === 0)
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center">
          <Receipt className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-xl text-gray-700 font-bold">Aucun paiement trouvé</p>
          <p className="text-gray-500 mt-2 mb-6">Cet étudiant n'a pas encore effectué de paiement.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    )

  const ecolage = paiements.filter((p: any) => p.etudiant === etudiantId && p.categorie === "Ecolage")
  const certificat = paiements.filter((p: any) => p.etudiant === etudiantId && p.categorie === "Certificat")
  const autre = paiements.filter((p: any) => p.etudiant === etudiantId && p.categorie === "Autre")

  let filteredPaiements: any[] = []

  switch (activeTab) {
    case "Ecolage":
      filteredPaiements = ecolage
      break
    case "Certificat":
      filteredPaiements = certificat
      break
    case "Autre":
      filteredPaiements = autre
      break
    default:
      filteredPaiements = ecolage
  }

  if (searchTerm) {
    filteredPaiements = filteredPaiements.filter(
      (p) =>
        p.mois.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.modePaiement.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.montant.toString().includes(searchTerm),
    )
  }

  const totalPages = Math.ceil(filteredPaiements.length / itemsPerPage)
  const paginatedPaiements = filteredPaiements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalMontant = filteredPaiements.reduce((sum, p) => sum + Number.parseFloat(p.montant), 0)

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start pt-10 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden relative animate-scale-in">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white hover:text-indigo-200 transition-colors p-1 rounded-full hover:bg-white hover:bg-opacity-20"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-center">Historique des Paiements</h2>
          <p className="text-center text-indigo-100 mt-1">
            {etudiantPrenom} {etudiantNom}
          </p>
        </div>

        {/* Message de notification */}
        {message.text && (
          <div
            className={`absolute top-20 right-6 z-10 p-3 rounded-lg shadow-lg max-w-md animate-slide-in ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              <p>{message.text}</p>
            </div>
          </div>
        )}

        {/* Contenu principal avec défilement */}
        <div className="overflow-y-auto max-h-[calc(85vh-120px)] p-6">
          {/* Onglets de catégories */}
          <div className="flex border-b border-gray-200 mb-6">
            {["Ecolage", "Certificat", "Autre"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as "Ecolage" | "Certificat" | "Autre")
                  setCurrentPage(1)
                }}
                className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all duration-200 border-b-2 ${
                  activeTab === tab
                    ? `border-${getTabColor(tab)}-500 text-${getTabColor(tab)}-600`
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {getTabIcon(tab)}
                {tab}
                <span className="ml-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {tab === "Ecolage" ? ecolage.length : tab === "Certificat" ? certificat.length : autre.length}
                </span>
              </button>
            ))}
          </div>

          {/* Barre de recherche et informations */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 w-full md:w-64"
              />
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg">
              <DollarSign className={`w-5 h-5 text-${getTabColor(activeTab)}-500`} />
              <span className="text-gray-700">Total: </span>
              <span className={`font-bold text-${getTabColor(activeTab)}-600`}>{totalMontant.toLocaleString()} Ar</span>
            </div>
          </div>

          {/* Tableau des paiements */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full table-auto text-sm">
              <thead
                className={`bg-gradient-to-r from-${getTabColor(activeTab)}-500 to-${getTabColor(activeTab)}-600 text-white`}
              >
                <tr>
                  <th className="px-4 py-3 text-left">Mois</th>
                  <th className="px-4 py-3 text-left">Montant</th>
                  <th className="px-4 py-3 text-left">Mode</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPaiements.length > 0 ? (
                  paginatedPaiements.map((p: any, index: number) => (
                    <React.Fragment key={p.id}>
                      <tr
                        className={`border-b border-gray-100 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-${getTabColor(activeTab)}-50`}
                      >
                        <td className="px-4 py-3">
                          {editId === p.id ? (
                            <input
                              name="mois"
                              value={editedPaiementData[p.id]?.mois || ""}
                              onChange={(e) => handleChange(e, p.id)}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <Calendar className={`w-4 h-4 text-${getTabColor(activeTab)}-500`} />
                              <span>{p.mois}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editId === p.id ? (
                            <div className="relative">
                              <input
                                type="number"
                                name="montant"
                                value={editedPaiementData[p.id]?.montant || ""}
                                onChange={(e) => handleChange(e, p.id)}
                                className="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                              />
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Ar</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <DollarSign className={`w-4 h-4 text-${getTabColor(activeTab)}-500`} />
                              <span className="font-medium">{Number.parseFloat(p.montant).toLocaleString()} Ar</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editId === p.id ? (
                            <select
                              name="modePaiement"
                              value={editedPaiementData[p.id]?.modePaiement || ""}
                              onChange={(e) => handleChange(e, p.id)}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                            >
                              <option value="Espèces">Espèces</option>
                              <option value="Chèques">Chèques</option>
                              <option value="Mobile Money">Mobile Money</option>
                              <option value="Virement">Virement</option>
                            </select>
                          ) : (
                            <div className="flex items-center gap-2">
                              <CreditCard className={`w-4 h-4 text-${getTabColor(activeTab)}-500`} />
                              <span>{p.modePaiement}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">{formatDate(p.datePaiement)}</td>
                        <td className="px-4 py-3">
                          {editId === p.id ? (
                            <input
                              name="description"
                              value={editedPaiementData[p.id]?.description || ""}
                              onChange={(e) => handleChange(e, p.id)}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <FileText className={`w-4 h-4 text-${getTabColor(activeTab)}-500`} />
                              <span>{p.description || "-"}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center items-center gap-2">
                            {editId === p.id ? (
                              <>
                                <button
                                  onClick={handleSave}
                                  disabled={isSaving}
                                  className={`p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                                  title="Enregistrer"
                                >
                                  {isSaving ? (
                                    <Loader className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Check className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                  title="Annuler"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditClick(p)}
                                  className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                  title="Modifier"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(p.id)}
                                  disabled={isDeleting === p.id}
                                  className={`p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors ${isDeleting === p.id ? "opacity-50 cursor-not-allowed" : ""}`}
                                  title="Supprimer"
                                >
                                  {isDeleting === p.id ? (
                                    <Loader className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleFactureClick(p)}
                                  className={`p-1.5 rounded-lg ${selectedPaiementForFacture?.id === p.id ? "bg-indigo-500 text-white" : `bg-indigo-100 text-indigo-600 hover:bg-indigo-200`} transition-colors`}
                                  title="Facture"
                                >
                                  <Receipt className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Affichage du formulaire de facture si sélectionné */}
                      {selectedPaiementForFacture?.id === p.id && (
                        <tr>
                          <td colSpan={6}>
                            <div
                              className={`bg-${getTabColor(activeTab)}-50 border border-${getTabColor(activeTab)}-100 rounded-lg p-4 m-2 animate-fade-in`}
                            >
                              <FactureForm paiement={p} onClose={() => setSelectedPaiementForFacture(null)} />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Filter className="w-10 h-10 text-gray-300 mb-2" />
                        <p>Aucun résultat trouvé</p>
                        {searchTerm && (
                          <button onClick={() => setSearchTerm("")} className="mt-2 text-indigo-600 hover:underline">
                            Effacer la recherche
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredPaiements.length > itemsPerPage && (
            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Afficher</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="border rounded-md px-2 py-1 text-sm"
                >
                  {[5, 10, 20, 50].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-600">par page</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg mx-0.5 ${
                          currentPage === pageNum
                            ? `bg-${getTabColor(activeTab)}-500 text-white`
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="mx-1">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg mx-0.5 text-gray-600 hover:bg-gray-100"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaiementDetails