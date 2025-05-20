export interface Entry {
    id?: string;
    patient: string; // ID of the patient this entry belongs to
    date: string;
    weight?: number;
    feeds?: string;
    cal?: number;
    protein?: number;
    kmc?: number;
    gain_loss?: string;
    acute_events?: string;
  }
  
  export interface Patient {
    id?: string;
    patient_id: string;
    ga: number;
    weight: number;
    aga_sga_lga: string;
    sex: string;
    dob: string;
    tob?: string;
    entries?: Entry[]; // Optional, if you’re nesting entries
  }
  