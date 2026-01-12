"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useDeleteGroup, useLeaveGroup } from "../../hooks/useChat" // Ajout du hook useLeaveGroup

import { useContext } from "react"
import AuthContext from "../../api/AuthContext"

interface GroupActionsMenuProps {
  groupId: number
  isOwner?: boolean
  onDelete?: () => void
  onLeave?: () => void
  disabled?: boolean
}


const GroupActionsMenu: React.FC<GroupActionsMenuProps> = ({
  groupId,
  isOwner = false,
  onDelete,
  onLeave,
  disabled = false,
}) => {
  // Récupérer le rôle de l'utilisateur via AuthContext
  const auth = useContext(AuthContext)
  // On suppose que tu as accès à l'utilisateur courant dans le contexte
  // Sinon, adapte ici pour passer le user/role en props
  // @ts-expect-error - auth object may have user property
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = auth?.user || auth?.currentUser || null

  const deleteGroupResult = useDeleteGroup()
  const leaveGroupResult = useLeaveGroup()

  const { mutate: deleteGroup } = deleteGroupResult
  const { mutate: leaveGroup } = leaveGroupResult

  const [isOpen, setIsOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"delete" | "leave" | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const isLoading = (deleteGroupResult as any).isLoading || (leaveGroupResult as any).isLoading

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        if (confirmAction) setConfirmAction(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [confirmAction])

  // Reset confirm state after timeout
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (confirmAction) {
      timer = setTimeout(() => {
        setConfirmAction(null)
      }, 3000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [confirmAction])

  const handleDeleteGroup = () => {
    if (confirmAction !== "delete") {
      setConfirmAction("delete")
      return
    }

    deleteGroup(groupId, {
      onSuccess: () => {
        if (onDelete) onDelete()
        setIsOpen(false)
        setConfirmAction(null)
      },
      onError: () => {
        alert("Erreur lors de la suppression du groupe.")
        setConfirmAction(null)
      },
    })
  }

  const handleLeaveGroup = () => {
    if (confirmAction !== "leave") {
      setConfirmAction("leave")
      return
    }

    leaveGroup(groupId, {
      onSuccess: () => {
        if (onLeave) onLeave()
        setIsOpen(false)
        setConfirmAction(null)
      },
      onError: () => {
        alert("Erreur lors de la sortie du groupe.")
        setConfirmAction(null)
      },
    })
  }

  const handleEditGroup = () => {
    // Implement edit group functionality
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
      <button
        className={`p-1.5 rounded-full transition-colors duration-200 ${
          isOpen ? "bg-gray-200 text-gray-800" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        }`}
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        disabled={disabled || isLoading}
        aria-label="Options du groupe"
        title="Options du groupe"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200 animate-in fade-in slide-in-from-top-5 duration-200">
          {!confirmAction ? (
            <>
              {isOwner && (
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditGroup()
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-3 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Modifier le groupe
                </button>
              )}

              <button
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation()
                  handleLeaveGroup()
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-3 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clipRule="evenodd"
                  />
                </svg>
                Quitter le groupe
              </button>

              {isOwner && (
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteGroup()
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-3 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Supprimer le groupe
                </button>
              )}
            </>
          ) : (
            <div className="p-3">
              <p className="text-sm text-gray-700 mb-2">
                {confirmAction === "delete"
                  ? "Confirmer la suppression du groupe ?"
                  : "Confirmer la sortie du groupe ?"}
              </p>
              <div className="flex space-x-2">
                <button
                  className="flex-1 px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    setConfirmAction(null)
                  }}
                >
                  Annuler
                </button>
                <button
                  className={`flex-1 px-3 py-1 ${
                    confirmAction === "delete" ? "bg-red-500 hover:bg-red-600" : "bg-orange-500 hover:bg-orange-600"
                  } text-white rounded text-sm`}
                  onClick={(e) => {
                    e.stopPropagation()
                    confirmAction === "delete" ? handleDeleteGroup() : handleLeaveGroup()
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
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
                    </span>
                  ) : confirmAction === "delete" ? (
                    "Supprimer"
                  ) : (
                    "Quitter"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default GroupActionsMenu
