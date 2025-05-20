
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
         <header className="text-center mb-12 relative">
          <div className="absolute right-0 top-0">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-black-600 hover:text-black-700 hover:bg-black-50"
            >
              Logout
            </Button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">
            NICU Daily Progress Tracker
          </h1>
          <p className="text-gray-600 text-lg">
            Track and visualize preterm infant progress data
          </p>
        </header>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">New Patient Entry</h2>
              <p className="text-gray-500 mb-6">
                Create a new patient record and start tracking daily progress
              </p>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/new-patient">Create New Patient</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">View Patient Records</h2>
              <p className="text-gray-500 mb-6">
                Access existing patient records and visualize progress data
              </p>
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <Link to="/patients">View Patients</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>GROWING PRETERM NICU DAILY PROGRESS SHEET</p>
          <p>AIIMS JODHPUR, Dept. of NEONATOLOGY</p>
          <p className="mt-2">© {new Date().getFullYear()} - Powered by IIT Jodhpur, Dept. of Computer Science and Engineering</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
