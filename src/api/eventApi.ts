import api from "./api";

// Interface EventType
export interface EventType {
  idevenement: number;
  titre: string;
  description: string;
  image: File | string | null;
  datedebut: string;
  datefin: string;
  dateD: string;
  dateF: string;
  publiePar?: string;
  typeEvent: "scolaire" | "formation" | "annonce" | " autres";
  lieu: string;
}

// Fonction utilitaire pour préparer le FormData
const prepareFormData = (event: EventType): FormData => {
  const formData = new FormData();
  formData.append("titre", event.titre);
  formData.append("description", event.description);
  if (event.image && event.image instanceof File) {
    formData.append("image", event.image);
  }
  formData.append("datedebut", event.datedebut);
  formData.append("datefin", event.datefin);
  formData.append("typeEvent", event.typeEvent);
  formData.append("lieu", event.lieu);
  return formData;
};

const eventApi = {
  getEventPublic: async (): Promise<EventType[]> => {
    const { data } = await api.get("/events/list");
    return data as EventType[];
  },
  getEvents: async (): Promise<EventType[]> => {
    const { data } = await api.get("dir/events/list");
    return data as EventType[];
  },
  getOneEvent: async (id: number): Promise<EventType> => {
    const { data } = await api.get(`/events/list/${id}/`);
    return data as EventType;
  },

  addEvents: async (event: EventType): Promise<EventType> => {
    const formData = prepareFormData(event);
    console.log(formData);
    console.log(event);
    const { data } = await api.post("dir/events/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data as EventType;
  },

  updateEvents: async (event: EventType): Promise<EventType> => {
    const formData = prepareFormData(event);
    const { data } = await api.patch(
      `api/events/${event.idevenement}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Important pour indiquer qu'on envoie des fichiers
        },
      }
    );
    return data as EventType;
  },

  deleteEvents: async (id: number): Promise<void> => {
    await api.delete(`api/events/${id}/`);
  },
};

export default eventApi;
