import api from "./api";
import { User } from "./userApi";

export interface AnneeProfile {
  id: number | undefined;
  anneeScolaire: string;
}

const anneeApi = {
  get: async (): Promise<AnneeProfile[]> => {
    const { data } = await api.get("api/annee/");
    return data;
  },
  getGenerics: async (name: string, type: string): Promise<AnneeProfile[]> => {
    const { data } = await api.get(`api/annee/?${name}=${type}`);
    return data;
  },
  retrieve: async (id: string): Promise<AnneeProfile> => {
    const { data } = await api.get(`api/annee/${id}/`);
    return data;
  },
  add: async (annee: string): Promise<AnneeProfile> => {
    const { data } = await api.post("api/annee/", { anneeScolaire: annee });
    return data;
  },
  update: async (annee: AnneeProfile): Promise<AnneeProfile> => {
    const { data } = await api.put(`/api/annee/${annee.id}`, annee);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/annee/${id}`);
  },
};

export default anneeApi;
