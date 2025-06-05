export interface DailyEntry {
  date: string;
  tfr: string;
  dol: string;
  feeds: string;
  pma: string;
  mode_of_feeding: string;
  weight: number | null;
  gain_loss: string;
  hmf: string;
  type_of_milk: string;
  cal: number | null;
  protein: number | null;
  kmc: number | null;
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

export interface Patient {
  id: string;
  patient_id: string; 
  name: string;
  ga: string;
  weight: string;
  aga_sga_lga: string;
  sex: string;
  dob: string;
  tob: string;
  entries?: DailyEntry[];
}
