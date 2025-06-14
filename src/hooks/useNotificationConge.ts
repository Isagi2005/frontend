import { useQuery } from "@tanstack/react-query";
import api from "../../src/api/api";

export const getNotifications = async () => {
  const response = await api.get("/api/notifConge/"); // adapte à ton endpoint
  return response.data;
};

export const useNotifications = () => {
  return useQuery(["notifications"], getNotifications);
};
