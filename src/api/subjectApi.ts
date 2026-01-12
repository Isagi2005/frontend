import api from "./api";
import { User } from "./userApi";

export interface SubjectProfile {
  id: string;
  titre: string;
  enseignant: string | User;
}

const prepareFormData = (matiere: SubjectProfile): FormData => {
  const formData = new FormData();
  formData.append("titre", matiere.titre);
  if (typeof matiere.enseignant === 'string') {
    formData.append("enseignant", matiere.enseignant);
  } else {
    formData.append("enseignant", JSON.stringify(matiere.enseignant));
  }

  return formData;
};

const subjectApi = {
  get: async (): Promise<SubjectProfile[]> => {
    const { data } = await api.get("api/matiere/");
    return data as SubjectProfile[];
  },

  getGenerics: async (
    name: string,
    value: string
  ): Promise<SubjectProfile[]> => {
    const { data } = await api.get(`api/matiere/?${name}=${value}`);
    return data as SubjectProfile[];
  },
  retrieve: async (id: string): Promise<SubjectProfile> => {
    const { data } = await api.get(`api/matiere/${id}/`);
    return data as SubjectProfile;
  },
  add: async (subject: SubjectProfile): Promise<SubjectProfile> => {
    const formData = prepareFormData(subject);
    const { data } = await api.post("api/matiere/", formData);
    return data as SubjectProfile;
  },
  update: async (subject: SubjectProfile): Promise<SubjectProfile> => {
    const formData = prepareFormData(subject);
    const { data } = await api.put(`/api/matiere/${subject.id}`, formData);
    return data as SubjectProfile;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/matiere/${id}`);
  },
};

export default subjectApi;
