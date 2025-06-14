import Header from "../components/main_app/Header";
import Sidebar from "../components/main_app/Sidebar";
import { useState } from "react";

interface HomeProps {
  children?: React.ReactNode;
}

const Home = ({ children }: HomeProps) => {
  const [isOpen, setIsOpen] = useState(true); // true = ouverte par défaut
  const role = localStorage.getItem("role")
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0">
        <Header />
      </div>

      {/* Contenu principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar contrôlée */}
        {role !== "parent" && (<Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />)}

        {/* Main avec padding dynamique */}
        <main
          className={`flex-1 overflow-y-auto transition-all duration-500 p-4 bg-gray-50 ${
            isOpen ? "ml-60" : "ml-10"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Home;
