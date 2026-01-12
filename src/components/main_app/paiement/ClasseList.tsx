"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  FaMoneyBillWave,
  FaEye,
  FaArrowLeft,
  FaUsers,
  FaFileWord,
  FaSearch,
  FaGraduationCap,
  FaSpinner,
  FaTimesCircle,
  FaCheckCircle,
} from "react-icons/fa"
import { useParams, useNavigate } from "react-router-dom"
import { useGetGenerics } from "../../../hooks/useStudent"
import PaiementForm from "./PaiementForm"
import PaiementDetails from "./PaiementDetails"
import { generateCertificatText, exportCertificatDocx } from "../../../api/certificatApi"
import CertificatPreview from "./CertificatPreview"
import "../../../../classe-list.css"

const ClasseList: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: students, isLoading, isError } = useGetGenerics("classe", id || "")

  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [selectedStudentForDetails, setSelectedStudentForDetails] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [certificatTexte, setCertificatTexte] = useState<string | null>(null)
  const [certificatStudent, setCertificatStudent] = useState<any>(null)
  const [isGeneratingCertificat, setIsGeneratingCertificat] = useState(false)
  const [activeRow, setActiveRow] = useState<number | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const rows = document.querySelectorAll("tbody tr")
    rows.forEach((row, index) => {
      ;(row as HTMLElement).style.animationDelay = `${index * 0.05}s`
    })
  }, [students, searchQuery])

  const filteredStudents = students?.filter((student) => {
    const fullName = `${student.nom} ${student.prenom}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase())
  })

  const handleOpenPaiement = (student: any) => setSelectedStudent(student)
  const handleClosePaiement = () => setSelectedStudent(null)

  const handleViewDetails = (student: any) => {
    setSelectedStudentForDetails(student)
    // Scroll to details section with smooth animation
    setTimeout(() => {
      const detailsSection = document.getElementById("details-section")
      if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  const handleGenerateCertificat = async (student: any) => {
    try {
      setIsGeneratingCertificat(true)
      const texte = await generateCertificatText(student)
      setCertificatTexte(texte)
      setCertificatStudent(student)
    } catch (err) {
      showNotification("Erreur lors de la génération du certificat")
      console.error(err)
    } finally {
      setIsGeneratingCertificat(false)
    }
  }

  const handleDirectDownloadDocx = async (student: any) => {
    try {
      setIsGeneratingCertificat(true)
      const texte = await generateCertificatText(student)
      await exportCertificatDocx(student, texte)
      showNotification(`Certificat de ${student.prenom} ${student.nom} téléchargé avec succès`)
    } catch (err) {
      showNotification("Erreur lors du téléchargement du certificat")
      console.error(err)
    } finally {
      setIsGeneratingCertificat(false)
    }
  }

  const showNotification = (message: string) => {
    setSuccessMessage(message)
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  if (!id)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-xl border border-indigo-100 max-w-md animate-fade-in">
          <FaTimesCircle className="text-indigo-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucune classe sélectionnée</h2>
          <p className="text-gray-600 mb-6">Veuillez sélectionner une classe pour voir la liste des étudiants.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md flex items-center justify-center gap-2 mx-auto"
          >
            <FaArrowLeft /> Retour à la sélection
          </button>
        </div>
      </div>
    )

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="relative animate-spin mb-4">
          <FaSpinner className="text-indigo-600 text-5xl" />
        </div>
        <h2 className="text-xl font-semibold text-indigo-800 mb-2 animate-pulse">Chargement des étudiants</h2>
        <p className="text-indigo-600">Veuillez patienter un instant...</p>
      </div>
    )

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-pink-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-xl border border-red-100 max-w-md animate-fade-in">
          <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-6">Impossible de charger la liste des étudiants. Veuillez réessayer.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-md flex items-center justify-center gap-2 mx-auto"
          >
            <FaSpinner className="animate-spin" /> Réessayer
          </button>
        </div>
      </div>
    )

  if (!students || students.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-xl border border-indigo-100 max-w-md animate-fade-in">
          <FaUsers className="text-indigo-300 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucun étudiant trouvé</h2>
          <p className="text-gray-600 mb-6">Cette classe ne contient aucun étudiant pour le moment.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md flex items-center justify-center gap-2 mx-auto"
          >
            <FaArrowLeft /> Retour à la sélection
          </button>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-8 relative">
      {/* Notification */}
      <div
        className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg transition-all duration-500 flex items-center gap-3 max-w-md ${
          showSuccessMessage ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"
        } ${successMessage.includes("Erreur") ? "bg-red-100 text-red-800 border border-red-200" : "bg-green-100 text-green-800 border border-green-200"}`}
      >
        {successMessage.includes("Erreur") ? (
          <FaTimesCircle className="text-red-500 text-xl flex-shrink-0" />
        ) : (
          <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
        )}
        <p>{successMessage}</p>
      </div>

      <div className="max-w-7xl mx-auto animate-fade-in">
        {/* Header avec animation */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300">
              <FaGraduationCap className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 text-transparent bg-clip-text">
                Liste des étudiants
              </h1>
              <p className="text-indigo-600 text-sm mt-1">
                {filteredStudents?.length || 0} étudiant{filteredStudents?.length !== 1 ? "s" : ""} dans cette classe
              </p>
            </div>
          </div>

          {/* Bouton retour */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 transform hover:-translate-y-1"
          >
            <FaArrowLeft /> Retour aux classes
          </button>
        </div>

        {/* Recherche avec animation */}
        <div className="mb-8 max-w-md mx-auto transform hover:scale-102 transition-all duration-300">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-indigo-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un étudiant..."
              className="w-full pl-12 pr-4 py-3 border-2 border-indigo-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tableau avec animations */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-indigo-100 animate-fade-in-up">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800">
                <th className="text-left px-6 py-4 font-semibold border-b border-indigo-200">Nom</th>
                <th className="text-left px-6 py-4 font-semibold border-b border-indigo-200">Prénom</th>
                <th className="text-left px-6 py-4 font-semibold border-b border-indigo-200">Classe</th>
                <th className="text-left px-6 py-4 font-semibold border-b border-indigo-200">Actions</th>
                <th className="text-left px-6 py-4 font-semibold border-b border-indigo-200">Certificat</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents?.map((etudiant: any, index: number) => (
                <tr
                  key={etudiant.id}
                  className={`transition-all duration-300 table-row-animated ${
                    activeRow === etudiant.id ? "bg-indigo-50" : index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50`}
                  onMouseEnter={() => setActiveRow(etudiant.id)}
                  onMouseLeave={() => setActiveRow(null)}
                >
                  <td className="px-6 py-4 border-b border-indigo-100">{etudiant.nom}</td>
                  <td className="px-6 py-4 border-b border-indigo-100">{etudiant.prenom}</td>
                  <td className="px-6 py-4 border-b border-indigo-100">{etudiant.classeName}</td>
                  <td className="px-6 py-4 border-b border-indigo-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenPaiement(etudiant)}
                        className="flex items-center gap-1.5 text-sm text-white bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:from-green-600 hover:to-emerald-700 transform hover:-translate-y-0.5"
                      >
                        <FaMoneyBillWave /> Payer
                      </button>
                      <button
                        onClick={() => handleViewDetails(etudiant)}
                        className="flex items-center gap-1.5 text-sm text-white bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 transform hover:-translate-y-0.5"
                      >
                        <FaEye /> Détails
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b border-indigo-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleGenerateCertificat(etudiant)}
                        disabled={isGeneratingCertificat}
                        className={`flex items-center gap-1.5 text-sm text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 ${
                          isGeneratingCertificat
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                        }`}
                      >
                        {isGeneratingCertificat ? <FaSpinner className="animate-spin" /> : null}
                        Aperçu
                      </button>
                      <button
                        onClick={() => handleDirectDownloadDocx(etudiant)}
                        disabled={isGeneratingCertificat}
                        className={`flex items-center gap-1.5 text-sm text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 ${
                          isGeneratingCertificat
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                        }`}
                      >
                        {isGeneratingCertificat ? <FaSpinner className="animate-spin" /> : <FaFileWord />}
                        Word
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Aperçu du certificat */}
        {certificatTexte && certificatStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <CertificatPreview
              content={certificatTexte}
              etudiant={certificatStudent}
              onClose={() => setCertificatTexte(null)}
            />
          </div>
        )}

        {/* Paiement Formulaire */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <PaiementForm
              etudiantId={selectedStudent.id}
              etudiantNom={selectedStudent.nom}
              etudiantPrenom={selectedStudent.prenom}
              onClose={handleClosePaiement}
            />
          </div>
        )}

        {/* Détails Paiement */}
        {selectedStudentForDetails && (
          <div id="details-section" className="mt-12 animate-fade-in-up">
            <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-6 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-lg shadow-md">
                  <FaEye className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Détails des paiements - {selectedStudentForDetails.prenom} {selectedStudentForDetails.nom}
                </h2>
                <button
                  onClick={() => setSelectedStudentForDetails(null)}
                  className="ml-auto text-gray-500 hover:text-red-500 transition-colors"
                >
                  <FaTimesCircle className="text-xl" />
                </button>
              </div>

              <PaiementDetails
                etudiantId={selectedStudentForDetails.id}
                etudiantNom={selectedStudentForDetails.nom}
                etudiantPrenom={selectedStudentForDetails.prenom}
                onClose={() => setSelectedStudentForDetails(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClasseList
