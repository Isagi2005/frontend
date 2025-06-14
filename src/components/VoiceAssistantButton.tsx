import React, { useRef, useState } from "react";
import {AudioLinesIcon} from "lucide-react"
// Vérifie la compatibilité navigateur
const isSpeechRecognitionSupported =
  "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

const VoiceAssistantButton: React.FC<{
  onTranscript?: (text: string) => void;
}> = ({ onTranscript }) => {
  const recognitionRef = useRef<any>(null);
  const [listening, setListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");

  // Démarre la reconnaissance vocale
  const startListening = () => {
    if (!isSpeechRecognitionSupported) {
      alert("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
      return;
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (e: any) => {
      setListening(false);
      alert("Erreur de reconnaissance vocale : " + e.error);
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setLastTranscript(transcript);
      if (onTranscript) onTranscript(transcript);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <>
      <button
        title="Assistant vocal"
        onClick={startListening}
        className={`rounded-full p-1 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 ${listening ? "bg-blue-500" : ""}`}
        style={{ marginLeft: 8 }}
      >
        <span className="sr-only">Assistant vocal</span>
        <AudioLinesIcon/>
      </button>
      {/* Affichage du dernier texte reconnu (debug) */}
      {/* <div style={{ fontSize: 12, color: '#888' }}>{lastTranscript}</div> */}
    </>
  );
};

export default VoiceAssistantButton;
