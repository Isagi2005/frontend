import api from "./api";
import { StudentProfile } from "./studentApi";

export type statut = "P" | "A" | "R";

export interface coursProfile {
  id: string;
  enseignant: string;
  matiere: string;
  classe: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  matiereNom: string;
  dateFormatte: string;
  classeNom: string;
  enseignantNom: string;
}

export interface presenceEtudiantProfile {
  id: string;
  etudiant: string | number;
  cours: string;
  statut: statut;
  heureA: string;
  raison: string;
  etudiantName: string;
  coursName: string;
}

export interface presencePersonnelProfile {
  id: string;
  statut: statut;
  date: string;
  heureA: string;
  raison: string;
}

const presenceApi = {
  updateStatut: async (id: string, data: { statut: statut; raison?: string }) => {
    const { data: res } = await api.patch(`api/presence/statut/${id}/`, data);
    return res;
  },

  deleteInscription: async (id: string) => {
    await api.delete(`api/inscription/${id}/`);
  },
  getCours: async (): Promise<coursProfile[]> => {
    const { data } = await api.get("api/cours/");
    return data;
  },
  getPresenceEtudiant: async (): Promise<presenceEtudiantProfile[]> => {
    const { data } = await api.get("api/presEtudiant/");
    return data;
  },
  getPresencePers: async (): Promise<presencePersonnelProfile[]> => {
    const { data } = await api.get("api/presPerso/");
    return data;
  },

  verification: async (cours_id: string) => {
    const { data } = await api.get(`api/presence/verifier/${cours_id}`);
    return data;
  },
  retrieve: async (
    id: string,
    endpoints: string
  ): Promise<
    coursProfile[] | presenceEtudiantProfile[] | presencePersonnelProfile[]
  > => {
    const { data } = await api.get(`api/${endpoints}/${id}/`);
    return data;
  },
  getGenerics: async (
    name: string,
    value: string
  ): Promise<presenceEtudiantProfile[]> => {
    const { data } = await api.get(`api/presEtudiant/?${name}=${value}`);
    return data;
  },
  addCours: async (cours: coursProfile): Promise<coursProfile> => {
    const { data } = await api.post("api/cours/", cours);
    return data;
  },
  addPresEtudiant: async (
    dataPres: presenceEtudiantProfile
  ): Promise<presenceEtudiantProfile> => {
    const { data } = await api.post("api/presEtudiant/", dataPres);
    return data;
  },

  addPresPers: async (
    dataPres: presencePersonnelProfile
  ): Promise<presencePersonnelProfile> => {
    const { data } = await api.post("api/presPerso/", dataPres);
    return data;
  },

  updateCours: async (dataPres: coursProfile): Promise<coursProfile> => {
    const { data } = await api.patch(`/api/cours/${dataPres.id}/`, dataPres);
    return data;
  },
  updatePresEtudiant: async (
    dataPres: presenceEtudiantProfile
  ): Promise<presenceEtudiantProfile> => {
    const { data } = await api.patch(
      `/api/presEtudiant/${dataPres.id}/`,
      dataPres
    );
    return data;
  },


  deleteCours: async (id: number): Promise<void> => {
    await api.delete(`/api/cours/${id}/`);
  },
};
export default presenceApi;
