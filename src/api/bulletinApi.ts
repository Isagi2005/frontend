import api from "./api";
import type { AnneeProfile } from "./anneeApi";
export interface PeriodeType{
  id: number;
  nom: string;
  typePeriode: string;
  ordre: number;
  dateDebut: string;
  dateFin: string;
  anneeScolaire: AnneeProfile | number;
  anneeScolaireNom: string
}
export interface Domaine {
    id: number;
    nom: string;
    typeDomaine: string;
    code: string;
    groupeCycles: string;
}
export interface BulletinType{
    id: number;
    eleve: number;
    eleve_nom?: string;
    classe_nom?: string;
    periode: number;
    periode_nom?: string;
    appreciationGenerale: string;
    pointsForts: string;
    besoins: string;
    projet: string;
    dateEdition: string;
    moyenneGenerale: number;
    evaluations?: EvaluationEtudiantType[];
}
export interface EvaluationEtudiantType {
    domaine_id: string
    domaine: Domaine
    valeurNote: number  
    appreciation: string
    // bulletin: BulletinType | string;
    observations: string;
}

export type BulletinFormValues = {
  eleve: number;
  periode: number;
  appreciationGenerale: string;
  pointsForts: string;
  besoins: string;
  projet: string;
  moyenneGenerale: number;
  evaluations: EvaluationEtudiantType[];
};

const EvaluationAPi = {
    getPeriode: async (): Promise<PeriodeType[]> => {
      const { data } = await api.get("api/periode/");
      return data;
    },
    getDomaine: async (): Promise<Domaine[]> => {
        const { data } = await api.get("api/domaine/");
        return data;
      },
      getBulletin: async (): Promise<BulletinType[]> => {
        const { data } = await api.get("api/bulletin/");
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.results)) return data.results;
        return [];
      },
      getEvaluation: async (): Promise<EvaluationEtudiantType[]> => {
        const { data } = await api.get("api/evaluation/");
        return data;
      },
      getGenericsPeriode: async (
        name: string,
        type: string
      ): Promise<PeriodeType[]> => {
        const { data } = await api.get(`api/periode/?${name}=${type}`);
        return data;
      },
      getGenericsDomaine: async (
        name: string,
        type: string
      ): Promise<Domaine[]> => {
        const { data } = await api.get(`api/domaine/?${name}=${type}`);
        return data;
      },
      getGenericsBulletin: async (
        name: string,
        type: string
      ): Promise<BulletinType[]> => {
        const { data } = await api.get(`api/bulletin/?${name}=${type}`);
        return data;
      },
      getGenericsEvaluation: async (
        name: string,
        type: string
      ): Promise<EvaluationEtudiantType[]> => {
        const { data } = await api.get(`api/evaluation/?${name}=${type}`);
        return data;
      },
      retrievePeriode: async (id: string): Promise<PeriodeType> => {
        const { data } = await api.get(`api/periode/${id}/`);
        return data;
      },
      retrieveDomaine: async (id: string): Promise<Domaine> => {
        const { data } = await api.get(`api/domaine/${id}/`);
        return data;
      },
      retrieveBulletin: async (id: string): Promise<BulletinType> => {
        const { data } = await api.get(`api/bulletin/${id}/`);
        return data;
      },
      retrieveEvaluation: async (id: string): Promise<EvaluationEtudiantType> => {
        const { data } = await api.get(`api/evaluation/${id}/`);
        return data;    
      },
      addPeriode: async (periode: PeriodeType): Promise<PeriodeType> => {
        const { data } = await api.post("api/periode/", periode);
        return data;
      },
      addDomaine: async (domaine: Domaine): Promise<Domaine> => {
        const { data } = await api.post("api/domaine/", domaine);
        return data;
      },
      updatePeriode: async (periode: PeriodeType): Promise<PeriodeType> => {
        const { data } = await api.put(`/api/periode/${periode.id}/`, periode);
        return data;
      },
      updateDomaine: async (domaine: Domaine): Promise<Domaine> => {
        const { data } = await api.put(`/api/domaine/${domaine.id}/`, domaine);
        return data;
      },
      deleteDomaine: async (id: number): Promise<void> => {
        await api.delete(`/api/domaine/${id}/`);
      },
      addBulletin: async (bulletin: BulletinType): Promise<BulletinType> => {
        const { data } = await api.post("api/bulletin/", bulletin);
        return data;
      },
      updateBulletin: async (bulletin: BulletinType): Promise<BulletinType> => {
        const { data } = await api.put(`/api/bulletin/${bulletin.id}/`, bulletin);
        return data;
      },
      deleteBulletin: async (id: number): Promise<void> => {
        await api.delete(`/api/bulletin/${id}/`);
      },
      addEvaluation: async (evaluation: EvaluationEtudiantType): Promise<EvaluationEtudiantType> => {
        const { data } = await api.post("api/evaluation/", evaluation);
        return data;
      },
      updateEvaluation: async (evaluation: EvaluationEtudiantType): Promise<EvaluationEtudiantType> => {
        const { data } = await api.put(`/api/evaluation/${evaluation.id}/`, evaluation);
        return data;
      },
      deleteEvaluation: async (id: number): Promise<void> => {
        await api.delete(`/api/evaluation/${id}/`);
      },
      deletePeriode: async (id: number): Promise<void> => {
        await api.delete(`/api/periode/${id}/`);
      },
      // Ajout complet bulletin + évaluations imbriquées (endpoint DRF nested create)
      createFullBulletin: async (payload: BulletinFormValues) => {
        const { data } = await api.post("api/bulletin/", payload);
        return data;
      }
}
export default EvaluationAPi