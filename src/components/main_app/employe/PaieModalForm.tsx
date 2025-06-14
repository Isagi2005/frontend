"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { PaieParams } from "../../../api/paieApi"
import { useCreatePaie } from "../../../hooks/usePaie"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, DollarSign, CreditCard, X, CheckCircle, AlertCircle } from "lucide-react"

interface Props {
  employeId: number
  onClose: () => void
}

const PaieModalForm = ({ employeId, onClose }: Props) => {
  const [form, setForm] = useState<PaieParams>({
    employe_id: employeId,
    mois: "",
    annee: new Date().getFullYear(),
    montant: 0,
    mode_paiement: "Espèce",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const createPaie = useCreatePaie()

  // Liste des mois en français
  const moisOptions = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ]

  // Années disponibles (année actuelle et les 5 précédentes)
  const currentYear = new Date().getFullYear()
  const anneeOptions = Array.from({ length: 6 }, (_, i) => currentYear - i)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "montant"
          ? Number.parseFloat(value) || 0
          : name === "annee"
            ? Number.parseInt(value, 10) || new Date().getFullYear()
            : value,
    }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MG", {
      style: "currency",
      currency: "MGA",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    console.log("Payload envoyé :", form)

    createPaie.mutate(form, {
      onSuccess: () => {
        setStatus("success")
        setTimeout(() => {
          onClose()
        }, 1500)
      },
      onError: () => {
        setStatus("error")
        setIsSubmitting(false)
      },
    })
  }

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
        <div className="min-h-screen px-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-auto relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                Enregistrer un paiement
              </h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors rounded-full p-1 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {status === "idle" && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Mois</label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                          size={18}
                        />
                        <select
                          name="mois"
                          value={form.mois}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        >
                          <option value="" disabled>
                            Sélectionnez un mois
                          </option>
                          {moisOptions.map((mois) => (
                            <option key={mois} value={mois}>
                              {mois}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Année</label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                          size={18}
                        />
                        <select
                          name="annee"
                          value={form.annee}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        >
                          {anneeOptions.map((annee) => (
                            <option key={annee} value={annee}>
                              {annee}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Montant</label>
                      <div className="relative">
                        <DollarSign
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                          size={18}
                        />
                        <input
                          type="number"
                          name="montant"
                          value={form.montant}
                          onChange={handleChange}
                          required
                          min="0"
                          step="any"
                          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {form.montant > 0 && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-500">
                            {formatCurrency(form.montant)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Mode de paiement</label>
                      <div className="relative">
                        <CreditCard
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                          size={18}
                        />
                        <select
                          name="mode_paiement"
                          value={form.mode_paiement}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        >
                          <option value="Espèce">Espèce</option>
                          <option value="Chèque">Chèque</option>
                          <option value="Virement">Virement</option>
                          <option value="Mobile Money">Mobile Money</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Traitement...
                        </>
                      ) : (
                        "Confirmer le paiement"
                      )}
                    </button>
                  </div>
                </form>
              )}

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-8 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Paiement enregistré</h3>
                  <p className="text-slate-500 mb-6">
                    Le paiement de {formatCurrency(form.montant)} pour {form.mois} {form.annee} a été enregistré avec
                    succès.
                  </p>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-8 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="h-10 w-10 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Erreur</h3>
                  <p className="text-slate-500 mb-6">
                    Une erreur est survenue lors de l'enregistrement du paiement. Veuillez réessayer.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Réessayer
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default PaieModalForm
