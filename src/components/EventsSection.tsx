import React from 'react';
import bg1 from '../assets/bg1.jpg';

const EventsSection: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white overflow-hidden p-6">
      {/* Conteneur Principal */}
      <div className="flex flex-col md:flex-row items-center max-w-7xl w-full">
        
        {/* Image Masquée avec une Forme de Vague */}
        <div className="relative w-full md:w-1/2 h-[400px] md:h-[550px]">
          <svg className="absolute w-full h-full">
            <defs>
              <clipPath id="waveMask" clipPathUnits="objectBoundingBox">
                <path d="M0,0 H1 V0.8 Q0.7,1 0.5,0.9 Q0.3,0.8 0,1 Z" />
              </clipPath>
            </defs>
            <image 
              href={bg1} 
              width="100%" 
              height="100%" 
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#waveMask)"
            />
          </svg>
        </div>

        {/* Contenu Textuel Centré à Droite */}
        <div className="md:w-1/2 flex flex-col items-center md:items-start justify-center p-8 md:p-10 text-center md:text-left md:pl-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            NOS OFFRES ADAPTÉES AUX ENTREPRISES
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus quidem id consequuntur officiis tempore at perspiciatis explicabo sunt animi officia laudantium, distinctio ipsum, nobis porro beatae iusto sint! Ut, dolorem?
          </p>

          {/* Bouton Aligné à Droite sous le Texte */}
          <div className="flex justify-center md:justify-start w-full">
            <button className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-blue-600">
              EN SAVOIR PLUS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsSection;