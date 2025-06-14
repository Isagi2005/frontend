import api from "./api";
import { Employe } from "./employeApi";

export interface Conge {
    id: number;
    employe: number;  
    date_debut: string;
    date_fin: string;
    raison: string;   
    type_conge: string,
    statut?: "valide" | "annule"; 
  }

const congeApi = {
  // Récupérer tous les congés
  get: async (): Promise<Conge[]> => {
    const { data } = await api.get("api/conges/");
    return data;
  },

  // Récupérer les congés d’un employé
  getByEmployee: async (employeeId: number): Promise<Conge[]> => {
    const { data } = await api.get(`api/conges/?employee=${employeeId}`);
    return data;
  },

  // Récupérer un congé spécifique
  getOne: async (id: number): Promise<Conge> => {
    const { data } = await api.get(`api/conges/${id}/`);
    return data;
  },

  // Ajouter un congé
  add: async (conge: Conge): Promise<Conge> => {
    const { data } = await api.post("api/conges/", conge);
    return data;
  },

  // Modifier un congé
  update: async (conge: Conge): Promise<Conge> => {
    if (!conge.id) throw new Error("ID requis pour la mise à jour du congé.");
    const { data } = await api.put(`api/conges/${conge.id}/`, conge);
    return data;
  },

  // Supprimer un congé
  delete: async (id: number): Promise<void> => {
    await api.delete(`api/conges/${id}/`);
  },
  createForEmployee: async (employeeId: number, congeData: Omit<Conge, 'id' | 'employe'>): Promise<Conge> => {
    const { data } = await api.post("api/conges/", { ...congeData, employe: employeeId });
    return data;
  },
  
  // Méthode pour récupérer tous les employés
  getEmployees: async (): Promise<Employe[]> => {
    const { data } = await api.get("api/employee/");
    return data;
  }
};

export default congeApi;
