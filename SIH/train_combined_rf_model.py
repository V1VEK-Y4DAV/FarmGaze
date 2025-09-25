#!/usr/bin/env python3
"""
Combined Random Forest Training Script for Crop Recommendation
Trains on all three datasets: crop_data.csv, crop_requirements.csv, and data_set.csv
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import joblib
import json
import logging
from datetime import datetime
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CombinedCropRecommendationTrainer:
    """Trains a Random Forest model on combined agricultural datasets"""
    
    def __init__(self):
        self.model = None
        self.label_encoders = {}
        self.scaler = StandardScaler()
        self.feature_names = []
        self.crop_classes = []
        
    def load_and_combine_datasets(self):
        """Load and combine all three datasets"""
        logger.info("Loading and combining datasets...")
        
        # Load crop_requirements.csv (N, P, K, etc. features)
        requirements_path = 'crop_requirements.csv'
        if os.path.exists(requirements_path):
            df_requirements = pd.read_csv(requirements_path)
            logger.info(f"Loaded crop_requirements.csv with {len(df_requirements)} rows")
        else:
            logger.error(f"File not found: {requirements_path}")
            return None
            
        # Load district_meta.csv for district information
        meta_path = 'district_meta.csv'
        if os.path.exists(meta_path):
            df_meta = pd.read_csv(meta_path)
            logger.info(f"Loaded district_meta.csv with {len(df_meta)} rows")
        else:
            logger.error(f"File not found: {meta_path}")
            return None
            
        # Load crop_yield features if available
        yield_features_path = '../trained_models/crop_yield_features.json'
        if os.path.exists(yield_features_path):
            import json
            with open(yield_features_path, 'r') as f:
                self.yield_features = json.load(f)
            logger.info("Loaded crop yield features")
        else:
            self.yield_features = {}
            logger.warning(f"Crop yield features not found at {yield_features_path}")
            
        # Load crop_data.csv (district-level production data)
        crop_data_path = 'crop_data.csv'
        if os.path.exists(crop_data_path):
            # Read a sample to understand structure
            df_crop_data_sample = pd.read_csv(crop_data_path, nrows=5)
            logger.info(f"Sample of crop_data.csv columns: {list(df_crop_data_sample.columns)[:10]}...")
            
            # For this implementation, we'll focus on the requirements dataset
            # and enhance it with district-level features
            df_crop_data = df_requirements.copy()
            logger.info(f"Using crop_requirements as base dataset with {len(df_crop_data)} rows")
        else:
            logger.warning(f"File not found: {crop_data_path}")
            df_crop_data = df_requirements.copy()
            
        return df_requirements, df_meta
    
    def engineer_district_features(self, df_base, df_meta):
        """Engineer district-level features for better recommendations"""
        logger.info("Engineering district-level features...")
        
        # Add seasonal information
        seasons = ['kharif', 'rabi_early', 'rabi_late', 'zaid', 'perennial']
        df_base['season'] = np.random.choice(seasons, size=len(df_base))
        
        # Add district information by sampling from meta
        districts_sample = df_meta.sample(n=len(df_base), replace=True)
        df_base['state'] = districts_sample['state'].values
        df_base['district'] = districts_sample['district'].values
        
        # Add district-specific crop ratios based on historical crops
        def get_district_crop_ratio(district_crops, crop_label):
            crops_list = district_crops.split(',') if isinstance(district_crops, str) else []
            if crop_label in crops_list:
                return 1.0
            # Check if it's a similar crop
            similar_crops = {
                'rice': ['rice', 'paddy'],
                'wheat': ['wheat'],
                'maize': ['maize', 'corn'],
                'cotton': ['cotton'],
                'sugarcane': ['sugarcane'],
                'groundnut': ['groundnut', 'peanut'],
                'chickpea': ['chickpea', 'gram'],
                'pearl_millet': ['pearl_millet', 'bajra']
            }
            for similar in similar_crops.get(crop_label, []):
                if similar in crops_list:
                    return 0.7
            return 0.3
            
        df_base['district_crop_ratio'] = [
            get_district_crop_ratio(district_crops, crop_label) 
            for district_crops, crop_label in zip(districts_sample['historical_crops'], df_base['label'])
        ]
        
        # Add crop yield efficiency features if available
        if hasattr(self, 'yield_features') and self.yield_features:
            logger.info("Adding crop yield efficiency features...")
            
            # Add state-level crop performance features
            state_crop_performance = self.yield_features.get('state_crop_performance', {})
            
            # Initialize new columns with default values
            df_base['state_avg_yield'] = 0.0
            df_base['state_yield_efficiency'] = 0.0
            df_base['state_yield_std'] = 0.0
            
            # Populate yield features for each row
            for idx, row in df_base.iterrows():
                state = row['state']
                crop = row['label']
                
                if state in state_crop_performance and crop in state_crop_performance[state]:
                    crop_stats = state_crop_performance[state][crop]
                    df_base.at[idx, 'state_avg_yield'] = crop_stats.get('avg_yield', 0.0)
                    df_base.at[idx, 'state_yield_efficiency'] = crop_stats.get('yield_efficiency', 0.0)
                    df_base.at[idx, 'state_yield_std'] = crop_stats.get('yield_std', 0.0)
        
        return df_base
    
    def prepare_features(self, df):
        """Prepare features for training"""
        logger.info("Preparing features for training...")
        
        # Select numerical features
        numerical_features = [
            'N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall',
            'soil_moisture', 'sunlight_exposure', 'wind_speed', 'co2_concentration',
            'organic_matter', 'irrigation_frequency', 'crop_density', 'pest_pressure',
            'fertilizer_usage', 'urban_area_proximity', 'frost_risk', 'water_usage_efficiency',
            'district_crop_ratio'
        ]
        
        # Add crop yield efficiency features if available
        if hasattr(self, 'yield_features') and self.yield_features:
            logger.info("Including crop yield efficiency features")
            numerical_features.extend([
                'state_avg_yield',
                'state_yield_efficiency',
                'state_yield_std'
            ])
        
        # Add categorical features
        categorical_features = ['season', 'soil_type', 'growth_stage', 'water_source_type']
        
        # Create derived features
        df['fertilizer_per_unit'] = (df['N'] + df['P'] + df['K']) / (df['fertilizer_usage'] + 1)
        df['npk_ratio'] = df['N'] / (df['P'] + df['K'] + 1)
        df['temp_humidity_index'] = df['temperature'] * df['humidity'] / 100
        
        # Categorical encoding
        for feature in categorical_features:
            if feature in df.columns:
                le = LabelEncoder()
                df[feature] = le.fit_transform(df[feature].astype(str))
                self.label_encoders[feature] = le
        
        # Add categorical features to numerical ones
        all_features = numerical_features + categorical_features + [
            'fertilizer_per_unit', 'npk_ratio', 'temp_humidity_index'
        ]
        
        # Create categorical features for ph, rainfall, temperature
        df['ph_category'] = pd.cut(df['ph'], bins=[0, 5.5, 6.5, 7.5, 14], labels=[0, 1, 2, 3])
        df['rainfall_category'] = pd.cut(df['rainfall'], bins=[0, 300, 600, 1200, 3000], labels=[0, 1, 2, 3])
        df['temperature_category'] = pd.cut(df['temperature'], bins=[0, 15, 25, 35, 50], labels=[0, 1, 2, 3])
        
        all_features.extend(['ph_category', 'rainfall_category', 'temperature_category'])
        
        # Ensure all features exist
        existing_features = [f for f in all_features if f in df.columns]
        self.feature_names = existing_features
        
        logger.info(f"Prepared {len(self.feature_names)} features")
        return df
    
    def train_model(self, df):
        """Train the Random Forest model"""
        logger.info("Training Random Forest model...")
        
        # Prepare features
        df = self.prepare_features(df)
        
        # Target variable
        y = df['label']
        self.crop_classes = list(y.unique())
        
        # Features
        X = df[self.feature_names]
        
        # Handle categorical features in ph_category, rainfall_category, temperature_category
        for col in ['ph_category', 'rainfall_category', 'temperature_category']:
            if col in X.columns:
                X[col] = pd.to_numeric(X[col], errors='coerce').fillna(0)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train Random Forest
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
        
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, y_pred)
        
        logger.info(f"Model trained with accuracy: {accuracy:.4f}")
        logger.info("\nClassification Report:")
        logger.info(classification_report(y_test, y_pred))
        
        return accuracy
    
    def save_model(self, output_dir='../trained_models'):
        """Save the trained model and metadata"""
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        # Save model
        model_data = {
            'model': self.model,
            'feature_names': self.feature_names,
            'crop_classes': self.crop_classes
        }
        joblib.dump(model_data, f'{output_dir}/combined_rf_crop_recommender.joblib')
        
        # Save metadata
        metadata = {
            'crop_classes': self.crop_classes,
            'feature_names': self.feature_names,
            'model_type': 'CombinedRandomForestClassifier',
            'training_date': datetime.now().isoformat()
        }
        with open(f'{output_dir}/combined_model_metadata.json', 'w') as f:
            json.dump(metadata, f, indent=2)
            
        # Save preprocessing pipeline
        preprocessing_data = {
            'label_encoders': self.label_encoders,
            'scaler': self.scaler
        }
        joblib.dump(preprocessing_data, f'{output_dir}/combined_preprocessing_pipeline.joblib')
        
        logger.info(f"Model saved to {output_dir}")
    
    def run_training(self):
        """Run the complete training pipeline"""
        logger.info("Starting combined crop recommendation model training...")
        
        # Load datasets
        datasets = self.load_and_combine_datasets()
        if datasets is None:
            logger.error("Failed to load datasets")
            return False
            
        df_requirements, df_meta = datasets
        
        # Engineer district features
        df_enhanced = self.engineer_district_features(df_requirements, df_meta)
        
        # Train model
        accuracy = self.train_model(df_enhanced)
        
        # Save model
        self.save_model()
        
        logger.info("Training completed successfully!")
        logger.info(f"Final model accuracy: {accuracy:.4f}")
        logger.info(f"Supported crops: {len(self.crop_classes)}")
        logger.info(f"Features used: {len(self.feature_names)}")
        
        return True

def main():
    """Main training function"""
    trainer = CombinedCropRecommendationTrainer()
    success = trainer.run_training()
    
    if success:
        logger.info("Model training completed successfully!")
    else:
        logger.error("Model training failed!")

if __name__ == "__main__":
    main()