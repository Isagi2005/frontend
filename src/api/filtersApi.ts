import api from "./api";

export interface FilterParams {
  etudiant?: string | number;
  mois?: string;
  anneeScolaire?: string;
  classe?: string;
}

export interface Paiement {
  id: number;
  montant: number;
  date: string;
  etudiant: {
    id: number;
    nom: string;
    prenom: string;
  };
  // Ajoutez d'autres champs selon votre modèle de données
}

export interface Student {
  id: number;
  nom: string;
  prenom: string;
  // Ajoutez d'autres champs selon votre modèle de données
}

const filtersApi = {
  // Récupère les paiements par étudiant et par mois
  async getPaiementsByStudentAndMonth(etudiantId: number, mois: string): Promise<Paiement[]> {
    const { data } = await api.get<Paiement[]>(
      `/paiements/etudiant/${etudiantId}/mois/${mois}`
    );
    return data;
  },

  // Récupère les paiements par mois et année scolaire
  async getPaiementsByMois(anneeScolaire: string, mois: string): Promise<Paiement[]> {
    const { data } = await api.get<Paiement[]>(
      `/paiements/annee-scolaire/${anneeScolaire}/mois/${mois}`
    );
    return data;
  },

  // Récupère les étudiants par classe et année scolaire
  async getStudentsByClasseAndAnnee(classe: string, anneeScolaire: string): Promise<Student[]> {
    const { data } = await api.get<Student[]>(
      `/etudiants/classe/${classe}/annee-scolaire/${anneeScolaire}`
    );
    return data;
  },

  // Autres méthodes de filtrage peuvent être ajoutées ici
};

export default filtersApi;
