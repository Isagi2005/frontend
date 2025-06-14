import { useForm } from "react-hook-form";
import { DemandeType } from "../../api/siteApi";
import { useAddInscription } from "../../hooks/useSite";
import { toast } from "react-toastify";
import {
  CalendarIcon,
  Send,
  User,
  MapPin,
  Mail,
  Phone,
  GraduationCap,
} from "lucide-react";
import { useGetByClass } from "../../hooks/useClass";

const NouvelleDemande = () => {
  const useMutation = useAddInscription();
  const {data: listClass, isLoading, isError} = useGetByClass('anneeScolaire', '1');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<DemandeType>({});

  const onSubmitHandler = (data: DemandeType) => {
    setValue("dateDeDemande", null);
    useMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Votre demande a bien été envoyée");
      },
      onError: () => toast.error("Votre demande n'a pas été envoyée"),
    });
    reset();
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 mt-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Demande d'Inscription
            </h2>
            <p className="text-slate-600">Complétez le formulaire ci-dessous</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <User className="mr-2 h-5 w-5" />
                Formulaire de demande d'inscription
              </h3>
            </div>

            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className="p-6 space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Student Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="nomEleve"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Nom de l'élève <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="nomEleve"
                      type="text"
                      placeholder="Nom de l'élève"
                      {...register("nomEleve", {
                        required: "Le nom est obligatoire",
                      })}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.nomEleve
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-slate-300"
                      } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                    />
                  </div>
                  {errors.nomEleve && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.nomEleve.message}
                    </p>
                  )}
                </div>

                {/* Student First Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="prenomEleve"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Prénoms
                  </label>
                  <div className="relative">
                    <input
                      id="prenomEleve"
                      type="text"
                      placeholder="Prénom de l'élève"
                      {...register("prenomEleve")}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.prenomEleve
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-slate-300"
                      } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                    />
                  </div>
                  {errors.prenomEleve && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.prenomEleve.message}
                    </p>
                  )}
                </div>

                {/* Requested Class */}
                <div className="space-y-2">
                  <label
                    htmlFor="classeDemande"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Classe Demandée <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <GraduationCap className="h-5 w-5 text-slate-400" />
                    </div>
                    {!(isLoading || isError) && (
                      <select
                      id="classeDemande"
                      {...register("classeDemande", {
                        required: "Veuillez sélectionner une classe",
                      })}
                      className="w-full pl-10 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none bg-white"
                    > 
                      <option value="">Sélectionnez une classe</option>
                      {listClass?.map((classe)=>(
                        <option value={classe.nom}>{classe.nom}</option>
                      ))}
                    </select>)}
                    
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-slate-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.classeDemande && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.classeDemande.message}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label
                    htmlFor="dateDeNaissance"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Date de naissance <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="dateDeNaissance"
                      type="date"
                      {...register("dateDeNaissance", {
                        required: "Date de naissance obligatoire",
                      })}
                      className={`w-full pl-10 px-4 py-3 rounded-lg border ${
                        errors.dateDeNaissance
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-slate-300"
                      } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                    />
                  </div>
                  {errors.dateDeNaissance && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.dateDeNaissance.message}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label
                    htmlFor="lieu"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Lieu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="lieu"
                      type="text"
                      placeholder="Lieu ou adresse de l'élève"
                      {...register("lieu", { required: "Lieu obligatoire" })}
                      className={`w-full pl-10 px-4 py-3 rounded-lg border ${
                        errors.lieu
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-slate-300"
                      } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                    />
                  </div>
                  {errors.lieu && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lieu.message}
                    </p>
                  )}
                </div>

                {/* Parent Contact */}
                <div className="space-y-2">
                  <label
                    htmlFor="contactParent"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Contact <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="contactParent"
                      type="text"
                      placeholder="Contact du parent"
                      {...register("contactParent", {
                        required: "Contact obligatoire",
                      })}
                      className={`w-full pl-10 px-4 py-3 rounded-lg border ${
                        errors.contactParent
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-slate-300"
                      } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                    />
                  </div>
                  {errors.contactParent && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.contactParent.message}
                    </p>
                  )}
                </div>

                {/* Parent Email */}
                <div className="space-y-2 sm:col-span-2">
                  <label
                    htmlFor="emailParent"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Email (Optionnel)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="emailParent"
                      type="email"
                      placeholder="Email du parent"
                      {...register("emailParent")}
                      className={`w-full pl-10 px-4 py-3 rounded-lg border ${
                        errors.emailParent
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-slate-300"
                      } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                    />
                  </div>
                  {errors.emailParent && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.emailParent.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium shadow-md hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Envoyer la demande
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Additional Information */}
          <div className="mt-6 text-center text-sm text-slate-500">
            <p>
              Les champs marqués d'un <span className="text-red-500">*</span>{" "}
              sont obligatoires
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NouvelleDemande;
