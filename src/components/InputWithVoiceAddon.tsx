import React, { useRef, useState } from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";

// Vérifie la compatibilité navigateur
const isSpeechRecognitionSupported =
  typeof window !== 'undefined' && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);

interface InputWithVoiceAddonProps extends Omit<TextFieldProps, 'onChange'> {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  lang?: string; // optionnel, par défaut "fr-FR"
}

const InputWithVoiceAddon: React.FC<InputWithVoiceAddonProps> = ({ value, onChange, lang = "fr-FR", ...props }) => {
  const recognitionRef = useRef<any>(null);
  const [listening, setListening] = useState(false);

  const startListening = () => {
    if (!isSpeechRecognitionSupported) {
      alert("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
      return;
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
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
      console.log(transcript)
      // On concatène le texte reconnu à la valeur existante
      const newValue = value ? value + ' ' + transcript : transcript;
      // Crée un faux event pour le onChange du parent
      const syntheticEvent = {
        ...event,
        target: { value: newValue }
      } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
      onChange(syntheticEvent);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <TextField
      {...props}
      value={value}
      onChange={onChange}
      InputProps={{
        ...(props.InputProps || {}),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="Démarrer la dictée vocale"
              onClick={startListening}
              edge="end"
              color={listening ? "primary" : "default"}
              disabled={!isSpeechRecognitionSupported}
            >
              <MicIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default InputWithVoiceAddon;
