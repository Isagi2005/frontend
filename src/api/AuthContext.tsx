import { useContext, useEffect, useState } from "react";
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
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const loginMutation = useLogin();

  const getAuthenticated = async () => {
    try {
      if (hasLoggedOut == false) {
        const success: boolean = await Is_authenticated();
        setIsAuthenticated(success);
      } else {
        console.log(hasLoggedOut);
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (username: string, password: string, role: string) => {
    loginMutation.mutate(
      { username, password, role },
      {
        onSuccess: () => {
          setIsAuthenticated(true);
          return true;
        },
        onError: () => {
          setIsAuthenticated(false);
          return false;
        },
      }
    );
  };
  const logout = async () => {
    const success = await UseLogout();

    if (success) {
      setIsAuthenticated(false);
      setHasLoggedOut(true);
    }
  };

  useEffect(() => {
    if (!hasLoggedOut) {
      getAuthenticated();
    }

    const interval = setInterval(async () => {
      await refreshToken();
    }, 25 * 60 * 1000);

    return () => clearInterval(interval);
  }, [hasLoggedOut]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
