"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Edit,
  Check,
  Eye,
  X,
  Phone,
  Mail,
  MapPin,
  FootprintsIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUpdateFooter } from "../../../hooks/useSite";
import type { Footertype } from "../../../api/siteApi";

interface Props {
  displayedData: Footertype;
}

const TableFooter = ({ displayedData }: Props) => {
  const navigate = useNavigate();
  const [editId, setEditId] = useState<string | null>(null);
  const [expandedFields, setExpandedFields] = useState<string[]>([]);
  const updateMutation = useUpdateFooter();
  const { register, handleSubmit, reset, setValue } = useForm<Footertype>();

  const handleEdit = (data: Footertype) => {
    setEditId(data.id);
    setValue("id", data.id);
    setValue("contact", data.contact);
    setValue("emailInfo", data.emailInfo);
    setValue("adresse", data.adresse);
  };

  const onSubmit = (data: Footertype) => {
    if (editId !== null) {
      updateMutation.mutate(
        { ...data },
        {
          onSuccess: () => {
            toast.success("Modification réussie !");
            setEditId(null);
          },
          onError: () => {
            toast.error("Échec de la modification !");
          },
        }
      );
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
          <FootprintsIcon className="mr-2 h-5 w-5 text-amber-600" />
          Configuration du pied de page
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 bg-gradient-to-r from-amber-50 to-amber-100 text-left text-sm font-semibold text-amber-800 uppercase tracking-wider border-b">
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    Contact
                  </div>
                </th>
                <th className="px-6 py-4 bg-gradient-to-r from-amber-50 to-amber-100 text-left text-sm font-semibold text-amber-800 uppercase tracking-wider border-b">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </div>
                </th>
                <th className="px-6 py-4 bg-gradient-to-r from-amber-50 to-amber-100 text-left text-sm font-semibold text-amber-800 uppercase tracking-wider border-b">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Adresse
                  </div>
                </th>
                <th className="px-6 py-4 bg-gradient-to-r from-amber-50 to-amber-100 text-center text-sm font-semibold text-amber-800 uppercase tracking-wider border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {!displayedData ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex justify-center items-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-amber-500"
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
                      : "hover:bg-amber-50 transition-colors duration-150"
                  }`}
                >
                  {editId === displayedData.id ? (
                    <>
                      <td className="px-6 py-4">
                        <input {...register("id")} type="hidden" />
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            {...register("contact")}
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                            placeholder="Numéro de téléphone"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            {...register("emailInfo")}
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                            placeholder="Adresse email"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            {...register("adresse")}
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                            placeholder="Adresse physique"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={handleSubmit(onSubmit)}
                            className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-full transition-colors"
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
                        <div className="flex items-start">
                          <Phone className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm text-gray-900">
                              {truncateText(displayedData.contact, 30)}
                              {displayedData.contact.length > 30 && (
                                <button
                                  onClick={() => toggleExpandField("contact")}
                                  className="ml-2 text-xs text-amber-600 hover:text-amber-800"
                                >
                                  {expandedFields.includes("contact")
                                    ? "Moins"
                                    : "Plus"}
                                </button>
                              )}
                            </div>
                            {expandedFields.includes("contact") && (
                              <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                                {displayedData.contact}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <Mail className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm text-gray-900">
                              {truncateText(displayedData.emailInfo, 30)}
                              {displayedData.emailInfo.length > 30 && (
                                <button
                                  onClick={() => toggleExpandField("email")}
                                  className="ml-2 text-xs text-amber-600 hover:text-amber-800"
                                >
                                  {expandedFields.includes("email")
                                    ? "Moins"
                                    : "Plus"}
                                </button>
                              )}
                            </div>
                            {expandedFields.includes("email") && (
                              <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                                {displayedData.emailInfo}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm text-gray-900">
                              {truncateText(displayedData.adresse, 30)}
                              {displayedData.adresse.length > 30 && (
                                <button
                                  onClick={() => toggleExpandField("adresse")}
                                  className="ml-2 text-xs text-amber-600 hover:text-amber-800"
                                >
                                  {expandedFields.includes("adresse")
                                    ? "Moins"
                                    : "Plus"}
                                </button>
                              )}
                            </div>
                            {expandedFields.includes("adresse") && (
                              <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                                {displayedData.adresse}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
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
                            className="p-1.5 bg-amber-50 text-amber-600 rounded-full hover:bg-amber-100 transition-colors"
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

export default TableFooter;
