import React, { useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Patient, DailyEntry } from "@/types/patient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DataVisualizationProps {
  patient: Patient;
}

export const DataVisualization = ({ patient }: DataVisualizationProps) => {
  const [selectedMetric, setSelectedMetric] = useState("weight");
  const [aggregation, setAggregation] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  if (!patient.entries || patient.entries.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-medium text-gray-500">No data available</h3>
        <p className="mt-2 text-gray-400">Record daily progress to visualize data</p>
      </Card>
    );
  }
  
  // Sort entries by date
  const sortedEntries = [...patient.entries].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
  // Helper: get week number since DOB
  function getWeekNumber(dob: string, date: string) {
    const start = new Date(dob);
    const current = new Date(date);
    const diff = (current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return Math.floor(diff / 7) + 1;
  }
  // Helper: get month string (YYYY-MM)
  function getMonthString(date: string) {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  }
  // Helper: average numeric fields
  function average(arr: (number|null)[]) {
    const nums = arr.filter(x => typeof x === 'number' && !isNaN(x));
    if (nums.length === 0) return null;
    return (nums.reduce((a, b) => a + (b as number), 0) / nums.length);
  }
  // Helper: mode for categorical
  function mode(arr: string[]) {
    if (!arr.length) return '';
    const freq: Record<string, number> = {};
    arr.forEach(x => { if (x) freq[x] = (freq[x] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  }

  // Aggregation logic
  let aggregatedEntries: typeof sortedEntries = sortedEntries;
  if (aggregation !== 'daily') {
    const groups: Record<string, typeof sortedEntries> = {};
    sortedEntries.forEach(entry => {
      let key = '';
      if (aggregation === 'weekly') key = getWeekNumber(patient.dob, entry.date).toString();
      if (aggregation === 'monthly') key = getMonthString(entry.date);
      if (!groups[key]) groups[key] = [];
      groups[key].push(entry);
    });
    aggregatedEntries = Object.entries(groups).map(([key, group]) => {
      // Use the first date in the group for x-axis
      const date = group[0].date;
      // Average numeric fields
      const avgEntry: any = { date };
      [
        'weight','kmc','cal','dol','protein','tfr','feeds','pma','calcium','phosphorus','vitD','iron','zinc','caffeine','hmf','nns','piomi'
      ].forEach(field => {
        avgEntry[field] = average(group.map(e => parseFloat(e[field] || '')));
      });
      // Mode for categorical
      avgEntry['typeOfMilk'] = mode(group.map(e => e.type_of_milk));
      return avgEntry;
    });
    // Sort by date
    aggregatedEntries = aggregatedEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  // Format data for chart
  const chartData = aggregatedEntries.map(entry => {
    const date = new Date(entry.date);
    function safeParse(val: any) {
      if (val === undefined || val === null || val === "") return null;
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    }
    return {
      name: `${date.getMonth() + 1}/${date.getDate()}`,
      weight: safeParse(entry.weight),
      kmc: safeParse(entry.kmc),
      cal: safeParse(entry.cal),
      dol: safeParse(entry.dol),
      protein: safeParse(entry.protein),
      tfr: safeParse(entry.tfr),
      feeds: safeParse(entry.feeds),
      pma: safeParse(entry.pma),
      calcium: safeParse(entry.calcium),
      phosphorus: safeParse(entry.phosphorus),
      vitD: safeParse(entry.vit_d),
      iron: safeParse(entry.iron),
      zinc: safeParse(entry.zinc),
      caffeine: safeParse(entry.caffeine),
      hmf: safeParse(entry.hmf),
      nns: safeParse(entry.nns),
      piomi: safeParse(entry.piomi),
      dateString: entry.date
    };
  });
  
  // Create metric options for dropdown
  const metricOptions = [
    { value: "weight", label: "Weight" },
    { value: "kmc", label: "KMC (hrs/day)" },
    { value: "cal", label: "Caloric Intake" },
    { value: "protein", label: "Protein Intake" },
    { value: "tfr", label: "TFR" },
    { value: "dol", label: "TFR" },
    { value: "feeds", label: "Feeds" },
    { value: "pma", label: "PMA" },
    
    { value: "gainLoss", label: "Gain/Loss" },
    { value: "hmf", label: "HMF" },
   
    { value: "nns", label: "NNS" },
    { value: "piomi", label: "PIOMI" },
    { value: "calcium", label: "Calcium" },
    { value: "phosphorus", label: "Phosphorus" },
    { value: "vitD", label: "Vitamin D" },
    { value: "iron", label: "Iron" },
    { value: "zinc", label: "Zinc" },
    { value: "caffeine", label: "Caffeine" },
    
  ];
  
  // Find the metric that has data
  const availableMetrics = metricOptions.filter(metric => {
    return aggregatedEntries.some(entry => {
      const value = entry[metric.value as keyof DailyEntry];
      // Check if the value exists and can be converted to a number
      return value !== null && value !== undefined && value !== "" && !isNaN(Number(value));
    });
  });
  
  return (
    <div>
      {/* Aggregation Toggle */}
      <div className="flex justify-end mb-4">
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-500">View:</span>
          <button
            className={`px-3 py-1 rounded ${aggregation === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setAggregation('daily')}
          >Daily</button>
          <button
            className={`px-3 py-1 rounded ${aggregation === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setAggregation('weekly')}
          >Weekly</button>
          <button
            className={`px-3 py-1 rounded ${aggregation === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setAggregation('monthly')}
          >Monthly</button>
        </div>
      </div>
      <Tabs defaultValue="chart">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
          <TabsTrigger value="chart">Chart View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="mt-6">
          <Card className="p-6">
            <div className="grid grid-cols-2 grid-rows-2 gap-6 h-[700px]">
              {/* Top Left Quadrant: Date, Basic Info, DOL */}
              <div className="flex flex-col justify-between p-4 border rounded-lg bg-gray-50">
                <div>
                  <div className="text-sm text-gray-400 mb-2">{new Date(sortedEntries[sortedEntries.length-1].date).toLocaleDateString()}</div>
                  <div className="mb-2">
                    <div className="font-semibold text-lg">Patient Info</div>
                    <div className="text-sm text-gray-600">ID: {patient.patient_id}</div>
                    <div className="text-sm text-gray-600">Sex: {patient.sex}</div>
                    <div className="text-sm text-gray-600">DOB: {patient.dob}</div>
                    <div className="text-sm text-gray-600">GA: {patient.ga}</div>
                    <div className="text-sm text-gray-600">Birth Wt: {patient.weight} g</div>
                    <div className="text-sm text-gray-600">{patient.aga_sga_lga}</div>
                    <div className="text-sm text-gray-600">
                      PMA: {(() => {
                        const gaWeeks = parseFloat(patient.ga);
                        const dolDays = parseFloat(sortedEntries[sortedEntries.length-1].dol || "0");
                        if (isNaN(gaWeeks) || isNaN(dolDays)) return "-";
                        const pma = gaWeeks + dolDays / 7;
                        return pma.toFixed(1) + " wks";
                      })()}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="font-bold text-xl text-gray-700">DOL</div>
                  <div className="text-6xl font-extrabold text-blue-600 leading-none">
                    {sortedEntries[sortedEntries.length-1].dol || "-"}
                  </div>
                </div>
              </div>

              {/* Top Right Quadrant: Minerals Chart */}
              <div className="p-2 border rounded-lg bg-white flex flex-col">
                <div className="font-semibold mb-2">Minerals & Caffeine Over Time</div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="calcium" stroke="#60a5fa" name="Calcium" />
                    <Line type="monotone" dataKey="phosphorus" stroke="#f59e42" name="Phosphorus" />
                    <Line type="monotone" dataKey="vitD" stroke="#34d399" name="Vit D" />
                    <Line type="monotone" dataKey="iron" stroke="#ef4444" name="Iron" />
                    <Line type="monotone" dataKey="zinc" stroke="#a78bfa" name="Zinc" />
                    <Line type="monotone" dataKey="caffeine" stroke="#f97316" name="Caffeine" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Bottom: Other Numeric Fields in Grid */}
              <div className="col-span-2 grid grid-cols-3 gap-4 overflow-y-auto" style={{maxHeight: '400px', boxSizing: 'border-box', paddingBottom: '8px'}}>
                {[
                  { key: "weight", label: "Weight", color: "#3b82f6" },
                  { key: "kmc", label: "KMC (hrs/day)", color: "#fbbf24" },
                  { key: "cal", label: "Caloric Intake", color: "#10b981" },
                  { key: "protein", label: "Protein Intake", color: "#6366f1" },
                  { key: "tfr", label: "TFR", color: "#f472b6" },
                  { key: "feeds", label: "Feeds", color: "#f87171" },
                  { key: "hmf", label: "HMF", color: "#facc15" },
                  { key: "nns", label: "NNS", color: "#818cf8" },
                  { key: "piomi", label: "PIOMI", color: "#fb7185" },
                ].map(field => (
                  <div key={field.key} className="p-2 border rounded-lg bg-white flex flex-col">
                    <div className="font-semibold mb-1">{field.label}</div>
                    <ResponsiveContainer width="100%" height={100}>
                      <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip />
                        <Line type="monotone" dataKey={field.key} stroke={field.color} dot={false} name={field.label} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ))}
                {/* Step Chart for Type of Milk */}
                <div className="col-span-3 p-2 border rounded-lg bg-white flex flex-col mt-4">
                  <div className="font-semibold mb-1">Type of Milk (Step Chart)</div>
                  {(() => {
                    // Get unique types
                    const types = Array.from(new Set(aggregatedEntries.map(e => e.type_of_milk).filter(Boolean)));
                    // Map type to y-value
                    const typeToY = Object.fromEntries(types.map((t, i) => [t, i+1]));
                    // Prepare chart data
                    const stepData = aggregatedEntries.map(entry => ({
                      name: new Date(entry.date).toLocaleDateString(),
                      typeY: typeToY[entry.type_of_milk] || null,
                      typeOfMilk: entry.type_of_milk || "Unknown"
                    }));
                    return (
                      <ResponsiveContainer width="100%" height={100}>
                        <LineChart data={stepData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                          <XAxis dataKey="name" />
                          <YAxis type="number" domain={[1, types.length]} ticks={types.map((_, i) => i+1)} tickFormatter={i => types[i-1] || ''} allowDecimals={false} />
                          <Tooltip formatter={(_, __, props) => props.payload.typeOfMilk} />
                          <Line type="stepAfter" dataKey="typeY" stroke="#6366f1" dot={{ r: 5 }} name="Type of Milk" />
                        </LineChart>
                      </ResponsiveContainer>
                    );
                  })()}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="table" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                    <TableHead>Date</TableHead>
                      <TableHead>TFR</TableHead>
                      <TableHead>DOL</TableHead>
                      <TableHead>Feeds</TableHead>
                      <TableHead>PMA</TableHead>
                      <TableHead>Mode of Feeding</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Gain/Loss</TableHead>
                      <TableHead>HMF</TableHead>
                      <TableHead>Type of Milk</TableHead>
                      <TableHead>Cal</TableHead>
                      <TableHead>Protein</TableHead>
                      <TableHead>KMC</TableHead>
                      <TableHead>NNS</TableHead>
                      <TableHead>PIOMI</TableHead>
                      <TableHead>Early Intervention</TableHead>
                      <TableHead>Calcium</TableHead>
                      <TableHead>Phosphorus</TableHead>
                      <TableHead>Vit D</TableHead>
                      <TableHead>Iron</TableHead>
                      <TableHead>Zinc</TableHead>
                      <TableHead>Caffeine</TableHead>
                      <TableHead>Resp. Support</TableHead>
                      <TableHead>Desaturations</TableHead>
                      <TableHead>Acute Events</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedEntries.map((entry, index) => (
                      <TableRow key={index}>
                         <TableCell>{entry.date}</TableCell>
                        <TableCell>{entry.tfr || "-"}</TableCell>
                        <TableCell>{entry.dol || "-"}</TableCell>
                        <TableCell>{entry.feeds || "-"}</TableCell>
                        <TableCell>{entry.pma || "-"}</TableCell>
                        <TableCell>{entry.mode_of_feeding || "-"}</TableCell>
                        <TableCell>{entry.weight || "-"}</TableCell>
                        <TableCell>{entry.gain_loss || "-"}</TableCell>
                        <TableCell>{entry.hmf || "-"}</TableCell>
                        <TableCell>{entry.type_of_milk || "-"}</TableCell>
                        <TableCell>{entry.cal || "-"}</TableCell>
                        <TableCell>{entry.protein || "-"}</TableCell>
                        <TableCell>{entry.kmc || "-"}</TableCell>
                        <TableCell>{entry.nns || "-"}</TableCell>
                        <TableCell>{entry.piomi || "-"}</TableCell>
                        <TableCell>{entry.early_intervention || "-"}</TableCell>
                        <TableCell>{entry.calcium || "-"}</TableCell>
                        <TableCell>{entry.phosphorus || "-"}</TableCell>
                        <TableCell>{entry.vit_d || "-"}</TableCell>
                        <TableCell>{entry.iron || "-"}</TableCell>
                        <TableCell>{entry.zinc || "-"}</TableCell>
                        <TableCell>{entry.caffeine || "-"}</TableCell>
                        <TableCell>{entry.resp_support || "-"}</TableCell>
                        <TableCell>{entry.desaturations || "-"}</TableCell>
                        <TableCell>{entry.acute_events || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
