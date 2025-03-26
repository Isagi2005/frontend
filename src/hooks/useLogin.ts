import { useMutation } from "@tanstack/react-query";
import api from "../api/api";

interface LoginData {
  username: string;
  password: string;
  role: string;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginData) => {
      const res = await api.post(`/api/user/login/`, data);
      console.log(res.data);
      return res.data;
    },
  });
};

export const Is_authenticated = async () => {
  try {
    const res = await api.post(`/api/user/authenticated/`);
    return res.data.authenticated;
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
