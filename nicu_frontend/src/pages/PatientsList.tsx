import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientHeader } from "@/components/PatientHeader";
import axios from "axios";
import { Patient } from "@/types/patient";

const PatientsList = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get("http://127.0.0.1:8000/api/patients/", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPatients(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setError("Failed to load patients");
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);
  
  const filteredPatients = patients.filter(patient => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      patient.patient_id.toString().toLowerCase().includes(searchTermLower) ||
      patient.weight.toString().toLowerCase().includes(searchTermLower) ||
      patient.sex.toLowerCase().includes(searchTermLower) ||
      patient.dob.toLowerCase().includes(searchTermLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
        <div className="container mx-auto px-4">
          <PatientHeader />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading patients...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
        <div className="container mx-auto px-4">
          <PatientHeader />
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-red-500">{error}</h3>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        <PatientHeader />
        
        <Card className="mt-8">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-bold">Patient Records</CardTitle>
              <p className="text-gray-500 text-sm mt-1">
                {patients.length} total patients
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </CardHeader>
          <CardContent>
            {patients.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-500">No patients found</h3>
                <p className="mt-2 text-gray-400">Create a new patient to get started</p>
                <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
                  <Link to="/new-patient">Create New Patient</Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>AGA/SGA/LGA</TableHead>
                      <TableHead>Sex</TableHead>
                      <TableHead>DOB</TableHead>
                      <TableHead>Data Entries</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>{patient.patient_id}</TableCell>
                        <TableCell>{patient.weight}</TableCell>
                        <TableCell>{patient.aga_sga_lga}</TableCell>
                        <TableCell>{patient.sex}</TableCell>
                        <TableCell>{patient.dob}</TableCell>
                        <TableCell>{patient.entries?.length || 0}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            asChild
                            variant="outline" 
                            size="sm"
                          >
                            <Link to={`/patient/${patient.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientsList;
