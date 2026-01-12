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
  telephone?: string;
  email?: string;
  pere?: string;
  mere?: string;
  classe: ClassProfile | string;
  className: string;
  parent: User | number;
  parentX?: User;
  age: string;
  image: string | File | null;
  [key: string]: unknown;
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
  if (student.pere) formData.append("pere", student.pere);
  if (student.mere) formData.append("mere", student.mere);
  if (student.telephone) formData.append("telephone", student.telephone);
  if (student.email) formData.append("email", student.email);
  if (student.image !== null && student.image instanceof File)
    formData.append("image", student.image);
  if (typeof student.classe === 'string')
    formData.append("classe", student.classe);
  else if (student.classe?.id)
    formData.append("classe", student.classe.id.toString());
  if (typeof student.parent === 'number')
    formData.append("parent", student.parent.toString());
  else if (student.parent?.id)
    formData.append("parent", student.parent.id.toString());
  return formData;
};

const studentApi = {
  get: async (): Promise<StudentProfile[]> => {
    const { data } = await api.get("api/etudiant/") as { data: StudentProfile[] };
    return data;
  },

  getGenerics: async (
    name: string,
    value: string
  ): Promise<StudentProfile[]> => {
    const { data } = await api.get(`api/etudiant/?${name}=${value}`) as { data: StudentProfile[] };
    return data;
  },

  getOneStudent: async (id: string): Promise<StudentProfile> => {
    const { data } = await api.get(`api/etudiant/${id}/`) as { data: StudentProfile };
    return data;
  },

  confirmUpload: async (previewData: SheetPreview[]): Promise<StudentProfile[]> => {
    const allStudents = previewData.flatMap(item => item.data);
    const { data } = await api.post("/upload-excel/", {
      students: allStudents,
    }) as { data: StudentProfile[] };
    return data;
  },

  uploadWithExcel: async (formData: FormData): Promise<SheetPreview> => {
    const { data } = await api.post("/preview-excel/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }) as { data: SheetPreview };
    return data;
  },

  add: async (student: StudentProfile): Promise<StudentProfile> => {
    const formData = prepareFormData(student);
    const { data } = await api.post("api/etudiant/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) as { data: StudentProfile };
    return data;
  },

  update: async (student: StudentProfile): Promise<StudentProfile> => {
    const formData = prepareFormData(student);
    const { data } = await api.put(`/api/etudiant/${student.id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) as { data: StudentProfile };
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/etudiant/${id}/`);
  },
};

export default studentApi;
