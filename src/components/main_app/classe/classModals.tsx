import AjoutClasse from "./AjoutClasse";

export interface ClassModalProps {
  showPage: boolean;
  setShowPage: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClassModals = ({ showPage, setShowPage }: ClassModalProps) => {
  return (
    <>
      {/* Modal pour l'importation d'un fichier Excel */}
      {showPage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-4xl h-96 overflow-y-auto">
            <AjoutClasse />
            <div className="flex justify-center">
              <button
                onClick={() => setShowPage(false)}
                className="mt-4 w-40 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition"
              >
                X Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClassModals;
