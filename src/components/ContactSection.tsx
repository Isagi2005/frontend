import React from 'react';
import { FaMapMarkerAlt, FaUserGraduate, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const ContactSection: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white overflow-hidden p-4">
      <div className="max-w-full w-full bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
          Informations de Contact et Localisation
        </h2>

        {/* Section Pronote */}
        <div className="flex items-center justify-center mb-6">
          <FaUserGraduate className="h-8 w-8 text-blue-500 mr-2" />
          <a
            href="/pronote" // Remplacez par le lien vers Pronote
            className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors duration-300 hover:bg-blue-600"
          >
            Se Connecter à Pronote
          </a>
        </div>

        {/* Conteneur Flex pour Contact et Localisation */}
        <div className="flex flex-col md:flex-row justify-between">
          {/* Informations de Contact */}
          <div className="w-full md:w-1/2 pr-2 mb-6 md:mb-0">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Contactez-Nous</h3>
            <div className="mb-4 flex items-center">
              <FaPhoneAlt className="h-6 w-6 text-blue-500 mr-2" />
              <p className="text-gray-700">Téléphone : <strong>034 62 510 83</strong></p>
            </div>
            <div className="mb-4 flex items-center">
              <FaEnvelope className="h-6 w-6 text-blue-500 mr-2" />
              <p className="text-gray-700">Email : <strong>Raitra_Kidz@gmail.com</strong></p>
            </div>
            <div className="mb-4 flex items-center">
              <FaMapMarkerAlt className="h-6 w-6 text-blue-500 mr-2" />
              <p className="text-gray-700">Adresse : <strong>EP Raitra Kidz</strong></p>
            </div>
          </div>

          {/* Section Localisation */}
          <div className="w-full md:w-1/2 pl-2">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Localisation</h3>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253934.0385535115!2d47.5543775!3d-18.9497482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x21f07d0f184eeb2f%3A0x4d7be3aa20119b91!2sRaitra%20Kidz!5e0!3m2!1sen!2s!4v1619518075162!5m2!1sen!2s"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="w-full h-full rounded-lg shadow-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;