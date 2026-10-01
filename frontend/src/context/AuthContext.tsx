import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { User } from "../types/shared";
import { getItem, removeItem, setItem } from "../services/localstorage";
import { loginAPI } from "../services";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    return getItem<User>("currentUser");
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUser = getItem<User>("currentUser");
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await loginAPI(email, password);
      const authenticatedUser = response.user;
      setUser(authenticatedUser);
      setItem("currentUser", authenticatedUser);
      return authenticatedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      isLoading: false,
      login: async () => ({} as User),
      logout: () => {},
    };
  }
  return context;
};
