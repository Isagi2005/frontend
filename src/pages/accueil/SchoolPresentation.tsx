import type React from "react"
import { motion } from "framer-motion"
import image4 from "../../assets/FB_IMG_17470619288341367.jpg";
// Image fictive pour la directrice
const directorImage = image4

// Logo fictif de l'école

const SchoolPresentation: React.FC = () => {
  return (
    <section className="py-12 bg-white mt-10 w-full">
      <div className=" mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-lg overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row">
            {/* Partie gauche avec photo de la directrice */}
            <div className="w-full md:w-2/5 bg-emerald-50 p-6 flex flex-col items-center justify-center">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-blue-500 mb-4">Mot de la Directrice</h3>
                <div className="w-24 h-1 bg-yellow-300 mx-auto"></div>
              </div>

              <div className="w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={directorImage || "/placeholder.svg"}
                  alt="Directrice Holy RANDRIATSOA MENJAHARISOA"
                  className="w-full h-full object-cover"
                />
              </div>

              <motion.div
                className="text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="bg-red-600 text-white px-4 py-2 rounded-full text-lg font-medium">
                  Holy RANDRIATSOA MENJAHARISOA
                </span>
              </motion.div>
            </div>

            {/* Partie droite avec texte */}
            <div className="w-full md:w-3/5 p-6 text-white">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold bg-green-500 inline-block px-6 py-2 rounded-full shadow-md">
                  Lycée Privé Raitra Kidz
                </h2>
              </div>

              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-blue-800 font-bold text-lg">🇫🇷</span>
                  </div>
                  <p className="italic text-lg">
                    "J'ai décidé de consacrer ma vie professionnelle à l'éducation parce que je crois en la grandeur de
                    chaque enfant."
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-blue-800 font-bold text-lg">🇲🇬</span>
                  </div>
                  <p className="italic text-lg">
                    "Nisafidy ny hisehatra anatin'ny fanabeazana aho satria mino sy mahataky fa manana ny maha izy azy
                    ny Zaza sy ny ankizy tsirairay avy..."
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-blue-800 font-bold text-lg">🇺🇸</span>
                  </div>
                  <p className="italic text-lg">
                    "I've dedicated my lifeworks into education because I believe in the greatness of each child."
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <h3 className="text-2xl font-script text-red-300 font-bold">Maternelle - École - Collège</h3>
              </div>

              <div className="mt-6 flex flex-col md:flex-row justify-between items-center bg-red-600 rounded-lg p-3">
                <div className="flex items-center mb-2 md:mb-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  VILLA MENJA, BY-PASS ALASORA
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  034 62 510 83
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SchoolPresentation
