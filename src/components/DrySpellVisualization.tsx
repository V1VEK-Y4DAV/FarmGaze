import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Droplets } from "lucide-react";

const DrySpellVisualization: React.FC = () => {
  const [districts] = useState<string[]>([
    'Durg', 'Bastar', 'Raipur', 'Bilaspur', 'Raigarh', 'Surguja',
    'Jabalpur', 'Balaghat', 'Chhindwara', 'Narsinghpur', 'Seoni', 'Mandla'
  ]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Durg');
  const [selectedYear, setSelectedYear] = useState<number>(2015);

  // Mock data for dry spells
  const drySpellData = [
    { month: 'June', count: 2 },
    { month: 'July', count: 3 },
    { month: 'August', count: 1 },
    { month: 'September', count: 2 }
  ];

  // Mock data for yield impact
  const yieldImpactData = [
    { month: 'June', yield: 1200 },
    { month: 'July', yield: 950 },
    { month: 'August', yield: 1100 },
    { month: 'September', yield: 1050 }
  ];

  // Mock data for fertilizer impact
  const fertilizerImpactData = [
    { month: 'June', fertilizer: 25000 },
    { month: 'July', fertilizer: 32000 },
    { month: 'August', fertilizer: 28000 },
    { month: 'September', fertilizer: 30000 }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            Monsoon Dry Spell Analysis
          </CardTitle>
          <CardDescription>
            Analysis of dry spells during monsoon season and their impact on agriculture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                  {[2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000].map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button>Refresh Data</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Dry Spells Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Dry Spell Frequency</CardTitle>
                <CardDescription>
                  Number of dry spells per month during monsoon season
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={drySpellData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis label={{ value: 'Number of Dry Spells', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Dry Spells" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Season Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Dry Spells:</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Duration:</span>
                    <span className="font-medium">4.5 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Dry Days:</span>
                    <span className="font-medium">36 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Yield Impact:</span>
                    <span className="font-medium text-red-600">-12.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fertilizer Impact:</span>
                    <span className="font-medium text-green-600">+8.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Yield Impact Chart */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Crop Yield Impact</CardTitle>
              <CardDescription>
                Comparison of expected vs actual crop yield
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={yieldImpactData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'Yield (tons)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="yield" name="Crop Yield" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Fertilizer Impact Chart */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Fertilizer Usage Impact</CardTitle>
              <CardDescription>
                Comparison of expected vs actual fertilizer usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={fertilizerImpactData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'Fertilizer (tons)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="fertilizer" name="Fertilizer Usage" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default DrySpellVisualization;