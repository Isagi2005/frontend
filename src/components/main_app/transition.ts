import {
  directionItem,
  enseignantItem,
  financeItem,
  parentItem,
} from "../../dataMenu/sidebarItem";
import Loading from "../Loading";

const Transition = () => {
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
    }
  };
  selectRole(role);
};
export default Transition;
