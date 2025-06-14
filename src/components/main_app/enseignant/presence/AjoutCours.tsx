import {
  CalendarDays,
  Clock,
  UserRound,
  Users2,
} from "lucide-react";
import { useGetClass } from "../../../../hooks/useClass";
import { useGetGenerics } from "../../../../hooks/useUser";
import ProfCombobox from "../../classe/ProfCombobox";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { coursProfile } from "../../../../api/presenceApi";
import { useAddCours } from "../../../../hooks/usePresence";

const AjoutCours = () => {
  const { data: listProf } = useGetGenerics("role", "enseignant");
  const addCours = useAddCours();
  const { data: listClasse } = useGetClass();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<coursProfile>();

  const onSubmit = (data: coursProfile) => {
    addCours.mutate(data, {
      onSuccess: () => {
        toast.success("Cours ajouté avec succès !");
        reset();
      },
      onError: () => {
        toast.error("Échec de l'ajout du cours !");
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto border bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Nouveau Cours
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Date du cours */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <span className="p-2 bg-gray-100">
            <CalendarDays size={18} className="text-gray-500" />
          </span>
          <input
            type="date"
            {...register("date", { required: "La date est obligatoire" })}
            className="w-full p-2 focus:outline-none"
          />
        </div>
        {errors.date && (
          <p className="text-red-500 text-sm">{errors.date.message}</p>
        )}

        {/* Heure de début */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <span className="p-2 bg-gray-100">
            <Clock size={18} className="text-gray-500" />
          </span>
          <input
            type="time"
            {...register("heureDebut", {
              required: "L'heure de début est obligatoire",
            })}
            className="w-full p-2 focus:outline-none"
          />
        </div>
        {errors.heureDebut && (
          <p className="text-red-500 text-sm">{errors.heureDebut.message}</p>
        )}

        {/* Heure de fin */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <span className="p-2 bg-gray-100">
            <Clock size={18} className="text-gray-500" />
          </span>
          <input
            type="time"
            {...register("heureFin", {
              required: "L'heure de fin est obligatoire",
            })}
            className="w-full p-2 focus:outline-none"
          />
        </div>
        {errors.heureFin && (
          <p className="text-red-500 text-sm">{errors.heureFin.message}</p>
        )}

        {/* Enseignant */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <span className="p-2 bg-gray-100">
            <UserRound size={18} className="text-gray-500" />
          </span>
          {listProf && (
            <ProfCombobox
              name="enseignant"
              control={control}
              profs={listProf}
            />
          )}
        </div>
        {errors.enseignant && (
          <p className="text-red-500 text-sm">{errors.enseignant.message}</p>
        )}

        {/* Classe */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <span className="p-2 bg-gray-100">
            <Users2 size={18} className="text-gray-500" />
          </span>
          <Controller
            name="classe"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full p-2 bg-white focus:outline-none"
              >
                <option value="">Sélectionner une classe</option>
                {listClasse?.map((classe) => (
                  <option key={classe.id} value={classe.id}>
                    {classe.nom} {classe.yearName}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
        {errors.classe && (
          <p className="text-red-500 text-sm">{errors.classe.message}</p>
        )}

        {/* Bouton submit */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="w-40 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Créer
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjoutCours;
