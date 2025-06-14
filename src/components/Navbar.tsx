import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useMenu from "../hooks/useMenu";
import { menuItems } from "../dataMenu/menuItems";
import monImage from "../assets/logo.png";

interface Props {
  children?: React.ReactNode;
}

const Navbar = ({ children }: Props) => {
  const { isOpen, toggleMenu, activeMenuId, toggleSubMenu, closeSubMenu } =
    useMenu();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Header */}
      <header
        className={`fixed w-full top-0 z-20 transition-all duration-300 shadow-md backdrop-blur-lg 
          ${
            isScrolled
              ? "bg-gradient-to-r from-blue-400 to-green-400 bg-opacity-90 text-gray-900"
              : "bg-gradient-to-r from-emerald-300 to-blue-400 text-blue-950"
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src={monImage}
              alt="RAITRA KIDZ"
              className="h-12 w-auto items-start"
            />
            <span className="text-lg font-bold">Raitra Kidz</span>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex space-x-6">
            {menuItems.map((item) => (
              <div key={item.id} className="relative group">
                {item.subMenu ? (
                  <>
                    <button
                      onClick={() => toggleSubMenu(item.id)}
                      className="text-lg font-semibold uppercase hover:text-yellow-300 transition duration-300"
                    >
                      {item.name}
                    </button>
                    {/* Sous-menu */}
                    {activeMenuId === item.id && (
                      <div
                        onMouseLeave={closeSubMenu}
                        className="absolute top-full left-0 mt-2 bg-white text-gray-900 rounded-lg shadow-lg w-48 py-2"
                      >
                        {item.subMenu.map((subItem) => (
                          <Link
                            key={subItem.id}
                            to={`/${item.name}/${subItem.name}`
                              .replace(/\s+/g, "_")
                              .replace(/[^\wÀ-ÿ/]/g, "_")
                              .toLowerCase()}
                            className="block px-4 py-2 hover:bg-gray-200"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={
                      item.name === "Accueil"
                        ? "/"
                        : `/${item.name.toLowerCase().replace(/\s+/g, "_")}`
                    }
                    className="text-lg font-semibold uppercase hover:text-yellow-300 transition duration-300"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Menu Burger (Mobile) */}
          <button
            onClick={toggleMenu}
            className="md:hidden focus:outline-none p-2 rounded transition duration-300 text-white bg-yellow-500"
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <nav className="md:hidden bg-white text-gray-900 py-4 px-6 space-y-4 shadow-md">
            {menuItems.map((item) => (
              <div key={item.id}>
                {item.subMenu ? (
                  <>
                    <button
                      onClick={() => toggleSubMenu(item.id)}
                      className="block w-full text-left font-semibold uppercase py-2 hover:text-yellow-500"
                    >
                      {item.name}
                    </button>
                    {activeMenuId === item.id && (
                      <div className="pl-4">
                        {item.subMenu.map((subItem) => (
                          <Link
                            key={subItem.id}
                            to={`/${item.name}/${subItem.name}`
                              .replace(/\s+/g, "_")
                              .replace(/[^\wÀ-ÿ/]/g, "_")
                              .toLowerCase()}
                            className="block py-1 text-gray-700 hover:text-yellow-500"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={
                      item.name === "Accueil"
                        ? "/"
                        : `/${item.name.toLowerCase().replace(/\s+/g, "_")}`
                    }
                    className="block font-semibold uppercase py-2 hover:text-yellow-500"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        )}
      </header>

      {/* Contenu principal */}
      <main className="">{children}</main>
    </>
  );
};

export default Navbar;
