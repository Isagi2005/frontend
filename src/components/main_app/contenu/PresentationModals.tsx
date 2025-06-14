import { X } from "lucide-react";
import AjoutPresentation from "./AjoutPresentation";

export interface ClassModalProps {
  showPage: boolean;
  setShowPage: React.Dispatch<React.SetStateAction<boolean>>;
}

const PresentationModals = ({ showPage, setShowPage }: ClassModalProps) => {
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

            <AjoutPresentation />
          </div>
        </div>
      )}
    </>
  );
};

export default PresentationModals;
