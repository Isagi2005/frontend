"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Edit,
  Trash2,
  Check,
  Eye,
  X,
  Calendar,
  MapPin,
  Tag,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Dialogue from "../DialogModals";
import type { EventType } from "../../../api/eventApi";
import { useDeleteEvent, useUpdateEvent } from "../../../hooks/useEvent";

interface ClassProps {
  displayedData: EventType[];
}

const TableEvent = ({ displayedData }: ClassProps) => {
  const navigate = useNavigate();
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const deleteMutation = useDeleteEvent();
  const updateMutation = useUpdateEvent();
  const [previewImage, setPreviewImage] = useState<string | null>();
  const { register, handleSubmit, reset, setValue } = useForm<EventType>();

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

  const handleEdit = (event: EventType) => {
    setEditId(event.idevenement);
    setValue("idevenement", event.idevenement);
    setValue("titre", event.titre);
    setValue("description", event.description);
    setValue("datedebut", event.datedebut);
    setValue("datefin", event.datefin);
    setValue("typeEvent", event.typeEvent);
    setValue("lieu", event.lieu);
  };

  const onSubmit = (data: EventType) => {
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

  const toggleExpandRow = (id: number) => {
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
    <div className="w-full overflow-hidden rounded-lg shadow-md">
      {isOpen && (
        <Dialogue
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          mutation={deleteMutation}
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-white border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
              <th className="px-4 py-3 text-left font-medium">Titre</th>
              <th className="px-4 py-3 text-left font-medium">Description</th>
              <th className="px-4 py-3 text-left font-medium">Dates</th>
              <th className="px-4 py-3 text-left font-medium">Lieu</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-center font-medium">Image</th>
              <th className="px-4 py-3 text-left font-medium">Publié par</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedData === null ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                  <div className="flex justify-center items-center space-x-2">
                    <svg
                      className="animate-spin h-5 w-5 text-gray-400"
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
                <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                  Aucun évènement correspondant
                </td>
              </tr>
            ) : (
              displayedData?.map((event) => (
                <>
                  <tr
                    key={event.idevenement}
                    className={`hover:bg-gray-50 ${
                      editId === event.idevenement ? "bg-blue-50" : ""
                    }`}
                  >
                    {editId === event.idevenement ? (
                      <>
                        <td className="px-4 py-4" colSpan={8}>
                          <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                          >
                            <input {...register("idevenement")} type="hidden" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Titre
                                </label>
                                <input
                                  {...register("titre")}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Lieu
                                </label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                  </div>
                                  <input
                                    {...register("lieu")}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Date de début
                                </label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                  </div>
                                  <input
                                    {...register("datedebut")}
                                    type="date"
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Date de fin
                                </label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                  </div>
                                  <input
                                    {...register("datefin")}
                                    type="date"
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Type d'évènement
                                </label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Tag className="h-4 w-4 text-gray-400" />
                                  </div>
                                  <select
                                    {...register("typeEvent")}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="formation">Formation</option>
                                    <option value="annonce">Annonce</option>
                                    <option value="scolaire">
                                      Activités parascolaire
                                    </option>
                                    <option value="autres">Autres</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Image
                                </label>
                                <div className="flex items-center space-x-4">
                                  {previewImage ? (
                                    <img
                                      src={previewImage || "/placeholder.svg"}
                                      alt="Preview"
                                      className="h-16 w-16 rounded-full object-cover border border-gray-200"
                                    />
                                  ) : (
                                    <img
                                      src={
                                        event?.image
                                          ? `${import.meta.env.VITE_API_URL}${
                                              event.image
                                            }`
                                          : ""
                                      }
                                      alt={event.titre}
                                      className="h-16 w-16 rounded-full object-cover border border-gray-200"
                                    />
                                  )}
                                  <label className="cursor-pointer px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    Changer
                                    <input
                                      type="file"
                                      className="sr-only"
                                      onChange={handleImageChange}
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                {...register("description")}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>

                            <div className="flex justify-end space-x-3">
                              <button
                                type="button"
                                onClick={handleCancel}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Annuler
                              </button>
                              <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Enregistrer
                              </button>
                            </div>
                          </form>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-4">
                          <div className="font-medium text-gray-900">
                            {truncateText(event.titre, 30)}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="relative">
                            <div className="text-sm text-gray-500">
                              {expandedRows.includes(event.idevenement)
                                ? event.description
                                : truncateText(event.description, 50)}
                            </div>
                            {event.description &&
                              event.description.length > 50 && (
                                <button
                                  onClick={() =>
                                    toggleExpandRow(event.idevenement)
                                  }
                                  className="text-xs text-blue-600 hover:text-blue-800 mt-1 font-medium"
                                >
                                  {expandedRows.includes(event.idevenement)
                                    ? "Voir moins"
                                    : "Voir plus"}
                                </button>
                              )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                              <span>Début: {event.dateD}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                              <span>Fin: {event.dateF}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            {truncateText(event.lieu, 20)}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              event.typeEvent === "formation"
                                ? "bg-green-100 text-green-800"
                                : event.typeEvent === "annonce"
                                ? "bg-blue-100 text-blue-800"
                                : event.typeEvent === "scolaire"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {event.typeEvent}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex justify-center">
                            {event.image ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                src={`${import.meta.env.VITE_API_URL}${
                                  event.image
                                }`}
                                alt={event.titre}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-medium">
                                  {getInitials(event.titre)}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-500">
                            {truncateText(event.publiePar || "", 20)}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end space-x-3">
                            <button
                              onClick={() =>
                                navigate(`/event/${event.idevenement}`)
                              }
                              className="text-gray-600 hover:text-gray-900 transition-colors"
                              title="Voir les détails"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(event)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Modifier"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => openModal(event.idevenement)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableEvent;
