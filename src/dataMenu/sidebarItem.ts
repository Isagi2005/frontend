import { IconType } from "react-icons/lib";
import { MdOutlineDashboard } from "react-icons/md";

export interface sidebarType {
  id: number;
  menu: string;
  link: string;
  icon: IconType | undefined | string;
  sous_menu?: sidebarType[];
}
export const directionItem: sidebarType[] = [
  {
    id: 1,
    menu: "Tableau de bord",
    link: "",
    icon: MdOutlineDashboard,
  },
  {
    id: 2,
    menu: "Contenu publique",
    link: "",
    icon: MdOutlineDashboard,
    sous_menu: [
      {
        id: 1,
        menu: "Evenements",
        link: "",
        icon: MdOutlineDashboard,
      },
    ],
  },
  {
    id: 3,
    menu: "Personnel",
    link: "",
    icon: MdOutlineDashboard,
    sous_menu: [
      {
        id: 1,
        menu: "Enseignant",
        link: "",
        icon: MdOutlineDashboard,
      },
      {
        id: 2,
        menu: "Finance",
        link: "",
        icon: MdOutlineDashboard,
      },
    ],
  },
  {
    id: 4,
    menu: "Classe",
    link: "",
    icon: MdOutlineDashboard,
    sous_menu: [
      {
        id: 1,
        menu: "Classe",
        link: "",
        icon: MdOutlineDashboard,
      },
    ],
  },
];

export const financeItem: sidebarType[] = [
  {
    id: 1,
    menu: "Tableau de bord",
    link: "",
    icon: MdOutlineDashboard,
  },
  {
    id: 2,
    menu: "Contenu financière",
    link: "",
    icon: MdOutlineDashboard,
    sous_menu: [
      {
        id: 1,
        menu: "Evenements",
        link: "",
        icon: MdOutlineDashboard,
      },
    ],
  },
  {
    id: 3,
    menu: "Personnel",
    link: "",
    icon: MdOutlineDashboard,
    sous_menu: [
      {
        id: 1,
        menu: "Enseignant",
        link: "",
        icon: MdOutlineDashboard,
      },
      {
        id: 2,
        menu: "Finance",
        link: "",
        icon: MdOutlineDashboard,
      },
    ],
  },
  {
    id: 4,
    menu: "Classe",
    link: "",
    icon: MdOutlineDashboard,
    sous_menu: [
      {
        id: 1,
        menu: "Classe",
        link: "",
        icon: MdOutlineDashboard,
      },
    ],
  },
];

export const parentItem: sidebarType[] = [];
export const enseignantItem: sidebarType[] = [];
