"use client"

import { useState } from "react"
import { useGetRapports, useGetRapportDetails, useDeleteRapport } from "../../../hooks/useRapportEcolage"
import { useNotifierEtudiant } from "../../../hooks/useNotification"
import Loading from "../../../components/Loading"
import type { RapportDetail, Paiement } from "../../../api/rapportEcolageApi"
import PaiementHistoriqueModal from "./PaiementHistoriqueModal"
import { toast } from "react-toastify"
import {
  ChevronDown,
  Mail,
  MessageSquare,
  FileText,
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
  BookOpen,
  User,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import classNames from "classnames"

const RapportFinancierList = () => {
  const [selectedRapportId, setSelectedRapportId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [paiementsEtudiant, setPaiementsEtudiant] = useState<Paiement[]>([])
  const [eleveNom, setEleveNom] = useState("")
  const [notificationEnCours, setNotificationEnCours] = useState<number | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null)

  const { data: rapports, isLoading } = useGetRapports()
  const { data: rapportDetails, isLoading: isDetailLoading } = useGetRapportDetails(selectedRapportId)
  const deleteRapport = useDeleteRapport()
  const notifierEtudiant = useNotifierEtudiant()

  const handleNotifierParent = (etudiant: RapportDetail, canal: "email" | "whatsapp") => {
    if (!etudiant.etudiant_id) {
      toast.error("ID élève manquant - impossible de notifier")
      return
    }

    setNotificationEnCours(etudiant.etudiant_id)
    setDropdownOpen(null)

    notifierEtudiant.mutate(
      { eleve_id: etudiant.etudiant_id, canal },
      {
        onSuccess: () => {
          toast.success(`Notification envoyée avec succès via ${canal === "email" ? "email" : "WhatsApp"}`)
        },
        onError: () => {
          toast.error(`Échec de l'envoi de la notification via ${canal === "email" ? "email" : "WhatsApp"}`)
        },
        onSettled: () => setNotificationEnCours(null),
      },
    )
  }

  const toggleDropdown = (etudiantId: number) => {
    setDropdownOpen(dropdownOpen === etudiantId ? null : etudiantId)
  }

  const handleDeleteRapport = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce rapport ?")) {
      deleteRapport.mutate(id, {
        onSuccess: () => {
          toast.success("Rapport supprimé avec succès")
          if (selectedRapportId === id) {
            setSelectedRapportId(null)
          }
        },
        onError: () => {
          toast.error("Échec de la suppression du rapport")
        },
      })
    }
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loading />
      </div>
    )

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-lg border border-gray-100"
    >
      <div className="flex items-center mb-8">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Rapports Financiers</h2>
      </div>

      <motion.div
        variants={tableVariants}
        initial="hidden"
        animate="visible"
        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
      >
        <table className="w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-4 font-medium text-gray-500">N°</th>
              <th className="p-4 font-medium text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  Année Scolaire
                </div>
              </th>
              <th className="p-4 font-medium text-gray-500">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                  Classe
                </div>
              </th>
              <th className="p-4 font-medium text-gray-500">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                  Mois
                </div>
              </th>
              <th className="p-4 font-medium text-gray-500">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  Envoyé par
                </div>
              </th>
              <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rapports?.map((rapport, index) => (
              <motion.tr
                key={rapport.id}
                variants={rowVariants}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 text-gray-500 font-medium">{index + 1}</td>
                <td className="p-4">{rapport.annee_scolaire_nom}</td>
                <td className="p-4">{rapport.classe_nom}</td>
                <td className="p-4">{rapport.mois}</td>
                <td className="p-4">{rapport.envoyeur_nom || "—"}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedRapportId(rapport.id!)}
                      disabled={isDetailLoading}
                      className={classNames(
                        "flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                        selectedRapportId === rapport.id
                          ? "bg-blue-100 text-blue-700"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-100",
                      )}
                    >
                      <FileText className="h-4 w-4 mr-1.5" />
                      {isDetailLoading && selectedRapportId === rapport.id ? "Chargement..." : "Détails"}
                    </button>
                    <button
                      onClick={() => handleDeleteRapport(rapport.id!)}
                      disabled={deleteRapport.isPending}
                      className="flex items-center px-3 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" />
                      {deleteRapport.isPending ? "Suppression..." : "Supprimer"}
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {rapports?.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Aucun rapport financier disponible</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      <AnimatePresence>
        {selectedRapportId && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                  <Users className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Détails du Rapport</h3>
              </div>
              <button
                onClick={() => setSelectedRapportId(null)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Fermer les détails"
              >
                <XCircle className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {isDetailLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loading />
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="p-3 font-medium text-gray-500">N°</th>
                      <th className="p-3 font-medium text-gray-500">Nom</th>
                      <th className="p-3 font-medium text-gray-500">Prénom</th>
                      <th className="p-3 font-medium text-gray-500">Statut</th>
                      <th className="p-3 font-medium text-gray-500">Total Payé</th>
                      <th className="p-3 font-medium text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rapportDetails?.map((etudiant, index) => {
                      const totalPaye = etudiant.paiements.reduce((acc, p) => acc + p.montant, 0)
                      const isPaid = etudiant.paiements.length > 0
                      const isNotifLoading = notificationEnCours === etudiant.etudiant_id
                      const isDropdown = dropdownOpen === etudiant.etudiant_id

                      return (
                        <motion.tr
                          key={etudiant.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 border-t transition-colors"
                        >
                          <td className="p-3 text-gray-500">{index + 1}</td>
                          <td className="p-3 font-medium">{etudiant.nom}</td>
                          <td className="p-3">{etudiant.prenom}</td>
                          <td className="p-3">
                            {isPaid ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Payé
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <XCircle className="h-3 w-3 mr-1" />
                                Non payé
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-medium">{totalPaye.toLocaleString()} Ar</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => {
                                  setPaiementsEtudiant(etudiant.paiements)
                                  setEleveNom(`${etudiant.nom} ${etudiant.prenom}`)
                                  setIsModalOpen(true)
                                }}
                                className="flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm transition-colors"
                              >
                                <FileText className="h-3.5 w-3.5 mr-1" />
                                Historique
                              </button>

                              <div className="relative">
                                <button
                                  onClick={() => toggleDropdown(etudiant.etudiant_id!)}
                                  className={classNames(
                                    "flex items-center px-2.5 py-1 rounded-md text-sm transition-colors",
                                    isNotifLoading
                                      ? "bg-gray-100 text-gray-400"
                                      : "bg-amber-50 text-amber-600 hover:bg-amber-100",
                                  )}
                                  disabled={isNotifLoading}
                                >
                                  {isNotifLoading ? (
                                    <>
                                      <div className="h-3 w-3 mr-1.5 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
                                      Envoi...
                                    </>
                                  ) : (
                                    <>
                                      Notifier
                                      <ChevronDown className="ml-1 h-3.5 w-3.5" />
                                    </>
                                  )}
                                </button>

                                <AnimatePresence>
                                  {isDropdown && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                      transition={{ duration: 0.15 }}
                                      className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200 overflow-hidden"
                                    >
                                      <button
                                        className="flex items-center px-4 py-2.5 text-sm w-full hover:bg-green-50 hover:text-green-700 transition-colors"
                                        onClick={() => handleNotifierParent(etudiant, "whatsapp")}
                                      >
                                        <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp
                                      </button>
                                      <button
                                        className="flex items-center px-4 py-2.5 text-sm w-full hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                        onClick={() => handleNotifierParent(etudiant, "email")}
                                      >
                                        <Mail className="mr-2 h-4 w-4" /> Email
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                    {rapportDetails?.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500">
                          <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p>Aucun détail disponible pour ce rapport</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <PaiementHistoriqueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        paiements={paiementsEtudiant}
        eleveNom={eleveNom}
      />
    </motion.div>
  )
}

export default RapportFinancierList
