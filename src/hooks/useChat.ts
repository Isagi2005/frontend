import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import chatApi, { Message } from "../api/chatApi";
import { useEffect, useRef } from "react";

// Récupérer les messages d'une conversation
export const useGetMessages = (conversationId: number, conversationType: 'private' | 'group') => {
  return useQuery<Message[]>({
    staleTime: 5 * 60 * 1000,
    queryKey: ["chat", "messages", conversationId, conversationType],
    queryFn: () => chatApi.getMessages(conversationId, conversationType),
    enabled: !!conversationId && !!conversationType,
  });
};

// Envoyer un message
export const useSendMessage = (conversationId: number, conversationType: 'private' | 'group') => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { content?: string; file?: File; image?: File }) =>
      chatApi.sendMessage({ conversationId, conversationType, ...payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["chat", "messages", conversationId, conversationType] 
      });
    },
  });
};

// Marquer un message comme lu
export const useMarkAsRead = () => {
  return useMutation({
    mutationFn: (messageId: number) => chatApi.markAsRead(messageId),
  });
};

// WebSocket pour recevoir les nouveaux messages en temps réel
export const useChatWebSocket = (
  conversationId: number,
  conversationType: 'private' | 'group',
  onMessage: (msg: Message) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!conversationId || !conversationType) return;
    const wsUrl = chatApi.getWebSocketUrl(conversationId, conversationType);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.content && data.sender) {
        onMessage(data as Message);
      }
    };
    return () => {
      ws.close();
    };
  }, [conversationId, conversationType, onMessage]);

  return wsRef;
};

// Récupérer toutes les conversations de l'utilisateur
export const useGetConversations = () => {
  return useQuery({
    queryKey: ["chat", "conversations"],
    queryFn: chatApi.getConversations,
  });
};

// Créer une conversation (privée ou groupe)
export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: chatApi.createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["chat", "conversations"] 
      });
    },
  });
};

export const useCreatePrivateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => chatApi.createConversation({ participantIds: [userId] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["chat", "conversations"] 
      });
    },
  });
};

// Créer un groupe
export const useCreateGroupConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, memberIds }: { name: string; memberIds: number[] }) =>
      chatApi.createConversation({ participantIds: memberIds, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["chat", "conversations"] 
      });
    },
  });
};

// Supprimer une conversation
export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, conversationType }: { conversationId: number; conversationType: 'private' | 'group' }) =>
      chatApi.deleteConversation(conversationId, conversationType),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["chat", "conversations"] 
      });
    },
  });
};

// Quitter un groupe
export const useLeaveGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: number) => chatApi.leaveGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["chat", "groups"] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["chat", "conversations"] 
      });
    },
  });
};

// Supprimer un groupe
export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: number) => chatApi.deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["chat", "groups"] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["chat", "conversations"] 
      });
    },
  });
};

// Récupérer les groupes
export const useGetGroups = () => {
  return useQuery({
    queryKey: ["chat", "groups"],
    queryFn: chatApi.getGroups,
  });
};

// Récupérer les discussions privées
export const useGetPrivateChats = () => {
  return useQuery({
    queryKey: ["chat", "privateChats"],
    queryFn: chatApi.getPrivateChats,
  });
};

// Supprimer un message (hook pour react-query)
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (messageId: number) => chatApi.deleteMessage(messageId),
    onSuccess: () => {
      // Invalide tous les messages de toutes les conversations (ou affiner avec un paramètre)
      queryClient.invalidateQueries({ 
        queryKey: ["chat", "messages"] 
      });
    },
  });
};