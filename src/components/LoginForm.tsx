import {  useState } from "react";
import { useAuth } from "../api/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import img1 from "../assets/icone_dir.png";
import img2 from "../assets/icone_personnel.jpg";
import img3 from "../assets/icone_parent.png";
import BackButton from "./Button";
import { capturePhoto } from "./cameraUtils";
import { UseUpdateProfile, GetUser } from "../hooks/useUser";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const roles: string | null = localStorage.getItem("role");
  const nav = useNavigate();
  const { login } = useAuth();
  
  const updateProfile = UseUpdateProfile();
  const { data: userData } = GetUser();

  const getImage = (role: string) => {
    switch (role) {
      case "finance":
        return img2;
      case "enseignant":
        return img2;
      case "direction":
        return img1;
      case "parent":
        return img3;
      default:
        return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password, roles);
    // Prise de photo et PATCH du profil (sauf pour les parents)
    // try {
    //   if (roles !== 'parent') {
    //     const photo = await capturePhoto();
    //     if (photo && userData?.profile?.id) {
    //       await updateProfile.mutateAsync({
    //         ...userData.profile,
    //         historique: photo,
    //       });
    //     }
    //   }
    // } catch (err) {
    //   console.log("erreur", err);
    // }
    nav("/home");
  };


  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-200 to-blue-500 flex items-center justify-center p-6">
      {/* Logo animé */}
      <div>
        <BackButton to="/element" />
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md bg-gradient-to-r from-white to-emerald-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <img
              src={roles && getImage(roles)}
              alt=""
              className="w-20 h-auto rounded-full bg-gray-700"
            />
          </div>
          {/* Identifiant */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Identifiant
            </label>
            <div className="relative">
              <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                id="username"
                placeholder="Identifiant"
                className="pl-10 pr-3 py-2 border rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="Mot de passe"
                className="pl-3 pr-10 py-2 border rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Bouton de connexion */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
