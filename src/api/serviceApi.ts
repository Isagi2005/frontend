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
export const getServices = () => api.get<Service[]>("api/contenu/services/")

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
export const deleteService = (id: number) =>
  api.delete(`api/contenu/services/${id}/`)
