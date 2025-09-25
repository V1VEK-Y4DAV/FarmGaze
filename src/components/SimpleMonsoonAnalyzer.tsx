import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Droplets, Sprout, Package } from "lucide-react";

interface DrySpell {
  startDate: string;
  endDate: string;
  duration: number;
}

interface PredictionResult {
  predictedYield: number;
  predictedFertilizerUsage: number;
  confidence: number;
}

const SimpleMonsoonAnalyzer: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [district, setDistrict] = useState<string>('Adilabad'); // Default district
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [drySpells, setDrySpells] = useState<DrySpell[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !district) return;

    setLoading(true);
    setError(null);
    
    try {
      // Fetch dry spells data
      const drySpellResponse = await fetch(
        `http://localhost:3001/api/dry-spells?startDate=${startDate}&endDate=${endDate}`
      );
      
      if (!drySpellResponse.ok) {
        throw new Error('Failed to fetch dry spell data');
      }
      
      const drySpellData = await drySpellResponse.json();
      setDrySpells(drySpellData.drySpells || []);
      
      // Fetch prediction data
      const predictionResponse = await fetch(
        `http://localhost:3001/api/predict-impact/${district}?startDate=${startDate}&endDate=${endDate}`
      );
      
      if (!predictionResponse.ok) {
        throw new Error('Failed to fetch prediction data');
      }
      
      const predictionData = await predictionResponse.json();
      setPredictionResult(predictionData.prediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze monsoon data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for dry spells chart
  const prepareDrySpellsChartData = () => {
    return drySpells.map((spell, index) => ({
      name: `Dry Spell ${index + 1}`,
      startDate: spell.startDate,
      endDate: spell.endDate,
      duration: spell.duration
    }));
  };

  // Prepare data for yield comparison
  const prepareYieldData = () => {
    if (!predictionResult) return [];
    // Using simulated previous year data for comparison
    const previousYearYield = predictionResult.predictedYield * 1.1; // Assume 10% higher in normal conditions
    return [
      { name: 'Predicted', value: predictionResult.predictedYield },
      { name: 'Previous Year (Est)', value: previousYearYield }
    ];
  };

  // Prepare data for fertilizer comparison
  const prepareFertilizerData = () => {
    if (!predictionResult) return [];
    // Using simulated previous year data for comparison
    const previousYearFertilizer = predictionResult.predictedFertilizerUsage * 0.9; // Assume 10% lower in normal conditions
    return [
      { name: 'Predicted', value: predictionResult.predictedFertilizerUsage },
      { name: 'Previous Year (Est)', value: previousYearFertilizer }
    ];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            Monsoon Dry Spell Analyzer
          </CardTitle>
          <CardDescription>
            Analyze dry spells during a 21-day period and predict impacts on crop yield and fertilizer usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min="2020-06-01"
                max="2025-09-30"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min="2020-06-01"
                max="2025-09-30"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Enter district name"
                required
              />
            </div>
            
            <div className="flex items-end">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Analyzing...' : 'Analyze Period'}
              </Button>
            </div>
          </form>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              Error: {error}
            </div>
          )}
          
          {drySpells && drySpells.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Dry Spell Periods</CardTitle>
                <CardDescription>
                  Dry spells detected within the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareDrySpellsChartData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Duration (days)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="duration" name="Dry Spell Duration" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
          
          {predictionResult && (
            <div className="space-y-6">
              {/* Yield Prediction Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-green-500" />
                    Crop Yield Prediction
                  </CardTitle>
                  <CardDescription>
                    Predicted crop yield for the period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareYieldData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Yield (tons)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Crop Yield" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Confidence: {predictionResult.confidence.toFixed(2)}%
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Fertilizer Usage Prediction Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-yellow-500" />
                    Fertilizer Usage Prediction
                  </CardTitle>
                  <CardDescription>
                    Predicted fertilizer usage for the period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareFertilizerData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Fertilizer (kg)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Fertilizer Usage" fill="#ffc658" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Confidence: {predictionResult.confidence.toFixed(2)}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {drySpells && drySpells.length === 0 && predictionResult && !loading && (
            <div className="text-center py-8 text-gray-500">
              No dry spells detected in the selected period.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleMonsoonAnalyzer;