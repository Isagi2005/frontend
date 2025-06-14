"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Edit, Check, Eye, X, Home, FileText, ImageIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { accueilType } from "../../../api/siteApi";
import { useUpdateAccueil } from "../../../hooks/useSite";

interface Props {
  displayedData: accueilType;
}

const TableAccueil = ({ displayedData }: Props) => {
  const navigate = useNavigate();
  const [editId, setEditId] = useState<string | null>(null);
  const [expandedFields, setExpandedFields] = useState<string[]>([]);
  const updateMutation = useUpdateAccueil();
  const [previewImage1, setPreviewImage1] = useState<string | null>();
  const [previewImage2, setPreviewImage2] = useState<string | null>();
  const [previewImage3, setPreviewImage3] = useState<string | null>();
  const { register, handleSubmit, reset, setValue } = useForm<accueilType>();

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: 1 | 2 | 3
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue(`image${index}` as keyof accueilType, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (index === 1) setPreviewImage1(reader.result as string);
        if (index === 2) setPreviewImage2(reader.result as string);
        if (index === 3) setPreviewImage3(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const handleEdit = (data: accueilType) => {
    setEditId(data.id);
    setValue("id", data.id);
    setValue("texteAccueil", data.texteAccueil);
    setValue("titre", data.titre);
  };

  const onSubmit = (data: accueilType) => {
    if (editId !== null) {
      updateMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Modification réussie !");
          setEditId(null);
        },
        onError: () => {
          toast.error("Échec de la modification !");
        },
      });
      reset();
    }
  };

  const handleCancel = () => {
    setEditId(null);
    reset();
  };

  const toggleExpandField = (field: string) => {
    setExpandedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Home className="mr-2 h-5 w-5 text-purple-600" />
          Configuration de la page d'accueil
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 text-left text-sm font-semibold text-purple-800 uppercase tracking-wider border-b">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Titre
                  </div>
                </th>
                <th className="px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 text-left text-sm font-semibold text-purple-800 uppercase tracking-wider border-b">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Texte d'accueil
                  </div>
                </th>
                <th className="px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 text-center text-sm font-semibold text-purple-800 uppercase tracking-wider border-b">
                  <div className="flex items-center justify-center">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Image 1
                  </div>
                </th>
                <th className="px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 text-center text-sm font-semibold text-purple-800 uppercase tracking-wider border-b">
                  <div className="flex items-center justify-center">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Image 2
                  </div>
                </th>
                <th className="px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 text-center text-sm font-semibold text-purple-800 uppercase tracking-wider border-b">
                  <div className="flex items-center justify-center">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Image 3
                  </div>
                </th>
                <th className="px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 text-center text-sm font-semibold text-purple-800 uppercase tracking-wider border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedData === null ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex justify-center items-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-purple-500"
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
                      <span>Chargement...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr
                  className={`${
                    editId === displayedData.id
                      ? "bg-blue-50"
                      : "hover:bg-purple-50 transition-colors duration-150"
                  }`}
                >
                  {editId === displayedData.id ? (
                    <>
                      <td className="px-6 py-4">
                        <input {...register("id")} type="hidden" />
                        <input
                          {...register("titre")}
                          className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <textarea
                          {...register("texteAccueil")}
                          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
                          rows={4}
                        />
                      </td>
                      {[1, 2, 3].map((num) => {
                        const preview =
                          num === 1
                            ? previewImage1
                            : num === 2
                            ? previewImage2
                            : previewImage3;
                        const img =
                          displayedData[`image${num}` as keyof accueilType];

                        return (
                          <td key={num} className="px-6 py-4">
                            <div className="flex flex-col items-center justify-center gap-3">
                              <img
                                src={
                                  preview ||
                                  (img as string) ||
                                  "/placeholder.svg"
                                }
                                alt={`Image ${num}`}
                                className="h-20 w-20 object-cover rounded-lg shadow border border-gray-200"
                              />
                              <label className="cursor-pointer bg-purple-50 border border-purple-200 px-3 py-1.5 text-sm rounded-md text-purple-700 hover:bg-purple-100 transition-colors">
                                Changer
                                <input
                                  type="file"
                                  className="sr-only"
                                  onChange={(e) =>
                                    handleImageChange(e, num as 1 | 2 | 3)
                                  }
                                />
                              </label>
                            </div>
                          </td>
                        );
                      })}
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={handleSubmit(onSubmit)}
                            className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-colors"
                            title="Valider"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-400 hover:bg-gray-500 text-white p-2 rounded-full transition-colors"
                            title="Annuler"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {truncateText(displayedData.titre, 30)}
                          {displayedData.titre.length > 30 && (
                            <button
                              onClick={() => toggleExpandField("titre")}
                              className="ml-2 text-xs text-purple-600 hover:text-purple-800"
                            >
                              {expandedFields.includes("titre")
                                ? "Moins"
                                : "Plus"}
                            </button>
                          )}
                        </div>
                        {expandedFields.includes("titre") && (
                          <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                            {displayedData.titre}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {truncateText(displayedData.texteAccueil, 60)}
                          {displayedData.texteAccueil.length > 60 && (
                            <button
                              onClick={() => toggleExpandField("texteAccueil")}
                              className="ml-2 text-xs text-purple-600 hover:text-purple-800"
                            >
                              {expandedFields.includes("texteAccueil")
                                ? "Moins"
                                : "Plus"}
                            </button>
                          )}
                        </div>
                        {expandedFields.includes("texteAccueil") && (
                          <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                            {displayedData.texteAccueil}
                          </div>
                        )}
                      </td>
                      {[1, 2, 3].map((num) => {
                        const img = displayedData[
                          `image${num}` as keyof accueilType
                        ] as string;

                        return (
                          <td key={num} className="px-6 py-4">
                            <div className="flex justify-center">
                              {img ? (
                                <img
                                  src={img || "/placeholder.svg"}
                                  alt={`Image ${num}`}
                                  className="h-16 w-16 object-cover rounded-lg shadow-sm border border-gray-200"
                                />
                              ) : (
                                <div className="h-16 w-16 rounded-lg bg-purple-100 flex items-center justify-center">
                                  <span className="text-purple-600 font-medium">
                                    {getInitials(displayedData.titre)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-3">
                          <button
                            onClick={() => navigate("/")}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                            title="Voir"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(displayedData)}
                            className="p-1.5 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors"
                            title="Modifier"
                          >
                            <Edit size={18} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableAccueil;
