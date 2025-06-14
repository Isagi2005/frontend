// import api from "./api";
// import { StudentProfile } from "./studentApi";

// export interface Domaine {
//   id: number;
//   code: string;
//   nom: string;
//   typeDomaine: string;
//   ordreAffichage: number;
//   cyclesDetail?: Cycle[];
// }

// export interface SousDomaine {
//   id: number;
//   domaine: number;
//   domaineDetail?: Domaine;
//   nom: string;
//   description: string;
//   ordreAffichage: number;
// }

// export interface Competence {
//   id: number;
//   code: string;
//   description: string;
//   sousDomaine?: number;
//   sousDomaineDetail?: SousDomaine;
//   domaine: number;
//   domaineDetail?: Domaine;
//   cyclesDetail?: Cycle[];
//   typeEvaluation: string;
//   ordreAffichage: number;
//   estSocle: boolean;
// }

// export interface Cycle {
//   id: number;
//   code: string;
//   nom: string;
//   groupe_cycles: string;
// }

// export interface Periode {
//   id: number;
//   nom: string;
//   ordre: number;
//   typePeriode: string;
//   dateDebut: string;
//   dateFin: string;
// }

// export interface Bulletin {
//   id: number;
//   eleve: number;
//   eleveDetail?: StudentProfile;
//   periode: number;
//   periodeDetail?: Periode;
//   appreciationGenerale: string;
//   pointsForts: string;
//   besoins: string;
//   projet: string;
//   dateEdition: string;
// }

// export interface EvaluationCompetence {
//   id: number;
//   bulletin: number;
//   bulletinDetail?: Bulletin;
//   competence: number;
//   competenceDetail?: Competence;
//   valeurNum?: number;
//   appreciation: string;
//   niveauAcquisition: string;
//   estAcquise?: boolean;
//   observations: string;
// }

// export interface EvaluationGlobale {
//   id: number;
//   bulletin: number;
//   bulletinDetail?: Bulletin;
//   sousDomaine: number;
//   sousDomaineDetail?: SousDomaine;
//   observations: string;
// }

// export interface VieScolaire {
//   id: number;
//   bulletin: number;
//   bulletinDetail?: Bulletin;
//   assiduite: string;
//   respect_reglement: string;
//   participation: string;
//   retards: number;
//   absencesJ: number;
//   absencesNJ: number;
// }

// export interface Communication {
//   id: number;
//   bulletin: number;
//   bulletinDetail?: Bulletin;
//   date: string;
//   contenu: string;
//   auteur: number;
//   auteurDetail?: string;
//   visaFamille: boolean;
//   dateVisa?: string;
// }

// const apiService = {
//   // Domaines
//   getDomaines: async (): Promise<Domaine[]> => {
//     const { data } = await api.get("domaines/");
//     return data;
//   },
//   getDomaine: async (id: number): Promise<Domaine> => {
//     const { data } = await api.get(`domaines/${id}/`);
//     return data;
//   },
//   getSousDomainesByDomaine: async (
//     domaineId: number
//   ): Promise<SousDomaine[]> => {
//     const { data } = await api.get(`domaines/${domaineId}/sous-domaines/`);
//     return data;
//   },
//   createDomaine: async (domaine: Omit<Domaine, "id">): Promise<Domaine> => {
//     const { data } = await api.post("domaines/", domaine);
//     return data;
//   },
//   updateDomaine: async (
//     id: number,
//     domaine: Partial<Domaine>
//   ): Promise<Domaine> => {
//     const { data } = await api.patch(`domaines/${id}/`, domaine);
//     return data;
//   },
//   deleteDomaine: async (id: number): Promise<void> => {
//     await api.delete(`domaines/${id}/`);
//   },

//   // Sous-domaines
//   getSousDomaines: async (): Promise<SousDomaine[]> => {
//     const { data } = await api.get("sous-domaines/");
//     return data;
//   },
//   getSousDomaine: async (id: number): Promise<SousDomaine> => {
//     const { data } = await api.get(`sous-domaines/${id}/`);
//     return data;
//   },
//   getCompetencesBySousDomaine: async (
//     sousDomaineId: number
//   ): Promise<Competence[]> => {
//     const { data } = await api.get(
//       `sous-domaines/${sousDomaineId}/competences/`
//     );
//     return data;
//   },
//   createSousDomaine: async (
//     sousDomaine: Omit<SousDomaine, "id">
//   ): Promise<SousDomaine> => {
//     const { data } = await api.post("sous-domaines/", sousDomaine);
//     return data;
//   },
//   updateSousDomaine: async (
//     id: number,
//     sousDomaine: Partial<SousDomaine>
//   ): Promise<SousDomaine> => {
//     const { data } = await api.patch(`sous-domaines/${id}/`, sousDomaine);
//     return data;
//   },
//   deleteSousDomaine: async (id: number): Promise<void> => {
//     await api.delete(`sous-domaines/${id}/`);
//   },

