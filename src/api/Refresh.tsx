import api from "./api";

export const refreshToken = async () => {
  try {
    const response = await api.post("api/token/refresh/");
    const newAccessToken = response.data.access;

    api.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;

    return newAccessToken;
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token");
    return null;
  }
};
