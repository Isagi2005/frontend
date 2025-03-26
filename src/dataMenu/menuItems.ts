export interface MenuItem {
  id: number;
  name: string;
  subMenu?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  { id: 1, name: "Accueil" },

  {
    id: 2,
    name: "Notre établissement",

    subMenu: [
      {
        id: 1,
        name: "Présentation",
      },
      { id: 2, name: "Ecole" },
      { id: 3, name: "Collège" },
      { id: 4, name: "Préscolaire" },
      { id: 5, name: "Primaire" },
    ],
  },

  {
    id: 3,
    name: "Les équipes",

    subMenu: [
      {
        id: 1,
        name: "Personnel de Direction",
      },
      {
        id: 2,
        name: "Structure du Premier degré",
      },
      {
        id: 3,
        name: "Structure du Second degré",
      },
    ],
  },

  {
    id: 4,
    name: "Inscription",

    subMenu: [
      {
        id: 1,
        name: "Réinscription pour l'année 2025",
      },
      {
        id: 2,
        name: "Nouvelle demande de l'inscription",
      },
      {
        id: 3,
        name: "Calendrier scolaire",
      },
    ],
  },
  {
    id: 5,
    name: "Enseignement",
    subMenu: [
      {
        id: 1,
        name: "Instance du pilotage pédagogique",
      },
      {
        id: 2,
        name: "Projet d'établissement",
      },
      {
        id: 3,
        name: "Accompagnement des elèves",
      },
      { id: 4, name: "Politique des langues" },
      {
        id: 5,
        name: "Cellule de formation continue",
      },
    ],
  },
  {
    id: 6,
    name: "Nos services",
    subMenu: [{ id: 1, name: "Buvette et restauration" }],
  },
  { id: 7, name: "Recrutement" },
];
