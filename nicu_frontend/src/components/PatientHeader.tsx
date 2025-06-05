
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const PatientHeader = () => {
  const { doctorEmail, logout } = useAuth();
  
  return (
    <header className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
            NICU Daily Progress Tracker
          </h1>
          <p className="text-gray-600 mt-1">
            AIIMS JODHPUR, DEPT OF NEONATOLOGY
          </p>
          {doctorEmail && (
            <p className="text-sm text-gray-500 mt-1">
              Logged in as: {doctorEmail}
            </p>
          )}
        </div>
        
        <div className="flex space-x-4">
          <Button asChild variant="outline">
            <Link to="/">Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/patients">All Patients</Link>
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/new-patient">New Patient</Link>
          </Button>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
