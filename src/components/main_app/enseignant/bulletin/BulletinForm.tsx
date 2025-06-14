import type React from "react"
import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { toast } from "react-toastify"
import { useCreateFullBulletin, useGetDomaine, useGetPeriode } from "../../../../hooks/useBulletin"
import { useGetStudent } from "../../../../hooks/useStudent"
import type { BulletinFormValues } from "../../../../api/bulletinApi"
import {
  Book,
  Calendar,
  CheckCircle,
  ChevronDown,
  FileText,
  Info,
  Lightbulb,
  Loader2,
  MessageSquare,
  Star,
  User,
  XCircle,
} from "lucide-react"

const BulletinForm: React.FC = () => {
  const methods = useForm<BulletinFormValues>()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods
  const { data: domaines = [], isLoading: isLoadingDomaines, isError: isErrorDomaines } = useGetDomaine()
  const { data: etudiants = [], isLoading: isLoadingEtudiants, isError: isErrorEtudiants } = useGetStudent()
  const { data: periodes = [], isLoading: isLoadingPeriodes, isError: isErrorPeriodes } = useGetPeriode()
  const { mutate: addBulletin, isLoading: isSubmittingBulletin } = useCreateFullBulletin()

  const [activeSection, setActiveSection] = useState<string>("general")
  const isLoading = isLoadingDomaines || isLoadingEtudiants || isLoadingPeriodes || isSubmitting || isSubmittingBulletin

  // Gestion loading global
  if (isLoadingDomaines || isLoadingEtudiants || isLoadingPeriodes) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md p-8">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
        <span className="text-blue-700 font-medium text-lg">Chargement des données...</span>
      </div>
    )
  }

  // Gestion erreurs globales
  if (isErrorDomaines || isErrorEtudiants || isErrorPeriodes) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md p-8">
        <XCircle className="h-12 w-12 text-red-600 mb-4" />
        <span className="text-xl font-semibold mb-2 text-red-600">Erreur lors du chargement des données</span>
        <span className="text-gray-600">Veuillez vérifier votre connexion ou réessayer plus tard.</span>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    )
  }

  const onSubmit = (data: BulletinFormValues) => {
    addBulletin(data, {
      onSuccess: () => {
        toast.success("Bulletin créé avec succès !")
        reset()
        setActiveSection("general")
      },
      onError: () => {
        toast.error("Erreur lors de la création du bulletin.")
      },
    })
  }

  return (
    <FormProvider {...methods}>
      <div className="max-w-5xl">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg p-6 shadow-md">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FileText className="mr-2" /> Création d'un nouveau bulletin
          </h2>
          <p className="text-blue-100 mt-1">Remplissez les informations ci-dessous pour créer un bulletin complet</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-b-lg shadow-md p-0 mb-8">
          {/* Navigation par étapes */}
          <div className="flex border-b overflow-x-auto">
            <button
              type="button"
              className={`flex items-center px-6 py-4 font-medium text-sm focus:outline-none ${
                activeSection === "general"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveSection("general")}
            >
              <User className="mr-2 h-4 w-4" /> Informations générales
            </button>
            <button
              type="button"
              className={`flex items-center px-6 py-4 font-medium text-sm focus:outline-none ${
                activeSection === "evaluations"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveSection("evaluations")}
            >
              <Star className="mr-2 h-4 w-4" /> Évaluations par domaine
            </button>
            <button
              type="button"
              className={`flex items-center px-6 py-4 font-medium text-sm focus:outline-none ${
                activeSection === "appreciation"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveSection("appreciation")}
            >
              <MessageSquare className="mr-2 h-4 w-4" /> Appréciations
            </button>
            
          </div>

          <div className="p-6">
            {/* Section Informations générales */}
            {activeSection === "general" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sélection de l'étudiant */}
                  <div>
                    <label className="mb-2 font-medium text-gray-700 flex items-center">
                      <User className="mr-2 h-4 w-4 text-blue-600" /> Élève <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register("eleve", { required: "Veuillez sélectionner un élève" })}
                        className={`w-full border ${errors.eleve ? "border-red-500" : "border-gray-300"} rounded-lg p-3 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Sélectionner un élève</option>
                        {etudiants.map((etudiant) => (
                          <option key={etudiant.id} value={etudiant.id}>
                            {etudiant.prenom} {etudiant.nom}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none h-5 w-5" />
                    </div>
                    {errors.eleve && <p className="mt-1 text-sm text-red-600">{errors.eleve.message}</p>}
                  </div>

                  {/* Sélection de la période */}
                  <div>
                    <label className="mb-2 font-medium text-gray-700 flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-blue-600" /> Période{" "}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register("periode", { required: "Veuillez sélectionner une période" })}
                        className={`w-full border ${errors.periode ? "border-red-500" : "border-gray-300"} rounded-lg p-3 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Sélectionner une période</option>
                        {periodes?.map((periode) => (
                          <option key={periode.id} value={periode.id}>
                            {periode.nom}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none h-5 w-5" />
                    </div>
                    {errors.periode && <p className="mt-1 text-sm text-red-600">{errors.periode.message}</p>}
                  </div>
                </div>

                {/* <div>
                  <label className="mb-2 font-medium text-gray-700 flex items-center">
                    <Star className="mr-2 h-4 w-4 text-blue-600" /> Moyenne générale{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="20"
                    {...register("moyenneGenerale", {
                      required: "La moyenne générale est requise",
                      min: { value: 0, message: "La note minimale est 0" },
                      max: { value: 20, message: "La note maximale est 20" },
                    })}
                    className={`w-full border ${errors.moyenneGenerale ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Ex: 15.5"
                  />
                  {errors.moyenneGenerale && (
                    <p className="mt-1 text-sm text-red-600">{errors.moyenneGenerale.message}</p>
                  )}
                </div> */}

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    onClick={() => setActiveSection("evaluations")}
                  >
                    Continuer <ChevronDown className="ml-2 h-4 w-4 rotate-270" />
                  </button>
                </div>
              </div>
            )}

            {/* Section Appréciations */}
            {activeSection === "appreciation" && (
              <div className="space-y-6">
                <div>
                  <label className="mb-2 font-medium text-gray-700 flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4 text-blue-600" /> Appréciation générale
                  </label>
                  <textarea
                    {...register("appreciationGenerale")}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="Saisissez une appréciation générale sur l'élève..."
                  />
                </div>

                <div>
                  <label className="mb-2 font-medium text-gray-700 flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-blue-600" /> Points forts
                  </label>
                  <textarea
                    {...register("pointsForts")}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="Décrivez les points forts de l'élève..."
                  />
                </div>

                <div>
                  <label className="mb-2 font-medium text-gray-700 flex items-center">
                    <Info className="mr-2 h-4 w-4 text-blue-600" /> Besoins
                  </label>
                  <textarea
                    {...register("besoins")}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="Identifiez les besoins d'amélioration..."
                  />
                </div>

                <div>
                  <label className=" mb-2 font-medium text-gray-700 flex items-center">
                    <Lightbulb className="mr-2 h-4 w-4 text-blue-600" /> Projet
                  </label>
                  <textarea
                    {...register("projet")}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="Décrivez les projets ou objectifs pour l'élève..."
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                    onClick={() => setActiveSection("evaluations")}
                  >
                    <ChevronDown className="mr-2 h-4 w-4 rotate-90" /> Retour
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-5 w-5" /> Création en cours...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" /> Créer le bulletin
                      </>
                    )}
                  </button>
                  
                </div>
              </div>
            )}

            {/* Section Évaluations par domaine */}
            {activeSection === "evaluations" && (
              <div className="space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Évaluez l'élève dans chaque domaine en attribuant une note sur 20 et en ajoutant des
                        commentaires si nécessaire.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Domaine
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                        >
                          Note /20
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Appréciation
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Observation
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {domaines.map((domaine, idx) => (
                        <tr key={domaine.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Book className="h-4 w-4 text-blue-600 mr-2" />
                              <span className="font-medium text-gray-900">{domaine.nom}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              step="0.01"
                              min={0}
                              max={20}
                              {...register(`evaluations.${idx}.valeurNote`, {
                                required: true,
                                min: 0,
                                max: 20,
                              })}
                              className="w-20 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input type="hidden" {...register(`evaluations.${idx}.domaine_id`)} value={domaine.id} />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              {...register(`evaluations.${idx}.appreciation`)}
                              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Très bien, À améliorer..."
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              {...register(`evaluations.${idx}.observations`)}
                              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Observations complémentaires..."
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                    onClick={() => setActiveSection("general")}
                  >
                    <ChevronDown className="mr-2 h-4 w-4 rotate-90" /> Retour
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    onClick={() => setActiveSection("appreciation")}
                  >
                    Continuer <ChevronDown className="ml-2 h-4 w-4 rotate-270" />
                  </button>
                  
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

export default BulletinForm
