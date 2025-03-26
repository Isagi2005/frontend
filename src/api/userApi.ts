import api from "./api";

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profile: UserProfile | undefined;
}
export type UserRole = "direction" | "personnel" | "parent";

export interface UserProfile {
  id: number;
  account?: User;
  image: string | File | null;
  sexe?: string;
  telephone?: string;
  birthDate?: string;
  adresse?: string;
  religion?: string;
  role: UserRole;
}
const userApi = {
  getUsers: async (): Promise<UserProfile[]> => {
    const { data } = await api.get("api/users/get/");
    return data;
  },
  getAuthentifiedUser: async (): Promise<User> => {
    const { data } = await api.get("/api/user/authentified/");
    return data;
  },
  addUser: async (user: UserProfile): Promise<UserProfile> => {
    const { data } = await api.post("/users", user);
    return data;
  },
  updateUser: async (user: UserProfile): Promise<UserProfile> => {
    const { data } = await api.put(`/users/${user.id}`, user);
    return data;
  },
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export default userApi;
