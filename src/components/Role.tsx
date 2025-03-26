import { useNavigate } from "react-router-dom";
import BackButton from "./Button";

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleSelectRole = (role: string) => {
    localStorage.setItem("role", role);
    navigate("/login");
  };

  return (
    <div className="bg-gradient-to-r from-emerald-200 to-blue-500  flex items-center justify-center min-h-screen ">
      <div>
        <BackButton to="/" />
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Choisissez votre fonction
        </h2>
        <div className="space-y-4">
          <button
            onClick={() => handleSelectRole("direction")}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Direction
          </button>
          <button
            onClick={() => handleSelectRole("finance")}
            className="w-full py-3 px-6 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Departement financière
          </button>
          <button
            onClick={() => handleSelectRole("parent")}
            className="w-full py-3 px-6 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 transition"
          >
            Parent
          </button>
          <button
            onClick={() => handleSelectRole("enseignant")}
            className="w-full py-3 px-6 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
          >
            Enseignant
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
