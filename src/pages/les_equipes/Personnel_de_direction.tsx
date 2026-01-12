"use client"


const Personnel_de_direction = () => {

  const getBackgroundColor = (type?: string) => {
    switch (type) {
      case "direction":
        return "bg-blue-600 text-white"
      case "staff":
        return "bg-green-500 text-white"
      case "responsable":
        return "bg-purple-500 text-white"
      case "documentaliste":
        return "bg-amber-500 text-white"
      case "enseignant":
        return "bg-teal-500 text-white"
      case "aide":
        return "bg-teal-400 text-white"
      default:
        return "bg-white"
    }
  }

  return (
    <div className="container mx-auto px-6 pt-24 pb-12">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Organigramme de l'Établissement
      </h1>

      <div className="bg-gray-50 rounded-xl shadow-lg p-6 overflow-x-auto">
        <div className="flex flex-col items-center">
          {/* Direction */}
          <div
            className={`${getBackgroundColor("direction")} border border-gray-300 p-4 rounded-lg shadow text-center cursor-pointer hover:opacity-90 transition w-64 mb-4`}
          >
            <div className="font-bold">Directeur Général</div>
            <div className="text-sm">Direction</div>
          </div>

          {/* Ligne verticale vers le staff */}
          <div className="w-0.5 h-8 bg-gray-400"></div>

          {/* Staff de direction */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className={`${getBackgroundColor("staff")} border border-gray-300 p-3 rounded-lg shadow text-center w-56`}>
              <div className="font-bold">Assitante de Direction</div>
              <div className="text-sm">Staff Direction</div>
            </div>
            <div className={`${getBackgroundColor("staff")} border border-gray-300 p-3 rounded-lg shadow text-center w-56`}>
              <div className="font-bold">Medecin généraliste</div>
              <div className="text-sm">Staff Direction</div>
            </div>
          </div>

          {/* Ligne verticale vers les responsables */}
          <div className="w-0.5 h-8 bg-gray-400"></div>

          {/* Responsables pédagogiques */}
          <div className="flex justify-center space-x-16 mb-8">
            <div className="flex flex-col items-center">
              <div
                className={`${getBackgroundColor("responsable")} border border-gray-300 p-3 rounded-lg shadow text-center w-64 mb-2`}
              >
                <div className="font-bold">Responsable Pédagogique</div>
                <div className="text-sm">Maternelle & Primaire</div>
              </div>
              <div className="w-0.5 h-8 bg-gray-400"></div>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`${getBackgroundColor("responsable")} border border-gray-300 p-3 rounded-lg shadow text-center w-64 mb-2`}
              >
                <div className="font-bold">Responsable Pédagogique</div>
                <div className="text-sm">Collège & Lycée</div>
              </div>
              <div className="w-0.5 h-8 bg-gray-400"></div>
            </div>
          </div>

          {/* Connexion vers la documentaliste */}
          <div className="relative w-full max-w-2xl mb-8">
            <div className="flex justify-between px-16">
              <div className="w-1/2 h-0.5 bg-gray-400 mt-4"></div>
              <div className="w-1/2 h-0.5 bg-gray-400 mt-4"></div>
            </div>
            <div className="w-0.5 h-8 bg-gray-400 mx-auto"></div>
          </div>

          {/* Documentaliste */}
          <div className="mb-8">
            <div
              className={`${getBackgroundColor("documentaliste")} border border-gray-300 p-3 rounded-lg shadow text-center w-56`}
            >
              <div className="font-bold">Documentaliste</div>
            </div>
          </div>

          {/* Enseignants */}
          <div className="flex justify-center space-x-16">
            {/* Branche gauche - Cycle 1 */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-8 bg-gray-400"></div>
              <div
                className={`${getBackgroundColor("enseignant")} border border-gray-300 p-3 rounded-lg shadow text-center w-56 mb-2`}
              >
                <div className="font-bold">Enseignants Cycle 1</div>
                <div className="text-sm">Maternelle & Primaire</div>
              </div>
              <div className="w-0.5 h-8 bg-gray-400"></div>
              <div
                className={`${getBackgroundColor("aide")} border border-gray-300 p-3 rounded-lg shadow text-center w-56`}
              >
                <div className="font-bold">Aides Maîtresse</div>
                <div className="text-sm">Maternelle & Primaire</div>
              </div>
            </div>

            {/* Branche droite - Cycles 2 et 3 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-0.5 h-8 bg-gray-400"></div>
              <div
                className={`${getBackgroundColor("enseignant")} border border-gray-300 p-3 rounded-lg shadow text-center w-56`}
              >
                <div className="font-bold">Enseignants Cycle 2 et Cycle 3</div>
                <div className="text-sm">Collège et Lycée </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Personnel_de_direction
