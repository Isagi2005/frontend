"use client";

import { useState } from "react";
import {
  useGetAccueil,
  useGetFooter,
  useGetPresentation,
} from "../../../hooks/useSite";
import TablePresentation from "./TablePresentation";
import TableAccueil from "./TableAccueil";
import TableFooter from "./TableFooter";
import { Home, FileText } from "lucide-react";

// Icône personnalisée pour le pied de page puisque FootprintsIcon n'est pas standard dans lucide-react
const FooterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M4 15l4-8 4 8" />
    <path d="M12 15l4-8 4 8" />
    <path d="M2 21h20" />
  </svg>
);

// Icône personnalisée pour le dashboard
const LayoutDashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

const ListAutre = () => {
  const [activeTab, setActiveTab] = useState("presentation");
  const { data: ListPres, isLoading: loadPres } = useGetPresentation();
  const { data: ListAccueil, isLoading: loadAccueil } = useGetAccueil();
  const { data: ListFooter, isLoading: loadFooter } = useGetFooter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Gestion du Site
        </h1>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab("presentation")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg ${
            activeTab === "presentation"
              ? "bg-emerald-50 text-emerald-700 border-t border-l border-r border-gray-200"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          <FileText
            className={`h-4 w-4 ${
              activeTab === "presentation"
                ? "text-emerald-600"
                : "text-gray-400"
            }`}
          />
          <span>Présentations</span>
        </button>
        <button
          onClick={() => setActiveTab("accueil")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg ${
            activeTab === "accueil"
              ? "bg-purple-50 text-purple-700 border-t border-l border-r border-gray-200"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Home
            className={`h-4 w-4 ${
              activeTab === "accueil" ? "text-purple-600" : "text-gray-400"
            }`}
          />
          <span>Page d'Accueil</span>
        </button>
        <button
          onClick={() => setActiveTab("footer")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg ${
            activeTab === "footer"
              ? "bg-amber-50 text-amber-700 border-t border-l border-r border-gray-200"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span
            className={
              activeTab === "footer" ? "text-amber-600" : "text-gray-400"
            }
          >
            <FooterIcon />
          </span>
          <span>Pied de Page</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {/* Presentation Tab */}
        {activeTab === "presentation" && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            {loadPres ? (
              <LoadingState />
            ) : (
              <div className="mt-4">
                {ListPres && <TablePresentation displayedData={ListPres} />}
              </div>
            )}
          </div>
        )}

        {/* Accueil Tab */}
        {activeTab === "accueil" && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            {loadAccueil ? (
              <LoadingState />
            ) : (
              <div className="mt-4">
                {ListAccueil?.map((accueilData) => (
                  <TableAccueil
                    key={accueilData.id}
                    displayedData={accueilData}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Tab */}
        {activeTab === "footer" && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            {loadFooter ? (
              <LoadingState />
            ) : (
              <div className="mt-4">
                {ListFooter?.map((footerData) => (
                  <TableFooter key={footerData.id} displayedData={footerData} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 relative">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-600">Chargement des données...</p>
    </div>
  );
};

export default ListAutre;
