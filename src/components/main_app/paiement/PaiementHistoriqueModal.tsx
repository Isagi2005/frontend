import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { Paiement } from "../../../api/rapportEcolageApi";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  paiements: Paiement[];
  eleveNom: string;
}

const PaiementHistoriqueModal: React.FC<Props> = ({ isOpen, onClose, paiements, eleveNom }) => {
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + " Ar";
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 bg-black bg-opacity-30">
        <Dialog.Panel className="w-full max-w-5xl p-6 bg-white rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Historique des paiements - {eleveNom}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-red-600">
              <X />
            </button>
          </div>

          
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm border border-gray-300 rounded-lg shadow">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border px-3 py-2">Mois</th>
                  <th className="border px-3 py-2">Montant</th>
                  <th className="border px-3 py-2">Mode Paiement</th>
                  <th className="border px-3 py-2">Catégorie</th>
                  <th className="border px-3 py-2">Description</th>
                  <th className="border px-3 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {paiements.map((p) => (
                  <tr key={p.id} className="text-center even:bg-gray-50">
                    <td className="border px-2 py-2">{p.mois}</td>
                    <td className="border px-2 py-2">{formatMontant(p.montant)}</td>
                    <td className="border px-2 py-2">{p.modePaiement}</td>
                    <td className="border px-2 py-2">{p.categorie}</td>
                    <td className="border px-2 py-2">{p.description}</td>
                    <td className="border px-2 py-2">{p.datePaiement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PaiementHistoriqueModal;
