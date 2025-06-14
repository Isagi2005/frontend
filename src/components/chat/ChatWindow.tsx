import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import type { ConversationDetail, Message } from "../../api/chatApi"
import { useGetMessages, useSendMessage, useChatWebSocket } from "../../hooks/useChat"
import MessageInput from "./MessageInput"
import { GetUser } from "../../hooks/useUser"

type Props = {
  conversation: ConversationDetail
  onBack: () => void
  isMobile: boolean
}

const ChatWindow: React.FC<Props> = ({ conversation, onBack, isMobile }) => {
  const { data: messages, refetch } = useGetMessages(conversation.id, conversation.type)
  const { mutate: sendMessage } = useSendMessage(conversation.id, conversation.type)
  const { data: user } = GetUser()
  const [wsMessages, setWsMessages] = useState<Message[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  // Ajoute l'état local pour le modal de suppression
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; messageId: number | null }>({ open: false, messageId: null });

  // Fonction de suppression
  const handleDelete = async (messageId: number) => {
    // Appelle la mutation ou l'API pour supprimer le message
    // await deleteMessageMutation.mutateAsync(messageId);
    // Optionnel: refetch messages ou update local state
    refetch();
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, wsMessages])

  // WebSocket pour nouveaux messages
  useChatWebSocket(conversation.id, conversation.type, (msg: Message) => {
    setWsMessages((prev) => [...prev, msg])
    refetch()
  })

  // Envoi de message texte ou fichier/image via useSendMessage
  const handleSend = useCallback(
    (content: string, file?: File, image?: File) => {
      sendMessage({ content, file, image })
    },
    [sendMessage],
  )

  // Gestion de l'envoi de fichiers
  const handleSendFile = (file: File) => {
    sendMessage({ file })
  }

  // Combine and sort messages by timestamp
  const allMessages = [...(messages || []), ...wsMessages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )

  // Récupère le nom complet d'un utilisateur
  const getUserName = (u: any) =>
    u?.first_name || u?.last_name ? `${u.first_name || ""} ${u.last_name || ""}`.trim() : u?.username || "Utilisateur"

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {isMobile && (
        <div className="p-3 border-b bg-white shadow-sm">
          <button className="flex items-center text-blue-600 font-medium" onClick={onBack}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Retour
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100">
        {allMessages.map((msg, idx) => {
          // Correction de la détection du message de l'utilisateur connecté
          const isOwn =
            msg.sender?.id === user?.id ||
            msg.sender?.profile?.id === user?.profile?.id ||
            msg.sender?.username === user?.username;
          const showName =
            conversation.type === "group" && (idx === 0 || allMessages[idx - 1].sender.id !== msg.sender.id);

          return (
            <div key={msg.id + msg.timestamp} className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-1`}>
              <div className={`flex flex-col max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
                {showName && !isOwn && (
                  <span className="text-xs text-gray-600 ml-2 mb-1">{getUserName(msg.sender)}</span>
                )}

                <div
                  className={`rounded-2xl px-4 py-2 relative ${
                    isOwn ? "bg-green-500 text-white rounded-tr-none" : "bg-gray-200 text-gray-800 rounded-tl-none"
                  }`}
                >
                  {/* Affichage du contenu texte, image ou fichier */}
                  {msg.content && <span>{msg.content}</span>}
                  {msg.image && (
                    <div className="mt-2">
                      <img src={msg.image} alt="Image envoyée" className="max-w-xs max-h-48 rounded-lg border" />
                    </div>
                  )}
                  {msg.file && (
                    <div className="mt-2">
                      <a
                        href={msg.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm hover:text-blue-800"
                        download
                      >
                        {msg.filename || (typeof msg.file === 'string' ? msg.file.split('/').pop() : 'Fichier joint')}
                      </a>
                    </div>
                  )}
                  {/* Icône de menu suppression (affichée seulement au hover) */}
                  {isOwn && (
                    <button
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-600 z-10"
                      onClick={() => setDeleteModal({ open: true, messageId: msg.id })}
                      title="Supprimer"
                      style={{ lineHeight: 0 }}
                      type="button"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <span className={`text-[10px] ${isOwn ? "text-gray-500" : "text-gray-500"} mt-1 mx-2`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef}></div>
      </div>
      <MessageInput onSend={handleSend} onSendFile={handleSendFile} />

      {/* Ajout du modal de suppression en bas du composant */}
      {deleteModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
            <h3 className="text-lg font-medium mb-2">Confirmer la suppression</h3>
            <p className="mb-4 text-gray-600">Voulez-vous vraiment supprimer ce message&nbsp;?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                onClick={() => setDeleteModal({ open: false, messageId: null })}
              >
                Annuler
              </button>
              <button
                className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
                onClick={async () => {
                  if (deleteModal.messageId) {
                    await handleDelete(deleteModal.messageId);
                    setDeleteModal({ open: false, messageId: null });
                  }
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatWindow;
