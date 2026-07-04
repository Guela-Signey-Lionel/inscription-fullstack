import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import ConnexionPage from "../pages/connexion/page";
import InscriptionComptePage from "../pages/inscription-compte/page";
import ConnexionAdminPage from "../pages/connexion-admin/page";
import ForgotPasswordPage from "../pages/mot-de-passe-oublie/page";
import CandidatDashboard from "../pages/candidat/tableau-de-bord/page";
import CandidatInscription from "../pages/candidat/inscription/page";
import CandidatProfil from "../pages/candidat/profil/page";
import CandidatParametres from "../pages/candidat/parametres/page";
import CandidatDocuments from "../pages/candidat/documents/page";
import CandidatFormations from "../pages/candidat/formations/page";
import CandidatMessages from "../pages/candidat/messages/page";
import AdminDashboard from "../pages/admin/tableau-de-bord/page";
import AdminDossiers from "../pages/admin/dossiers/page";
import AdminDossierDetail from "../pages/admin/dossier-detail/page";
import AdminStatistiques from "../pages/admin/statistiques/page";
import AdminParametres from "../pages/admin/parametres/page";
import AdminProfil from "../pages/admin/profil/page";
import AdminMessages from "../pages/admin/messages/page";
import PaiementSucces from "../pages/candidat/paiement/succes/page";
import PaiementEchec from "../pages/candidat/paiement/echec/page";
import CandidatFAQ from "../pages/candidat/faq/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/connexion",
    element: <ConnexionPage />,
  },
  {
    path: "/connexion-admin",
    element: <ConnexionAdminPage />,
  },
  {
    path: "/inscription-compte",
    element: <InscriptionComptePage />,
  },
  {
    path: "/mot-de-passe-oublie",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/candidat/tableau-de-bord",
    element: <CandidatDashboard />,
  },
  {
    path: "/candidat/inscription",
    element: <CandidatInscription />,
  },
  {
    path: "/candidat/profil",
    element: <CandidatProfil />,
  },
  {
    path: "/candidat/parametres",
    element: <CandidatParametres />,
  },
  {
    path: "/candidat/documents",
    element: <CandidatDocuments />,
  },
  {
    path: "/candidat/formations",
    element: <CandidatFormations />,
  },
  {
    path: "/candidat/messages",
    element: <CandidatMessages />,
  },
  {
    path: "/candidat/faq",
    element: <CandidatFAQ />,
  },
  {
    path: "/candidat/paiement/succes",
    element: <PaiementSucces />,
  },
  {
    path: "/candidat/paiement/echec",
    element: <PaiementEchec />,
  },
  {
    path: "/admin/tableau-de-bord",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/dossiers",
    element: <AdminDossiers />,
  },
  {
    path: "/admin/dossier/:id",
    element: <AdminDossierDetail />,
  },
  {
    path: "/admin/messages",
    element: <AdminMessages />,
  },
  {
    path: "/admin/statistiques",
    element: <AdminStatistiques />,
  },
  {
    path: "/admin/parametres",
    element: <AdminParametres />,
  },
  {
    path: "/admin/profil",
    element: <AdminProfil />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;