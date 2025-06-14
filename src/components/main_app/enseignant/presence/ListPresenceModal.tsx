import { X } from "lucide-react";
import { coursProfile } from "../../../../api/presenceApi";
import { useGetGenerics } from "../../../../hooks/usePresence";
import UpdatePres from "./UpdatePres";

export interface ModalProps {
  showPage: boolean;
  setShowPage: React.Dispatch<React.SetStateAction<boolean>>;
  cour: coursProfile;
}

const ListPresenceModal = ({ showPage, setShowPage, cour }: ModalProps) => {
  const { data, isLoading, isError } = useGetGenerics("cours", cour.id);
  // Filtrer les présences pour n'afficher que celles du cours sélectionné
  const filteredData = Array.isArray(data) ? data.filter((p) => p.cours === cour.id) : [];
  return (
    <>
      {/* Modal pour l'importation d'un fichier Excel */}

      {showPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300">
          <div className="relative bg-white w-full max-w-3xl mx-4 sm:mx-auto rounded-2xl shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
            {/* Bouton de fermeture en haut à droite */}
            <button
              onClick={() => setShowPage(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
              aria-label="Fermer"
            >
              <X size={24} />
            </button>

            {isLoading ? (
              "Chargement..."
            ) : isError ? (
              <div className="text-red-500">Erreur lors du chargement des présences</div>
            ) : (
              <UpdatePres displayedData={filteredData} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ListPresenceModal;
