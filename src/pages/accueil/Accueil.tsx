import { Link } from "react-router-dom";
import monImage from "../../assets/bga.jpg";
import Events from "../../components/EvenementsScroll";

const Accueil = () => {
  return (
    <>
      <div
        className="mt-24 relative w-full h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${monImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white px-6 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Bienvenue à RAITRA KIDZ
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Une école d'excellence où l'éducation et l'épanouissement des
            enfants sont notre priorité. Découvrez notre programme unique et nos
            activités enrichissantes.
          </p>
          <Link
            to="notre_établissement/présentation"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-lg text-lg transition duration-300 shadow-lg"
          >
            En savoir plus
          </Link>
        </div>
      </div>

      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Nos Événements
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Découvrez les événements à venir qui rythment la vie de notre école.
        </p>
        <Events />
      </section>
    </>
  );
};

export default Accueil;
