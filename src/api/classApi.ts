import api from "./api";
import { User } from "./userApi";

export interface ClassProfile {
  id: number | undefined;
  nom: string;
  titulaire: string | User;
  anneeScolaire: string;
  profName: string;
  yearName: string;
  categorie: string;
  effectif: number;
  nbrGarcon: number;
  nbrFille: number;
}

const prepareFormData = (classe: ClassProfile): FormData => {
  const formData = new FormData();
  formData.append("nom", classe.nom);
  formData.append("titulaire", classe.titulaire);
  formData.append("anneeScolaire", classe.anneeScolaire);
  formData.append("categorie", classe.categorie);

  return formData;
};

const classApi = {
  get: async (): Promise<ClassProfile[]> => {
    const { data } = await api.get("api/classe/");
    return data;
  },
  getLastClass: async (): Promise<ClassProfile[]> => {
    const { data } = await api.get("class/list/");
    return data;
  },
  getTypeByClass: async (
    name: string,
    type: string
  ): Promise<ClassProfile[]> => {
    const { data } = await api.get(`api/classe/?${name}=${type}`);
    return data;
  },
  retrieve: async (id: string): Promise<ClassProfile> => {
    const { data } = await api.get(`api/etudiant/${id}/`);
    return data;
  },
  add: async (classe: ClassProfile): Promise<ClassProfile> => {
    const formData = prepareFormData(classe);
    const { data } = await api.post("api/classe/", formData);
    return data;
  },
  update: async (classe: ClassProfile): Promise<ClassProfile> => {
    const formData = prepareFormData(classe);
    const { data } = await api.put(`/api/classe/${classe.id}/`, formData);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/classe/${id}/`);
  },
};

export default classApi;
