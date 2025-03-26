import api from "./api";

export interface ExamProfile {
  id: number | undefined;
  description: string;
  startDate: string;
  finishDate: string;
}

const examApi = {
  get: async (): Promise<ExamProfile[]> => {
    const { data } = await api.get("api/examen/");
    return data;
  },
  add: async (exam: ExamProfile): Promise<ExamProfile> => {
    const { data } = await api.post("api/examen/", exam);
    return data;
  },
  update: async (exam: ExamProfile): Promise<ExamProfile> => {
    const { data } = await api.put(`/api/examen/${exam.id}`, exam);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/examen/${id}`);
  },
};

export default examApi;
