import { HiMenuAlt3 } from "react-icons/hi";
import {
  directionItem,
  enseignantItem,
  financeItem,
  parentItem,
  sidebarType,
} from "../../dataMenu/sidebarItem";
import React, { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { UseLogout } from "../../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../api/AuthContext";

interface SidebarProps {
  setActiveMenu: (menu: sidebarType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveMenu }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const nav = useNavigate();
  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);
  const { logout } = useAuth();

  const handleLogout = async () => {
    logout();
    nav("/login");
  };

  const role = localStorage.getItem("role");
  const selectRole = (roleChoice: string) => {
    switch (roleChoice) {
      case "direction":
        return directionItem;
      case "finance":
        return financeItem;
      case "enseignant":
        return enseignantItem;
      case "parent":
        return parentItem;
      default:
        return null;
    }
  };
  const dataItem = selectRole(role);

  return (
    <div
      className={`bg-[#0e0e0e] min-h-screen fixed ${
        isOpen ? "w-72" : "w-16"
      } duration-500 text-gray-100 px-4 flex flex-col justify-between h-screen absolute`}
    >
      {/* Partie supérieure : Bouton d'ouverture et menus */}
      <div>
        {/* Bouton pour ouvrir/fermer la sidebar */}
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-wait"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>

        {/* Liste des menus */}
        <div className="mt-4 flex flex-col gap-2">
          {dataItem?.map((item) => (
            <div key={item.id} className="relative">
              {/* Élément principal */}
              <button
                className="flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md w-full text-left"
                onClick={() => {
                  if (item.sous_menu && item.sous_menu.length > 0) {
                    setOpenSubMenu(openSubMenu === item.id ? null : item.id);
                  } else {
                    setActiveMenu(item);
                  }
                }}
              >
                {/* Icône */}
                <div>
                  {item.icon && React.createElement(item.icon, { size: 20 })}
                </div>

                {/* Texte du menu */}
                <h2
                  className={`whitespace-pre duration-500 ${
                    !isOpen && "opacity-0 translate-x-28 overflow-hidden"
                  }`}
                >
                  {item.menu}
                </h2>
              </button>

              {/* Sous-menus si disponibles */}
              {item.sous_menu &&
                item.sous_menu.length > 0 &&
                openSubMenu === item.id && (
                  <div
                    className={`rounded-md shadow-lg py-2 ${
                      isOpen
                        ? "w-full ml-4"
                        : " bg-gray-800 absolute left-full ml-2 w-48"
                    }`}
                  >
                    {item.sous_menu.map((sousItem) => (
                      <button
                        key={sousItem.id}
                        className="flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-700 rounded-md w-full text-left"
                        onClick={() => setActiveMenu(sousItem)}
                      >
                        <div>
                          {sousItem.icon &&
                            React.createElement(sousItem.icon, { size: 18 })}
                        </div>
                        <h2>{sousItem.menu}</h2>
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>

      {/* Bouton Déconnexion (fixé en bas) */}
      <div className="py-4">
        <button
          onClick={handleLogout}
          className="flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-700 rounded-md w-full text-left"
        >
          <div>
            <FaSignOutAlt />
          </div>
          <h2
            className={`whitespace-pre duration-500 ${
              !isOpen && "opacity-0 translate-x-28 overflow-hidden"
            }`}
          >
            Déconnexion
          </h2>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
