import express, { Request, Response } from 'express';
import { monsoonAnalysisAPI } from './apiController';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Initialize the monsoon analysis system
const initializeSystem = async () => {
  try {
    await monsoonAnalysisAPI.initialize();
    console.log('Monsoon analysis system initialized');
  } catch (error) {
    console.error('Failed to initialize monsoon analysis system:', error);
    process.exit(1);
  }
};

// Routes

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Monsoon analysis API is running' });
});

// Get list of districts
app.get('/api/districts', (req: Request, res: Response) => {
  try {
    const districts = monsoonAnalysisAPI.getDistricts();
    res.json({ districts });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get year range
app.get('/api/year-range', (req: Request, res: Response) => {
  try {
    const yearRange = monsoonAnalysisAPI.getYearRange();
    res.json({ yearRange });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Detect dry spells for a date range
app.get('/api/dry-spells', (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }
    
    const drySpells = monsoonAnalysisAPI.detectDrySpells(startDate as string, endDate as string);
    res.json({ drySpells });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Analyze historical impact
app.get('/api/impact-analysis/:district/:year', (req: Request, res: Response) => {
  try {
    const { district, year } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }
    
    const impact = monsoonAnalysisAPI.analyzeImpact(
      district, 
      parseInt(year), 
      startDate as string, 
      endDate as string
    );
    res.json({ impact });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Predict impact using ML model
app.get('/api/predict-impact/:district', async (req: Request, res: Response) => {
  try {
    const { district } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }
    
    const prediction = await monsoonAnalysisAPI.predictImpact(
      district, 
      startDate as string, 
      endDate as string
    );
    res.json({ prediction });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get comprehensive analysis
app.get('/api/analysis/:district/:year', async (req: Request, res: Response) => {
  try {
    const { district, year } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }
    
    const analysis = await monsoonAnalysisAPI.getComprehensiveAnalysis(
      district, 
      parseInt(year), 
      startDate as string, 
      endDate as string
    );
    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Start the server
const startServer = async () => {
  await initializeSystem();
  
  app.listen(PORT, () => {
    console.log(`Monsoon analysis server running on port ${PORT}`);
  });
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down monsoon analysis server');
  process.exit(0);
});

// Export for use in other modules
export { app, startServer };