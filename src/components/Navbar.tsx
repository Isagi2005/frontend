import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Menu } from "lucide-react";
import { FaAngleDown } from 'react-icons/fa'; 
import logo from '../assets/logo.jpg';
import Publication from './Publication';
import EventsSection from './EventsSection'; // Importer le nouveau composant
import ContactSection from "./ContactSection";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>("accueil");
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  let closeTimeout: NodeJS.Timeout;

  const handleClick = (sectionName: string) => {
    setCurrentSection(sectionName);
    setIsOpen(false);
    document.getElementById(sectionName)?.scrollIntoView({ behavior: 'smooth' });
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
      <nav className={`fixed top-0 left-0 w-full z-50 px-6 lg:px-8 transition-all duration-300 ${isScrolled ? "bg-slate-100 shadow-xl" : "bg-slate-100 bg-opacity-80 shadow-xl"} rounded-lg`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          <motion.div className="flex items-center" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
          </motion.div>
          <div className="hidden md:flex space-x-8">
            {[{
              name: "accueil",
              submenu: null
            }, {
              name: "notre-etablissement",
              submenu: ["Présentation", "École", "Collège", "Infrastructure", "Calendrier Scolaire"]
            }, {
              name: "equipes",
              submenu: ["Personnels de Direction", "Structure de 1ère Degré", "Structure de 2nde Degré"]
            }, {
              name: "inscription",
              submenu: ["Réinscription 2025", "Nouvelle Demande", "Frais de Scolarité", "Liste des Fournitures"]
            }, {
              name: "enseignant",
              submenu: ["Instance de Pilotage", "Projet d'Établissement", "Accompagnement", "Politique de Langue", "Formation Continue"]
            }, {
              name: "nos-services",
              submenu: ["Buvette", "Cantine Scolaire"]
            }, {
              name: "recrutement",
              submenu: null
            }].map(({ name, submenu }) => (
              <div key={name} className="relative"
                   onMouseEnter={() => {
                     clearTimeout(closeTimeout);
                     setDropdownOpen(name);
                   }}
                   onMouseLeave={() => {
                     closeTimeout = setTimeout(() => setDropdownOpen(null), 300);
                   }}>
                <motion.div className="transition-all duration-300 flex items-center" whileHover={{ scale: 1.05 }}>
                  <a href={`#${name}`} onClick={() => handleClick(name)} className="text-black hover:text-blue-400 transition-colors duration-300">
                    {name.replace("-", " ").toUpperCase()}
                  </a>
                  {submenu && <FaAngleDown className="ml-1 text-gray-500" />}
                </motion.div>
                {submenu && dropdownOpen === name && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }} 
                    exit={{ opacity: 0, height: 0 }} 
                    transition={{ duration: 0.3 }} 
                    className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg"
                    onMouseEnter={() => clearTimeout(closeTimeout)} 
                    onMouseLeave={() => setDropdownOpen(null)}
                  >
                    {submenu.map((subitem) => (
                      <a key={subitem} 
                         href={`#${subitem.replace(" ", "-").toLowerCase()}`} 
                         onClick={() => {
                           handleClick(subitem.replace(" ", "-").toLowerCase());
                           setDropdownOpen(null);
                         }} 
                         className="block px-4 py-2 text-black hover:bg-blue-200">
                        {subitem}
                      </a>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-black hover:text-blue-400">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <Publication />

      {/* Utilisation du composant EventsSection */}
      <EventsSection />
      <ContactSection />
    </div>
  );
};

export default Navbar;