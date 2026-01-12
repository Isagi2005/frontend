import { useQuery } from "@tanstack/react-query";
import api from "../../src/api/api";

export interface NotificationConge {
  id: number;
  message: string;
  date: string;
  lu: boolean;
  // Ajoutez d'autres champs selon votre API
}

export const getNotifications = async (): Promise<NotificationConge[]> => {
  const response = await api.get<NotificationConge[]>("/api/notifConge/");
  return response.data;
};

export const useNotifications = () => {
  return useQuery<NotificationConge[]>({
    queryKey: ['notifications'],
    queryFn: getNotifications
  });
};
