import React from "react";
import { RapportDetail } from "../../../api/rapportEcolageApi";

interface PaiementModalProps {
  etudiant: RapportDetail | null;
  onClose: () => void;
}

const PaiementModal: React.FC<PaiementModalProps> = ({ etudiant, onClose }) => {
  if (!etudiant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-lg font-semibold mb-4">
          Paiements de {etudiant.nom} {etudiant.prenom}
        </h2>

        {etudiant.paiements.length === 0 ? (
          <p>Aucun paiement enregistré.</p>
        ) : (
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Mois</th>
                <th className="p-2 border">Montant</th>
                <th className="p-2 border">Mode</th>
                <th className="p-2 border">Catégorie</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Effectué par</th>
              </tr>
            </thead>
            <tbody>
              {etudiant.paiements.map((paiement) => (
                <tr key={paiement.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{paiement.mois}</td>
                  <td className="p-2 border">{paiement.montant} Ar</td>
                  <td className="p-2 border">{paiement.modePaiement}</td>
                  <td className="p-2 border">{paiement.categorie}</td>
                  <td className="p-2 border">{paiement.description || "—"}</td>
                  <td className="p-2 border">
                    {new Date(paiement.datePaiement).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">{paiement.effectuePar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PaiementModal;
