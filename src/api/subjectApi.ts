import api from "./api";

export interface SubjectProfile {
  id: number | undefined;
  title: string;
  prof: number | undefined;
}

const subjectApi = {
  get: async (): Promise<ClassProfile[]> => {
    const { data } = await api.get("api/matiere/");
    return data;
  },
  add: async (subject: SubjectProfile): Promise<SubjectProfile> => {
    const { data } = await api.post("api/matiere/", subject);
    return data;
  },
  update: async (subject: SubjectProfile): Promise<SubjectProfile> => {
    const { data } = await api.put(`/api/matiere/${subject.id}`, subject);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/matiere/${id}`);
  },
};

export default subjectApi;
