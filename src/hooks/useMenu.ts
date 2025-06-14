import { useState } from "react";

const useMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [selectedSubItem, setSelectedSubItem] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleSubMenu = (id: number) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const closeSubMenu = () => {
    setActiveMenuId(null);
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
    closeSubMenu, // ← on exporte ici
    selectSubItem,
  };
};

export default useMenu;
