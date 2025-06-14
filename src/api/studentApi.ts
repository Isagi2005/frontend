import api from "./api";
import { ClassProfile } from "./classApi";
import { User } from "./userApi";

export interface StudentProfile {
  id: number;
  nom: string;
  prenom: string;
  prenoms: string;
  sexe: string;
  religion: string;
  adresse: string;
  dateDeNaissance: string;
  pere?: string;
  mere?: string;
  classe: ClassProfile | string;
  classeName: string;
  parent: User | number;
  parentX: User;
  age: string;
  image: string | File | null;
}

export interface SheetPreview {
  sheet: string;
  data: StudentProfile[];
}

const prepareFormData = (student: StudentProfile): FormData => {
  const formData = new FormData();
  formData.append("nom", student.nom);
  formData.append("prenom", student.prenom);
  formData.append("sexe", student.sexe);
  formData.append("religion", student.religion);
  formData.append("adresse", student.adresse);
  formData.append("dateDeNaissance", student.dateDeNaissance);
  formData.append("pere", student.pere);
  formData.append("mere", student.mere);
  if (student.image !== null && student.image instanceof File)
    formData.append("image", student.image);
  formData.append("classe", student.classe);
  formData.append("parent", student.parent);
  return formData;
};

const studentApi = {
  get: async (): Promise<StudentProfile[]> => {
    const { data } = await api.get("api/etudiant/");
    return data;
  },

  getGenerics: async (
    name: string,
    value: string
  ): Promise<StudentProfile[]> => {
    const { data } = await api.get(`api/etudiant/?${name}=${value}`);
    return data;
  },

  getOneStudent: async (id: string): Promise<StudentProfile> => {
    const { data } = await api.get(`api/etudiant/${id}/`);
    return data;
  },

  confirmUpload: async (previewData: SheetPreview): Promise<StudentProfile> => {
    const { data } = await api.post("/upload-excel/", {
      students: previewData.flatMap((sheet) => sheet.data),
    });
    return data;
  },

  uploadWithExcel: async (formData) => {
    const { data } = await api.post("/preview-excel/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  add: async (student: StudentProfile): Promise<StudentProfile> => {
    const formData = prepareFormData(student);
    const { data } = await api.post("api/etudiant/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  update: async (student: StudentProfile): Promise<StudentProfile> => {
    const formData = prepareFormData(student);
    const { data } = await api.put(`/api/etudiant/${student.id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/etudiant/${id}/`);
  },
};

export default studentApi;
