import api from "./api";

export interface Facture {
  id?: number;
  etudiant: number;
  montant: number;
  dateEmission: string; // Format YYYY-MM-DD
  description?: string;
  statut: "Payée" | "Impayée";
}

const factureApi = {
  getAll: async (): Promise<Facture[]> => {
    const { data } = await api.get("api/facture/");
    return data;
  },

  getOne: async (id: number): Promise<Facture> => {
    const { data } = await api.get(`api/facture/${id}/`);
    return data;
  },

  getByEtudiant: async (etudiantId: number): Promise<Facture[]> => {
    const { data } = await api.get(`api/facture/?etudiant=${etudiantId}`);
    return data;
  },

  add: async (facture: Facture): Promise<Facture> => {
    const { data } = await api.post("api/facture/", facture);
    return data;
  },

  update: async (facture: Facture): Promise<Facture> => {
    const { data } = await api.put(`api/facture/${facture.id}/`, facture);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`api/facture/${id}/`);
  },
};

export default factureApi;
