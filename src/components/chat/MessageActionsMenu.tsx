import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useDeleteMessage } from "../../hooks/useChat"

interface MessageActionsMenuProps {
  messageId: number
  onDelete: () => void
  isGroupOwner?: boolean
  isGroupMessage?: boolean
  disabled?: boolean
}

const MessageActionsMenu: React.FC<MessageActionsMenuProps> = ({
  messageId,
  onDelete,
  isGroupOwner = false,
  isGroupMessage = false,
  disabled = false,
}) => {
  const { mutate: deleteMessage } = useDeleteMessage()
  const [isOpen, setIsOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        if (confirmDelete) setConfirmDelete(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [confirmDelete])

  // Reset confirm state after timeout
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (confirmDelete) {
      timer = setTimeout(() => {
        setConfirmDelete(false)
      }, 3000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [confirmDelete])

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }

    deleteMessage(messageId, {
      onSuccess: () => {
        onDelete()
        setIsOpen(false)
        setConfirmDelete(false)
      },
      onError: () => {
        alert("Erreur lors de la suppression du message.")
        setConfirmDelete(false)
      },
    })
  }

  const handleEdit = () => {
    // Implement edit functionality
    console.log("Edit message:", messageId)
    setIsOpen(false)
  }

  const handleLeaveGroup = () => {
    // Implement leave group functionality
    console.log("Leave group")
    setIsOpen(false)
  }

  const handleDeleteGroup = () => {
    // Implement delete group functionality
    console.log("Delete group")
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        className={`p-1.5 rounded-full transition-colors duration-200 ${
          isOpen ? "bg-gray-200 text-gray-800" : "text-gray-500 hover:bg-gray-100"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        aria-label="Options du message"
        title="Options du message"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200 animate-in fade-in slide-in-from-top-5 duration-200">
          {!confirmDelete ? (
            <>
              <button
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={handleEdit}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-3 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Modifier
              </button>

              <button
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={handleDelete}
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
                Supprimer
              </button>

              {isGroupMessage && (
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleLeaveGroup}
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
              )}

              {isGroupOwner && (
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={handleDeleteGroup}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-3 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Supprimer le groupe
                </button>
              )}
            </>
          ) : (
            <div className="p-3">
              <p className="text-sm text-gray-700 mb-2">Confirmer la suppression ?</p>
              <div className="flex space-x-2">
                <button
                  className="flex-1 px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300"
                  onClick={() => setConfirmDelete(false)}
                >
                  Annuler
                </button>
                <button
                  className="flex-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  onClick={handleDelete}
                  
                >
                    "Supprimer"
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MessageActionsMenu
