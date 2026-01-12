import { createBrowserRouter, Outlet, RouteObject } from "react-router-dom";
import Reinscription from "../pages/inscription/Reinscription";
import NouvelleDemande from "../pages/inscription/Nouvelle_demande";
import CalendrierScolaire from "../pages/inscription/CalendrierScolaire";
import Buvette from "../pages/nos_service/Buvette";
import AccueilPage from "../pages/accueil/accueilPage";
import Recrutement from "../pages/recrutement/recrutement";
import Presentation from "../pages/notre_etablissement/Presentation";
import Navbar from "../components/Navbar";
import RoleSelection from "../components/Role";
import Login from "../pages/Login";
import Footer from "../components/Footer";
import Home from "../pages/HomePage";
import NotFound from "../pages/NotFound";
import Personnel_de_direction from "../pages/les_equipes/Personnel_de_direction";
import EventPages from "../pages/EventPages";
import RedirectToDashboard from "../components/GetRole";
import { routesByRole } from "./routeByRole";
import ProtectedRoute from "./ProtectedRoute";
import UserForm from "../components/main_app/personnel/updateUser";

type Role = 'direction' | 'finance' | 'enseignant' | 'parent';

interface CustomRoute extends Omit<RouteObject, 'children'> {
  allowedRoles?: Role[];
  children?: CustomRoute[];
  path: string;
  element: React.ReactNode;
}


const AppRoute = () => {
  const allRoutes: CustomRoute[] = Object.entries(routesByRole).flatMap(([role, routes]) =>
    routes.map((route) => ({
      ...route,
      allowedRoles: [role as Role],
      path: route.path.startsWith('/') ? route.path.slice(1) : route.path
    }))
  );
  
  const role = localStorage.getItem("role") as Role | null;
  
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
          element: <AccueilPage />,
        },
        {
          path: "notre_établissement/présentation",
          element: <Presentation />,
        },

        {
          path: "les_équipes",
          element: <Personnel_de_direction />,
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
          path: "nos_services/buvette_restauration_et_transport_scolaire",
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
      path: "/event/:id",
      element: <EventPages />,
    },
    {
      path: "/event",
      element: <EventPages />,
    },
    {
      path: "/login",
      element: role && <Login />,
    },
    {
      path: "/unauthorized",
      element: <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-4">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retour
          </button>
        </div>
      </div>,
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute
          allowedRoles={["direction", "finance", "enseignant", "parent"]}
        >
          <Home>
            <Outlet />
          </Home>
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <RedirectToDashboard />,
        },
        {
          path: "modif/:id",
          element: <UserForm />,
        },
        ...allRoutes.map(({ path, element, allowedRoles }) => ({
          path,
          element: (
            <ProtectedRoute allowedRoles={allowedRoles || []}>
              {element}
            </ProtectedRoute>
          ),
        })) as RouteObject[],
      ],
    },

    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return router;
};
export default AppRoute;
