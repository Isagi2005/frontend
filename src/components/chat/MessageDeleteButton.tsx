import React, { useState } from "react";
import { useDeleteMessage } from "../../hooks/useChat";

interface MessageDeleteButtonProps {
  messageId: number;
  onDelete: () => void;
  disabled?: boolean;
  icon?: boolean;
}

const MessageDeleteButton: React.FC<MessageDeleteButtonProps> = ({ messageId, onDelete, disabled, icon }) => {
  const { mutate: deleteMessage, isLoading } = useDeleteMessage();
  const [confirm, setConfirm] = useState(false);

  const handleDelete = () => {
    if (!confirm) {
      setConfirm(true);
      setTimeout(() => setConfirm(false), 2500); // Reset confirm after 2.5s
      return;
    }
    deleteMessage(messageId, {
      onSuccess: onDelete,
      onError: () => alert("Erreur lors de la suppression du message."),
    });
  };

  return (
    <button
      className={icon
        ? `p-1 rounded-full bg-white/80 hover:bg-red-100 text-red-500 hover:text-red-700 shadow transition ml-1`
        : `ml-2 text-red-500 hover:text-red-700 text-xs`}
      onClick={handleDelete}
      disabled={isLoading || disabled}
      title="Supprimer le message"
      style={icon ? { lineHeight: 0, minWidth: 28, minHeight: 28 } : {}}
    >
      {isLoading ? (
        icon ? (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
        ) : (
          "Suppression..."
        )
      ) : confirm ? (
        icon ? (
          <span className="text-xs font-semibold">Confirmer ?</span>
        ) : (
          "Confirmer ?"
        )
      ) : icon ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        "Supprimer"
      )}
    </button>
  );
};

export default MessageDeleteButton;
