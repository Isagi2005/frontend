import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  to: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 text-black bg-transparent rounded-lg hover:bg-blue-700 transition shadow-md md:top-6 md:left-6"
    >
      <ArrowLeft size={20} />
      <span>Retour</span>
    </button>
  );
};

export default BackButton;
