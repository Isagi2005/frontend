import { useForm } from "react-hook-form";
import { CalendarDays, FileImage, Info, Type } from "lucide-react";
import { toast } from "react-toastify";
import { useAddEvent } from "../../../hooks/useEvent";
import { EventType } from "../../../api/eventApi";
import { useState } from "react";

const AjoutEvent = () => {
  const addMutation = useAddEvent();
  const [previewImage, setPreviewImage] = useState<string | null>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<EventType>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: EventType) => {
    addMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Nouvel évènement publié !");
        reset();
        setPreviewImage(null);
      },
      onError: () => {
        toast.error("Échec de la création !");
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg border">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 border-b pb-2">
        🗓️ Nouvelle Évènement
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre de l'évènement
          </label>
          <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <span className="p-2 bg-gray-100">
              <Type size={18} className="text-gray-500" />
            </span>
            <input
              {...register("titre", { required: "Le titre est obligatoire" })}
              placeholder="Entrez le titre"
              className="w-full p-2 focus:outline-none"
            />
          </div>
          {errors.titre && (
            <p className="text-red-500 text-sm mt-1">{errors.titre.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <div className="flex items-start border rounded-lg p-2">
            <Info size={18} className="text-gray-500 mt-1 mr-2" />
            <textarea
              {...register("description")}
              rows={5}
              placeholder="Décrivez brièvement l'évènement..."
              className="w-full resize-none focus:outline-none"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <span className="p-2 bg-gray-100">
                <CalendarDays size={18} className="text-gray-500" />
              </span>
              <input
                type="date"
                {...register("datedebut")}
                className="w-full p-2 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <span className="p-2 bg-gray-100">
                <CalendarDays size={18} className="text-gray-500" />
              </span>
              <input
                type="date"
                {...register("datefin")}
                className="w-full p-2 focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lieu de l'évènement
          </label>
          <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <span className="p-2 bg-gray-100">
              <Type size={18} className="text-gray-500" />
            </span>
            <input
              {...register("lieu")}
              placeholder="Entrez le titre"
              className="w-full p-2 focus:outline-none"
            />
          </div>
          {errors.lieu && (
            <p className="text-red-500 text-sm mt-1">{errors.lieu.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type d'évènement
          </label>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <span className="p-2 bg-gray-100">
              <CalendarDays size={18} className="text-gray-500" />
            </span>
            <select
              id="type"
              {...register("typeEvent")}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="formation">Formation</option>
              <option value="annonce">Annonce</option>
              <option value="scolaire">Activités parascolaire</option>
              <option value="autres">Autres</option>
            </select>
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image de couverture
          </label>
          <div className="flex items-center gap-4">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="h-16 w-16 rounded-lg object-cover border"
              />
            ) : (
              <div className="h-16 w-16 flex items-center justify-center rounded-lg bg-gray-100 border">
                <FileImage size={24} className="text-gray-400" />
              </div>
            )}
            <label className="cursor-pointer inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Choisir un fichier
              <input
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
          )}
        </div>

        {/* Bouton */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full sm:w-48 bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition"
          >
            Publier
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjoutEvent;
