import api from "./api";

export interface ClassProfile {
  id: number | undefined;
  className: string;
  numericName: string;
  titulary: undefined | number;
}

const classApi = {
  get: async (): Promise<ClassProfile[]> => {
    const { data } = await api.get("api/classe/");
    return data;
  },
  add: async (classe: ClassProfile): Promise<ClassProfile> => {
    const { data } = await api.post("api/classe/", classe);
    return data;
  },
  update: async (classe: ClassProfile): Promise<ClassProfile> => {
    const { data } = await api.put(`/api/classe/${classe.id}`, classe);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/classe/${id}`);
  },
};

export default classApi;
