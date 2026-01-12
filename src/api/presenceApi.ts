import api from "./api";

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

export interface VerificationResult {
  mode: "update" | "create";
  presences?: presenceEtudiantProfile[];
  students_without_presence?: Array<{
    id: string | number;
    prenom: string;
    nom: string;
    prenoms?: string;
    sexe?: string;
    religion?: string;
    adresse?: string;
    dateDeNaissance?: string;
    telephone?: string;
    email?: string;
    pere?: string;
    mere?: string;
    classe?: string | number;
    className?: string;
    parent?: string | number;
    parentX?: Record<string, unknown>;
    age?: string;
    image?: string | File | null;
    [key: string]: unknown;
  }>;
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
    return data as coursProfile[];
  },
  getPresenceEtudiant: async (): Promise<presenceEtudiantProfile[]> => {
    const { data } = await api.get("api/presEtudiant/");
    return data as presenceEtudiantProfile[];
  },
  getPresencePers: async (): Promise<presencePersonnelProfile[]> => {
    const { data } = await api.get("api/presPerso/");
    return data as presencePersonnelProfile[];
  },

  verification: async (cours_id: string): Promise<VerificationResult> => {
    const { data } = await api.get(`api/presence/verifier/${cours_id}`);
    return data as VerificationResult;
  },
  retrieve: async (
    id: string,
    endpoints: string
  ): Promise<
    coursProfile[] | presenceEtudiantProfile[] | presencePersonnelProfile[]
  > => {
    const { data } = await api.get(`api/${endpoints}/${id}/`);
    return data as coursProfile[] | presenceEtudiantProfile[] | presencePersonnelProfile[];
  },
  getGenerics: async (
    name: string,
    value: string
  ): Promise<presenceEtudiantProfile[]> => {
    const { data } = await api.get(`api/presEtudiant/?${name}=${value}`);
    return data as presenceEtudiantProfile[];
  },
  addCours: async (cours: coursProfile): Promise<coursProfile> => {
    const { data } = await api.post("api/cours/", cours);
    return data as coursProfile;
  },
  addPresEtudiant: async (
    dataPres: presenceEtudiantProfile
  ): Promise<presenceEtudiantProfile> => {
    const { data } = await api.post("api/presEtudiant/", dataPres);
    return data as presenceEtudiantProfile;
  },

  addPresPers: async (
    dataPres: presencePersonnelProfile
  ): Promise<presencePersonnelProfile> => {
    const { data } = await api.post("api/presPerso/", dataPres);
    return data as presencePersonnelProfile;
  },

  updateCours: async (dataPres: coursProfile): Promise<coursProfile> => {
    const { data } = await api.patch(`/api/cours/${dataPres.id}/`, dataPres);
    return data as coursProfile;
  },
  updatePresEtudiant: async (
    dataPres: presenceEtudiantProfile
  ): Promise<presenceEtudiantProfile> => {
    const { data } = await api.patch(
      `/api/presEtudiant/${dataPres.id}/`,
      dataPres
    );
    return data as presenceEtudiantProfile;
  },


  deleteCours: async (id: number): Promise<void> => {
    await api.delete(`/api/cours/${id}/`);
  },
};
export default presenceApi;
