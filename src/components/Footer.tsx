import React from "react";
import monImage from "../assets/Logo1.png";
import {
  FaFacebook,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGetFooter } from "../hooks/useSite";

const Footer: React.FC = () => {
  const { data: listData, isLoading, isError } = useGetFooter();
  return (
    <footer className="bg-emerald-100 pt-10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Contenu Principal */}
        <div className="grid grid-cols-1 xl:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-8 xl: text-gray-700">
          {/* Logo & Infos */}
          <div className="text-center md:text-left ">
            <Link to="/element">
              <img
                src={monImage}
                alt="RAITRA KIDZ"
                className="h-auto w-screen mx-auto md:mx-0"
              />
            </Link>
          </div>

          {/* Contact */}
          {isLoading || isError || listData?.length <=0  ? (
            <div className="text-center md:text-left bg-white py-4 px-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-red-600 mb-4">
                CONTACTEZ-NOUS
              </h3>
              <div className="mb-3 flex items-center">
                <FaPhoneAlt className="h-6 w-6 text-blue-500 mr-2" />
                <p>+261 34 62 510 83</p>
              </div>
              <div className="mb-3 flex items-center">
                <FaEnvelope className="h-6 w-6 text-blue-500 mr-2" />
                <p>raitra.kidz@gmail.com</p>
              </div>
              <div className="mb-3 flex items-center">
                <FaMapMarkerAlt className="h-6 w-6 text-blue-500 mr-2" />
                <p>Villa Menja By-Pass Alasora</p>
              </div>
            </div>
          ) : (
            listData?.map((data) => (
              <div
                key={data.id}
                className="xl:text-center md:text-center bg-white py-4 px-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold text-red-600 mb-4">
                  CONTACTEZ-NOUS
                </h3>
                <div className="mb-3 flex">
                  <FaPhoneAlt className="h-6 w-6 text-blue-500 mr-2" />
                  <p>+{data.contact}</p>
                </div>
                <div className="mb-3 flex">
                  <FaEnvelope className="h-6 w-6 text-blue-500 mr-2" />
                  <p>{data.emailInfo}</p>
                </div>
                <div className="mb-3 flex">
                  <FaMapMarkerAlt className="h-6 w-6 text-blue-500 mr-2" />
                  <p>{data.adresse}</p>
                </div>
              </div>
            ))
          )}

          {/* Réseaux sociaux */}
          <div className="text-center md:text-left bg-white py-4 px-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-red-600 mb-4">
              SUIVEZ-NOUS
            </h3>
            <p className="text-gray-600">
              Rejoignez-nous sur les réseaux sociaux pour suivre nos actualités.
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <a
                href="https://web.facebook.com/p/Raitra-Kidz-Creche-Garderie-Ecole-100068664767491/?_rdc=1&_rdr"
                className="text-gray-600 hover:text-black text-2xl"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.instagram.com/ep_raitra_kidz/"
                className="text-gray-600 hover:text-black text-2xl"
              >
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-600 hover:text-black text-2xl">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Localisation */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-red-600 mb-4">
              NOUS TROUVER
            </h3>
            <div className="mt-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253934.0385535115!2d47.5543775!3d-18.9497482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x21f07d0f184eeb2f%3A0x4d7be3aa20119b91!2sRaitra%20Kidz!5e0!3m2!1sen!2s!4v1619518075162!5m2!1sen!2sz=17&zoomcontrol=1"
                width="100%"
                height="200"
                className="rounded-lg shadow-md border border-gray-300"
                allowFullScreen
                style={{ border: "0" }}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Bas de page */}
      <div className="bg-indigo-400 text-black text-center py-3 mt-10">
        <p className="text-sm">2025 © RAITRA KIDZ</p>
      </div>
    </footer>
  );
};

export default Footer;
