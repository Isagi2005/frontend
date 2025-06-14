import React, { useState } from "react"
import { FileText, DollarSign, Calculator, X } from "lucide-react"

interface FactureFormProps {
  paiement: any
  onClose: () => void
}

const FactureForm: React.FC<FactureFormProps> = ({ paiement, onClose }) => {
  const [montantTotal, setMontantTotal] = useState("")
  const [resteAPayer, setResteAPayer] = useState("")

  const handleDownload = () => {
    const content = `
      ------------------------------------------
                École Privée Raitra Kidz
                  FACTURE DE PAIEMENT
      ------------------------------------------
      
      Nom & Prénom     : ${paiement.nom ?? "À compléter"}
      Catégorie        : ${paiement.categorie}
      Mois             : ${paiement.mois}

      Montant total    : ${montantTotal} Ar
      Montant payé     : ${paiement.montant} Ar
      Reste à payer    : ${resteAPayer} Ar
      
      Mode de paiement : ${paiement.modePaiement}
      Description      : ${paiement.description}

      ------------------------------------------
                        
                Signature et cachet :
      
      
      
      ------------------------------------------

      
    `
    const blob = new Blob([content], { type: "application/msword" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `facture-${paiement.id}.doc`
    link.click()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in px-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg animate-scale-in overflow-hidden">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-4 text-white flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Génération de facture
          </h2>
          <button onClick={onClose} className="hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Détails */}
        <div className="p-6 space-y-4 text-sm text-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <p><strong>Nom & Prénom:</strong> {paiement.nom ?? "À compléter"}</p>
            <p><strong>Catégorie:</strong> {paiement.categorie}</p>
            <p><strong>Mois:</strong> {paiement.mois}</p>
            <p><strong>Montant payé:</strong> {paiement.montant} Ar</p>
            <p><strong>Mode de paiement:</strong> {paiement.modePaiement}</p>
            <p><strong>Description:</strong> {paiement.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="flex items-center text-sm text-gray-600 gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                Montant total
              </label>
              <input
                type="number"
                value={montantTotal}
                onChange={(e) => setMontantTotal(e.target.value)}
                placeholder="Ex: 100000"
                className="w-full px-3 py-2 border-2 border-green-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="flex items-center text-sm text-gray-600 gap-2 mb-1">
                <Calculator className="w-4 h-4 text-green-600" />
                Reste à payer
              </label>
              <input
                type="number"
                value={resteAPayer}
                onChange={(e) => setResteAPayer(e.target.value)}
                placeholder="Ex: 20000"
                className="w-full px-3 py-2 border-2 border-green-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
          
            <button
              onClick={handleDownload}
              disabled={!montantTotal || !resteAPayer}
              className={`px-5 py-2 rounded text-white font-medium transition ${
                !montantTotal || !resteAPayer
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              📄 Télécharger en Word
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FactureForm
