import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { DailyEntry } from "@/types/patient";
import axios from "axios";

interface DailyEntryFormProps {
  patientId: string;
  dob: string; // Patient's date of birth
  ga: string;  // Patient's gestational age (weeks, as string)
}

// Define a type for the form data that matches our input handling
interface FormData {
  tfr: string;
  feeds: string;
  mode_of_feeding: string;
  weight: string;
  gain_loss: string;
  hmf: string;
  type_of_milk: string;
  cal: string;
  protein: string;
  kmc: string;
  nns: string;
  piomi: string;
  early_intervention: string;
  calcium: string;
  phosphorus: string;
  vit_d: string;
  iron: string;
  zinc: string;
  caffeine: string;
  resp_support: string;
  desaturations: string;
  acute_events: string;
}

export const DailyEntryForm = ({ patientId, dob, ga }: DailyEntryFormProps) => {
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState<FormData>({
    tfr: "",
    feeds: "",
    mode_of_feeding: "",
    weight: "",
    gain_loss: "",
    hmf: "",
    type_of_milk: "",
    cal: "",
    protein: "",
    kmc: "",
    nns: "",
    piomi: "",
    early_intervention: "N",
    calcium: "",
    phosphorus: "",
    vit_d: "",
    iron: "",
    zinc: "",
    caffeine: "",
    resp_support: "",
    desaturations: "",
    acute_events: ""
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dob || isNaN(new Date(dob).getTime()) || !ga || isNaN(parseFloat(ga))) {
      toast({
        title: "Error",
        description: "Patient DOB or GA is missing or invalid.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const token = localStorage.getItem('access');
      console.log('dob:', dob, 'ga:', ga, 'entryDate:', entryDate);
      // Calculate DOL (days since DOB) and PMA (GA + DOL/7)
      const dol = Math.floor((new Date(entryDate).getTime() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const pma = parseFloat(ga) + dol / 7;

      // Convert empty string values to null for numeric fields
      const processedFormData = {
        ...formData,
        kmc: formData.kmc === "" ? null : parseFloat(formData.kmc),
        cal: formData.cal === "" ? null : parseFloat(formData.cal),
        protein: formData.protein === "" ? null : parseFloat(formData.protein),
        weight: formData.weight === "" ? null : parseFloat(formData.weight)
      };

      const newEntry: DailyEntry = {
        date: entryDate,
        ...processedFormData,
        dol: dol.toString(),
        pma: pma.toFixed(1)
      };
      
      // Send the new entry to the API - using the correct endpoint
      await axios.post("http://127.0.0.1:8000/api/entries/", {
        ...newEntry,
        patient: patientId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      toast({
        title: "Success",
        description: "Daily progress data saved successfully"
      });
      
      // Reset form data but keep the date
      setFormData({
        tfr: "",
        feeds: "",
        mode_of_feeding: "",
        weight: "",
        gain_loss: "",
        hmf: "",
        type_of_milk: "",
        cal: "",
        protein: "",
        kmc: "",
        nns: "",
        piomi: "",
        early_intervention: "N",
        calcium: "",
        phosphorus: "",
        vit_d: "",
        iron: "",
        zinc: "",
        caffeine: "",
        resp_support: "",
        desaturations: "",
        acute_events: ""
      });
      
      // Optionally refresh the page or navigate
      navigate(`/patient/${patientId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error details:", {
          status: error.response?.status,
          data: error.response?.data
        });
        
        if (error.response?.status === 404) {
          toast({
            title: "Error",
            description: "The API endpoint for saving entries was not found. Please check the server configuration.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to save daily progress data. Please fill the required fields with proper values.",
            variant: "destructive"
          });
        }
      }
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            GROWING PRETERM NICU DAILY PROGRESS SHEET
          </h2>
          
          <div className="mb-4">
            <Label htmlFor="date">Date</Label>
            <Input 
              type="date"
              id="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="max-w-xs"
              required
            />
          </div>
          
          {/* First row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="tfr">TFR:</Label>
              <Input 
                id="tfr" 
                name="tfr"
                value={formData.tfr}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="kmc">KMC (hrs/day):</Label>
              <Input 
                id="kmc" 
                name="kmc"
                type="number"
                step="0.01" 
                value={formData.kmc}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          {/* Second row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="feeds">Feeds:</Label>
              <Input 
                id="feeds" 
                name="feeds"
                type="number"
                value={formData.feeds}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="nns">NNS (times/day):</Label>
              <Input 
                id="nns" 
                name="nns"
                value={formData.nns}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          {/* Third row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="mode_of_feeding">Mode of feeding:</Label>
              <Input 
                id="mode_of_feeding" 
                name="mode_of_feeding"
                value={formData.mode_of_feeding}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="piomi">PIOMI (times/day):</Label>
              <Input 
                id="piomi" 
                name="piomi"
                value={formData.piomi}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="early_intervention">Early intervention (Y/N):</Label>
              <Select
                value={formData.early_intervention}
                onValueChange={(value) => handleSelectChange("early_intervention", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Y">Yes</SelectItem>
                  <SelectItem value="N">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Weight section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="weight">Weight:</Label>
              <Input 
                id="weight" 
                name="weight"
                type="number"
                step="0.01" 
                value={formData.weight}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="gain_loss">Gain/loss:</Label>
              <Input 
                id="gain_loss" 
                name="gain_loss"
                value={formData.gain_loss}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          {/* HMF section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="hmf">HMF (No of sachet/Dilution):</Label>
              <Input 
                id="hmf" 
                name="hmf"
                value={formData.hmf}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          {/* Nutrition section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="cal">Cal (kcal/kg/day):</Label>
              <Input 
                id="cal" 
                name="cal"
                type="number"
                value={formData.cal}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="protein">Protein (gm/kg/day):</Label>
              <Input 
                id="protein" 
                name="protein"
                type="number"
                value={formData.protein}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          {/* Milk type */}
          <div className="mb-4">
            <Label htmlFor="type_of_milk">Type of Milk (DHM/MOM/FF with amount):</Label>
            <Input 
              id="type_of_milk" 
              name="type_of_milk"
              value={formData.type_of_milk}
              onChange={handleInputChange}
            />
          </div>
          
          {/* Supplements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="calcium">Calcium:</Label>
              <Input 
                id="calcium" 
                name="calcium"
                value={formData.calcium}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="phosphorus">Phosphorus:</Label>
              <Input 
                id="phosphorus" 
                name="phosphorus"
                value={formData.phosphorus}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="vit_d">Vit D:</Label>
              <Input 
                id="vit_d" 
                name="vit_d"
                value={formData.vit_d}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="iron">Iron:</Label>
              <Input 
                id="iron" 
                name="iron"
                value={formData.iron}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="zinc">Zinc:</Label>
              <Input 
                id="zinc" 
                name="zinc"
                value={formData.zinc}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="caffeine">Caffeine:</Label>
              <Input 
                id="caffeine" 
                name="caffeine"
                value={formData.caffeine}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          {/* Respiratory support */}
          <div className="mb-4">
            <Label htmlFor="resp_support">Resp. support:</Label>
            <Input 
              id="resp_support" 
              name="resp_support"
              value={formData.resp_support}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="desaturations">Desaturations/Apnea:</Label>
            <Input 
              id="desaturations" 
              name="desaturations"
              value={formData.desaturations}
              onChange={handleInputChange}
            />
          </div>
          
          {/* Acute events */}
          <div className="mb-6">
            <Label htmlFor="acute_events">Any acute event in 24 hours:</Label>
            <Textarea 
              id="acute_events" 
              name="acute_events"
              value={formData.acute_events}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button 
            type="button"
            variant="outline"
            onClick={() => navigate(`/patient/${patientId}`)}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Save Entry
          </Button>
        </div>
      </form>
    </Card>
  );
};
