import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientHeader } from "@/components/PatientHeader";
import { createPatient } from "@/api/auth";
import { useToast } from "@/components/ui/use-toast";

type NewPatientState = {
  name: string;
  patientId: string;
  ga: string;
  weight: string;
  aga_sga_lga: string;
  sex: string;
  dob: string;
  tob: string;
  entries: any[];
};

const NewPatient = () => {
  const initialPatientState: NewPatientState = {
    name: "",
    patientId: "",
    ga: "",
    weight: "",
    aga_sga_lga: "AGA",
    sex: "Male",
    dob: "",
    tob: "",
    entries: [],
  };

  const [patient, setPatient] = useState<NewPatientState>(initialPatientState);
  
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatient(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPatient(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Basic validation
    if (!patient.patientId || !patient.ga || !patient.weight || !patient.dob || !patient.name) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
  
    try {
      await createPatient({
        patient_id: patient.patientId,
        ga: Number(patient.ga),
        weight: Number(patient.weight),
        aga_sga_lga: patient.aga_sga_lga,
        sex: patient.sex,
        dob: patient.dob,
        tob: patient.tob || undefined,
        entries: [],
        name: patient.name,
      } as any);
  
      toast({
        title: "Patient Created",
        //description: "The patient record has been successfully saved to the server",
      });
  
      navigate("/patients"); // or wherever you show the patient list
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Something went wrong while saving the patient.",
        variant: "destructive",
      });
      console.error("Error creating patient:", error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        <PatientHeader />
        
        <Card className="max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center">New Patient Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Patient Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter patient name"
                    value={patient.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    name="patientId"
                    placeholder="Enter patient ID"
                    value={patient.patientId}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ga">Gestational Age (GA)</Label>
                  <Input
                    id="ga"
                    name="ga"
                    type="number"
                    min="20"
                    max="45"
                    step="1"
                    placeholder="In weeks"
                    value={patient.ga}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (Wt)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.01"
                    min="0.3"
                    max="10"
                    placeholder="In Kg"
                    value={patient.weight}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aga_sga_lga">AGA/SGA/LGA</Label>
                  <Select
                    value={patient.aga_sga_lga}
                    onValueChange={(value) => handleSelectChange("aga_sga_lga", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select classification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AGA">AGA</SelectItem>
                      <SelectItem value="SGA">SGA</SelectItem>
                      <SelectItem value="LGA">LGA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sex">Sex</Label>
                  <Select
                    value={patient.sex}
                    onValueChange={(value) => handleSelectChange("sex", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth (DOB)</Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    value={patient.dob}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tob">Time of Birth (TOB)</Label>
                  <Input
                    id="tob"
                    name="tob"
                    type="time"
                    value={patient.tob}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Create Patient
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewPatient;