//   // Compétences
//   getCompetences: async (params?: {
//     domaine_id?: number;
//     sous_domaine_id?: number;
//     cycle_id?: number;
//   }): Promise<Competence[]> => {
//     const { data } = await api.get("competences/", { params });
//     return data;
//   },
//   getCompetence: async (id: number): Promise<Competence> => {
//     const { data } = await api.get(`competences/${id}/`);
//     return data;
//   },
//   createCompetence: async (
//     competence: Omit<Competence, "id">
//   ): Promise<Competence> => {
//     const { data } = await api.post("competences/", competence);
//     return data;
//   },
//   updateCompetence: async (
//     id: number,
//     competence: Partial<Competence>
//   ): Promise<Competence> => {
//     const { data } = await api.patch(`competences/${id}/`, competence);
//     return data;
//   },
//   deleteCompetence: async (id: number): Promise<void> => {
//     await api.delete(`competences/${id}/`);
//   },

//   // Cycles
//   getCycles: async (): Promise<Cycle[]> => {
//     const { data } = await api.get("cycles/");
//     return data;
//   },
//   getCycle: async (id: number): Promise<Cycle> => {
//     const { data } = await api.get(`cycles/${id}/`);
//     return data;
//   },

//   // Périodes
//   getPeriodes: async (): Promise<Periode[]> => {
//     const { data } = await api.get("periodes/");
//     return data;
//   },
//   getPeriode: async (id: number): Promise<Periode> => {
//     const { data } = await api.get(`periodes/${id}/`);
//     return data;
//   },

//   // Bulletins
//   getBulletins: async (params?: {
//     eleve_id?: number;
//     periode_id?: number;
//     classe_id?: number;
//   }): Promise<Bulletin[]> => {
//     const { data } = await api.get("bulletins/", { params });
//     return data;
//   },
//   getBulletin: async (id: number): Promise<Bulletin> => {
//     const { data } = await api.get(`bulletins/${id}/`);
//     return data;
//   },
//   getEvaluationsByBulletin: async (
//     bulletinId: number
//   ): Promise<EvaluationCompetence[]> => {
//     const { data } = await api.get(`bulletins/${bulletinId}/evaluations/`);
//     return data;
//   },
//   createBulletin: async (bulletin: Omit<Bulletin, "id">): Promise<Bulletin> => {
//     const { data } = await api.post("bulletins/", bulletin);
//     return data;
//   },
//   addEvaluationToBulletin: async (
//     bulletinId: number,
//     evaluation: Omit<EvaluationCompetence, "id" | "bulletin">
//   ): Promise<EvaluationCompetence> => {
//     const { data } = await api.post(
//       `bulletins/${bulletinId}/evaluations/`,
//       evaluation
//     );
//     return data;
//   },
//   updateBulletin: async (
//     id: number,
//     bulletin: Partial<Bulletin>
//   ): Promise<Bulletin> => {
//     const { data } = await api.patch(`bulletins/${id}/`, bulletin);
//     return data;
//   },
//   deleteBulletin: async (id: number): Promise<void> => {
//     await api.delete(`bulletins/${id}/`);
//   },

//   // Évaluations de compétences
//   getEvaluationCompetence: async (
//     id: number
//   ): Promise<EvaluationCompetence> => {
//     const { data } = await api.get(`evaluations-competences/${id}/`);
//     return data;
//   },
//   updateEvaluationCompetence: async (
//     id: number,
//     evaluation: Partial<EvaluationCompetence>
//   ): Promise<EvaluationCompetence> => {
//     const { data } = await api.patch(
//       `evaluations-competences/${id}/`,
//       evaluation
//     );
//     return data;
//   },
//   deleteEvaluationCompetence: async (id: number): Promise<void> => {
//     await api.delete(`evaluations-competences/${id}/`);
//   },

//   // Évaluations globales
//   getEvaluationsGlobales: async (): Promise<EvaluationGlobale[]> => {
//     const { data } = await api.get("evaluations-globales/");
//     return data;
//   },
//   getEvaluationGlobale: async (id: number): Promise<EvaluationGlobale> => {
//     const { data } = await api.get(`evaluations-globales/${id}/`);
//     return data;
//   },

//   // Vie scolaire
//   getVieScolaire: async (id: number): Promise<VieScolaire> => {
//     const { data } = await api.get(`vie-scolaire/${id}/`);
//     return data;
//   },
//   updateVieScolaire: async (
//     id: number,
//     vieScolaire: Partial<VieScolaire>
//   ): Promise<VieScolaire> => {
//     const { data } = await api.patch(`vie-scolaire/${id}/`, vieScolaire);
//     return data;
//   },

//   // Communications
//   getCommunications: async (params?: {
//     bulletin_id?: number;
//     eleve_id?: number;
//   }): Promise<Communication[]> => {
//     const { data } = await api.get("communications/", { params });
//     return data;
//   },
//   getCommunication: async (id: number): Promise<Communication> => {
//     const { data } = await api.get(`communications/${id}/`);
//     return data;
//   },
//   createCommunication: async (
//     communication: Omit<Communication, "id">
//   ): Promise<Communication> => {
//     const { data } = await api.post("communications/", communication);
//     return data;
//   },
// };

// export default apiService;
