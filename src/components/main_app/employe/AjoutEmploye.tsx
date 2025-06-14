"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useAddEmploye, useDeleteEmploye, useGetEmployes, useUpdateEmploye } from "../../../hooks/useEmploye"
import type { Employe } from "../../../api/employeApi"
import {
  Pencil,
  Trash2,
  Search,
  PlusCircle,
  DollarSign,
  UserRound,
  Calendar,
  CreditCard,
  Briefcase,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  MoreHorizontal,
  X,
} from "lucide-react"
import PaieForm from "./PaieModalForm"
import PaieDetailsModal from "./PaieDetailsModal"
import { motion, AnimatePresence } from "framer-motion"

const initialState: Employe = {
  nom: "",
  prenom: "",
  date_naissance: "",
  cin: "",
  poste: "",
  salarie: undefined,
  dateEmbauche: "",
}

const EmployePage = () => {
  const [form, setForm] = useState<Employe>(initialState)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedEmployeId, setSelectedEmployeId] = useState<number | null>(null)
  const [showPaieForm, setShowPaieForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [showDropdown, setShowDropdown] = useState<number | null>(null)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  const { data: employes, isLoading } = useGetEmployes()
  const addEmploye = useAddEmploye()
  const updateEmploye = useUpdateEmploye()
  const deleteEmploye = useDeleteEmploye()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(null)
      setShowFilterDropdown(false)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateEmploye.mutate({ ...form, id: editingId })
    } else {
      addEmploye.mutate(form)
    }
    setForm(initialState)
    setEditingId(null)
    setShowModal(false)
  }

  const handleEdit = (emp: Employe) => {
    setForm(emp)
    setEditingId(emp.id || null)
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    deleteEmploye.mutate(id)
    setConfirmDelete(null)
  }

  const filtered =
    employes?.filter((emp) => `${emp.nom} ${emp.prenom} ${emp.poste}`.toLowerCase().includes(search.toLowerCase())) ||
    []

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR").format(date)
  }

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "-"
    return new Intl.NumberFormat("fr-MG", {
      style: "currency",
      currency: "MGA",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const toggleDropdown = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setShowDropdown(showDropdown === id ? null : id)
  }

  const toggleFilterDropdown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowFilterDropdown(!showFilterDropdown)
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
            <div className="p-6 pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <UserRound className="h-6 w-6 text-blue-600" />
                    Gestion des Employés
                  </h1>
                  <p className="text-slate-500 mt-1">Gérez vos employés et leurs informations</p>
                </div>
                <button
                  onClick={() => {
                    setForm(initialState)
                    setEditingId(null)
                    setShowModal(true)
                  }}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <PlusCircle size={18} /> Ajouter Employé
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                <div className="relative w-full sm:w-auto flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, prénom ou poste"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative">
                    <button
                      onClick={toggleFilterDropdown}
                      className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                    >
                      <Filter size={16} /> Filtrer
                    </button>
                    {showFilterDropdown && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-slate-200">
                        <div className="py-2 px-3 border-b border-slate-200 font-medium text-sm">Filtrer par poste</div>
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setSearch("")
                              setShowFilterDropdown(false)
                            }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                          >
                            Tous
                          </button>
                          {Array.from(new Set(employes?.map((emp) => emp.poste) || [])).map(
                            (poste) =>
                              poste && (
                                <button
                                  key={poste}
                                  onClick={() => {
                                    setSearch(poste)
                                    setShowFilterDropdown(false)
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                                >
                                  {poste}
                                </button>
                              ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
                    <Download size={16} /> Exporter
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-12 bg-slate-100 rounded-md animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 text-slate-700">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold">Nom & Prénom</th>
                        <th className="text-left py-3 px-4 font-semibold">CIN</th>
                        <th className="text-left py-3 px-4 font-semibold">Poste</th>
                        <th className="text-left py-3 px-4 font-semibold">Salaire</th>
                        <th className="text-left py-3 px-4 font-semibold">Date d'embauche</th>
                        <th className="text-center py-3 px-4 font-semibold">Paiement</th>
                        <th className="text-right py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <AnimatePresence>
                        {currentItems.length > 0 ? (
                          currentItems.map((emp) => (
                            <motion.tr
                              key={emp.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="hover:bg-slate-50 group"
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    {emp.nom.charAt(0)}
                                    {emp.prenom.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {emp.nom} {emp.prenom}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                      {emp.date_naissance ? formatDate(emp.date_naissance) : "Non spécifié"}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">{emp.cin || "-"}</td>
                              <td className="py-3 px-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                  {emp.poste || "Non spécifié"}
                                </span>
                              </td>
                              <td className="py-3 px-4">{formatCurrency(emp.salarie)}</td>
                              <td className="py-3 px-4">{formatDate(emp.dateEmbauche)}</td>
                              <td className="py-3 px-4 text-center">
                                <div className="flex justify-center gap-2">
                                  <button
                                    className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                                    onClick={() => {
                                      setSelectedEmployeId(emp.id!)
                                      setShowPaieForm(true)
                                    }}
                                  >
                                    <DollarSign size={16} />
                                    <span className="sr-only md:not-sr-only md:ml-2">Payer</span>
                                  </button>
                                  <button
                                    className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                                    onClick={() => {
                                      setSelectedEmployeId(emp.id!)
                                    }}
                                  >
                                    <Eye size={16} />
                                    <span className="sr-only md:not-sr-only md:ml-2">Voir</span>
                                  </button>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex justify-end">
                                  <div className="relative">
                                    <button
                                      onClick={(e) => toggleDropdown(e, emp.id!)}
                                      className="p-1.5 rounded-md hover:bg-slate-100 transition-colors"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                    {showDropdown === emp.id && (
                                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-slate-200">
                                        <div className="py-2 px-3 border-b border-slate-200 font-medium text-sm">
                                          Actions
                                        </div>
                                        <div className="py-1">
                                          <button
                                            onClick={() => {
                                              handleEdit(emp)
                                              setShowDropdown(null)
                                            }}
                                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                                          >
                                            <Pencil size={14} /> Modifier
                                          </button>
                                          <button
                                            onClick={() => {
                                              setConfirmDelete(emp.id!)
                                              setShowDropdown(null)
                                            }}
                                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
                                          >
                                            <Trash2 size={14} /> Supprimer
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="h-24 text-center">
                              <div className="flex flex-col items-center justify-center text-slate-500">
                                <Search size={48} strokeWidth={1} className="text-slate-300 mb-2" />
                                <p>Aucun employé trouvé</p>
                                <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {filtered.length > itemsPerPage && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-slate-500">
                    Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filtered.length)} sur{" "}
                    {filtered.length} employés
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className={`p-1.5 rounded-md border ${
                        currentPage === 1
                          ? "border-slate-200 text-slate-400 cursor-not-allowed"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1),
                      )
                      .map((page, i, arr) => (
                        <React.Fragment key={page}>
                          {i > 0 && arr[i - 1] !== page - 1 && <span className="text-slate-400">...</span>}
                          <button
                            className={`w-9 h-9 rounded-md ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "border border-slate-200 hover:bg-slate-50 text-slate-700"
                            }`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))}
                    <button
                      className={`p-1.5 rounded-md border ${
                        currentPage === totalPages
                          ? "border-slate-200 text-slate-400 cursor-not-allowed"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Modal ajout / édition employé */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 relative">
              <div className="p-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
                    {editingId ? <Pencil size={20} /> : <PlusCircle size={20} />}
                    {editingId ? "Modifier un employé" : "Ajouter un employé"}
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {editingId
                      ? "Modifiez les informations de l'employé ci-dessous."
                      : "Remplissez les informations pour ajouter un nouvel employé."}
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                      <input
                        type="text"
                        name="nom"
                        value={form.nom}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                      <input
                        type="text"
                        name="prenom"
                        value={form.prenom}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Date de naissance</label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="date"
                          name="date_naissance"
                          value={form.date_naissance || ""}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">CIN</label>
                      <div className="relative">
                        <CreditCard
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="text"
                          name="cin"
                          value={form.cin || ""}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Poste</label>
                      <div className="relative">
                        <Briefcase
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="text"
                          name="poste"
                          value={form.poste || ""}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Salaire</label>
                      <div className="relative">
                        <DollarSign
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="number"
                          name="salarie"
                          value={form.salarie || ""}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Date d'embauche</label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="date"
                          name="dateEmbauche"
                          value={form.dateEmbauche || ""}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {editingId ? "Mettre à jour" : "Ajouter"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation de suppression */}
        {confirmDelete !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-red-600 flex items-center gap-2 mb-4">
                  <Trash2 size={20} />
                  Confirmer la suppression
                </h2>
                <p className="text-slate-600 mb-6">
                  Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="px-4 py-2 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
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
            </div>
          </div>
        )}

        {/* Formulaire de paie */}
        {showPaieForm && selectedEmployeId && (
          <PaieForm employeId={selectedEmployeId} onClose={() => setShowPaieForm(false)} />
        )}

        {/* Détails de paie */}
        {selectedEmployeId && !showPaieForm && (
          <PaieDetailsModal employeId={selectedEmployeId} onClose={() => setSelectedEmployeId(null)} />
        )}
      </div>
    </div>
  )
}

export default EmployePage
