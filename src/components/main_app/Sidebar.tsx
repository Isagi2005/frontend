import { HiMenuAlt3 } from "react-icons/hi";
import {
  directionItem,
  enseignantItem,
  financeItem,
  parentItem,
} from "../../dataMenu/sidebarItem";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const nav = useNavigate();
  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);

  const role = localStorage.getItem("role") || '';
  
  type RoleType = 'direction' | 'finance' | 'enseignant' | 'parent';
  
  const selectRole = (roleChoice: string) => {
    const validRole = ['direction', 'finance', 'enseignant', 'parent'].includes(roleChoice) 
      ? roleChoice as RoleType 
      : null;
      
    if (!validRole) return null;
    
    const roleMap = {
      'direction': directionItem,
      'finance': financeItem,
      'enseignant': enseignantItem,
      'parent': parentItem
    };
    
    return roleMap[validRole] || null;
  };
  
  const dataItem = selectRole(role) || [];
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div
      className={`h-screen fixed top-0 left-0 ${
        isOpen ? "w-64" : "w-16"
      } bg-gray-300 duration-500 `}
    >
      <div
        className={`bg-gray-300 min-h-screen ${
          isOpen ? "w-64" : "w-16"
        } duration-500 text-blue-950 px-4 flex flex-col justify-between h-screen absolute shadow-2xl`}
      >
        {/* Partie supérieure : Bouton d'ouverture et menus */}
        <div>
          {/* Bouton pour ouvrir/fermer la sidebar */}
          <div className="py-3 flex justify-end">
            <HiMenuAlt3
              size={26}
              className="cursor-auto"
              onClick={handleOpen}
            />
          </div>

          {/* Liste des menus */}
          <div className="mt-4 flex flex-col gap-2">
            {Array.isArray(dataItem) && dataItem.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseLeave={() => {
                  if (openSubMenu === item.id) {
                    setOpenSubMenu(null);
                  }
                }}
              >
                {/* Élément principal */}
                <button
                  className="flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-zinc-500 rounded-md w-full text-left"
                  onClick={() => {
                    if (item.sous_menu && item.sous_menu.length > 0) {
                      setOpenSubMenu(openSubMenu === item.id ? null : item.id);
                    } else {
                      nav(item.link);
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
                          : " bg-gray-300 absolute left-full ml-2 w-48"
                      }`}
                    >
                      {item.sous_menu.map((sousItem) => (
                        <Link
                          to={sousItem.link}
                          key={sousItem.id}
                          className="flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-700 rounded-md w-full text-left"
                        >
                          <div>
                            {sousItem.icon &&
                              React.createElement(sousItem.icon, { size: 18 })}
                          </div>
                          <h2>{sousItem.menu}</h2>
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
