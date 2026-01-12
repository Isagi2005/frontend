import api from "./api";

export interface Paie {
  id?: number;
  employe_id: number;
  mois: string;
  annee: number;
  montant: number;
  datePaiement?: string;
  employe_nom?: string;
  employe_prenom?: string;
  mode_paiement: string; 
}

export interface PaieParams {
  employe_id: number;
  mois: string;
  annee: number;
  montant: number;
  mode_paiement: string; 
}

const paieApi = {
  create: async (paie: PaieParams): Promise<Paie> => {
    const { data } = await api.post("api/paie/", paie);
    return data as Paie;
  },

  getByEmploye: async (employeId: number): Promise<Paie[]> => {
    const { data } = await api.get(`api/paie/?employe_id=${employeId}`);
    return data as Paie[];
  },
  update: async (id: number, paie: Partial<PaieParams>): Promise<Paie> => {
    const { data } = await api.patch(`api/paie/${id}/`, paie);
    return data as Paie;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`api/paie/${id}/`);
  },
  
};

export default paieApi;
