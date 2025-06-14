import { Controller, useForm } from "react-hook-form";
import { StudentProfile } from "../../../api/studentApi";
import { UseRetrieve, useUpdateStudent } from "../../../hooks/useStudent";
import { useGetClass } from "../../../hooks/useClass";
import {
  User,
  BookOpen,
  Users,
  CalendarPlus2,
  Church,
  MapPinCheck,
  ImageIcon,
} from "lucide-react";
import { useGetGenerics } from "../../../hooks/useUser";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

interface Props {
  selectedId: number;
}

const UpdateStudent = ({ selectedId }: Props) => {
  const studentMutation = useUpdateStudent();

  const { data: classes, isLoading } = useGetClass();
  const [previewImage, setPreviewImage] = useState<string | null>();
  const { data: listParent, isLoading: load } = useGetGenerics(
    "role",
    "parent"
  );
  const { data: students } = UseRetrieve(selectedId + "");

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<StudentProfile>();
  useEffect(() => {
    if (students) {
      reset(students);
    }
  }, [students, reset]);
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
  const onSubmit = (donnee: StudentProfile) => {
    studentMutation.mutate(donnee, {
      onSuccess: () => {
        toast.success("Modification reussit !");
      },
      onError: () => {
        toast.error("Erreur lors du modification !");
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto bg-transparent ">
      <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
        Modification
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("id")} hidden />
        {/* Nom */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <span className="p-2 bg-gray-100">
            <User size={18} className="text-gray-500" />
          </span>
          <input
            {...register("nom", { required: "Le nom est obligatoire" })}
            placeholder="Nom"
            className="w-full p-2 focus:outline-none"
          />
        </div>
        {errors.nom && (
          <p className="text-red-500 text-sm">{errors.nom.message}</p>
        )}

        {/* Prénom */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <span className="p-2 bg-gray-100">
            <User size={18} className="text-gray-500" />
          </span>
          <input
            {...register("prenom")}
            placeholder="Prénom"
            className="w-full p-2 focus:outline-none"
          />
        </div>
        {errors.prenom && (
          <p className="text-red-500 text-sm">{errors.prenom.message}</p>
        )}

        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <span className="p-2 bg-gray-100">
            <User size={18} className="text-gray-500" />
          </span>
          <Controller
            name="sexe"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full p-2 focus:outline-none bg-white"
              >
                <option value="H">Garçon</option>
                <option value="F">Fille</option>
              </select>
            )}
          />
        </div>
        {errors.sexe && (
          <p className="text-red-500 text-sm">{errors.sexe.message}</p>
        )}

        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <span className="p-2 bg-gray-100">
            <Church size={18} className="text-gray-500" />
          </span>
          <input
            {...register("religion")}
            placeholder="Religion"
            className="w-full p-2 focus:outline-none"
          />
        </div>
        {errors.religion && (
          <p className="text-red-500 text-sm">{errors.religion.message}</p>
        )}

        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <span className="p-2 bg-gray-100">
            <MapPinCheck size={18} className="text-gray-500" />
          </span>
          <input
            {...register("adresse")}
            placeholder="Adresse"
            className="w-full p-2 focus:outline-none"
          />
        </div>
        {errors.adresse && (
          <p className="text-red-500 text-sm">{errors.adresse.message}</p>
        )}

        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <span className="p-2 bg-gray-100">
            <CalendarPlus2 size={18} className="text-gray-500" />
          </span>
          <input
            {...register("dateDeNaissance")}
            placeholder="Date de naissance"
            type="Date"
            className="w-full p-2 focus:outline-none"
          />
        </div>
        {errors.dateDeNaissance && (
          <p className="text-red-500 text-sm">
            {errors.dateDeNaissance.message}
          </p>
        )}

        {/* Classe */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <span className="p-2 bg-gray-100">
            <BookOpen size={18} className="text-gray-500" />
          </span>
          <Controller
            name="classe"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full p-2 focus:outline-none bg-white"
              >
                <option value="">--- Sélectionnez une classe ---</option>
                {isLoading ? (
                  <option value="">Chargement...</option>
                ) : (
                  classes?.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.nom}
                    </option>
                  ))
                )}
              </select>
            )}
          />
        </div>
        {errors.classe && (
          <p className="text-red-500 text-sm">{errors.classe.message}</p>
        )}

        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <span className="p-2 bg-gray-100">
            <Users size={18} className="text-gray-500" />
          </span>
          <Controller
            name="parent"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full p-2 focus:outline-none bg-white"
              >
                <option value="">--- Parent ---</option>
                {load ? (
                  <option value="">Chargement...</option>
                ) : (
                  listParent?.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.first_name} {parent.last_name}
                    </option>
                  ))
                )}
              </select>
            )}
          />
        </div>
        {errors.parent && (
          <p className="text-red-500 text-sm">{errors.parent.message}</p>
        )}
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
            Valider
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateStudent;
