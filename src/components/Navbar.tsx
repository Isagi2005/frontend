// Navbar.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Menu } from "lucide-react";
import { FaAngleDown } from 'react-icons/fa'; 
import logo from '../assets/logo.jpg';
import Publication from './Publication'; // Importez le nouveau composant

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>("accueil");
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null); 

  const handleClick = (sectionName: string) => {
    setCurrentSection(sectionName);
    setIsOpen(false);
    document.getElementById(sectionName)?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleDropdown = (item: string) => {
    setDropdownOpen(dropdownOpen === item ? null : item); 
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-white">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 px-6 lg:px-8 transition-all duration-300 ${
          isScrolled ? "bg-slate-100 shadow-xl" : "bg-slate-100 bg-opacity-80 shadow-xl"
        } rounded-lg`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
          </motion.div>

          {/* Liens Desktop */}
          <div className="hidden md:flex space-x-8">
            {[
              { name: "accueil", submenu: null },
              { name: "notre-etablissement", submenu: ["Présentation", "École", "Collège", "Infrastructure", "Calendrier Scolaire"] },
              { name: "equipes", submenu: ["Personnels de Direction", "Structure de 1ère Degré", "Structure de 2nde Degré"] },
              { name: "inscription", submenu: ["Réinscription 2025", "Nouvelle Demande", "Frais de Scolarité", "Liste des Fournitures"] },
              { name: "enseignant", submenu: ["Instance de Pilotage", "Projet d'Établissement", "Accompagnement", "Politique de Langue", "Formation Continue"] },
              { name: "nos-services", submenu: ["Buvette", "Cantine Scolaire"] },
              { name: "recrutement", submenu: null },
            ].map(({ name, submenu }) => (
              <div key={name} className="relative">
                <motion.div
                  className="transition-all duration-300 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => submenu && toggleDropdown(name)} // Ouvrir le menu au clic
                >
                  <a
                    href={`#${name}`}
                    onClick={() => handleClick(name)}
                    className="text-black hover:text-blue-400 transition-colors duration-300"
                  >
                    {name.replace("-", " ").toUpperCase()}
                  </a>
                  {submenu && (
                    <FaAngleDown className="ml-1 text-gray-500" />
                  )}
                </motion.div>

                {submenu && dropdownOpen === name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg"
                  >
                    {submenu.map((subitem) => (
                      <a
                        key={subitem}
                        href={`#${subitem.replace(" ", "-").toLowerCase()}`} 
                        onClick={() => handleClick(subitem.replace(" ", "-").toLowerCase())}
                        className="block px-4 py-2 text-black hover:bg-blue-200"
                      >
                        {subitem}
                      </a>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Bouton Menu Mobile */}
          <button
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className="md:hidden text-black hover:text-blue-400"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <motion.div
            className="md:hidden bg-slate-100 bg-opacity-90 shadow-xl absolute top-16 left-0 w-full rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="px-6 py-3 space-y-2">
              {[
                "accueil",
                "notre-etablissement",
                "equipes",
                "inscription",
                "enseignant",
                "nos-services",
                "recrutement",
              ].map((item) => (
                <motion.div
                  key={item}
                  className="transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <a
                    href={`#${item}`}
                    onClick={() => handleClick(item)}
                    className="block text-black hover:text-blue-400 transition-colors duration-300 text-lg"
                  >
                    {item.replace("-", " ").toUpperCase()}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Section de Publication */}
      <Publication />
    </div>
  );
};

export default Navbar;