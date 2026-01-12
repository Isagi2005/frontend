import api from "./api";

export const refreshToken = async () => {
  try {
    const response = await api.post("api/token/refresh/");
    const newAccessToken = (response.data as { access: string }).access;

    (api.defaults.headers as unknown as Record<string, string>)["Authorization"] = `Bearer ${newAccessToken}`;

    return newAccessToken;
  } catch {
    console.error("Erreur lors du rafraîchissement du token");
    return null;
  }
};
