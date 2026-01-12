import api from "./api"

export interface Service {
  id: number
  service_type: string
  title: string
  description: string
  image: string
  updated_at: string
}

// GET
export const getServices = async () => {
  const response = await api.get<Service[]>("api/contenu/services/");
  return response.data;
}

// POST
export const createService = (data: FormData) =>
  api.post<Service>("api/contenu/services/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  })

// PATCH
export const updateService = (id: number, data: FormData) =>
  api.patch<Service>(`api/contenu/services/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  })

// DELETE
// In serviceApi.ts
export const deleteService = (id: number) => {
  return api.delete(`api/contenu/services/${id}/`);
};
