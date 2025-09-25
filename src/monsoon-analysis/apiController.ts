import { MonsoonDataProcessor, DrySpell, ImpactAnalysis } from './dataProcessor';
import { ImpactPredictor, PredictionFeatures, PredictionOutput } from './impactPredictor';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class MonsoonAnalysisAPI {
  private dataProcessor: MonsoonDataProcessor;
  private impactPredictor: ImpactPredictor;
  private initialized: boolean = false;

  constructor() {
    this.dataProcessor = new MonsoonDataProcessor();
    this.impactPredictor = new ImpactPredictor();
  }

  // Initialize the system with data and train the model
  async initialize(): Promise<void> {
    try {
      // Load agricultural data
      const dataPath = path.join(__dirname, '..', '..', 'SIH', 'done.csv');
      await this.dataProcessor.loadAgriculturalData(dataPath);
      
      // Initialize and train the prediction model
      this.impactPredictor.initializeModel();
      await this.impactPredictor.trainModel(this.dataProcessor.getAllAgriculturalData());
      
      this.initialized = true;
      console.log('Monsoon analysis system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize monsoon analysis system:', error);
      throw error;
    }
  }

  // Get list of available districts
  getDistricts(): string[] {
    if (!this.initialized) {
      throw new Error('System not initialized. Call initialize() first.');
    }
    return this.dataProcessor.getDistricts();
  }

  // Get year range in the dataset
  getYearRange(): { min: number, max: number } {
    if (!this.initialized) {
      throw new Error('System not initialized. Call initialize() first.');
    }
    return this.dataProcessor.getYearRange();
  }

  // Detect dry spells for a specific date range
  detectDrySpells(startDate: string, endDate: string): DrySpell[] {
    if (!this.initialized) {
      throw new Error('System not initialized. Call initialize() first.');
    }
    return this.dataProcessor.detectDrySpells(startDate, endDate);
  }

  // Analyze historical impact of dry spells
  analyzeImpact(district: string, year: number, startDate: string, endDate: string): ImpactAnalysis {
    if (!this.initialized) {
      throw new Error('System not initialized. Call initialize() first.');
    }
    return this.dataProcessor.analyzeImpact(district, year, startDate, endDate);
  }

  // Predict impact of dry spells using the ML model
  async predictImpact(district: string, startDate: string, endDate: string): Promise<PredictionOutput> {
    if (!this.initialized) {
      throw new Error('System not initialized. Call initialize() first.');
    }

    // Get dry spell analysis for the period
    const drySpells = this.dataProcessor.detectDrySpells(startDate, endDate);
    
    // Get state code for the district
    const stateCode = this.dataProcessor.getStateCodeForDistrict(district);
    
    if (stateCode === null) {
      throw new Error(`Could not find state code for district: ${district}`);
    }
    
    // Calculate features for prediction
    const features: PredictionFeatures = {
      stateCode: stateCode,
      drySpellCount: drySpells.length,
      averageDrySpellDuration: drySpells.length > 0 
        ? drySpells.reduce((sum, spell) => sum + spell.duration, 0) / drySpells.length 
        : 0,
      totalDrySpellDays: drySpells.reduce((sum, spell) => sum + spell.duration, 0)
    };

    // Make prediction
    return await this.impactPredictor.predict(features);
  }

  // Get comprehensive analysis for a district and date range
  async getComprehensiveAnalysis(
    district: string, 
    year: number,
    startDate: string, 
    endDate: string
  ): Promise<{
    drySpells: DrySpell[];
    historicalImpact: ImpactAnalysis;
    predictedImpact: PredictionOutput;
  }> {
    if (!this.initialized) {
      throw new Error('System not initialized. Call initialize() first.');
    }

    const drySpells = this.detectDrySpells(startDate, endDate);
    const historicalImpact = this.analyzeImpact(district, year, startDate, endDate);
    const predictedImpact = await this.predictImpact(district, startDate, endDate);

    return {
      drySpells,
      historicalImpact,
      predictedImpact
    };
  }
}

// Create a singleton instance
const monsoonAnalysisAPI = new MonsoonAnalysisAPI();

// Initialize the system when the module is loaded
// In a real application, you might want to do this in a more controlled way
// monsoonAnalysisAPI.initialize().catch(console.error);

export { monsoonAnalysisAPI, MonsoonAnalysisAPI };