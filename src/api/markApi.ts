import api from "./api";

export interface MarkProfile {
  id: number | undefined;
  student: undefined | string;
  subject: undefined | string;
  exam: undefined | string;
  mark: undefined | number;
  observation: undefined | string;
}

const markApi = {
  get: async (): Promise<MarkProfile[]> => {
    const { data } = await api.get("api/note/");
    return data;
  },
  add: async (mark: MarkProfile): Promise<MarkProfile> => {
    const { data } = await api.post("api/note/", mark);
    return data;
  },
  update: async (mark: MarkProfile): Promise<MarkProfile> => {
    const { data } = await api.put(`/api/note/${mark.id}`, mark);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/note/${id}`);
  },
};

export default markApi;
