import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";
import { PresentationType } from "../../../api/siteApi";
import { useAddPresentation } from "../../../hooks/useSite";
import {
  Book,
  List,
  AlignLeft,
  Target,
  Image as ImageIcon,
} from "lucide-react";

const AjoutPresentation = () => {
  const addMutation = useAddPresentation();
  const [previewImage, setPreviewImage] = useState<string | null>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<PresentationType>();

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

  const onSubmit = (data: PresentationType) => {
    addMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Ajout avec succès !");
        reset();
        setPreviewImage(null);
      },
      onError: () => {
        toast.error("Échec de la création !");
      },
    });
  };

  return (
    <div className="border px-4 py-6 shadow-lg max-w-2xl mx-auto bg-white rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Nouvelle présentation
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Grand titre */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <span className="p-2 bg-gray-100">
            <Book size={20} className="text-gray-500" />
          </span>
          <input
            {...register("titrePresentation", {
              required: "Le titre est obligatoire",
            })}
            placeholder="Grand titre"
            className="w-full p-2 focus:outline-none"
          />
        </div>
        {errors.titrePresentation && (
          <p className="text-red-500 text-sm">
            {errors.titrePresentation.message}
          </p>
        )}

        {/* Sous-titre */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <span className="p-2 bg-gray-100">
            <List size={20} className="text-gray-500" />
          </span>
          <input
            {...register("section")}
            placeholder="Sous-titre"
            className="w-full p-2 focus:outline-none"
          />
        </div>
        {errors.section && (
          <p className="text-red-500 text-sm">{errors.section.message}</p>
        )}

        {/* Texte */}
        <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden">
          <div className="flex items-center p-2 bg-gray-100">
            <AlignLeft size={20} className="text-gray-500" />
            <span className="ml-2 text-sm text-gray-500">
              Texte de présentation
            </span>
          </div>
          <textarea
            {...register("textePresentation")}
            rows={5}
            placeholder="Contenu principal"
            className="w-full p-3 focus:outline-none"
          />
        </div>
        {errors.textePresentation && (
          <p className="text-red-500 text-sm">
            {errors.textePresentation.message}
          </p>
        )}

        {/* Objectifs */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <span className="p-2 bg-gray-100">
            <Target size={20} className="text-gray-500" />
          </span>
          <input
            {...register("objectifs")}
            placeholder="Objectifs"
            className="w-full p-2 focus:outline-none"
          />
        </div>
        {errors.objectifs && (
          <p className="text-red-500 text-sm">{errors.objectifs.message}</p>
        )}

        {/* Image */}
        <div className="flex flex-col sm:flex-row items-center gap-4 border border-gray-300 rounded-lg p-4">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Preview"
              className="h-20 w-20 rounded-md object-cover border"
            />
          ) : (
            <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded-md border">
              <ImageIcon size={24} className="text-gray-400" />
            </div>
          )}
          <div>
            <label className="cursor-pointer inline-block rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500">
              Changer l’image
              <input
                type="file"
                className="sr-only"
                onChange={handleImageChange}
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Formats acceptés : JPG, PNG
            </p>
          </div>
        </div>
        {errors.image && (
          <p className="text-red-500 text-sm">{errors.image.message}</p>
        )}

        {/* Bouton */}
        <div className="flex justify-center">
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

export default AjoutPresentation;
