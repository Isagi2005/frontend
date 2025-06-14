// certificatApi.ts
import api from './api';

interface CertificatData {
  etudiant_id: number;
  annee_scolaire: string;
  texte_certificat?: string;
}

export const generateCertificatText = async (etudiant: any) => {
  const data: CertificatData = {
    etudiant_id: etudiant.id,
    annee_scolaire: `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`
  };

  const response = await api.post("api/certificat/generer/", data);
  return response.data.texte_certificat;
};

export const exportCertificatDocx = async (etudiant: any, texteCertificat: string) => {
  const data: CertificatData = {
    etudiant_id: etudiant.id,
    texte_certificat: texteCertificat
  };

  const response = await api.post("api/certificat/export/", data, {
    responseType: 'blob' // Important pour les fichiers
  });
  
  // Créer un lien de téléchargement
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `certificat_${etudiant.nom}_${etudiant.prenom}.docx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};