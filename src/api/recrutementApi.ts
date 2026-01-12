// src/api/recrutementApi.ts
import api from "./api"

const recrutementApi = {
  getAll: () => Promise.resolve(api.get("api/contenu/recrutement/").then(res => res.data)),

  getOne: (id: number) =>
    Promise.resolve(api.get(`api/contenu/recrutement/${id}/`).then(res => res.data)),

  create: (data: FormData) =>
    Promise.resolve(api.post("api/contenu/recrutement/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(res => res.data)),

  update: (id: number, data: FormData) =>
    Promise.resolve(api.patch(`api/contenu/recrutement/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(res => res.data)),

  delete: (id: number) =>
    Promise.resolve(api.delete(`api/contenu/recrutement/${id}/`).then(res => res.data)),
}

export default recrutementApi
