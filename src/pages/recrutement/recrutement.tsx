import ecoleImage from '../../assets/bg2.jpg'; 

const Recrutement= () => {
  return (
    <div className="p-6 mt-24">
    <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row items-center">
      {/* Section de description */}
      <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
        <h1 className="text-4xl font-bold mb-4">RECRUTEMENT</h1>
        <p>Bienvenue à l'école! Voici les informations pertinentes...</p>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Classes proposées :</h2>
          <ul className="list-disc list-inside">
            <li>Classes pour les enfants de 4 à 10 ans.</li>
            <li>Activités pédagogiques variées.</li>
            <li>Suivi personnalisé pour chaque élève.</li>
          </ul>
        </div>
      </div>

      {/* Section d'image */}
      <div className="md:w-1/2">
        <img
          src={ecoleImage} 
          alt="École"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
    </div>
  )
};

export default Recrutement;