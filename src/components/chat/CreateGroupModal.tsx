"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import UserSearchList from "./UserSearchList"
import type { User } from "../../api/userApi"

interface Props {
  onClose: () => void
  onCreate: (name: string, memberIds: number[]) => void
}

const CreateGroupModal: React.FC<Props> = ({ onClose, onCreate }) => {
  const [step, setStep] = useState<"name" | "members">("name")
  const [groupName, setGroupName] = useState("")
  const [members, setMembers] = useState<User[]>([])
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  // Handle escape key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscKey)
    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [onClose])

  // Correction du type: excludeIds doit être number[] sans undefined
  const excludeIds: number[] = members.map((m) => m.id!).filter((id): id is number => id !== undefined)

  const handleCreateGroup = () => {
    const validMemberIds = members.map((m) => m.id!).filter((id): id is number => id !== undefined)
    onCreate(groupName, validMemberIds)
  }

  const handleBack = () => {
    setStep("name")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transition-all duration-300 transform"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {step === "name" ? "Créer un groupe" : "Ajouter des membres"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1 transition-colors duration-200"
            aria-label="Fermer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "name" ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="group-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du groupe
                </label>
                <input
                  ref={inputRef}
                  id="group-name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Ex: Équipe Marketing"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <p className="text-sm text-gray-500">
                Donnez un nom à votre groupe qui permettra aux membres de l'identifier facilement.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ajouter des membres</label>
                <UserSearchList
                  onUserSelect={(user) => {
                    if (!members.some((m) => m.id === user.id)) setMembers([...members, user])
                  }}
                  excludeIds={excludeIds}
                />
              </div>

              {members.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Membres sélectionnés ({members.length})
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
                    {members.map((m) => (
                      <span
                        key={m.id}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {m.first_name} {m.last_name}
                        <button
                          className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                          onClick={() => setMembers(members.filter((mem) => mem.id !== m.id))}
                          aria-label={`Retirer ${m.first_name} ${m.last_name}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          {step === "name" ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!groupName.trim()}
                onClick={() => setStep("members")}
              >
                Suivant
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
              >
                Retour
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={members.length === 0}
                onClick={handleCreateGroup}
              >
                Créer le groupe
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateGroupModal
