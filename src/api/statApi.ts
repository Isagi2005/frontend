import api from './api';

// API pour les statistiques de classe
// Type pour un mois de stats de présence élève
export interface PresenceStatsEleveMonth {
  mois: string;
  retards_30mn?: number;
  absences_demi_journee?: number;
  heures_retard?: number;
  heures_absence?: number;
}

const statApi = {
  async getClasseStats(classeId: number, periodeId?: number) {
    const url = periodeId
      ? `/api/stats/classe/${classeId}/periode/${periodeId}/`
      : `/api/stats/classe/${classeId}/`;
    const { data } = await api.get(url);
    return data;
  },
  async getPresenceStatsEleve(eleveId: number): Promise<PresenceStatsEleveMonth[]> {
    const { data } = await api.get(`/api/stats/presence/eleve/${eleveId}/`);
    return data;
  },
  // API pour l'évolution des notes d'un élève
  async getEvolutionEleve(eleveId: number) {
    const { data } = await api.get(`/api/stats/eleve/${eleveId}/`);
    return data;
  },

  // API pour les alertes élèves en difficulté
  async getAlertesDifficulte() {
    const { data } = await api.get('/api/stats/alertes/');
    return data;
  }
}
export default statApi;