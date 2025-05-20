
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Patient } from "@/types/patient";

interface PatientInfoProps {
  patient: Patient;
}

export const PatientInfo = ({ patient }: PatientInfoProps) => {
  return (
    <Card className="mb-6 bg-white shadow-md">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Patient Information</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-gray-500">GA</p>
            <p className="font-medium">{patient.ga}</p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-gray-500">Weight</p>
            <p className="font-medium">{patient.weight}</p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-gray-500">AGA/SGA/LGA</p>
            <p className="font-medium">{patient.aga_sga_lga}</p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-gray-500">Sex</p>
            <p className="font-medium">{patient.sex}</p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-gray-500">DOB</p>
            <p className="font-medium">{patient.dob}</p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-gray-500">TOB</p>
            <p className="font-medium">{patient.tob || "N/A"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
