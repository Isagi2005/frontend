import type React from "react"
import { useState, useEffect } from "react"
import ConversationList from "./ConversationList"
import ChatWindow from "./ChatWindow"
import UserSearchList from "./UserSearchList"
import CreateGroupModal from "./CreateGroupModal"
import type { ConversationDetail } from "../../api/chatApi"
import type { User } from "../../api/userApi"
import { useCreatePrivateConversation, useCreateGroupConversation } from "../../hooks/useChat"
import { GetUser } from "../../hooks/useUser"

const ChatContainer: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<ConversationDetail | null>(null)
  const [showUserList, setShowUserList] = useState(false)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [loadingConv, setLoadingConv] = useState(false)

  const createPrivateConvMutation = useCreatePrivateConversation()
  const createGroupConvMutation = useCreateGroupConversation()

  const { data: user } = GetUser();
  const userRole = user?.profile?.role ;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    // Set initial value
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Démarrer une conversation privée
  const handleUserSelect = async (user: User) => {
    setLoadingConv(true)
    try {
      const conv = await createPrivateConvMutation.mutateAsync(user.id!)
      setSelectedConversation(conv)
      setShowUserList(false)
    } finally {
      setLoadingConv(false)
    }
  }

  // Créer un groupe
  const handleCreateGroup = async (name: string, memberIds: number[]) => {
    setLoadingConv(true)
    try {
      const conv = await createGroupConvMutation.mutateAsync({ name, memberIds })
      setSelectedConversation(conv)
      setShowGroupModal(false)
    } finally {
      setLoadingConv(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100 overflow-hidden">
      {/* Sidebar - Conversations List */}
      <div
        className={`${
          isMobile && selectedConversation ? "hidden" : "flex"
        } flex-col bg-white shadow-sm border-r border-gray-200 transition-all duration-300 ${
          isMobile ? "w-full" : "w-80 lg:w-96"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
          <div className="flex space-x-2">
            <button
              className="flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors duration-200"
              onClick={() => setShowUserList((v) => !v)}
              title="Nouvelle conversation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </button>
            {userRole !== "parent" && (
              <button
                className="flex items-center justify-center p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors duration-200"
                onClick={() => setShowGroupModal(true)}
                title="Nouveau groupe"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </button>
            )}

          </div>
        </div>

        {/* User Search Dropdown */}
        {showUserList && (
          <div className="absolute top-[112px] left-0 w-80 lg:w-96 bg-white z-20 shadow-xl border border-gray-200 rounded-b-lg overflow-hidden">
            <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-medium text-gray-700">Nouvelle conversation</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowUserList(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              <UserSearchList onUserSelect={handleUserSelect} />
            </div>
          </div>
        )}

        {/* Conversations List */}
        <div className="flex-1 overflow-hidden">
          <ConversationList
            onSelectConversation={setSelectedConversation}
            selectedConversationId={selectedConversation?.id}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div
        className={`${
          isMobile && !selectedConversation ? "hidden" : "flex"
        } flex-col flex-1 bg-gray-50 transition-all duration-300`}
      >
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            onBack={() => setSelectedConversation(null)}
            isMobile={isMobile}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Bienvenue dans votre messagerie</h2>
            <p className="text-gray-600 max-w-md">
              Sélectionnez une conversation existante ou démarrez une nouvelle discussion pour commencer à échanger.
            </p>
            <div className="mt-8 flex space-x-4">
              <button
                onClick={() => setShowUserList(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                Nouvelle conversation
              </button>
              <button
                onClick={() => setShowGroupModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Créer un groupe
              </button>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loadingConv && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
              <p className="mt-4 text-blue-600 font-medium">Chargement de la conversation...</p>
            </div>
          </div>
        )}
      </div>

      {/* Group Creation Modal */}
      {showGroupModal && <CreateGroupModal onClose={() => setShowGroupModal(false)} onCreate={handleCreateGroup} />}
    </div>
  )
}

export default ChatContainer
