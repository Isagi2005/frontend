import { useMutation, useQuery } from "@tanstack/react-query";
import notificationApi from "../api/notificationApi";
import { toast } from "react-toastify";

interface NotificationData {
  eleve_id: number;
  canal: "email" | "whatsapp";
}

export const useNotifierEtudiant = () => {
  return useMutation({
    mutationFn: (data: NotificationData) => notificationApi.notifierImpaye(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Notification envoyée avec succès !");
      } else {
        toast.error("Échec de la notification : " + (data.errors?.join(", ") || "Erreur inconnue"));
      }
    },
    onError: (error: any) => {
      toast.error("Erreur lors de l'envoi de la notification.");
      console.error("Notification error:", error);
    },
  });
};

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: notificationApi.getNotifications,
    staleTime: 60 * 1000, // 1 minute
  });
};
