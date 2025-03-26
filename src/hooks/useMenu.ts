import { useState } from "react";

// Hook personnalisé pour gérer l'état du menu et du sous-menu
const useMenu = () => {
  const [isOpen, setIsOpen] = useState(false); // Ajouter l'état pour le menu
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [selectedSubItem, setSelectedSubItem] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev); // Toggle pour ouvrir/fermer le menu
  };

  const toggleSubMenu = (id: number) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const selectSubItem = (id: number, name: string) => {
    setSelectedSubItem({ id, name });
    setActiveMenuId(null);
  };

  return {
    isOpen,
    toggleMenu,
    activeMenuId,
    selectedSubItem,
    toggleSubMenu,
    selectSubItem,
  };
};

export default useMenu;
