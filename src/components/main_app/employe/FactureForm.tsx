import React, { useState } from "react";

interface FactureFormProps {
  paie: any;
  onClose: () => void;
}

const FactureForm: React.FC<FactureFormProps> = ({ paie, onClose }) => {
  const [montantTotal, setMontantTotal] = useState("");
  const [resteAPayer, setResteAPayer] = useState("");

  const handleDownload = () => {
    const content = `
-------------------------------------------------------
                ÉCOLE PRIVÉE RAITRA KIDZ
                  FACTURE DE PAIEMENT
-------------------------------------------------------

Nom et prénom     : ${paie.employe.nom ?? "À compléter"}
Poste             : ${paie.employe.poste ?? "N/A"}
Catégorie         : Salaire / Paie
Mois              : ${paie.mois}
Date de paiement  : ${new Date(paie.datePaiement).toLocaleDateString()}

Montant total     : ${montantTotal} Ar
Montant payé      : ${paie.montant} Ar
Reste à payer     : ${resteAPayer} Ar

Mode de paiement  : ${paie.modePaiement ?? "N/A"}
Description       : ${paie.description ?? "Aucune"}

-------------------------------------------------------
Signature et cachet de l'établissement

        
        
-------------------------------------------------------
    `;

    const blob = new Blob([content], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `facture-paie-${paie.id}.doc`;
    link.click();
  };

  return (
    <div className="mt-4 border-t pt-4 bg-white p-6 rounded shadow-md space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">🧾 Génération de la fiche de paie</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
        <div><strong>Mois:</strong> {paie.mois}</div>
        <div><strong>Date de paiement:</strong> {new Date(paie.datePaiement).toLocaleDateString()}</div>
        <div><strong>Montant payé:</strong> {paie.montant} Ar</div>
        <div><strong>Mode de paiement:</strong> {paie.modePaiement}</div>
        <div><strong>Description:</strong> {paie.description}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600">💰 Montant total</label>
          <input
            type="number"
            value={montantTotal}
            onChange={(e) => setMontantTotal(e.target.value)}
            placeholder="Ex: 250000"
            className="w-full mt-1 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">🧮 Reste à payer</label>
          <input
            type="number"
            value={resteAPayer}
            onChange={(e) => setResteAPayer(e.target.value)}
            placeholder="Ex: 20000"
            className="w-full mt-1 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button
          onClick={handleDownload}
          disabled={!montantTotal || !resteAPayer}
          className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          📄 Télécharger en Word
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default FactureForm;
