export interface filterProps {
  id: number;
  nom: string;
  value?: string;
}

export const classFilter: filterProps[] = [
  {
    id: 1,
    nom: "Prescolaire",
  },
  {
    id: 2,
    nom: "Primaire",
  },
  {
    id: 3,
    nom: "College",
  },
  {
    id: 4,
    nom: "Lycee",
  },
];

export const userFilter: filterProps[] = [
  {
    id: 1,
    nom: "Direction",
  },
  {
    id: 2,
    nom: "Enseignant",
  },
  {
    id: 3,
    nom: "Finance",
  },
  {
    id: 4,
    nom: "Parent",
  },
];
export const demandeFilter: filterProps[] = [
  {
    id: 1,
    nom: "Demande lu(s)",
    value: "L",
  },
  {
    id: 2,
    nom: "Demande non lu(s)",
    value: "NL",
  },
];
export const filterClass: filterProps[] = [
  {
    id: 1,
    nom: "Demande lu(s)",
    value: "L",
  },
  {
    id: 2,
    nom: "Demande non lu(s)",
    value: "NL",
  },
];
