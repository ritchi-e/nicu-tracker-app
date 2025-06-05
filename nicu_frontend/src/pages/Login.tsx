import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username: username,
        password: password,
      });
  
      const { access, refresh } = response.data;
  
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      login(username);
  
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        if (error.response?.status === 401) {
          toast.error("Invalid username or password");
        } else if (error.response?.status === 500) {
          toast.error("Server error. Please try again later");
        } else {
          toast.error("Connection error. Please check if the server is running");
        }
      }
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
      <div className="w-full max-w-md p-4">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-6 border-b">
            <CardTitle className="text-2xl font-bold text-blue-800">
              NICU Daily Progress Tracker
            </CardTitle>
            <p className="text-gray-500 mt-2">
              AIIMS JODHPUR, DEPT OF NEONATOLOGY
            </p>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Login
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Please enter your credentials to access the system.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;