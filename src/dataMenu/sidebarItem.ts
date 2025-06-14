import { ChartPie, LucideMessageCircleMore } from "lucide-react";
import { IconType } from "react-icons/lib";
import { MdHistory, MdOutlineDashboard, MdPayment } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { FaPen, FaUsersGear } from "react-icons/fa6";
import { TbReport, TbUsersPlus } from "react-icons/tb";
// import { FaGenderless, FaMoneyCheckAlt, FaPen } from "react-icons/fa";
import { HiBookOpen } from "react-icons/hi";
import {  SiBookstack } from "react-icons/si";
import { RiStickyNoteAddFill } from "react-icons/ri";
import { IoSchool } from "react-icons/io5";

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
    icon: ChartPie,
    sous_menu:[
      // {
      //   id: 1,
      //   menu: "Financière",
      //   link: "dashboard",
      //   icon: MdOutlineDashboard,
      // },
      {
        id: 2,
        menu: "Pedagogique",
        link: "dashboard1",
        icon: ChartPie,
      },
    ]
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
        link: "contenu/evenements",
        icon: MdOutlineDashboard,
      },
      {
        id: 2,
        menu: "Inscription",
        link: "contenu/inscription",
        icon: FaPen,
      },
      
      // {
      //   id: 3,
      //   menu: "Recrutement",
      //   link: "contenu/recrutement",
      //   icon: TbUsersPlus,
      // },
      {
        id: 4,
        menu: "Autre",
        link: "contenu/autre",
        icon: TbUsersPlus,
      },
      // {
      //   id: 5,
      //   menu: "Services",
      //   link: "contenu/services",
      //   icon: TbUsersPlus,
      // },
    ],
  },
  {
    id: 3,
    menu: "Gestion des utilisateurs",
    link: "personnel/user",
    icon: FaUsersGear,
  },
  {
    id: 4,
    menu: "Pedagogie",
    link: "",
    icon: PiStudentFill,
    sous_menu: [
      {
        id: 1,
        menu: "Classe",
        link: "classe",
        icon: IoSchool,
      },
      {
        id: 2,
        menu: "Etudiant",
        link: "etudiant",
        icon: IoSchool,
      },
      {
        id: 3,
        menu: "Bulletin",
        link: "bulletinDir",
        icon: IoSchool,
      },
      {
        id: 4,
        menu: "Periode",
        link: "periode",
        icon: IoSchool,
      },
    ],
  },
  {
    id: 5,
    menu: "Rapport",
    link: "",
    icon: TbReport,
    sous_menu: [
      // {
      //   id: 1,
      //   menu: "Financier",
      //   link: "rapport/financier",
      //   icon: FaMoneyBillTransfer,
      // },
      {
        id: 1,
        menu: "Pedagogique",
        link: "rapport/pedagogique",
        icon: HiBookOpen,
      },
    ],
  },
  {
    id: 6,
    menu: "Communication",
    link: "com",
    icon: LucideMessageCircleMore,
  },
  // {
  //   id: 7,
  //   menu: "Gestion des Employés",
  //   link: "comFinance",
  //   icon: FaGenderless, 
  //   sous_menu: [
  //     {
  //       id: 1,
  //       menu: "Employés",
  //       link: "gestion/employe",
  //       icon: FaMoneyCheckAlt, 
  //     },
  //     {
  //       id: 2,
  //       menu: "Demande de Congé/ Permission",
  //       link: "conges",
  //       icon: MdOutlineDashboard,
  //     },
  //   ],
  // },
];

export const financeItem: sidebarType[] = [
  {
    id: 1,
    menu: "Paiement",
    link: "gestion/paiement",
    icon: MdPayment, 
  },
  {
    id: 2,
    menu: "Suivi des paiement Ecolage",
    link: "gestion/historique",
    icon: MdHistory, 
  },

];


export const enseignantItem: sidebarType[] = [
  {
    id: 1,
    menu: "Tableau de bord",
    link: "dashboardE",
    icon: ChartPie,
  },
  {
    id: 2,
    menu: "Gestion",
    link: "",
    icon: SiBookstack,
    sous_menu: [
      {
        id: 1,
        menu: "Elèves",
        link: "gestion/eleve",
        icon: PiStudentFill,
      },
      {
        id: 2,
        menu: "Presence",
        link: "gestion/presence",
        icon: TbReport,
      },
      {
        id: 3,
        menu: "Bulletin",
        link: "bulletin",
        icon: RiStickyNoteAddFill,
      },
    ],
  },
  {
    id: 3,
    menu: "Rapport journalière",
    link: "rapportJour",
    icon: HiBookOpen,
  },
  {
    id: 4,
    menu: "Communication",
    link: "comProf",
    icon: LucideMessageCircleMore,
  },
];

export const parentItem: sidebarType[] = [
  {
    id: 1,
    menu: "SUIVI",
    link: "status_paiements",
    icon: MdOutlineDashboard,
  },
];