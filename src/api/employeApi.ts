import api from "./api";

export interface Employe {
  id?: number;
  nom: string;
  prenom: string;
  date_naissance?: string;
  cin?: string;
  poste?: string;
  salarie?: number;
  dateEmbauche?: string;
}

const employeApi = {
  get: async (): Promise<Employe[]> => {
    const { data } = await api.get("api/employee/");
    return data as Employe[];
  },

  getOne: async (id: number): Promise<Employe> => {
    const { data } = await api.get(`api/employee/${id}/`);
    return data as Employe;
  },

  add: async (employe: Employe): Promise<Employe> => {
    const { data } = await api.post("api/employee/", employe);
    return data as Employe;
  },

  update: async (employe: Employe): Promise<Employe> => {
    const { data } = await api.put(`api/employee/${employe.id}/`, employe);
    return data as Employe;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`api/employee/${id}/`);
  },
};

export default employeApi;
