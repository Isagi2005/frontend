import React from "react";
import DOMPurify from "dompurify";
import { exportCertificatDocx } from "../../../api/certificatApi";

interface CertificatPreviewProps {
  content: string;
  etudiant: {
    id: number;
    nom: string;
    prenom: string;
    [key: string]: unknown;
  };
  onClose: () => void;
}

const CertificatPreview: React.FC<CertificatPreviewProps> = ({ 
  content, 
  etudiant,
  onClose 
}) => {
  const handleDownloadDocx = async () => {
    try {
      await exportCertificatDocx(etudiant, content);
    } catch (err) {
      alert("Erreur lors du téléchargement du document Word");
      console.error(err);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>Certificat de Scolarité</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 2cm;
              line-height: 1.6;
            }
            .header-container {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 1em;
            }
            .logo {
              width: 100px;
            }
            .title {
              text-align: center;
              flex-grow: 1;
            }
            .signature {
              margin-top: 3em;
              text-align: right;
            }
            .content {
              margin-top: 1.5em;
              text-align: justify;
            }
          </style>
        </head>
        <body>
          <div class="header-container">
            <div class="logo">
              <h3>RAITRA KIDZ</h3>
              <!-- Vous pouvez remplacer par une balise img si vous avez un logo -->
              <img src="assets/Logo1.png" alt="RAITRA KIDZ" class="logo">
            </div>
            <div class="title">
              <h2>CERTIFICAT DE SCOLARITÉ</h2>
            </div>
          </div>
          
          <div class="content">
            ${content}
          </div>
          
          <div class="signature">
            <p>Signature et cachet de la direction</p>
            <p>Madame la Directrice</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative max-h-[90vh] flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-emerald-600">
          Aperçu du Certificat de Scolarité
        </h2>

        <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 border border-gray-200 rounded">
          {/* Nouvelle structure d'en-tête */}
          <div className="flex justify-between items-start mb-4">
            <div className="text-left">
              <h3 className="font-bold">RAITRA KIDZ</h3>
              <p className="text-sm">By Pass Alasora</p>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">CERTIFICAT DE SCOLARITÉ</h2>
            </div>
          </div>
          
          {/* Contenu du certificat */}
          <div 
            className="text-justify mt-4" 
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(content) 
            }} 
          />
          
          {/* Signature */}
          <div className="mt-8 text-right">
            <p>Fait à Antananarivo, le {new Date().toLocaleDateString('fr-FR')}</p>
            <p className="mt-4">Signature et cachet de la direction</p>
            <p>Madame la Directrice</p>
          </div>
        </div>

        <div className="flex justify-between mt-4 flex-wrap gap-2">
          <button
            onClick={handleDownloadDocx}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Télécharger (Word)
          </button>
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Imprimer
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificatPreview;