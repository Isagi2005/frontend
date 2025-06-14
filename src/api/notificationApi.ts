import api from "./api";

interface NotificationData {
  eleve_id: number;
  canal: "email" | "whatsapp";
}

const notifierImpaye = async (data: NotificationData) => {
  const response = await api.post("/api/notifications/impaye/", data);
  return response.data;
};

const getNotifications = async () => {
  const response = await api.get("/api/users/notifications/");
  return response.data;
};

const notificationApi = { notifierImpaye, getNotifications };
export default notificationApi;
