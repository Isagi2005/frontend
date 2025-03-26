import React from "react";
import { sidebarType } from "../../dataMenu/sidebarItem";

interface MainContentProps {
  activeMenu: sidebarType;
}

const MainContent: React.FC<MainContentProps> = ({ activeMenu }) => {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold">{activeMenu.menu}</h1>
      <p className="mt-2 text-gray-600">Contenu pour "{activeMenu.menu}"</p>
    </div>
  );
};

export default MainContent;
