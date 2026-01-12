import api from "./api";

export interface RepartitionNote {
  range: string;
  count: number;
  color: string;
}

export interface MatierePerf {
  nom: string;
  moyenne: number;
  meilleure: number;
  min: number;
}

export interface EvolutionMoyenne {
  mois: string;
  moyenne: number;
}

export interface DashboardData {
  classe_nom: string;
  total_etudiants: number;
  retards_30plus: number;
  absences_demi_journee: number;
  nombre_eleve_classe: number;
  moyenne_generale?: number | null;
  meilleure_moyenne?: number | null;
  moyenne_min?: number | null;
  taux_reussite?: number | null;
  repartition_notes?: RepartitionNote[];
  eleves_en_difficulte?: number;
  eleves_excellents?: number;
  evolution_moyenne?: EvolutionMoyenne[];
  matieres?: MatierePerf[];
}


export interface DashboardFilters {
  classes: { id: number; nom: string; annee_id: number|null; annee_nom: string }[];
  annees: { id: number; nom: string }[];
  periodes: { id: number; nom: string; ordre: number; annee_id: number|null }[];
}

// --- Types pour la performance d'un élève ---
export interface MatierePerformance {
  nom: string;
  moyenne: number;
  appreciation: string;
}

export interface EvolutionTrimestre {
  trimestre: string;
  moyenne: number;
}

// --- Types pour l'affichage pédagogique parent ---
export interface ParentTrimestre {
  id: number;
  nom: string;
  typePeriode: string;
  dateDebut: string;
  dateFin: string;
  bulletin: BulletinParent | null;
  absences: number;
  retards: number;
}

export interface BulletinParent {
  id: number;
  moyenneGenerale: number;
  appreciationGenerale: string;
  pointsForts: string;
  besoins: string;
  projet: string;
  notes: NoteParent[];
}

export interface NoteParent {
  matiere: string;
  valeur: number;
  appreciation: string;
}

export interface ParentEnfantPedagogique {
  id: number;
  nom: string;
  prenom: string;
  classe: string;
  trimestres: ParentTrimestre[];
}

export interface ParentPedagogiqueAPI {
  data: ParentEnfantPedagogique[];
}

export interface TrimestreDisponible {
  id: number;
  nom: string;
}

export interface TypePerformanceEleve {
  moyenne_generale: number|null;
  rang_classe: number|null;
  total_eleves: number;
  matieres: MatierePerformance[];
  evolution: EvolutionTrimestre[];
  trimestres_disponibles: TrimestreDisponible[];
  trimestre_selectionne: number|null;
}

const dashApi = {
  getParentPedagogique: async (): Promise<ParentEnfantPedagogique[]> => {
    const response = await api.get('/api/parent/pedagogique/');
    return response.data as ParentEnfantPedagogique[];
  },
  getDashboardEnseignant: async (params?: {
    classe_id?: number;
    annee_id?: number;
    trimestre_id?: number;
  }): Promise<DashboardData> => {
    const response = await api.get('/api/dashboard/enseignant/stats/', { params });
    return response.data as DashboardData;
  },
  getDashboardFilters: async (): Promise<DashboardFilters> => {
    const response = await api.get('/api/dashboard/enseignant/filters/');
    return response.data as DashboardFilters;
  },
  getDashboardDirection: async (params?: {
    classe_id?: number;
    annee_id?: number;
    trimestre_id?: number;
  }): Promise<DashboardData> => {
    const response = await api.get('/api/dashboard/direction/stats/', { params });
    return response.data as DashboardData;
  },
  getDirFilters: async (): Promise<DashboardFilters> => {
    const response = await api.get('/api/dashboard/direction/filters/');
    return response.data as DashboardFilters;
  },
  getPerformanceEleve: async (
    eleveId: number,
    params?: { trimestre_id?: number | string }
  ): Promise<TypePerformanceEleve> => {
    const response = await api.get(`/api/eleves/${eleveId}/stats/`, { params });
    return response.data as TypePerformanceEleve;
  },
};

export default dashApi;