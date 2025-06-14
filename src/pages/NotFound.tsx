import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md text-center">
        <div className="flex justify-center mb-6 text-red-500">
          <AlertCircle size={64} />
        </div>
        <h1 className="text-4xl font-bold mb-4">Oups !</h1>
        <p className="text-gray-600 mb-6">
          La page que vous cherchez n'existe pas ou vous n'y avez pas accès.
        </p>
        <button
          onClick={handleGoBack}
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition"
        >
          Revenir à la page précédente
        </button>
      </div>
    </div>
  );
}

export default NotFound;
