import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Paiement } from "../../../api/rapportEcolageApi";
import { useUpdatePaiement, useDeletePaiement } from "../../../hooks/useRapportEcolage";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  paiements: Paiement[];
  eleveNom: string;
}

const PaiementHistoriqueModal: React.FC<Props> = ({ isOpen, onClose, paiements, eleveNom }) => {
  const [editId, setEditId] = useState<number | null>(null);
  const [editedPaiementData, setEditedPaiementData] = useState<Record<number, Partial<Paiement>>>({});
  const [message, setMessage] = useState<string>("");

  const { mutate: updatePaiement } = useUpdatePaiement();
  const { mutate: deletePaiement } = useDeletePaiement();

  const handleEditClick = (paiement: Paiement) => {
    setEditId(paiement.id!);
    setEditedPaiementData((prev) => ({
      ...prev,
      [paiement.id!]: { ...paiement },
    }));
  };

  const handleCancelEdit = () => {
    setEditId(null);
  };

  const handleSave = () => {
    if (editId !== null) {
      const updatedData = editedPaiementData[editId];
      if (!updatedData) return;
  
      updatePaiement(
        { id: editId, data: updatedData },   // <-- mutationFn attend { id, data }
        {
          onSuccess: () => {
            setEditId(null);
            setMessage("Paiement mis à jour avec succès !");
          },
          onError: () => {
            setMessage("Erreur lors de la mise à jour du paiement.");
          },
        }
      );
    }
  };
  const handleDelete = (id: number) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce paiement ?")) {
      deletePaiement(id, {
        onSuccess: () => {
          setMessage("Paiement supprimé avec succès !");
        },
        onError: () => {
          setMessage("Erreur lors de la suppression du paiement.");
        },
      });
    }
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, id: number) => {
    const { name, value } = e.target;
    setEditedPaiementData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [name]: name === "montant" ? Number(value) : value,
      },
    }));
  };

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

          {message && (
            <div className="text-center text-green-600 mb-4">{message}</div>
          )}

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
                  {/* <th className="border px-3 py-2">Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {paiements.map((p) => (
                  <tr key={p.id} className="text-center even:bg-gray-50">
                    <td className="border px-2 py-2">
                      {editId === p.id ? (
                        <input
                          name="mois"
                          value={editedPaiementData[p.id!]?.mois || ""}
                          onChange={(e) => handleChange(e, p.id!)}
                          className="w-24 px-2 py-1 border rounded"
                        />
                      ) : (
                        p.mois
                      )}
                    </td>
                    <td className="border px-2 py-2">
                      {editId === p.id ? (
                        <input
                          type="number"
                          name="montant"
                          value={editedPaiementData[p.id!]?.montant || ""}
                          onChange={(e) => handleChange(e, p.id!)}
                          className="w-24 px-2 py-1 border rounded"
                        />
                      ) : (
                        formatMontant(p.montant)
                      )}
                    </td>
                    <td className="border px-2 py-2">
                      {editId === p.id ? (
                        <select
                          name="modePaiement"
                          value={editedPaiementData[p.id!]?.modePaiement || ""}
                          onChange={(e) => handleChange(e, p.id!)}
                          className="w-full px-2 py-1 border rounded"
                        >
                          <option value="Espèce">Espèce</option>
                          <option value="Chèques">Chèques</option>
                          <option value="Mobile Money">Mobile Money</option>
                          <option value="Virement">Virement</option>
                        </select>
                      ) : (
                        p.modePaiement
                      )}
                    </td>
                    <td className="border px-2 py-2">{p.categorie}</td>
                    <td className="border px-2 py-2">
                      {editId === p.id ? (
                        <textarea
                          name="description"
                          value={editedPaiementData[p.id!]?.description || ""}
                          onChange={(e) => handleChange(e, p.id!)}
                          className="w-full px-2 py-1 border rounded"
                        />
                      ) : (
                        p.description || "-"
                      )}
                    </td>
                    <td className="border px-2 py-2">{p.datePaiement}</td>
                    {/* <td className="border px-2 py-2 flex justify-center items-center gap-2">
                      {editId === p.id ? (
                        <>
                          <button onClick={handleSave} className="text-green-600 hover:text-green-800" title="Enregistrer">
                            <Check size={18} />
                          </button>
                          <button onClick={handleCancelEdit} className="text-gray-600 hover:text-gray-800" title="Annuler">
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditClick(p)} className="text-blue-500 hover:text-blue-700" title="Modifier">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => handleDelete(p.id!)} className="text-red-500 hover:text-red-700" title="Supprimer">
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </td> */}
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
