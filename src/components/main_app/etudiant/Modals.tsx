import AjoutEtudiant from "./AjoutEtudiant";
import PreviewUpload from "./AjoutExcel";

export interface ModalProps {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  showPage: boolean;
  setShowPage: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modals = ({
  showForm,
  setShowForm,
  showPage,
  setShowPage,
}: ModalProps) => {
  return (
    <>
      {/* Modal pour l'ajout d'un étudiant */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md max-h-screen overflow-y-auto pt-12 pb-6">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl font-bold focus:outline-none"
              aria-label="Fermer"
            >
              ×
            </button>
            <AjoutEtudiant />
          </div>
        </div>
      )}

      {/* Modal pour l'importation d'un fichier Excel */}
      {showPage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto pt-12 pb-6">
            <button
              onClick={() => setShowPage(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl font-bold focus:outline-none"
              aria-label="Fermer"
            >
              ×
            </button>
            <PreviewUpload />
          </div>
        </div>
      )}
    </>
  );
};

export default Modals;
