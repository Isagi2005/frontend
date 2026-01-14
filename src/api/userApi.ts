
import api from "./api";

export interface User {
  id?: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  dateArrivee: string;
  is_active: boolean;
  status: "active" | "inactive";
  profile: UserProfile;
}

export interface Prof extends User {
  role: "enseignant";
}
export type UserRole = "direction" | "enseignant" | "parent" | "finance";

export interface UserProfile {
  id?: number;
  account?: User | string;
  image: string | File | null;
  historique?: string | File | null;
  sexe?: string;
  telephone?: string;
  birthDate?: string;
  adresse?: string;
  religion?: string;
  role: UserRole;
}

const prepareFormData = (data: User): FormData => {
  const formData = new FormData();

  // Ajouter les champs utilisateur
  formData.append("username", data.username);
  formData.append("password", data.password);
  formData.append("first_name", data.first_name);
  formData.append("last_name", data.last_name);
  if (data.is_active != null) {
    formData.append("is_active", data.is_active.toString());
  }
  formData.append("email", data.email);
  formData.append("dateArrivee", data.dateArrivee);
  formData.append("status", data.status);
  formData.append("profile", JSON.stringify(data.profile));

  return formData;
};
const prepareFormData2 = (data: UserProfile): FormData => {
  const formData = new FormData();

  if (data?.account) {
    if (typeof data.account === 'string') {
      formData.append("account", data.account);
    } else {
      formData.append("account", JSON.stringify(data.account));
    }
  }
  if (data.sexe) formData.append("sexe", data.sexe);
  if (data.telephone) formData.append("telephone", data.telephone);
  if (data.birthDate) formData.append("birthDate", data.birthDate);
  if (data.adresse) formData.append("adresse", data.adresse);
  if (data.religion) formData.append("religion", data.religion);
  formData.append("role", data.role);
  if (data?.image !== null && data?.image instanceof File)
    formData.append("image", data.image);
  if (data?.historique !== null && data?.historique instanceof File)
    formData.append("historique", data.historique);

  return formData;
};

const userApi = {
  getUsers: async (): Promise<User[]> => {
    const { data } = await api.get("api/users/role/");
    return data as User[];
  },
  getAuthentifiedUser: async (): Promise<User> => {
    const { data } = await api.get("/api/user/authentified/");
    return data as User;
  },
  retrieve: async (id: string): Promise<User> => {
    const { data } = await api.get(`api/users/role/${id}/`);
    return data as User;
  },
  getGenerics: async (name: string, value: string): Promise<User[]> => {
    const { data } = await api.get(`/api/users/role/?${name}=${value}`);
    return data as User[];
  },
  addUser: async (user: User): Promise<User> => {
    const formData = prepareFormData(user);
    const { data } = await api.post("/api/users/role/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data as User;
  },
  addProfile: async (user: UserProfile): Promise<UserProfile> => {
    const formData = prepareFormData2(user);
    const { data } = await api.post("/api/users/profile/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data as UserProfile;
  },
  updateUser: async (user: User): Promise<User> => {
    const formData = prepareFormData(user);
    const { data } = await api.patch(`/api/users/role/${user.id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data as User;
  },
  updateProfile: async (profile: UserProfile): Promise<UserProfile> => {
    const formData2 = prepareFormData2(profile);

    const { data } = await api.patch(
      `/api/users/profile/${profile.id}/`,
      formData2,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data as UserProfile;
  },
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export default userApi;
