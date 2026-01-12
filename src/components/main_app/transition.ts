import {
  directionItem,
  enseignantItem,
  financeItem,
  parentItem,
  type sidebarType,
} from "../../dataMenu/sidebarItem";

const Transition = (): null => {
  const role = localStorage.getItem("role") || "";

  const selectRole = (roleChoice: string): sidebarType[] | null => {
    const validRole = ['direction', 'finance', 'enseignant', 'parent'].includes(roleChoice) 
      ? roleChoice as 'direction' | 'finance' | 'enseignant' | 'parent'
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
  
  // Appel de la fonction pour s'assurer qu'elle s'exécute
  selectRole(role);
  
  // Ce composant ne rend rien, il est utilisé pour les effets de transition
  return null;
};

export default Transition;
