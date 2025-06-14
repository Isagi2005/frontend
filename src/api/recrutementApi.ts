// src/api/recrutementApi.ts
import api from "./api"

const recrutementApi = {
  getAll: () => api.get("api/contenu/recrutement/").then(res => res.data),

  getOne: (id: number) =>
    api.get(`api/contenu/recrutement/${id}/`).then(res => res.data),

  create: (data: FormData) =>
    api.post("api/contenu/recrutement/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(res => res.data),

 update: (id: number, data: FormData) =>
        api.patch(`api/contenu/recrutement/${id}/`, data, { // Changé de put à patch
          headers: { "Content-Type": "multipart/form-data" },
        }).then(res => res.data),

  delete: (id: number) =>
    api.delete(`api/contenu/recrutement/${id}/`).then(res => res.data),
}

export default recrutementApi
