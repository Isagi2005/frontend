"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Loader,
  AlertTriangle,
  CalendarDays,
  ChevronRight,
  School,
  BookOpen,
  Users,
  GraduationCap,
  RefreshCw,
} from "lucide-react"
import { useGetClass } from "../../../hooks/useClass"
import { useGet } from "../../../hooks/useAnnee"

const SelectClasse = () => {
  const navigate = useNavigate()
  const [selectedAnnee, setSelectedAnnee] = useState<string>("")
  const [isHovering, setIsHovering] = useState<number | null>(null)
  const [anneeMap, setAnneeMap] = useState<Record<number, string>>({})

  const { data: classes, isLoading, isError, error } = useGetClass()

  const {
    data: anneesScolaires,
    isLoading: isLoadingAnnees,
    isError: isErrorAnnees,
    error: errorAnnees,
  } = useGet()

  // Créer un mapping des IDs d'années vers les valeurs d'années scolaires
  useEffect(() => {
    if (anneesScolaires) {
      const mapping: Record<number, string> = {}
      anneesScolaires.forEach((annee) => {
        mapping[annee.id] = annee.anneeScolaire
      })
      setAnneeMap(mapping)
    }
  }, [anneesScolaires])

  const filteredClasses = selectedAnnee
    ? classes?.filter((classe) => classe.anneeScolaire === Number(selectedAnnee))
    : classes

  if (isLoading || isLoadingAnnees) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="relative">
          <Loader className="animate-spin text-indigo-600" size={60} />
          <div className="absolute inset-0 flex items-center justify-center">
            <School className="text-indigo-400" size={24} />
          </div>
        </div>
        <span className="mt-6 text-xl text-indigo-700 font-medium animate-pulse">Chargement des classes...</span>
        <span className="text-sm text-indigo-500 mt-2">Préparation de votre espace de gestion</span>
      </div>
    )
  }

  if (isError || isErrorAnnees) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
          <div className="bg-red-100 p-5 rounded-full inline-flex mb-2 animate-bounce">
            <AlertTriangle size={48} className="text-red-600" />
          </div>
          <h3 className="mt-4 text-2xl font-bold text-gray-800">Oups ! Une erreur est survenue</h3>
          <p className="text-gray-600 mt-3 mb-6">
            {error?.message || errorAnnees?.message || "Impossible de charger les données. Veuillez réessayer."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <RefreshCw size={18} className="animate-spin-slow" />
            <span>Réessayer</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header avec animation */}
        <header className="mb-12 relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-200 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-200 rounded-full opacity-30 blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-lg shadow-md">
                  <GraduationCap className="text-white" size={24} />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                    Sélection de classe
                  </span>
                </h1>
              </div>
              <p className="text-gray-600 pl-1">
                Choisissez une classe pour accéder à ses détails et gérer les paiements
              </p>
            </div>

            {/* Sélecteur Année avec animation */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-delay">
              <div className="relative w-full sm:w-72">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CalendarDays className="text-indigo-500" size={20} />
                </div>
                <select
                  className="w-full pl-10 pr-10 py-3 border-2 border-indigo-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-700 transition-all duration-300 hover:border-indigo-300"
                  value={selectedAnnee}
                  onChange={(e) => setSelectedAnnee(e.target.value)}
                  style={{ appearance: "none" }}
                >
                  <option value="">Toutes les années scolaires</option>
                  {anneesScolaires?.map((annee) => (
                    <option key={annee.id} value={annee.id}>
                      {annee.anneeScolaire}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronRight className="text-indigo-500 transform rotate-90" size={20} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Grille de classes avec animations */}
        <main className="relative z-10">
          {filteredClasses?.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-10 text-center max-w-2xl mx-auto animate-fade-in">
              <div className="bg-indigo-100 p-5 rounded-full inline-flex mb-4">
                <BookOpen size={48} className="text-indigo-500" />
              </div>
              <h3 className="text-2xl font-medium text-gray-800">Aucune classe disponible</h3>
              <p className="text-gray-500 mt-3 max-w-md mx-auto">
                {selectedAnnee
                  ? "Aucune classe n'est associée à l'année scolaire sélectionnée."
                  : "Aucune classe n'est actuellement disponible dans le système."}
              </p>
              {selectedAnnee && (
                <button
                  onClick={() => setSelectedAnnee("")}
                  className="mt-6 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Voir toutes les classes
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredClasses?.map((classe, index) => (
                <div
                  key={classe.id}
                  className={`bg-white rounded-2xl border-2 border-indigo-100 shadow-sm hover:shadow-xl p-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                    isHovering === classe.id ? "border-indigo-300 bg-indigo-50/30" : ""
                  }`}
                  onClick={() => navigate(`/home/gestion/paiement/classe/${classe.id}`)}
                  onMouseEnter={() => setIsHovering(classe.id)}
                  onMouseLeave={() => setIsHovering(null)}
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    animation: "fadeInUp 0.5s ease-out forwards",
                    opacity: 0,
                    transform: "translateY(20px)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-3 rounded-lg ${
                          isHovering === classe.id ? "bg-gradient-to-br from-indigo-500 to-purple-600" : "bg-indigo-100"
                        } transition-all duration-300`}
                      >
                        <Users
                          size={22}
                          className={`${
                            isHovering === classe.id ? "text-white" : "text-indigo-600"
                          } transition-all duration-300`}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {classe.nom ?? "Nom non disponible"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <CalendarDays size={14} className="text-indigo-400" />
                          <span>
                            {/* Afficher l'année scolaire complète au lieu de juste l'ID */}
                            {anneeMap[classe.anneeScolaire] || `Année ${classe.anneeScolaire}`}
                          </span>
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={20}
                      className={`${
                        isHovering === classe.id ? "text-indigo-600 translate-x-1" : "text-gray-400"
                      } transition-all duration-300`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* CSS pour les animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }
        
        .animate-spin-slow {
          animation: spin 2s linear infinite;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default SelectClasse
