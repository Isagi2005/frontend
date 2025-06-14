import { Controller, useForm } from "react-hook-form";
import { ClassProfile } from "../../../api/classApi";
import { BookOpen, User, CalendarFold, Users } from "lucide-react";
import { useAddClass } from "../../../hooks/useClass";
import { toast } from "react-toastify";
import { useGetGenerics } from "../../../hooks/useUser";
import { useAdd, useGet } from "../../../hooks/useAnnee";
import ProfCombobox from "./ProfCombobox";
import AnneeCombobox from "./AnneeCombobox";

const AjoutClasse = () => {
  const classMutation = useAddClass();
  const { data: listEnseignant } = useGetGenerics("role", "enseignant");
  const { data: listAnnee } = useGet();
  const addAnnee = useAdd();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ClassProfile>();

  const onSubmit = (data: ClassProfile) => {
    classMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Nouvelle classe crée !");
        reset();
      },
      onError: () => {
        toast.error("Échec de la création !");
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto bg-transparent ">
      <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
        Nouvelle classe
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <span className="p-2 bg-gray-100">
            <User size={18} className="text-gray-500" />
          </span>
          <input
            {...register("nom", { required: "Le nom est obligatoire" })}
            placeholder="Nom de la classe"
            className="w-full p-2 focus:outline-none"
          />
        </div>
        {errors.nom && (
          <p className="text-red-500 text-sm">{errors.nom.message}</p>
        )}

        {/* Classe */}
        <div className="flex items-center">
          <span className="p-2 bg-gray-100">
            <BookOpen size={18} className="text-gray-500" />
          </span>
          <ProfCombobox
            name="titulaire"
            control={control}
            profs={listEnseignant}
          />
        </div>
        {errors.titulaire && (
          <p className="text-red-500 text-sm">{errors.titulaire.message}</p>
        )}

        <div className="flex items-center ">
          <span className="p-2 bg-gray-100">
            <CalendarFold size={18} className="text-gray-500" />
          </span>
          <AnneeCombobox
            name="anneeScolaire"
            control={control}
            annees={listAnnee}
            onCreate={async (newValue: string) => {
              try {
                await addAnnee.mutateAsync(newValue);

                toast.success(`Année "${newValue}" créée !`);
              } catch (err) {
                toast.error("Erreur lors de la création de l'année: ");
                console.log(err);
              }
            }}
          />
        </div>
        {errors.anneeScolaire && (
          <p className="text-red-500 text-sm">{errors.anneeScolaire.message}</p>
        )}
        <div className="flex items-center ">
          <span className="p-2 bg-gray-100">
            <Users size={18} className="text-gray-500" />
          </span>
          <Controller
            name="categorie"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full p-2 focus:outline-none bg-white"
              >
                <option value="prescolaire">Prescolaire</option>
                <option value="primaire">Primaire</option>
                <option value="college">Collège</option>
                <option value="lycee">Lycée</option>
              </select>
            )}
          />
        </div>
        {errors.categorie && (
          <p className="text-red-500 text-sm">{errors.categorie.message}</p>
        )}
        {/* Bouton */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-40 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  );
};
export default AjoutClasse;
