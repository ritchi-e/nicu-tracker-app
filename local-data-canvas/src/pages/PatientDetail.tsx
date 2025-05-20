import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientHeader } from "@/components/PatientHeader";
import { PatientInfo } from "@/components/PatientInfo";
import { DailyEntryForm } from "@/components/DailyEntryForm";
import { DataVisualization } from "@/components/DataVisualization";
import { Patient } from "@/types/patient";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from "axios";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError("No patient ID provided");
      setLoading(false);
      return;
    }

    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get(`http://127.0.0.1:8000/api/patients/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPatient(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading patient:", err);
        setError("Error loading patient data");
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
        <div className="container mx-auto px-4">
          <PatientHeader />
          <Alert variant="destructive" className="mt-8 max-w-2xl mx-auto">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || "Failed to load patient"}</AlertDescription>
            <Button 
              className="mt-4" 
              variant="outline"
              onClick={() => navigate("/patients")}
            >
              Back to Patients
            </Button>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        <PatientHeader />
        
        <PatientInfo patient={patient} />
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Patient Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="record" className="w-full">
              <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
                <TabsTrigger value="record">Record Daily Progress</TabsTrigger>
                <TabsTrigger value="visualize">Visualize Progress</TabsTrigger>
              </TabsList>
              <TabsContent value="record" className="mt-6">
                <DailyEntryForm patientId={patient.id} dob={patient.dob} ga={patient.ga} />
              </TabsContent>
              <TabsContent value="visualize" className="mt-6">
                <DataVisualization patient={patient} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDetail;
