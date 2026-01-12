import api from "./api";
import { User } from "./userApi";

export interface Message {
  id: number;
  conversation_id: number;
  conversation_type: 'private' | 'group';
  content: string;
  sender: User;
  timestamp: string;
  file?: string;
  image?: string;
  is_read: boolean;
}

export interface Conversation {
  id: number;
  created_at: string;
  last_message?: Message;
  unread_count: number;
}

export interface ConversationDetail extends Conversation {
  members?: User[];
  name?: string;
  type: 'private' | 'group';
}

export interface CreateConversationPayload {
  participantIds: number[]; // Pour privée: 1 id, pour groupe: plusieurs
  name?: string; // Pour groupe
}

export type SendMessagePayload = {
  conversationId: number;
  conversationType: 'private' | 'group';
  content?: string;
  file?: File;
  image?: File;
};

const chatApi = {
  // Quitter un groupe
  leaveGroup(groupId: number): Promise<{success: boolean; deleted: boolean}> {
    return api.post(`/api/users/conversations/${groupId}/leave_group/`) as Promise<{success: boolean; deleted: boolean}>;
  },
  // Récupérer tous les messages d'une conversation
  getMessages(conversationId: number, conversationType: 'private' | 'group'): Promise<Message[]> {
    return api.get(`/api/users/messages/?conversation_id=${conversationId}&conversation_type=${conversationType}`) as Promise<Message[]>;
  },

  // Envoyer un message texte ou fichier
  sendMessage({ conversationId, conversationType, content, file, image }: SendMessagePayload): Promise<Message> {
    const formData = new FormData();
    formData.append("conversation_id", conversationId.toString());
    formData.append("conversation_type", conversationType);
    if (content) formData.append("content", content);
    if (file) formData.append("file", file);
    if (image) formData.append("image", image);
    return api.post(`/api/users/messages/`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }) as Promise<Message>;
  },

  // Marquer un message comme lu
  markAsRead(messageId: number): Promise<void> {
    return api.post(`/api/users/messages/${messageId}/mark_as_read/`) as Promise<void>;
  },

  // Supprimer un message
  deleteMessage(messageId: number): Promise<void> {
    return api.delete(`/api/users/messages/${messageId}/`) as Promise<void>;
  },

  // Utilitaires WebSocket
  getWebSocketUrl(conversationId: number, conversationType: 'private' | 'group'): string {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.hostname;
    let port = '';

    if (process.env.NODE_ENV === "development") {
      port = ':8000'; // Port du backend Django Channels en dev
    } else {
      // En prod, laisse vide ou adapte selon ton infra
      port = '';
    }

    return `${protocol}://${host}${port}/ws/chat/${conversationType}/${conversationId}/`;
  },

  // Récupérer toutes les conversations de l'utilisateur
  getConversations(): Promise<ConversationDetail[]> {
    return api.get('/api/users/chats/') as Promise<ConversationDetail[]>;
  },

  // Créer une conversation privée ou de groupe
  createConversation(payload: CreateConversationPayload): Promise<ConversationDetail> {
    return api.post('/api/users/chats/', payload) as Promise<ConversationDetail>;
  },

  // Supprimer une conversation
  deleteConversation(conversationId: number, conversationType: 'private' | 'group'): Promise<void> {
    return api.delete(`/api/users/chats/${conversationId}/?type=${conversationType}`) as Promise<void>;
  },

  // Supprimer un groupe
  deleteGroup(groupId: number): Promise<void> {
    return api.delete(`/api/users/chats/${groupId}/?type=group`) as Promise<void>;
  },

  // Récupérer les groupes
  getGroups(): Promise<ConversationDetail[]> {
    return api.get('/api/users/chats/?type=group') as Promise<ConversationDetail[]>;
  },

  // Récupérer les discussions privées
  getPrivateChats(): Promise<ConversationDetail[]> {
    return api.get('/api/users/chats/?type=private') as Promise<ConversationDetail[]>;
  },
};

export default chatApi;