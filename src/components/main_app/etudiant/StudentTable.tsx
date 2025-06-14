"use client";

import { useState } from "react";
import {
  Trash2,
  Edit,
  Eye,
  User,
  Calendar,
  MapPin,
  School,
} from "lucide-react";
import BulletinModal from "./BulletinModal";
import Dialogue from "../DialogModals";
import { useDeleteStudent } from "../../../hooks/useStudent";
import UpdateStudent from "./UpdateStudent";
import type { StudentProfile } from "../../../api/studentApi";
import DetailEtudiant from "./DetailEtudiant";

interface Props {
  displayedEtudiants: StudentProfile[];
}

const StudentTable = ({ displayedEtudiants }: Props) => {
  // Ajout pour le modal bulletin
  const [isBulletinOpen, setIsBulletinOpen] = useState(false);
  const [selectedEleveId, setSelectedEleveId] = useState<number | null>(null);

  // Fonction pour ouvrir le modal bulletin

  const deleteMutation = useDeleteStudent();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [updatedId, setUpdatedId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isShowUpdate, setShowUpdate] = useState(false);
  const [viewStudent, setViewStudent] = useState<StudentProfile | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleEdit = async (id: number) => {
    setUpdatedId(id);
    setShowUpdate(true);
  };

  const openModal = (id: number) => {
    setSelectedId(id);
    setIsOpen(true);
  };

  const handleView = (student: StudentProfile) => {
    setViewStudent(student);
    setIsViewOpen(true);
  };

  // ...

  // Affichage du modal de détail étudiant avec statistiques
  // (à placer dans le JSX, probablement juste avant le export default)
  //
  // <DetailEtudiant eleve={viewStudent} open={isViewOpen} onClose={() => setIsViewOpen(false)} />


  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="w-full">
      {/* Edit Modal */}
      {isShowUpdate && updatedId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl h-screen overflow-y-auto">
            <UpdateStudent selectedId={updatedId} />
            <div className="flex justify-center">
              <button
                onClick={() => setShowUpdate(false)}
                className="mt-4 w-40 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition"
              >
                X Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isOpen && (
        <Dialogue
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          mutation={deleteMutation}
        />
      )}

      {/* View Student Details */}
      {isViewOpen && viewStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Détails de l'étudiant
              </h2>
              <button
                onClick={() => setIsViewOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                {viewStudent.image ? (
                  <img
                    src={viewStudent.image || "/placeholder.svg"}
                    alt={`${viewStudent.prenom} ${viewStudent.nom}`}
                    className="w-32 h-32 object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-32 h-32 bg-blue-100 rounded-lg shadow-md flex items-center justify-center">
                    <span className="text-blue-600 text-3xl font-bold">
                      {getInitials(viewStudent.prenom, viewStudent.nom)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Nom complet
                  </h3>
                  <p className="text-lg font-medium">
                    {viewStudent.prenom} {viewStudent.nom}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Classe</h3>
                  <p className="text-lg font-medium">
                    {viewStudent.classeName || "-"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Date de naissance
                  </h3>
                  <p className="text-lg font-medium">
                    {formatDate(viewStudent.dateDeNaissance)} ({viewStudent.age}{" "}
                    ans)
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Genre</h3>
                  <p className="text-lg font-medium">
                    {viewStudent.sexe === "M"
                      ? "Masculin"
                      : viewStudent.sexe === "F"
                      ? "Féminin"
                      : viewStudent.sexe || "-"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Religion
                  </h3>
                  <p className="text-lg font-medium">
                    {viewStudent.religion || "-"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
                  <p className="text-lg font-medium">
                    {viewStudent.adresse || "-"}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <DetailEtudiant
                eleve={viewStudent}
                open={isViewOpen}
                onClose={() => setIsViewOpen(false)}
              />
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsViewOpen(false);
                  handleEdit(viewStudent.id);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Edit size={16} />
                Modifier
              </button>
              <button
                onClick={() => setIsViewOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <th className="px-6 py-3 text-left font-medium">Étudiant</th>
                <th className="px-6 py-3 text-left font-medium">Classe</th>
                <th className="px-6 py-3 text-left font-medium">Âge</th>
                <th className="px-6 py-3 text-left font-medium">Genre</th>
                <th className="px-6 py-3 text-left font-medium">Adresse</th>
                <th className="px-6 py-3 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayedEtudiants?.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Aucun étudiant trouvé
                  </td>
                </tr>
              ) : (
                displayedEtudiants?.map((etudiant) => (
                  <tr
                    key={etudiant.id}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {etudiant.image ? (
                          <img
                            src={etudiant.image || "/placeholder.svg"}
                            alt={`${etudiant.prenom} ${etudiant.nom}`}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {getInitials(etudiant.prenom, etudiant.nom)}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">
                            {etudiant.nom} {etudiant.prenom}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {etudiant.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <School className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-gray-700">
                          {etudiant.classeName || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-gray-700">
                          {etudiant.age} ans
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-gray-700">
                          {etudiant.sexe === "M"
                            ? "Garçon"
                            : etudiant.sexe === "F"
                            ? "Fille"
                            : etudiant.sexe || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-blue-500 mr-2" />
                        <span
                          className="text-gray-700 truncate max-w-[150px]"
                          title={etudiant.adresse || "-"}
                        >
                          {etudiant.adresse || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleView(etudiant)}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                          title="Voir les détails"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(etudiant.id)}
                          className="p-1.5 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => openModal(etudiant.id)}
                          className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal Bulletin */}
      <BulletinModal
        eleveId={selectedEleveId}
        open={isBulletinOpen}
        onClose={() => setIsBulletinOpen(false)}
      />
    </div>
  );
}
export default StudentTable;