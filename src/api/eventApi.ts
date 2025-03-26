import api from "./api";
import { User } from "./userApi";

// Interface EventType
export interface EventType {
  id?: number;
  titre: string;
  description: string;
  image: File | string | null;
  datedebut: string;
  datefin: string;
  publierPar?: User;
}

// Fonction utilitaire pour préparer le FormData
const prepareFormData = (event: EventType): FormData => {
  const formData = new FormData();
  formData.append("titre", event.titre);
  formData.append("description", event.description);
  if (event.image && event.image instanceof File) {
    formData.append("image", event.image); // Ajouter l'image si elle existe
  }
  formData.append("datedebut", event.datedebut);
  formData.append("datefin", event.datefin);
  return formData;
};

const eventApi = {
  getEventPublic: async (): Promise<EventType[]> => {
    const { data } = await api.get("/events/list");
    return data;
  },
  getEvents: async (): Promise<EventType[]> => {
    const { data } = await api.get("dir/events/list");
    return data;
  },

  addEvents: async (event: EventType): Promise<EventType> => {
    const formData = prepareFormData(event); // Utilisation de la fonction utilitaire
    const { data } = await api.post("dir/events/", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Important pour indiquer qu'on envoie des fichiers
      },
    });
    return data;
  },

  updateEvents: async (event: EventType): Promise<EventType> => {
    const formData = prepareFormData(event); // Utilisation de la fonction utilitaire
    const { data } = await api.put(`dir/events/update/${event.id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Important pour indiquer qu'on envoie des fichiers
      },
    });
    return data;
  },

  deleteEvents: async (id: number): Promise<void> => {
    await api.delete(`dir/events/delete/${id}/`);
  },
};

export default eventApi;
