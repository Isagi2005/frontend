"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import type { User, UserProfile, UserRole } from "../../../api/userApi"
import { toast } from "react-toastify"
import { useAddProfile, useAddUser } from "../../../hooks/useUser"
import BackButton from "../../Button"
import { UserIcon, Mail, Phone, Calendar, MapPin, Book, Lock, Upload, Save, UserPlus } from "lucide-react"

// Définition du schéma de validation
const userSchema = yup.object().shape({
  username: yup.string().required("Le nom d'utilisateur est requis"),
  email: yup.string().email("Email invalide").required("L'email est requis"),
  password: yup.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").required("Le mot de passe est requis"),
  first_name: yup.string(),
  last_name: yup.string(),
  profile: yup.object().shape({
    sexe: yup.string(),
    telephone: yup.string(),
    birthDate: yup.string(),
    adresse: yup.string(),
    religion: yup.string(),
    role: yup.mixed<UserRole>().oneOf(["direction", "enseignant", "parent", "finance"]).required("Le rôle est requis"),
    image: yup.mixed(), // Ajout du champ image
  }),
})

const CreateUser = () => {
  const addUser = useAddUser()
  const addProfile = useAddProfile()
  type UserFormData = yup.InferType<typeof userSchema>;
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    reset,
  } = useForm<UserFormData>({
    resolver: yupResolver(userSchema),
    defaultValues: {
      profile: {
        role: "enseignant",
        sexe: "H",
      },
    },
  })
  const [previewImage, setPreviewImage] = useState<string | null>()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Mettre à jour l'objet profile complet avec l'image
      const currentProfile = getValues("profile") || {};
      setValue("profile", {
        ...currentProfile,
        image: file
      });

      // Créer une preview de l'image
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmitHandler = async (data: UserFormData) => {
    try {
      // Création de l'utilisateur avec les champs requis
      const userData: User = {
        username: data.username,
        email: data.email,
        password: data.password,
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        is_active: true,
        status: "active",
        dateArrivee: new Date().toISOString(),
        // On envoie un profil minimal pour satisfaire le type User côté API
        profile: {
          ...(data.profile || {}),
          image: data.profile?.image ?? null,
        } as UserProfile,
      };

      // Appel des mutations
      const user = await addUser.mutateAsync(userData);

      // Création du profil utilisateur lié si nécessaire
      if (data.profile) {
        const profileData: UserProfile = {
          ...data.profile,
          image: data.profile.image ?? null,
          account: String(user.id),
        };

        await addProfile.mutateAsync(profileData);
      }

      toast.success("Utilisateur créé avec succès");
      reset();
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      toast.error("Une erreur est survenue lors de la création de l'utilisateur");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <UserPlus className="mr-2 h-6 w-6 text-blue-600" />
          Créer un nouvel utilisateur
        </h2>
        <BackButton to="/home/personnel" />
      </div>

      <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Colonne gauche */}
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                <UserIcon className="mr-2 h-5 w-5" />
                Informations personnelles
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <div className="relative">
                    <input
                      id="first_name"
                      type="text"
                      {...register("first_name")}
                      className={`pl-3 pr-10 py-2 w-full rounded-md border ${
                        errors.first_name ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                    />
                    {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    id="last_name"
                    type="text"
                    {...register("last_name")}
                    className={`pl-3 pr-10 py-2 w-full rounded-md border ${
                      errors.last_name ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  />
                  {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Mail className="mr-1 h-4 w-4 text-gray-500" />
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={`pl-3 pr-10 py-2 w-full rounded-md border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Lock className="mr-1 h-4 w-4 text-gray-500" />
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    {...register("password")}
                    className={`pl-3 pr-10 py-2 w-full rounded-md border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Coordonnées
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <textarea
                    id="adresse"
                    rows={3}
                    {...register("profile.adresse")}
                    className="pl-3 pr-10 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Phone className="mr-1 h-4 w-4 text-gray-500" />
                    Téléphone
                  </label>
                  <input
                    id="telephone"
                    type="text"
                    {...register("profile.telephone")}
                    className="pl-3 pr-10 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite */}
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <UserIcon className="mr-2 h-5 w-5" />
                Profil
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo de profil</label>
                  <div className="flex items-center space-x-4">
                    <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '';
                            target.alt = 'Image non disponible';
                          }}
                        />
                      ) : (
                        <UserIcon className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <label className="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center">
                      <Upload className="mr-2 h-4 w-4" />
                      Ajouter une photo
                      <input type="file" className="sr-only" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Rôle
                  </label>
                  <select
                    id="role"
                    {...register("profile.role")}
                    className="pl-3 pr-10 py-2 w-full rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="direction">Direction</option>
                    <option value="enseignant">Enseignant</option>
                    <option value="parent">Parent</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="sexe" className="block text-sm font-medium text-gray-700 mb-1">
                    Sexe
                  </label>
                  <select
                    id="sexe"
                    {...register("profile.sexe")}
                    className="pl-3 pr-10 py-2 w-full rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="H">Homme</option>
                    <option value="F">Femme</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Calendar className="mr-1 h-4 w-4 text-gray-500" />
                    Date de naissance
                  </label>
                  <input
                    id="birthDate"
                    type="date"
                    {...register("profile.birthDate")}
                    className="pl-3 pr-10 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="religion" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Book className="mr-1 h-4 w-4 text-gray-500" />
                    Religion
                  </label>
                  <input
                    id="religion"
                    type="text"
                    {...register("profile.religion")}
                    className="pl-3 pr-10 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Création en cours...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Créer l'utilisateur
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateUser
