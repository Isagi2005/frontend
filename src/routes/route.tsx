import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import College from "../pages/notre_etablissement/College";
import Ecole from "../pages/notre_etablissement/Ecole";
import Prescolaire from "../pages/notre_etablissement/Prescolaire";
import Primaire from "../pages/notre_etablissement/Primaire";
import Personnel_de_direction from "../pages/les_equipes/Personnel_de_direction";
import PremierDegre from "../pages/les_equipes/Structure_Premier_Degre";
import SecondDegre from "../pages/les_equipes/Structure_Second_Degre";
import Reinscription from "../pages/inscription/Reinscription";
import NouvelleDemande from "../pages/inscription/Nouvelle_demande";
import CalendrierScolaire from "../pages/inscription/CalendrierScolaire";
import InstanceDuPilotage from "../pages/enseignement/Instance_du_pilotage";
import ProjetEtablissement from "../pages/enseignement/Projet_Etablissement";
import Accompagnement from "../pages/enseignement/Accompagnement_eleve";
import PolitiqueLangue from "../pages/enseignement/Politique_langue";
import Formation from "../pages/enseignement/Formation";
import Buvette from "../pages/nos_service/Buvette";
import Accueil from "../pages/accueil/Accueil";
import Recrutement from "../pages/recrutement/recrutement";
import Presentation from "../pages/notre_etablissement/Presentation";
import Navbar from "../components/Navbar";
import RoleSelection from "../components/Role";
import { useState } from "react";
import Login from "../pages/Login";
import Footer from "../components/Footer";
import Home from "../pages/HomePage";
import NotFound from "../pages/NotFound";

import ProtectedRoute from "../components/ProtectedRoute";

const AppRoute = () => {
  const role = localStorage.getItem("role");
  const router = createBrowserRouter([
    {
      path: "",
      element: (
        <>
          <Navbar>
            <Outlet />
          </Navbar>
          <Footer />
        </>
      ),
      children: [
        {
          path: "/",
          element: <Accueil />,
        },
        {
          path: "notre_établissement/présentation",
          element: <Presentation />,
        },
        {
          path: "notre_établissement/ecole",
          element: <Ecole />,
        },
        {
          path: "notre_établissement/collège",
          element: <College />,
        },
        {
          path: "notre_établissement/préscolaire",
          element: <Prescolaire />,
        },
        {
          path: "notre_établissement/primaire",
          element: <Primaire />,
        },
        {
          path: "les_équipes/personnel_de_direction",
          element: <Personnel_de_direction />,
        },
        {
          path: "les_équipes/structure_du_premier_degré",
          element: <PremierDegre />,
        },
        {
          path: "les_équipes/structure_du_second_degré",
          element: <SecondDegre />,
        },
        {
          path: "inscription/réinscription_pour_l_année_2025",
          element: <Reinscription />,
        },
        {
          path: "inscription/nouvelle_demande_de_l_inscription",
          element: <NouvelleDemande />,
        },
        {
          path: "inscription/calendrier_scolaire",
          element: <CalendrierScolaire />,
        },
        {
          path: "enseignement/instance_du_pilotage_pédagogique",
          element: <InstanceDuPilotage />,
        },
        {
          path: "enseignement/projet_d_établissement",
          element: <ProjetEtablissement />,
        },
        {
          path: "enseignement/accompagnement_des_elèves",
          element: <Accompagnement />,
        },
        {
          path: "enseignement/politique_des_langues",
          element: <PolitiqueLangue />,
        },
        {
          path: "enseignement/cellule_de_formation_continue",
          element: <Formation />,
        },
        {
          path: "nos_services/buvette_et_restauration",
          element: <Buvette />,
        },
        {
          path: "recrutement",
          element: <Recrutement />,
        },
      ],
    },
    {
      path: "/element",
      element: <RoleSelection />,
    },
    {
      path: "/login",
      element: role && <Login />,
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <Home />,
        </ProtectedRoute>
      ),
    },
    // {
    //   path: "/logout",
    //   element: useLogout() ? (
    //     <RoleSelection setRole={setSelectedRole} />
    //   ) : (
    //     <Home />
    //   ),
    // },

    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return router;
};
export default AppRoute;
