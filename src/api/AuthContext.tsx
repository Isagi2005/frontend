import { useContext, useEffect, useRef, useState } from "react";
import { createContext } from "react";
import { Is_authenticated, useLogin, UseLogout } from "../hooks/useLogin";
import { refreshToken } from "../api/Refresh";
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const loginMutation = useLogin();

  // Supprime le hasLoggedOut et utilise plutôt ceci
  const skipInitialAuthCheck = useRef(false);

  const getAuthenticated = async () => {
    if (skipInitialAuthCheck.current) return;

    try {
      const success: boolean = await Is_authenticated();
      setIsAuthenticated(success);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (username: string, password: string, role: string) => {
    setLoading(true);
    skipInitialAuthCheck.current = true; // On skip la vérification initiale après login

    return new Promise<boolean>((resolve) => {
      loginMutation.mutate(
        { username, password, role },
        {
          onSuccess: () => {
            setIsAuthenticated(true);
            setLoading(false);
            resolve(true);
          },
          onError: () => {
            setIsAuthenticated(false);
            setLoading(false);
            skipInitialAuthCheck.current = false; // Réactive la vérification pour les prochains essais
            resolve(false);
          },
        }
      );
    });
  };

  const logout = async () => {
    const success = await UseLogout();
    if (success) {
      setIsAuthenticated(false);
      skipInitialAuthCheck.current = false; // Réactive la vérification après logout
    }
  };

  useEffect(() => {
    getAuthenticated();

    const interval = setInterval(async () => {
      if (isAuthenticated) {
        await refreshToken();
      }
    }, 25 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);

export default AuthContext;

