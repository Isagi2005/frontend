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
    ],
  },

  {
    id: 3,
    name: "Les équipes",
  },

  {
    id: 4,
    name: "Inscription",

    subMenu: [
 
      {
        id: 1,
        name: "Nouvelle demande de l'inscription",
      },

    ],
  },
  {
    id: 6,
    name: "Nos services",
    subMenu: [{ id: 1, name: "Buvette,restauration et Transport scolaire" }],
  },
  { id: 7, name: "Recrutement" },
];
