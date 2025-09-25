#!/usr/bin/env python3
"""
Process crop yield data to extract district-level statistics for enhanced crop recommendations.
This script processes the crop_yield.csv file to generate district-specific crop performance metrics.
"""

import pandas as pd
import numpy as np
import logging
import os
import json
from collections import defaultdict

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CropYieldDataProcessor:
    """Process crop yield data to extract district-level statistics"""
    
    def __init__(self):
        self.district_yield_stats = {}
        self.crop_performance_by_district = {}
        
    def load_crop_yield_data(self, file_path='crop_yield.csv'):
        """Load crop yield data from CSV file"""
        try:
            if os.path.exists(file_path):
                df = pd.read_csv(file_path)
                logger.info(f"Loaded crop yield data with {len(df)} rows")
                return df
            else:
                logger.error(f"Crop yield data file not found at {file_path}")
                return None
        except Exception as e:
            logger.error(f"Error loading crop yield data: {e}")
            return None
    
    def extract_state_district_mapping(self, district_meta_path='district_meta.csv'):
        """Extract state-district mapping from district metadata"""
        try:
            if os.path.exists(district_meta_path):
                df_meta = pd.read_csv(district_meta_path)
                # Create a mapping of districts to states
                district_to_state = {}
                for _, row in df_meta.iterrows():
                    district_to_state[row['district']] = row['state']
                logger.info(f"Loaded district metadata for {len(district_to_state)} districts")
                return district_to_state
            else:
                logger.warning(f"District metadata not found at {district_meta_path}")
                return {}
        except Exception as e:
            logger.error(f"Error loading district metadata: {e}")
            return {}
    
    def process_yield_data(self, df_yield):
        """Process yield data to extract district-level statistics"""
        logger.info("Processing crop yield data...")
        
        # Group by State and Crop to get average yield statistics
        state_crop_stats = df_yield.groupby(['State', 'Crop']).agg({
            'Yield': ['mean', 'std', 'max', 'min', 'count'],
            'Area': 'sum',
            'Production': 'sum',
            'Annual_Rainfall': 'mean',
            'Fertilizer': 'mean',
            'Pesticide': 'mean'
        }).reset_index()
        
        # Flatten column names
        state_crop_stats.columns = ['State', 'Crop', 'avg_yield', 'yield_std', 'max_yield', 'min_yield', 
                                   'record_count', 'total_area', 'total_production', 'avg_rainfall',
                                   'avg_fertilizer', 'avg_pesticide']
        
        # Calculate additional metrics
        state_crop_stats['yield_efficiency'] = state_crop_stats['total_production'] / state_crop_stats['total_area']
        
        # Group by State, Season, and Crop for seasonal analysis
        seasonal_stats = df_yield.groupby(['State', 'Season', 'Crop']).agg({
            'Yield': ['mean', 'std'],
            'Area': 'sum',
            'Production': 'sum'
        }).reset_index()
        
        # Flatten column names
        seasonal_stats.columns = ['State', 'Season', 'Crop', 'seasonal_avg_yield', 'seasonal_yield_std', 
                                 'seasonal_area', 'seasonal_production']
        
        # Calculate seasonal efficiency
        seasonal_stats['seasonal_yield_efficiency'] = (
            seasonal_stats['seasonal_production'] / seasonal_stats['seasonal_area']
        )
        
        logger.info(f"Processed yield statistics for {len(state_crop_stats)} state-crop combinations")
        logger.info(f"Processed seasonal statistics for {len(seasonal_stats)} state-season-crop combinations")
        
        return state_crop_stats, seasonal_stats
    
    def enhance_district_meta_with_yield(self, district_meta_path='district_meta.csv', 
                                        output_path='enhanced_district_meta.csv'):
        """Enhance district metadata with crop yield statistics"""
        logger.info("Enhancing district metadata with crop yield statistics...")
        
        # Load district metadata
        if not os.path.exists(district_meta_path):
            logger.error(f"District metadata file not found at {district_meta_path}")
            return False
            
        df_district = pd.read_csv(district_meta_path)
        logger.info(f"Loaded district metadata for {len(df_district)} districts")
        
        # Load and process crop yield data
        df_yield = self.load_crop_yield_data()
        if df_yield is None:
            return False
            
        state_crop_stats, seasonal_stats = self.process_yield_data(df_yield)
        
        # Add yield statistics to district metadata
        # We'll add average yield efficiency for major crops in each state
        major_crops = ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Groundnut', 'Chickpea']
        
        # Create dictionaries for quick lookup
        state_yield_dict = {}
        for _, row in state_crop_stats.iterrows():
            state = row['State']
            crop = row['Crop']
            if state not in state_yield_dict:
                state_yield_dict[state] = {}
            state_yield_dict[state][crop] = {
                'avg_yield': row['avg_yield'],
                'yield_efficiency': row['yield_efficiency'],
                'yield_std': row['yield_std']
            }
        
        # Add new columns to district metadata
        df_district['rice_yield_efficiency'] = 0.0
        df_district['wheat_yield_efficiency'] = 0.0
        df_district['maize_yield_efficiency'] = 0.0
        df_district['sugarcane_yield_efficiency'] = 0.0
        df_district['cotton_yield_efficiency'] = 0.0
        df_district['groundnut_yield_efficiency'] = 0.0
        df_district['chickpea_yield_efficiency'] = 0.0
        
        # Populate yield efficiency data
        for idx, row in df_district.iterrows():
            state = row['state']
            if state in state_yield_dict:
                crop_data = state_yield_dict[state]
                df_district.at[idx, 'rice_yield_efficiency'] = crop_data.get('Rice', {}).get('yield_efficiency', 0.0)
                df_district.at[idx, 'wheat_yield_efficiency'] = crop_data.get('Wheat', {}).get('yield_efficiency', 0.0)
                df_district.at[idx, 'maize_yield_efficiency'] = crop_data.get('Maize', {}).get('yield_efficiency', 0.0)
                df_district.at[idx, 'sugarcane_yield_efficiency'] = crop_data.get('Sugarcane', {}).get('yield_efficiency', 0.0)
                df_district.at[idx, 'cotton_yield_efficiency'] = crop_data.get('Cotton', {}).get('yield_efficiency', 0.0)
                df_district.at[idx, 'groundnut_yield_efficiency'] = crop_data.get('Groundnut', {}).get('yield_efficiency', 0.0)
                df_district.at[idx, 'chickpea_yield_efficiency'] = crop_data.get('Chickpea', {}).get('yield_efficiency', 0.0)
        
        # Save enhanced district metadata
        df_district.to_csv(output_path, index=False)
        logger.info(f"Enhanced district metadata saved to {output_path}")
        
        # Save yield statistics for use in the model
        yield_stats_output = {
            'state_crop_stats': state_crop_stats.to_dict('records'),
            'seasonal_stats': seasonal_stats.to_dict('records')
        }
        
        with open('../trained_models/yield_statistics.json', 'w') as f:
            json.dump(yield_stats_output, f, indent=2)
        logger.info("Yield statistics saved to trained_models/yield_statistics.json")
        
        return True
    
    def generate_crop_recommendation_features(self, output_path='../trained_models/crop_yield_features.json'):
        """Generate features from crop yield data for use in recommendation system"""
        logger.info("Generating crop recommendation features from yield data...")
        
        # Load and process crop yield data
        df_yield = self.load_crop_yield_data()
        if df_yield is None:
            return False
            
        state_crop_stats, seasonal_stats = self.process_yield_data(df_yield)
        
        # Create features for the recommendation system
        features = {
            'state_crop_performance': {},
            'seasonal_crop_performance': {},
            'crop_yield_trends': {}
        }
        
        # State-crop performance features
        for _, row in state_crop_stats.iterrows():
            state = row['State']
            crop = row['Crop']
            if state not in features['state_crop_performance']:
                features['state_crop_performance'][state] = {}
            
            features['state_crop_performance'][state][crop] = {
                'avg_yield': float(row['avg_yield']),
                'yield_efficiency': float(row['yield_efficiency']),
                'yield_std': float(row['yield_std']),
                'total_area': float(row['total_area']),
                'total_production': float(row['total_production']),
                'record_count': int(row['record_count'])
            }
        
        # Seasonal performance features
        for _, row in seasonal_stats.iterrows():
            state = row['State']
            season = row['Season'].strip()  # Remove extra spaces
            crop = row['Crop']
            
            if state not in features['seasonal_crop_performance']:
                features['seasonal_crop_performance'][state] = {}
            if season not in features['seasonal_crop_performance'][state]:
                features['seasonal_crop_performance'][state][season] = {}
            
            features['seasonal_crop_performance'][state][season][crop] = {
                'seasonal_avg_yield': float(row['seasonal_avg_yield']),
                'seasonal_yield_efficiency': float(row['seasonal_yield_efficiency']),
                'seasonal_area': float(row['seasonal_area']),
                'seasonal_production': float(row['seasonal_production'])
            }
        
        # Save features
        with open(output_path, 'w') as f:
            json.dump(features, f, indent=2)
        logger.info(f"Crop yield features saved to {output_path}")
        
        return True

def main():
    """Main function to process crop yield data"""
    logger.info("Starting crop yield data processing...")
    
    processor = CropYieldDataProcessor()
    
    # Create trained_models directory if it doesn't exist
    os.makedirs('../trained_models', exist_ok=True)
    
    # Enhance district metadata with yield statistics
    success1 = processor.enhance_district_meta_with_yield()
    
    # Generate features for recommendation system
    success2 = processor.generate_crop_recommendation_features()
    
    if success1 and success2:
        logger.info("Crop yield data processing completed successfully!")
    else:
        logger.error("Crop yield data processing failed!")

if __name__ == "__main__":
    main()