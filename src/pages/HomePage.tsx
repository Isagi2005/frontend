import { useState } from "react";
import { directionItem, financeItem } from "../dataMenu/sidebarItem";
import MainContent from "../components/main_app/MainSection";
import Header from "../components/main_app/Header";
import Sidebar from "../components/main_app/Sidebar";

const Home = () => {
  const [activeMenu, setActiveMenu] = useState(directionItem[0]);
  return (
    <div>
      <div className="">
        <Header />
      </div>

      <div className="flex">
        <div className="">
          <Sidebar setActiveMenu={setActiveMenu} />
        </div>
        <div className="ml-64 p-4 w-full h-screen overflow-y-auto">
          <MainContent activeMenu={activeMenu} />
        </div>
      </div>
    </div>
  );
};
export default Home;
