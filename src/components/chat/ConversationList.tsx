
import type React from "react"
import { useState } from "react"
import type { ConversationDetail } from "../../api/chatApi"
import { useGetConversations } from "../../hooks/useChat"
import type { User } from "../../api/userApi"
import { GetUser } from "../../hooks/useUser"
import GroupActionsMenu from "./GroupActionMenu"

import type { ParentEnfantPedagogique } from "../../types/parentTypes" // à adapter selon ton projet

type Props = {
  onSelectConversation: (conv: ConversationDetail) => void
  selectedConversationId?: number
  mode?: 'parent' | 'enseignant' | 'direction'
  enfants?: ParentEnfantPedagogique[]
  user?: User
}

const ConversationList: React.FC<Props> = ({ onSelectConversation, selectedConversationId, mode, enfants, user: userProp }) => {
  const { data: conversations, isLoading } = useGetConversations()
  const { data: userHook } = GetUser()
  const user = userProp || userHook
  const [searchTerm, setSearchTerm] = useState("")

  // --- Filtrage spécial pour le mode parent ---
  let filteredConversations = Array.isArray(conversations) ? conversations : [];
  // --- Filtrage spécial pour enseignant et direction ---
  if ((mode === 'enseignant' || mode === 'direction') && user) {
    // Liste des rôles autorisés pour la discussion
    const allowedRoles = ['parent', 'finance', 'direction'];
    filteredConversations = filteredConversations.filter((conv) => {
      // On vérifie les membres de la conversation
      if (conv.type === 'private') {
        // Trouver l'autre utilisateur
        const other = conv.members?.find((m: User) => m && m.id !== user.id);
        return other && allowedRoles.includes((other.profile?.role as string) || '');
      } else if (conv.type === 'group') {
        // Groupe dont l'utilisateur est membre ET qui ne contient que des rôles autorisés
        return conv.members?.some((m: User) => m && m.id === user.id) &&
          conv.members?.every((m: User) => allowedRoles.includes((m.profile?.role as string) || ''));
      }
      return false;
    });
  }
  // --- Filtrage spécial pour le mode parent ---
  else if (mode === 'parent' && enfants && user) {
    // Récupérer les titulaires de chaque enfant
    const titulairesIds = Array.from(new Set(
      enfants.flatMap((enfant: ParentEnfantPedagogique) =>
        (enfant as any).titulaires ? (enfant as any).titulaires.map((t: { id: number }) => t.id) : []
      )
    ));
    filteredConversations = filteredConversations.filter((conv) => {
      if (conv.type === "private") {
        // Conversation privée avec un titulaire
        const other = conv.members?.find((m: User) => m && m.id !== user.id)
        return other && titulairesIds.includes(other.id)
      } else if (conv.type === "group") {
        // Groupe dont le parent est membre
        return conv.members?.some((m: User) => m && m.id === user.id)
      }
      return false;
    });
  } else {
    // Filtrage standard (recherche)
    filteredConversations = filteredConversations.filter((conv) => {
      const searchLower = searchTerm.toLowerCase()
      if (conv.type === "group") {
        return (conv.name || "").toLowerCase().includes(searchLower)
      } else {
        const other = conv.members?.find((m: User) => m && m.id !== user?.id)
        return other && `${other.first_name || ""} ${other.last_name || ""}`.toLowerCase().includes(searchLower)
      }
    });
  }

  // Separate groups and private conversations
  const groups = filteredConversations.filter((c) => c.type === "group")
  const privates = filteredConversations.filter((c) => c.type === "private")

  // Format time (today shows only time, other days show date)
  const formatTime = (timestamp: string) => {
    if (!timestamp) return ""

    const messageDate = new Date(timestamp)
    const today = new Date()

    // Check if the message is from today
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    // Check if the message is from yesterday
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Hier"
    }

    // Check if the message is from this week
    const oneWeekAgo = new Date(today)
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    if (messageDate > oneWeekAgo) {
      return messageDate.toLocaleDateString(undefined, { weekday: "short" })
    }

    // Otherwise show the date
    return messageDate.toLocaleDateString(undefined, { day: "numeric", month: "short" })
  }

  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Generate a consistent color based on conversation ID
  const getAvatarColor = (id: number) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-teal-500",
    ]
    return colors[id % colors.length]
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Chargement des conversations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher une conversation..."
            className="w-full px-4 py-2 pl-10 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {(!Array.isArray(conversations) || conversations.length === 0) && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Aucune conversation</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez une nouvelle conversation pour discuter avec vos contacts.
            </p>
          </div>
        )}

        {groups.length > 0 && (
          <div className="mb-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
              Groupes
            </div>
            <ul>
              {groups.map((conv) => (
                <li
                  key={`group-${conv.id}`}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                    selectedConversationId === conv.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => onSelectConversation(conv)}
                >
                  <div className="flex items-center px-4 py-3 border-b border-gray-100">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white ${getAvatarColor(
                        conv.id,
                      )}`}
                    >
                      <span className="font-medium text-sm">{getInitials(conv.name || "Groupe")}</span>
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3
                          className={`text-sm font-medium truncate ${
                            selectedConversationId === conv.id ? "text-blue-600" : "text-gray-900"
                          }`}
                        >
                          {conv.name || "Groupe"}
                        </h3>
                        {conv.last_message?.timestamp && (
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {formatTime(conv.last_message.timestamp)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{conv.last_message?.content || "Aucun message"}</p>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <GroupActionsMenu groupId={conv.id} isOwner={conv.members?.find((m) => m.id === user?.id)?.id === user?.id} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {privates.length > 0 && (
          <div>
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
              Messages privés
            </div>
            <ul>
              {privates.map((conv) => {
                const other = conv.members?.find((m: User) => m && m.id !== user?.id)
                const displayName = other
                  ? `${other.first_name || ""} ${other.last_name || ""}`.trim() || other.username || "Utilisateur"
                  : "Utilisateur inconnu"

                return (
                  <li
                    key={`private-${conv.id}`}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                      selectedConversationId === conv.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => onSelectConversation(conv)}
                  >
                    <div className="flex items-center px-4 py-3 border-b border-gray-100">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white ${getAvatarColor(
                          other?.id || conv.id,
                        )}`}
                      >
                        <span className="font-medium text-sm">{getInitials(displayName)}</span>
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3
                            className={`text-sm font-medium truncate ${
                              selectedConversationId === conv.id ? "text-blue-600" : "text-gray-900"
                            }`}
                          >
                            {displayName}
                          </h3>
                          {conv.last_message?.timestamp && (
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                              {formatTime(conv.last_message.timestamp)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {conv.last_message?.content || "Aucun message"}
                        </p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {Array.isArray(conversations) && conversations.length > 0 && filteredConversations.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Aucun résultat</h3>
            <p className="mt-1 text-sm text-gray-500">Aucune conversation ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConversationList
