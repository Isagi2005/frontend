import api from "./api";

export interface StudentProfile {
  id: number;
  name: string;
  firstName: string;
  sexe: string;
  church: string;
  adress: string;
  birthDate: string;
  fatherName: string;
  motherName: string;
  classe: undefined | number;
  parent: undefined | number;
}
const studentApi = {
  get: async (): Promise<StudentProfile[]> => {
    const { data } = await api.get("api/etudiant/");
    return data;
  },
  add: async (student: StudentProfile): Promise<StudentProfile> => {
    const { data } = await api.post("api/etudiant/", student);
    return data;
  },
  update: async (student: StudentProfile): Promise<StudentProfile> => {
    const { data } = await api.put(`/api/etudiant/${student.id}`, student);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/etudiant/${id}`);
  },
};

export default studentApi;
