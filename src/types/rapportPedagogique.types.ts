export interface RapportPedagogique {
  id: number;
  dateDuRapport: string;
  auteur: string;
  tache: string;
  heureDebut: string;
  heureFin: string;
  classe: string | null;
  matiere?: string | null;
  commentaire?: string | null;
  lu: boolean;
}
