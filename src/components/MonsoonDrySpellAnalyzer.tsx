import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, Droplets, Sprout, Package } from "lucide-react";

interface DrySpell {
  startDate: string;
  endDate: string;
  duration: number;
  district: string;
  year: number;
}

interface ImpactAnalysis {
  district: string;
  year: number;
  drySpellCount: number;
  averageDrySpellDuration: number;
  totalDrySpellDays: number;
  actualYield: number;
  actualFertilizerUsage: number;
}

interface PredictionOutput {
  predictedYield: number;
  predictedFertilizerUsage: number;
  confidence: number;
}

const MonsoonDrySpellAnalyzer: React.FC = () => {
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [drySpells, setDrySpells] = useState<DrySpell[]>([]);
  const [impactAnalysis, setImpactAnalysis] = useState<ImpactAnalysis | null>(null);
  const [prediction, setPrediction] = useState<PredictionOutput | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch districts on component mount
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch('/api/districts');
        const data = await response.json();
        setDistricts(data.districts);
        if (data.districts.length > 0) {
          setSelectedDistrict(data.districts[0]);
        }
      } catch (err) {
        setError('Failed to fetch districts');
        console.error(err);
      }
    };

    fetchDistricts();
  }, []);

  // Set default date range to a 21-day period in monsoon season (June-September)
  useEffect(() => {
    if (selectedYear) {
      // Default to a 21-day period starting July 1st
      const defaultStart = `${selectedYear}-07-01`;
      const defaultEnd = `${selectedYear}-07-21`;
      setStartDate(defaultStart);
      setEndDate(defaultEnd);
    }
  }, [selectedYear]);

  // Fetch analysis data when parameters change
  useEffect(() => {
    if (!selectedDistrict || !selectedYear || !startDate || !endDate) return;

    const fetchAnalysisData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch comprehensive analysis for the selected period
        const response = await fetch(`/api/analysis/${selectedDistrict}/${selectedYear}?startDate=${startDate}&endDate=${endDate}`);
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setDrySpells(data.analysis.drySpells);
        setImpactAnalysis(data.analysis.historicalImpact);
        setPrediction(data.analysis.predictedImpact);
      } catch (err) {
        setError('Failed to fetch analysis data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [selectedDistrict, selectedYear, startDate, endDate]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The useEffect above will automatically fetch new data when state changes
  };

  // Prepare data for dry spells chart
  const prepareDrySpellsChartData = () => {
    return drySpells.map(spell => ({
      date: spell.startDate,
      duration: spell.duration
    }));
  };

  // Prepare data for yield comparison chart
  const prepareYieldComparisonData = () => {
    if (!impactAnalysis || !prediction) return [];
    
    return [
      {
        name: 'Actual',
        yield: impactAnalysis.actualYield
      },
      {
        name: 'Predicted',
        yield: prediction.predictedYield
      }
    ];
  };

  // Prepare data for fertilizer usage comparison chart
  const prepareFertilizerComparisonData = () => {
    if (!impactAnalysis || !prediction) return [];
    
    return [
      {
        name: 'Actual',
        fertilizer: impactAnalysis.actualFertilizerUsage
      },
      {
        name: 'Predicted',
        fertilizer: prediction.predictedFertilizerUsage
      }
    ];
  };

  // Calculate if the selected period is exactly 21 days
  const is21DayPeriod = () => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    return diffDays === 21;
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
            Analyze dry spells during a user-selected 21-day period and predict impacts on crop yield and fertilizer usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">District</label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map(district => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {[2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990].map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={`${selectedYear}-06-01`}
                max={`${selectedYear}-09-30`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={`${selectedYear}-06-01`}
                max={`${selectedYear}-09-30`}
              />
            </div>
            
            <div className="flex items-end">
              <Button type="submit" disabled={loading || !is21DayPeriod()}>
                {loading ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>
          </form>
          
          {!is21DayPeriod() && startDate && endDate && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md mb-4">
              Note: For best results, select a 21-day period within the monsoon season (June-September).
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              Error: {error}
            </div>
          )}
          
          {loading && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          )}
          
          {!loading && !error && impactAnalysis && prediction && (
            <div className="space-y-6">
              {/* Period Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-500" />
                    Analysis Period
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-600">
                      ({Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days)
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Dry Spells Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    Dry Spell Periods
                  </CardTitle>
                  <CardDescription>
                    Dry spells detected within the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {drySpells.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={prepareDrySpellsChartData()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                          <YAxis label={{ value: 'Duration (days)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="duration" name="Dry Spell Duration" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No dry spells detected in the selected period.
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Yield Prediction Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-green-500" />
                    Crop Yield Analysis
                  </CardTitle>
                  <CardDescription>
                    Comparison of actual vs predicted crop yield
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareYieldComparisonData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Yield (tons)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="yield" name="Crop Yield" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Confidence: {(prediction.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Fertilizer Usage Prediction Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-yellow-500" />
                    Fertilizer Usage Analysis
                  </CardTitle>
                  <CardDescription>
                    Comparison of actual vs predicted fertilizer usage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareFertilizerComparisonData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Fertilizer (tons)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="fertilizer" name="Fertilizer Usage" fill="#ffc658" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Confidence: {(prediction.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MonsoonDrySpellAnalyzer;