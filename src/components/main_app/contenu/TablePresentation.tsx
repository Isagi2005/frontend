"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Edit, Trash2, Check, Eye, X, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Dialogue from "../DialogModals";
import {
  useDeletePresentation,
  useUpdatePresentation,
} from "../../../hooks/useSite";
import type { PresentationType } from "../../../api/siteApi";
import PresentationModals from "./PresentationModals";

interface ClassProps {
  displayedData: PresentationType[];
}

const TableEvent = ({ displayedData }: ClassProps) => {
  const navigate = useNavigate();
  const [editId, setEditId] = useState<string | null>(null);
  const [showPage, setShowPage] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const deleteMutation = useDeletePresentation();
  const updateMutation = useUpdatePresentation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } =
    useForm<PresentationType>();

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

  const openModal = (id: number) => {
    setSelectedId(id);
    setIsOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleEdit = (data: PresentationType) => {
    setEditId(data.id);
    setValue("id", data.id);
    setValue("image", data.image);
    setValue("titrePresentation", data.titrePresentation);
    setValue("section", data.section);
    setValue("textePresentation", data.textePresentation);
    setValue("objectifs", data.objectifs);
  };

  const onSubmit = (data: PresentationType) => {
    if (editId !== null) {
      updateMutation.mutate(
        { ...data },
        {
          onSuccess: () => {
            toast.success("Modification réussie !");
            setEditId(null);
          },
          onError: () => {
            toast.error("Échec de la modification!");
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

  const toggleExpandRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
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
      {isOpen && (
        <Dialogue
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          mutation={deleteMutation}
        />
      )}
      <PresentationModals showPage={showPage} setShowPage={setShowPage} />

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Liste des présentations
        </h2>
        <button
          onClick={() => setShowPage(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg shadow hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
        >
          <Plus size={18} />
          Nouvelle présentation
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100 text-left text-sm font-semibold text-emerald-800 uppercase tracking-wider border-b">
                  Titre
                </th>
                <th className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100 text-left text-sm font-semibold text-emerald-800 uppercase tracking-wider border-b">
                  Sous-titres
                </th>
                <th className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100 text-left text-sm font-semibold text-emerald-800 uppercase tracking-wider border-b">
                  Objectifs
                </th>
                <th className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100 text-left text-sm font-semibold text-emerald-800 uppercase tracking-wider border-b">
                  Autre texte
                </th>
                <th className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100 text-center text-sm font-semibold text-emerald-800 uppercase tracking-wider border-b">
                  Image
                </th>
                <th className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100 text-center text-sm font-semibold text-emerald-800 uppercase tracking-wider border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayedData === null ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex justify-center items-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-emerald-500"
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
              ) : displayedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Aucun résultat correspondant
                  </td>
                </tr>
              ) : (
                displayedData?.map((presentation) => (
                  <tr
                    key={presentation.id}
                    className={`${
                      editId === presentation.id
                        ? "bg-blue-50"
                        : "hover:bg-emerald-50 transition-colors duration-150"
                    }`}
                  >
                    {editId === presentation.id ? (
                      <>
                        <td className="px-4 py-3">
                          <input {...register("id")} hidden />
                          <input
                            {...register("titrePresentation")}
                            className="border rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <textarea
                            {...register("section")}
                            className=""
                            rows={2}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <textarea
                            {...register("objectifs")}
                            className=""
                            rows={3}
                            cols={25}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <textarea
                            {...register("textePresentation")}
                            className=""
                            rows={2}
                            cols={25}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="mt-1 flex items-center">
                            {previewImage ? (
                              <img
                                src={previewImage || "/placeholder.svg"}
                                alt="Preview"
                                className="h-16 w-16 object-cover"
                              />
                            ) : (
                              <img
                                src={typeof presentation.image === 'string' ? presentation.image : "/placeholder.svg"}
                                alt="profil"
                                className="h-16 object-cover"
                              />
                            )}
                            <label className="ml-5 cursor-pointer rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                              <span>Changer</span>
                              <input
                                type="file"
                                className="sr-only"
                                onChange={handleImageChange}
                              />
                            </label>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center flex justify-center gap-4">
                          <button
                            onClick={handleSubmit(onSubmit)}
                            className="text-green-500"
                          >
                            <Check size={20} />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-gray-500"
                          >
                            <X size={20} />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {truncateText(presentation.titrePresentation, 30)}
                            {presentation.titrePresentation.length > 30 && (
                              <button
                                onClick={() => toggleExpandRow(presentation.id)}
                                className="ml-2 text-xs text-emerald-600 hover:text-emerald-800"
                              >
                                {expandedRows.includes(presentation.id)
                                  ? "Moins"
                                  : "Plus"}
                              </button>
                            )}
                          </div>
                          {expandedRows.includes(presentation.id) && (
                            <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                              {presentation.titrePresentation}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {truncateText(presentation.section, 30)}
                            {presentation.section.length > 30 && (
                              <button
                                onClick={() =>
                                  toggleExpandRow(presentation.id + "_section")
                                }
                                className="ml-2 text-xs text-emerald-600 hover:text-emerald-800"
                              >
                                {expandedRows.includes(
                                  presentation.id + "_section"
                                )
                                  ? "Moins"
                                  : "Plus"}
                              </button>
                            )}
                          </div>
                          {expandedRows.includes(
                            presentation.id + "_section"
                          ) && (
                            <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                              {presentation.section}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {truncateText(presentation.objectifs, 30)}
                            {presentation.objectifs.length > 30 && (
                              <button
                                onClick={() =>
                                  toggleExpandRow(presentation.id + "_obj")
                                }
                                className="ml-2 text-xs text-emerald-600 hover:text-emerald-800"
                              >
                                {expandedRows.includes(presentation.id + "_obj")
                                  ? "Moins"
                                  : "Plus"}
                              </button>
                            )}
                          </div>
                          {expandedRows.includes(presentation.id + "_obj") && (
                            <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                              {presentation.objectifs}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {truncateText(presentation.textePresentation, 30)}
                            {presentation.textePresentation.length > 30 && (
                              <button
                                onClick={() =>
                                  toggleExpandRow(presentation.id + "_text")
                                }
                                className="ml-2 text-xs text-emerald-600 hover:text-emerald-800"
                              >
                                {expandedRows.includes(
                                  presentation.id + "_text"
                                )
                                  ? "Moins"
                                  : "Plus"}
                              </button>
                            )}
                          </div>
                          {expandedRows.includes(presentation.id + "_text") && (
                            <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                              {presentation.textePresentation}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            {presentation.image ? (
                              <img
                                className="h-16 w-16 object-cover rounded shadow-sm border border-gray-200"
                                src={typeof presentation.image === 'string' ? presentation.image : URL.createObjectURL(presentation.image)}
                                alt={presentation.titrePresentation}
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                                <span className="text-emerald-600 font-medium">
                                  {getInitials(presentation.titrePresentation)}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-3">
                            <button
                              onClick={() =>
                                navigate("/notre_établissement/présentation")
                              }
                              className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                              title="Voir"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(presentation)}
                              className="p-1.5 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors"
                              title="Modifier"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => openModal(Number(presentation.id))}
                              className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableEvent;
