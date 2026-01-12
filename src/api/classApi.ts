import api from "./api";
import { User } from "./userApi";

export interface ClassProfile {
  id: number;
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
  if (typeof classe.titulaire === 'string') {
    formData.append("titulaire", classe.titulaire);
  } else {
    formData.append("titulaire", JSON.stringify(classe.titulaire));
  }
  formData.append("anneeScolaire", classe.anneeScolaire);
  formData.append("profName", classe.profName);
  formData.append("yearName", classe.yearName);
  formData.append("categorie", classe.categorie);
  formData.append("effectif", classe.effectif.toString());
  formData.append("nbrGarcon", classe.nbrGarcon.toString());
  formData.append("nbrFille", classe.nbrFille.toString());
  return formData;
};

const classApi = {
  get: async (): Promise<ClassProfile[]> => {
    const { data } = await api.get("api/classe/");
    return data as ClassProfile[];
  },
  getLastClass: async (): Promise<ClassProfile[]> => {
    const { data } = await api.get("api/classe/list/");
    return data as ClassProfile[];
  },
  getTypeByClass: async (
    name: string,
    type: string
  ): Promise<ClassProfile[]> => {
    const { data } = await api.get(`api/classe/?${name}=${type}`);
    return data as ClassProfile[];
  },
  retrieve: async (id: string): Promise<ClassProfile> => {
    const { data } = await api.get(`api/classe/${id}/`);
    return data as ClassProfile;
  },
  add: async (classe: ClassProfile): Promise<ClassProfile> => {
    const formData = prepareFormData(classe);
    const { data } = await api.post("api/classe/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data as ClassProfile;
  },
  update: async (classe: ClassProfile): Promise<ClassProfile> => {
    const formData = prepareFormData(classe);
    const { data } = await api.put(`/api/classe/${classe.id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data as ClassProfile;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/classe/${id}/`);
  },
};

export default classApi;
