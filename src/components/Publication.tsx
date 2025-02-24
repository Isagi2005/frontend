import React, { useEffect, useState } from "react";
import { FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import schoolImage1 from '../assets/bg1.jpg';
import schoolImage2 from '../assets/bg2.jpg';
import schoolImage3 from '../assets/bg3.jpg';

const images = [
  { src: schoolImage1, title: "Bienvenue à l'École", description: "Notre école offre un environnement d'apprentissage stimulant, avec des enseignants dévoués et des installations modernes." },
  { src: schoolImage2, title: "Nos Valeurs", description: "Nous croyons en l'éducation inclusive et en la diversité pour enrichir l'expérience d'apprentissage." },
  { src: schoolImage3, title: "Activités Extrascolaires", description: "Nous proposons une variété d'activités pour favoriser le développement personnel et social de nos élèves." },
];

const Publication: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showElements, setShowElements] = useState(false);
  const [currentElementIndex, setCurrentElementIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      
      setCurrentElementIndex(0);
      setShowElements(false); 
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setShowElements(true); 
      }, 1000); 
    }, 8000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showElements && currentElementIndex < 3) {
      const timeout = setTimeout(() => {
        setCurrentElementIndex((prev) => prev + 1);
      }, 1000); 

      return () => clearTimeout(timeout);
    }
  }, [showElements, currentElementIndex]);

  const handleClick = () => {
    alert("Plus d'infos cliqué !");
  };

  return (
    <div className="relative">
      {/* Section d'en-tête */}
      <div className="relative w-full h-screen">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${images[currentIndex].src})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            height: '100vh',
            width: '100vw',
          }}
        />
        <AnimatePresence>
          {showElements && (
            <div className="relative z-10 bg-white bg-opacity-80 p-6 rounded-lg shadow-lg max-w-md absolute left-1/4 top-1/2 transform -translate-y-1/2">
              <motion.h2 
                className="text-4xl font-bold mb-2"
                key="title" 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                {images[currentIndex].title}
              </motion.h2>
              {currentElementIndex > 0 && (
                <motion.p 
                  className="text-gray-700 mb-4"
                  key="description" 
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
                >
                  {images[currentIndex].description}
                </motion.p>
              )}
              {currentElementIndex > 1 && (
                <motion.button
                  className="flex items-center bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                  whileTap={{ scale: 0.95 }} 
                  onClick={handleClick} 
                  whileHover={{ scale: 1.05 }} 
                  key="button" 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.6 }}
                >
                  <FaInfoCircle className="mr-2" />
                  Plus d'infos
                </motion.button>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Publication;