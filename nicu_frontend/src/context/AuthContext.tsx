
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  doctorEmail: string | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [doctorEmail, setDoctorEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated on mount
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    const email = localStorage.getItem("doctorEmail");
    
    setIsAuthenticated(authStatus);
    setDoctorEmail(email);
  }, []);

  const login = (email: string) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("doctorEmail", email);
    setIsAuthenticated(true);
    setDoctorEmail(email);
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("doctorEmail");
    setIsAuthenticated(false);
    setDoctorEmail(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, doctorEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
