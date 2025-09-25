import * as tf from '@tensorflow/tfjs';

// Define the input features for our model
export interface PredictionFeatures {
  stateCode: number;
  drySpellCount: number;
  averageDrySpellDuration: number;
  totalDrySpellDays: number;
}

// Define the prediction output
export interface PredictionOutput {
  predictedYield: number;
  predictedFertilizerUsage: number;
  confidence: number;
}

class ImpactPredictor {
  private model: tf.LayersModel | null = null;
  private isTrained: boolean = false;
  
  // Initialize the model architecture
  initializeModel(): void {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [4], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 2, activation: 'linear' }) // 2 outputs: yield and fertilizer usage
      ]
    });
    
    model.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError',
      metrics: ['mae']
    });
    
    this.model = model;
  }
  
  // Prepare training data from the agricultural dataset
  prepareTrainingData(agriculturalData: any[]): { inputs: number[][], outputs: number[][] } {
    const inputs: number[][] = [];
    const outputs: number[][] = [];
    
    // Group data by district and year for dry spell analysis
    const districtYearData: {[key: string]: any[]} = {};
    
    agriculturalData.forEach(item => {
      const key = `${item.distName}-${item.year}`;
      if (!districtYearData[key]) {
        districtYearData[key] = [];
      }
      districtYearData[key].push(item);
    });
    
    // For each district-year combination, we'll simulate dry spells and create training data
    Object.values(districtYearData).forEach(dataGroup => {
      if (dataGroup.length > 0) {
        const sample = dataGroup[0];
        
        // Simulate dry spell features (in a real implementation, these would come from actual dry spell detection)
        const drySpellCount = Math.floor(Math.random() * 10); // 0-9 dry spells
        const averageDrySpellDuration = 4 + Math.random() * 4; // 4-8 days average
        const totalDrySpellDays = drySpellCount * averageDrySpellDuration;
        
        // Input features: state code and dry spell information
        inputs.push([
          sample.stateCode,
          drySpellCount,
          averageDrySpellDuration,
          totalDrySpellDays
        ]);
        
        // Output: actual yield and fertilizer usage from the dataset
        outputs.push([
          sample.yield || 1000,
          sample.fertilizerConsumption || 20000
        ]);
      }
    });
    
    return { inputs, outputs };
  }
  
  // Train the model using the agricultural dataset
  async trainModel(agriculturalData: any[]): Promise<void> {
    if (!this.model) {
      throw new Error('Model not initialized. Call initializeModel() first.');
    }
    
    // Prepare training data
    const { inputs, outputs } = this.prepareTrainingData(agriculturalData);
    
    if (inputs.length === 0 || outputs.length === 0) {
      throw new Error('No training data available');
    }
    
    // Convert to tensors
    const inputTensor = tf.tensor2d(inputs);
    const outputTensor = tf.tensor2d(outputs);
    
    // Train the model
    await this.model.fit(inputTensor, outputTensor, {
      epochs: 100,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 20 === 0) {
            console.log(`Epoch ${epoch}: loss = ${logs?.loss.toFixed(4)}`);
          }
        }
      }
    });
    
    // Clean up tensors
    inputTensor.dispose();
    outputTensor.dispose();
    
    this.isTrained = true;
  }
  
  // Make predictions based on state and dry spell information
  async predict(features: PredictionFeatures): Promise<PredictionOutput> {
    if (!this.model || !this.isTrained) {
      throw new Error('Model not trained. Call trainModel() first.');
    }
    
    // Prepare input tensor
    const inputTensor = tf.tensor2d([[
      features.stateCode,
      features.drySpellCount,
      features.averageDrySpellDuration,
      features.totalDrySpellDays
    ]]);
    
    // Make prediction
    const prediction = this.model.predict(inputTensor) as tf.Tensor;
    const predictionData = await prediction.data();
    
    // Clean up tensor
    inputTensor.dispose();
    prediction.dispose();
    
    // Return prediction with confidence (simplified)
    return {
      predictedYield: predictionData[0],
      predictedFertilizerUsage: predictionData[1],
      confidence: 0.85 // Simplified confidence measure
    };
  }
  
  // Save the model
  async saveModel(path: string): Promise<void> {
    if (!this.model || !this.isTrained) {
      throw new Error('Model not trained. Call trainModel() first.');
    }
    
    await this.model.save(`file://${path}`);
  }
  
  // Load a saved model
  async loadModel(path: string): Promise<void> {
    this.model = await tf.loadLayersModel(`file://${path}/model.json`);
    this.isTrained = true;
  }
}

export { ImpactPredictor };