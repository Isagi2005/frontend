import React, { useState } from "react";
import api from "../../../api/api";
import { SheetPreview } from "../../../api/studentApi";

interface PreviewResponse {
  preview: SheetPreview[];
}

const PreviewUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<SheetPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isPreviewResponse = (data: unknown): data is PreviewResponse => {
    return typeof data === 'object' && data !== null && 'preview' in data;
  };

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const response = (error as { response?: { data?: { error?: string } } }).response;
      return response?.data?.error || "Erreur lors de l'upload.";
    }
    return "Erreur lors de l'upload.";
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      if (
        !selectedFile.name.endsWith(".xls") &&
        !selectedFile.name.endsWith(".xlsx")
      ) {
        setErrorMessage(
          "Veuillez sélectionner un fichier Excel (.xls ou .xlsx)."
        );
        setFile(null);
      } else {
        setErrorMessage(null);
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setErrorMessage(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/preview-excel/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data || !isPreviewResponse(response.data)) {
        throw new Error("Réponse invalide du serveur");
      }

      setPreviewData(response.data.preview);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
      console.error("Erreur de l'upload :", error);
    }
    setLoading(false);
  };

  const handleConfirmUpload = async () => {
    try {
      await api.post("/upload-excel/", {
        students: previewData.flatMap((sheet) => sheet.data),
      });
      alert("Données enregistrées avec succès !");
      setPreviewData([]);
    } catch (error) {
      setErrorMessage("Erreur lors de l'enregistrement des données.");
      console.error("Erreur lors de l'enregistrement :", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Upload Section */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Importer un fichier Excel
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".xls,.xlsx"
            className="w-40 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className={`${
              !file || loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-teal-500 hover:bg-teal-600"
            } text-white font-medium py-2 px-4 rounded-lg transition duration-300 ml-4`}
          >
            {loading ? "Chargement..." : "Prévisualiser"}
          </button>
          {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
        </div>

        {/* Preview Section */}
        {previewData.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Aperçu des Données
            </h2>
            {previewData.map((sheet, index) => (
              <div key={index} className="mb-6">
                <h3 className="font-semibold text-teal-600 text-lg mb-2">
                  Feuille : {sheet.sheet}
                </h3>
                <div className="overflow-x-auto">
                  <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="border border-gray-300 px-4 py-2">
                          Nom
                        </th>
                        <th className="border border-gray-300 px-4 py-2">
                          Prénom
                        </th>
                        <th className="border border-gray-300 px-4 py-2">
                          Date de Naissance
                        </th>
                        <th className="border border-gray-300 px-4 py-2">
                          Sexe
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sheet.data.map((student, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">
                            {student.nom}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {student.prenoms}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {student.dateDeNaissance}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {student.sexe}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            <button
              onClick={handleConfirmUpload}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
            >
              Confirmer et Enregistrer
            </button>
          </div>
        )}

        {/* Liste des étudiants */}
      </div>
    </div>
  );
};

export default PreviewUpload;
