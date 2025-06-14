import api from "./api";

export interface Paiement {
  id?: number;
  etudiant: number;
  mois: string;
  montant: number;
  modePaiement: string;
  categorie: string;
  description?: string;
  datePaiement?: string;
  effectuePar?: number | null;
}

export interface PaiementHistorique {
  nom: string;
  prenom: string;
  mois: string;
  status: "Payé" | "Non payé";
}

const paiementApi = {
  // Récupérer tous les paiements
  get: async (): Promise<Paiement[]> => {
    const { data } = await api.get("api/paiement/");
    return data;
  },

  // Récupérer paiements par étudiant
  getByStudent: async (etudiantId: number): Promise<Paiement[]> => {
    const { data } = await api.get(`api/paiement/?etudiant=${etudiantId}`);
    return data;
  },

  // Récupérer un paiement spécifique
  getOne: async (id: number): Promise<Paiement> => {
    const { data } = await api.get(`api/paiement/${id}/`);
    return data;
  },

  // Ajouter un paiement
  add: async (paiement: Paiement): Promise<Paiement> => {
    const { data } = await api.post("api/paiement/", paiement);
    return data;
  },

  // Modifier complètement un paiement (PUT)
  update: async (paiement: Paiement): Promise<Paiement> => {
    if (!paiement.id) throw new Error("L'ID est requis pour la mise à jour.");

    const { data } = await api.put(`api/paiement/${paiement.id}/`, {
      ...paiement,
      description: paiement.description || "",
      datePaiement: paiement.datePaiement || new Date().toISOString().split("T")[0],
      effectuePar: paiement.effectuePar ?? null,
    });
    return data;
  },

  // Modifier partiellement un paiement (PATCH)
  patch: async (paiement: Partial<Paiement> & { id: number }): Promise<Paiement> => {
    const { data } = await api.patch(`api/paiement/${paiement.id}/`, paiement);
    return data;
  },

  // Supprimer un paiement
  delete: async (id: number): Promise<void> => {
    await api.delete(`api/paiement/${id}/`);
  },

  // Récupérer historique des paiements
  getPaiementHistorique: async (
    classeId: number,
    annee: string,
    mois: string
  ): Promise<PaiementHistorique[]> => {
    const { data } = await api.get("api/paiement/historique/", {
      params: { classe_id: classeId, annee_scolaire: annee, mois },
    });
    return data;
  },

  // Envoyer le rapport de paiement
  envoyerRapport: async (
    classeId: number,
    annee: string,
    mois: string
  ): Promise<any> => {
    const { data } = await api.post("api/paiement/envoyer-rapport/", {
      classe_id: classeId,
      annee_scolaire: annee,
      mois,
    });
    return data;
  },
  // Ajouter plusieurs paiements
  addMultiple: async (paiements: Paiement[]): Promise<Paiement[]> => {
  const { data } = await api.post("api/paiement/multiple/", paiements);
  return data;
},

};

export default paiementApi;
