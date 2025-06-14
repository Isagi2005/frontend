import api from "./api";
import { User } from "./userApi";

import { RapportPedagogique } from "../types/rapportPedagogique.types";

const prepareFormData = (rapport: RapportPedagogique): FormData => {
  const formData = new FormData();
  formData.append("tache", rapport.tache);
  formData.append("heureDebut", rapport.heureDebut);
  formData.append("heureFin", rapport.heureFin);
  if (rapport.classe !== null && rapport.classe !== undefined)
    formData.append("classe", String(rapport.classe));
  if (rapport.matiere) formData.append("matiere", rapport.matiere);
  if (rapport.commentaire) formData.append("commentaire", rapport.commentaire);
  return formData;
};

const getRapports = async (): Promise<RapportPedagogique[]> => {
  const { data } = await api.get("api/rapport-pedagogique/");
  return data;
};

const markRapportAsRead = async (id: number, lu: boolean): Promise<void> => {
  await api.post(`api/rapport-pedagogique/${id}/mark-as-read/`, { lu });
};

const rapportPedagogiqueApi = {
  get: getRapports,
  markAsRead: markRapportAsRead,
  retrieve: async (id: number): Promise<RapportPedagogique> => {
    const { data } = await api.get(`api/rapport-pedagogique/${id}/`);
    return data;
  },
  add: async (rapport: RapportPedagogique): Promise<RapportPedagogique> => {
    const formData = prepareFormData(rapport);
    const { data } = await api.post("api/rapport-pedagogique/", formData);
    return data;
  },
  update: async (rapport: RapportPedagogique): Promise<RapportPedagogique> => {
    if (!rapport.id) throw new Error("L'id du rapport est requis pour la mise à jour.");
    const formData = prepareFormData(rapport);
    const { data } = await api.put(`api/rapport-pedagogique/${rapport.id}/`, formData);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`api/rapport-pedagogique/${id}/`);
  },
  getGenerics: async (params: Record<string, string | number>): Promise<RapportPedagogique[]> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const { data } = await api.get(`api/rapport-pedagogique/?${query}`);
    return data;
  },
};

export default rapportPedagogiqueApi;
