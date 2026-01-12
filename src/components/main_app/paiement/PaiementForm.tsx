"use client"

import type React from "react"
import { useState } from "react"
import { useAddPaiement } from "../../../hooks/usePaiement"
import {
  Calendar,
  DollarSign,
  CreditCard,
  Tag,
  FileText,
  CheckCircle,
  X,
  AlertTriangle,
  CalendarIcon,
} from "lucide-react"
import "../../../../paiement-form.css"

interface PaiementFormProps {
  etudiantId: number
  etudiantNom: string
  etudiantPrenom: string
  onClose: () => void
}

const ALL_MONTHS = [
  "JANVIER", "FEVRIER", "MARS", "AVRIL", "MAI", "JUIN",
  "JUILLET", "AOÛT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DECEMBRE"
]

const PaiementForm: React.FC<PaiementFormProps> = ({ etudiantId, etudiantNom, etudiantPrenom, onClose }) => {
  const { mutate: createPaiement, isPending } = useAddPaiement()

  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  const [formData, setFormData] = useState({
    montant: "",
    modePaiement: "Espèces",
    categorie: "Ecolage",
    description: "",
    datePaiement: new Date().toISOString().slice(0, 10),
  })

  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleMonthChange = (month: string) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter((m) => m !== month))
    } else {
      setSelectedMonths([...selectedMonths, month])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (selectedMonths.length === 0) {
      setFormError("Veuillez sélectionner au moins un mois")
      return
    }

    if (!formData.montant) {
      setFormError("Veuillez saisir un montant")
      return
    }

    let successCount = 0
    selectedMonths.forEach((mois) => {
      createPaiement(
        {
          etudiant: etudiantId,
          mois,
          ...formData,
          montant: parseFloat(formData.montant),
        },
        {
          onSuccess: () => {
            successCount += 1
            if (successCount === selectedMonths.length) {
              setFormSuccess(true)
              setTimeout(onClose, 1500)
            }
          },
          onError: () => {
            setFormError("Erreur lors de l’enregistrement du paiement")
          },
        }
      )
    })
  }

  const formatMonth = (month: string) => month.charAt(0) + month.slice(1).toLowerCase()

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <button onClick={onClose} className="hover:text-indigo-100 p-1 rounded-full hover:bg-white hover:bg-opacity-20">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-center">Nouveau Paiement</h2>
            <div className="w-5" />
          </div>
        </div>

        <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <CalendarIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-indigo-600">Étudiant</p>
              <p className="font-semibold text-gray-800">{etudiantPrenom} {etudiantNom}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {formSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Paiement effectué avec succès!</h3>
              <p className="text-gray-600">
                Le paiement a été enregistré pour {etudiantPrenom} {etudiantNom}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <p className="text-sm">{formError}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  Mois à payer
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ALL_MONTHS.map((month) => (
                    <label key={month} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedMonths.includes(month)}
                        onChange={() => handleMonthChange(month)}
                        className="accent-indigo-600"
                      />
                      <span>{formatMonth(month)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-indigo-500" />
                    Montant <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      name="montant"
                      value={formData.montant}
                      onChange={handleInputChange}
                      className="w-full border-2 border-indigo-100 rounded-lg pl-8 pr-3 py-2.5"
                      placeholder="0.00"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">AR</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-indigo-500" />
                    Mode de paiement
                  </label>
                  <select
                    name="modePaiement"
                    value={formData.modePaiement}
                    onChange={handleInputChange}
                    className="w-full border-2 border-indigo-100 rounded-lg px-3 py-2.5"
                  >
                    <option value="Espèces">Espèces</option>
                    <option value="Chèques">Chèque</option>
                    <option value="Virement">Virement</option>
                    <option value="Mobile Money">Mobile Money</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-indigo-500" />
                    Catégorie
                  </label>
                  <select
                    name="categorie"
                    value={formData.categorie}
                    onChange={handleInputChange}
                    className="w-full border-2 border-indigo-100 rounded-lg px-3 py-2.5"
                  >
                    <option value="Ecolage">Écolage</option>
                    <option value="Certificat">Certificat</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    Date de paiement
                  </label>
                  <input
                    type="date"
                    name="datePaiement"
                    value={formData.datePaiement}
                    onChange={handleInputChange}
                    className="w-full border-2 border-indigo-100 rounded-lg px-3 py-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full border-2 border-indigo-100 rounded-lg px-3 py-2.5"
                  placeholder="Informations complémentaires (optionnel)"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all"
                >
                  {isPending ? "Enregistrement..." : "Confirmer le paiement"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaiementForm
