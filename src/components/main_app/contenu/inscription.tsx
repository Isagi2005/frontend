// components/InscriptionCard.tsx
import { useState } from "react";
import { DemandeType } from "../../../api/siteApi";
import { Mail, Phone, MapPin, Calendar, BookUser } from "lucide-react";
import { useDeleteInscription, useUpdateStatut } from "../../../hooks/useSite";
import { FaTrashAlt } from "react-icons/fa";

interface Props {
  demande: DemandeType;
}

const InscriptionCard: React.FC<Props> = ({ demande }) => {
  const useMutation = useUpdateStatut();
  const useDelete = useDeleteInscription();
  const handleChange = (status: DemandeType) => {
    const data = {
      id: status.id,
      statut: status.statut,
    };
    if (status.statut === "NL") {
      data.statut = "L";
    } else {
      data.statut = "NL";
    }
    useMutation.mutate(data);
  };
  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-5xl mx-auto border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-blue-700">
            {demande.nomEleve} {demande.prenomEleve}
          </h3>

          <span className="text-sm text-gray-500">
            <Calendar size={16} className="inline-block mr-1" />
            {demande.date}
          </span>
        </div>
        <div className="mb-1">
          <h4 className="mb-4 text-xl font-semibold text-black">
            née le {demande.dateNaissance}
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
          <p>
            <MapPin className="inline-block mr-2 text-blue-600" size={16} />
            <strong>Lieu:</strong> {demande.lieu}
          </p>
          <p>
            <Mail className="inline-block mr-2 text-blue-600" size={16} />
            <strong>Email:</strong> {demande.emailParent}
          </p>
          <p>
            <Phone className="inline-block mr-2 text-blue-600" size={16} />
            <strong>Contact Parent:</strong> {demande.contactParent}
          </p>
          <p>
            <BookUser className="inline-block mr-2 text-blue-600" size={16} />
            <strong>Classe demandée:</strong> {demande.classeDemande}
          </p>
        </div>
        <div className="flex">
          <div
            className="mx-2 my-2 bg-blue-500 w-44 h-7 rounded-md text-center hover:bg-blue-700"
            onClick={() => handleChange(demande)}
          >
            {demande.statut === "NL" ? (
              <button>Marquer comme lu</button>
            ) : (
              <button>Marquer comme non lu</button>
            )}
          </div>
          <div
            className="flex mx-2 my-2 rounded-md items-center w-30 h-7 hover:bg-red-600"
            onClick={() => useDelete.mutate(demande.id)}
          >
            <FaTrashAlt /> <div className="hover:cursor-pointer">Supprimer</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InscriptionCard;
