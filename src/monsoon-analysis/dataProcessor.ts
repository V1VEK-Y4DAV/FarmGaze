import Papa from 'papaparse';
import * as fs from 'fs';

// Define the structure of our agricultural data
export interface AgriculturalData {
  index: number;
  year: number;
  stateCode: number;
  stateName: string;
  distName: string;
  fertilizerConsumption: number;
  production: number;
  yield: number;
  consumption: number;
}

// Define the structure for dry spell data
export interface DrySpell {
  startDate: string;
  endDate: string;
  duration: number;
  district: string;
  year: number;
}

// Define the structure for impact analysis
export interface ImpactAnalysis {
  district: string;
  year: number;
  drySpellCount: number;
  averageDrySpellDuration: number;
  totalDrySpellDays: number;
  actualYield: number;
  actualFertilizerUsage: number;
}

class MonsoonDataProcessor {
  private agriculturalData: AgriculturalData[] = [];
  
  // Load and parse the CSV data
  async loadAgriculturalData(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        
        const parsedData = Papa.parse(data, {
          header: false,
          skipEmptyLines: true
        });
        
        // Skip the header row and process data
        for (let i = 1; i < parsedData.data.length; i++) {
          const row = parsedData.data[i] as string[];
          if (row.length >= 9) {
            this.agriculturalData.push({
              index: parseInt(row[0]),
              year: parseInt(row[1]),
              stateCode: parseInt(row[2]),
              stateName: row[3],
              distName: row[4],
              fertilizerConsumption: parseFloat(row[5]),
              production: parseFloat(row[6]),
              yield: parseFloat(row[7]),
              consumption: parseFloat(row[8])
            });
          }
        }
        
        resolve();
      });
    });
  }
  
  // Get unique districts from the data
  getDistricts(): string[] {
    const districts = new Set<string>();
    this.agriculturalData.forEach(item => districts.add(item.distName));
    return Array.from(districts);
  }
  
  // Get years range from the data
  getYearRange(): { min: number, max: number } {
    const years = this.agriculturalData.map(item => item.year);
    return {
      min: Math.min(...years),
      max: Math.max(...years)
    };
  }
  
  // Get data for a specific district and year
  getDataForDistrictAndYear(district: string, year: number): AgriculturalData | undefined {
    return this.agriculturalData.find(
      item => item.distName === district && item.year === year
    );
  }
  
  // Get state code for a district
  getStateCodeForDistrict(district: string): number | null {
    const data = this.agriculturalData.find(item => item.distName === district);
    return data ? data.stateCode : null;
  }
  
  // Simulate rainfall data generation for a specific date range
  generateRainfallData(startDate: string, endDate: string): { date: string; rainfall: number }[] {
    const rainfallData = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Generate daily rainfall data for the specified period
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      // Simulate rainfall (in mm) - in a real system this would come from actual data
      // For simulation, we'll use a random distribution with some dry periods
      const rainfall = Math.random() > 0.2 ? Math.random() * 20 : 0;
      rainfallData.push({ date: dateStr, rainfall });
    }
    
    return rainfallData;
  }
  
  // Detect dry spells (4-5 consecutive days with no rainfall) within a specific date range
  detectDrySpells(startDate: string, endDate: string): DrySpell[] {
    const rainfallData = this.generateRainfallData(startDate, endDate);
    const drySpells: DrySpell[] = [];
    let drySpellStart: string | null = null;
    let drySpellLength = 0;
    
    for (let i = 0; i < rainfallData.length; i++) {
      const day = rainfallData[i];
      
      if (day.rainfall === 0) {
        // Continue or start a dry spell
        if (drySpellStart === null) {
          drySpellStart = day.date;
        }
        drySpellLength++;
      } else {
        // End of a potential dry spell
        if (drySpellStart !== null && drySpellLength >= 4) {
          // We have a dry spell of at least 4 days
          drySpells.push({
            startDate: drySpellStart,
            endDate: rainfallData[i - 1].date,
            duration: drySpellLength,
            district: 'Selected Area',
            year: new Date(startDate).getFullYear()
          });
        }
        // Reset for next potential dry spell
        drySpellStart = null;
        drySpellLength = 0;
      }
    }
    
    // Check if the last sequence is a dry spell
    if (drySpellStart !== null && drySpellLength >= 4) {
      drySpells.push({
        startDate: drySpellStart,
        endDate: rainfallData[rainfallData.length - 1].date,
        duration: drySpellLength,
        district: 'Selected Area',
        year: new Date(startDate).getFullYear()
      });
    }
    
    return drySpells;
  }
  
  // Analyze impact of dry spells on crop yield and fertilizer usage
  analyzeImpact(district: string, year: number, startDate: string, endDate: string): ImpactAnalysis {
    const drySpells = this.detectDrySpells(startDate, endDate);
    const currentYearData = this.getDataForDistrictAndYear(district, year);
    
    return {
      district,
      year,
      drySpellCount: drySpells.length,
      averageDrySpellDuration: drySpells.length > 0 
        ? drySpells.reduce((sum, spell) => sum + spell.duration, 0) / drySpells.length 
        : 0,
      totalDrySpellDays: drySpells.reduce((sum, spell) => sum + spell.duration, 0),
      actualYield: currentYearData?.yield || 0,
      actualFertilizerUsage: currentYearData?.fertilizerConsumption || 0
    };
  }
  
  // Get all data for a district across all years
  getDataForDistrict(district: string): AgriculturalData[] {
    return this.agriculturalData.filter(item => item.distName === district);
  }
  
  // Get all agricultural data (for training)
  getAllAgriculturalData(): AgriculturalData[] {
    return this.agriculturalData;
  }
}

export { MonsoonDataProcessor };