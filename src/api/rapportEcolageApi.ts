import api from "./api";

// --- TYPES
export interface RapportPaiement {
  id?: number;
  classe: number;
  annee_scolaire: number;
  mois: string;
  message?: string;
  date_paiement?:string;
  date_envoi?: string;
  classe_nom?: string;
  annee_scolaire_nom?: string;
  envoyeur_nom?: string;
  statut_paiement?:string;
  contenu?: Record<string, unknown>; 
}

export interface Paiement {
  id: number;
  mois: string;
  modePaiement: string;
  datePaiement: string;
  categorie: string;
  description: string;
  montant: number;
  effectuePar: string;
}

export interface RapportDetail {
  id: number;
  etudiant_id: number;
  nom: string;
  prenom: string;
  classe: string;
  classe_id: number;
  statut: string;
  parent_email?: string;
  parent_nom?: string;
  paiements: Paiement[];
}


// --- API
const rapportApi = {
  get: async (): Promise<RapportPaiement[]> => {
    const { data } = await api.get("api/rapport-finance/") as { data: RapportPaiement[] };
    return data;
  },

  getDetails: async (id: number): Promise<RapportDetail[]> => {
    const { data } = await api.get(`api/rapport-finance/${id}/details/`) as { data: RapportDetail[] };
    return data;
  },

  add: async (rapport: RapportPaiement): Promise<RapportPaiement> => {
    const { data } = await api.post("api/rapport-finance/", rapport) as { data: RapportPaiement };
    return data;
  },

  delete: async (id: number) => {
    await api.delete(`api/rapport-finance/${id}/`);
  },

  deletePaiement: async (paiementId: number) => {
    await api.delete(`api/rapport-finance/paiement/${paiementId}/`);
  },

  updatePaiement: async (
    paiementId: number,
    data: Partial<Paiement>
  ): Promise<Paiement> => {
    const res = await api.patch(`api/rapport-finance/paiement/${paiementId}/`, data) as { data: Paiement };
    return res.data;
  },
};

export default rapportApi;
