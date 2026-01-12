import { useMutation } from "@tanstack/react-query";
import api from "../api/api";

interface LoginData {
  username: string;
  password: string;
  role: string;
}

interface AuthResponse {
  authenticated: boolean;
  user?: {
    id: number;
    username: string;
    role: string;
    // Ajoutez d'autres propriétés utilisateur si nécessaire
  };
  token?: string;
  error?: string;
}

export const useLogin = () => {
  return useMutation<AuthResponse, Error, LoginData>({
    mutationFn: async (data: LoginData) => {
      const res = await api.post<AuthResponse>(`/api/user/login/`, data);
      return res.data;
    },
  });
};

export const Is_authenticated = async (): Promise<boolean> => {
  try {
    const res = await api.post<AuthResponse>(`/api/user/authenticated/`);
    return res.data.authenticated || false;
  } catch {
    return false;
  }
};

export const UseLogout = async () => {
  try {
    await api.post(`/api/user/logout/`, {});
    return true;
  } catch {
    return false;
  }
};
