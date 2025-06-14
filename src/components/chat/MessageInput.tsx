import React, { useState, useRef } from "react";

// Ajout de la gestion des fichiers/images
interface Props {
  onSend: (content: string) => void;
  onSendFile?: (file: File) => void;
}

const MessageInput: React.FC<Props> = ({ onSend, onSendFile }) => {
  const [value, setValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (value.trim()) {
      onSend(value.trim());
      setValue("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onSendFile) {
      onSendFile(e.target.files[0]);
      e.target.value = ""; // reset
    }
  };

  return (
    <div className="flex gap-2 items-center p-2 border-t bg-white">
      <button
        type="button"
        className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"
        onClick={() => fileInputRef.current?.click()}
        title="Envoyer un fichier ou une image"
      >
        <span className="text-xl">+</span>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
      />
      <input
        type="text"
        className="flex-1 p-2 border rounded"
        placeholder="Écrire un message…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        type="button"
        className="bg-blue-600 text-white px-4 py-2 rounded ml-2"
        onClick={handleSend}
        disabled={!value.trim()}
      >
        Envoyer
      </button>
    </div>
  );
};

export default MessageInput;