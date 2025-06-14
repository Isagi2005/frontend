import ChatContainer from "../components/chat/ChatContainer";
import ListClasse from "../components/main_app/classe/ListClasse";
import ListAutre from "../components/main_app/contenu/ListAutre";
import ListEvent from "../components/main_app/contenu/ListEvent";
// import DashboardEcolage from "../components/main_app/dashboard/DashboardEcolage";
// import EmployePage from "../components/main_app/employe/AjoutEmploye";
import BulletinContainer from "../components/main_app/enseignant/bulletin/BulletinContainer";
import PeriodeManagement from "../components/main_app/enseignant/bulletin/PeriodeManagement";
import TransitionPresence from "../components/main_app/enseignant/presence/TransitionPresence";
import RapportPedagogiqueBoard from "../components/main_app/enseignant/RapportPedagogiqueBoard";
import DirectionDashboard from "../components/main_app/enseignant/stat/Dashboard";
import { EnseignantDashboard } from "../components/main_app/enseignant/stat/DashboardE";
// import CongesManagement from "../components/main_app/gestion_employe/CongesManagement";
import ClasseList from "../components/main_app/paiement/ClasseList";
import HistoriquePaiement from "../components/main_app/paiement/HistoriquePaiement";
// import RapportFinancierList from "../components/main_app/paiement/RapportFinancierList";
import SelectClasse from "../components/main_app/paiement/SelectClasse";
import DashboardContainer from "../components/main_app/parent/Container";
import CreateUser from "../components/main_app/personnel/CreateUsers";
import ListPersonnel from "../components/main_app/personnel/ListPersonnel";
import RapportPedagogiqueDirectionBoard from "../components/main_app/RapportPedagogiqueDirectionBoard";
// import RecrutementAdminPage from "../components/main_app/RecrutementAdminPage";
// import ServiceManager from "../components/main_app/ServiceManager";
import ListEtudiantPage from "../pages/enseignant/listEtudiantPage";
import Demandes from "../pages/inscription/SectionInscription";
import StatistiquesClassePage from '../pages/StatistiquesClasse';

export const routesByRole = {
  direction: [
    { path: "contenu/evenements", element: <ListEvent />, label: "Événements", keywords: ["événements", "evenements", "event", "agenda", "manifestation"] },
    { path: "contenu/inscription", element: <Demandes />, label: "Demandes d'inscription", keywords: ["inscription", "demandes", "enregistrement", "nouvel élève"] },
    { path: "classe", element: <ListClasse />, label: "Gestion des classes", keywords: ["classe", "classes", "gestion classe", "liste classe"] },
    { path: "contenu/autre", element: <ListAutre />, label: "Autres contenus", keywords: ["autre", "contenu divers", "autres"] },
    { path: "personnel/user", element: <ListPersonnel />, label: "Gestion des utilisateurs", keywords: ["utilisateur", "utilisateurs", "user", "personnel", "gestion personnel"] },
    { path: "periode", element: <PeriodeManagement />, label: "Gestion des périodes", keywords: ["période", "periodes", "gestion période", "trimestre", "semestre"] },
    { path: "createUser/", element: <CreateUser />, label: "Créer un utilisateur", keywords: ["créer utilisateur", "ajouter utilisateur", "nouvel utilisateur"] },
    // { path: "dashboard", element: <DashboardEcolage />, label: "Tableau de bord financier", keywords: ["dashboard", "tableau de bord", "financier", "accueil", "statistiques"] },
    { path: "dashboard1", element: <DirectionDashboard />, label: "Tableau de bord pédagogique", keywords: ["dashboard", "tableau de bord", "pédagogique", "accueil", "statistiques"] },
    // { path: "contenu/recrutement", element: <RecrutementAdminPage/>, label: "Recrutement", keywords: ["recrutement", "embauche", "nouvel employé"] },
    // { path: "contenu/services", element: <ServiceManager/>, label: "Gestion des services", keywords: ["services", "gestion services", "prestations"] },
    // { path: "rapport/financier", element: <RapportFinancierList/>, label: "Rapports financiers", keywords: ["rapport financier", "financier", "finance", "bilan"] },
    // { path: "conges", element: <CongesManagement/>, label: "Gestion des congés", keywords: ["congés", "absences", "gestion congé", "vacances"] },
    { path: "com", element: <ChatContainer />, label: "Messagerie", keywords: ["messagerie", "message", "chat", "communication"] },
    // { path: "gestion/employe", element: <EmployePage />, label: "Gestion des employés", keywords: ["employé", "employés", "gestion employé", "personnel"] },
    { path: "rapport/pedagogique", element: <RapportPedagogiqueDirectionBoard/>, label: "Rapports pédagogiques", keywords: ["rapport pédagogique", "pédagogie", "rapports", "journalier", "suivi"] },
    { path: "etudiant", element: <ListEtudiantPage/>, label: "gestion etudiant", keywords: ["etudiant", "eleve", "student", "journal"] },
    { path: "bulletinDir", element: <BulletinContainer/>, label: "gestion bulletin", keywords: ["bulletin", "note"] }
  ],
  finance: [
    {
      path: "dashboardF",
      element: "dashboardFinance",
    },
    
    {
      path: "comFinance",
      element: <ChatContainer />,
    },
    {
      path: "gestion/paiement",
      element: <SelectClasse />,
    },
    {
      path: "gestion/paiement/classe/:id",
      element: <ClasseList />,
    },

    {
      path: "gestion/historique",
      element: <HistoriquePaiement/>,
    },
    
  ],

  
  enseignant: [
    { path: "dashboardE", element:<div className="mx-10 my-2"><EnseignantDashboard/></div>, label: "Tableau de bord enseignant", keywords: ["dashboard", "tableau de bord", "enseignant", "accueil", "statistiques"] },
    { path: 'statistiques', element: <StatistiquesClassePage />, label: "Statistiques de classe", keywords: ["statistiques", "classe", "résultats", "notes", "performance"] },
    { path: "bulletin", element: <BulletinContainer/>, label: "Gestion des bulletins", keywords: ["bulletin", "bulletins", "gestion bulletin", "notes", "résultats"] },
    { path: "comProf", element:<ChatContainer/>, label: "Messagerie professeur", keywords: ["messagerie", "message", "chat", "professeur", "com"] },
    { path: "gestion/eleve", element: <ListEtudiantPage />, label: "Gestion des élèves", keywords: ["élève", "élèves", "gestion élève", "étudiant", "liste élèves"] },
    { path: "gestion/presence", element: <TransitionPresence />, label: "Gestion des présences", keywords: ["présence", "présences", "gestion présence", "absences"] },
    { path: "rapportJour", element: <RapportPedagogiqueBoard/>, label: "Rapports pédagogiques", keywords: ["rapport pédagogique", "pédagogique", "rapports", "journal", "suivi"] },
    
  ],
  parent: [
   {
    path: "dashboardP",
    element: <DashboardContainer />,
   },
  ],
};
