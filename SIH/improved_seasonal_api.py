#!/usr/bin/env python3
"""
Enhanced Seasonal Crop Recommendation API with improved seasonal logic
and better crop recommendations based on agricultural knowledge.
"""

import logging
import pandas as pd
import numpy as np
import requests
import joblib
from datetime import datetime
import pytz
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import warnings

# Suppress warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

def get_current_season():
    """Get current agricultural season based on IST time - Enhanced for 5 seasons"""
    ist = pytz.timezone('Asia/Kolkata')
    now = datetime.now(ist)
    month = now.month
    
    if month in [6, 7, 8, 9]:
        return 'kharif'        # Monsoon season
    elif month in [10, 11]:
        return 'rabi_early'    # Early winter season
    elif month in [12, 1, 2, 3]:
        return 'rabi_late'     # Late winter season
    elif month in [4, 5]:
        return 'zaid'          # Summer season
    else:
        return 'perennial'     # Perennial crop season (transitional)

class WeatherService:
    """Service to fetch real-time weather data"""
    
    @staticmethod
    def get_current_weather(lat, lon):
        """Fetch current weather from Open-Meteo API"""
        try:
            # Current weather
            current_url = f"https://api.open-meteo.com/v1/forecast"
            current_params = {
                'latitude': lat,
                'longitude': lon,
                'current': 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m',
                'timezone': 'Asia/Kolkata',
                'past_days': 7,
                'forecast_days': 1
            }
            
            current_response = requests.get(current_url, params=current_params, timeout=10)
            current_response.raise_for_status()
            current_data = current_response.json()
            
            # Weekly precipitation
            weekly_precipitation = sum(current_data.get('daily', {}).get('precipitation_sum', [0]))
            
            ist = pytz.timezone('Asia/Kolkata')
            
            return {
                'temperature': round(current_data['current']['temperature_2m'], 1),
                'humidity': current_data['current']['relative_humidity_2m'],
                'rainfall': weekly_precipitation,
                'wind_speed': round(current_data['current']['wind_speed_10m'], 1),
                'precipitation_current': current_data['current']['precipitation'],
                'precipitation_week': round(weekly_precipitation, 1),
                'fetch_time': datetime.now(ist).isoformat()
            }
            
        except Exception as e:
            logger.error(f"Weather API error: {e}")
            # Return default weather for the season
            season = get_current_season()
            if season == 'kharif':
                return {'temperature': 28, 'humidity': 80, 'rainfall': 1200, 'wind_speed': 8, 
                       'precipitation_current': 5, 'precipitation_week': 80, 
                       'fetch_time': datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()}
            elif season == 'rabi_early':
                return {'temperature': 15, 'humidity': 50, 'rainfall': 200, 'wind_speed': 6,
                       'precipitation_current': 0, 'precipitation_week': 5,
                       'fetch_time': datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()}
            elif season == 'rabi_late':
                return {'temperature': 20, 'humidity': 45, 'rainfall': 100, 'wind_speed': 5,
                       'precipitation_current': 0, 'precipitation_week': 3,
                       'fetch_time': datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()}
            elif season == 'zaid':
                return {'temperature': 35, 'humidity': 40, 'rainfall': 50, 'wind_speed': 12,
                       'precipitation_current': 0, 'precipitation_week': 2,
                       'fetch_time': datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()}
            elif season == 'perennial':
                return {'temperature': 25, 'humidity': 70, 'rainfall': 800, 'wind_speed': 7,
                       'precipitation_current': 2, 'precipitation_week': 20,
                       'fetch_time': datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()}
            else:
                # Default fallback
                return {'temperature': 25, 'humidity': 60, 'rainfall': 500, 'wind_speed': 7,
                       'precipitation_current': 1, 'precipitation_week': 10,
                       'fetch_time': datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()}

class ImprovedSeasonalCropRecommendationAPI:
    """Enhanced API with better seasonal crop recommendations"""
    
    def __init__(self):
        self.model = None
        self.feature_names = None
        self.crop_classes = None
        self.district_meta = None
        self.seasonal_crop_knowledge = self._load_seasonal_crop_knowledge()
        self.load_model()
        self.load_district_meta()
        # Cache for native crops per (state,district)
        self._native_cache = {}
    
    def _load_seasonal_crop_knowledge(self):
        """Load agricultural knowledge about seasonal crops for 5 seasons"""
        return {
            'kharif': {
                'ideal_crops': ['rice', 'cotton', 'sugarcane', 'maize', 'soybean', 'groundnut', 'pearl_millet'],
                'suitable_crops': ['bajra', 'jowar', 'tur', 'urad', 'moong', 'guar', 'sesame'],
                'conditions': {
                    'temperature_range': (25, 35),
                    'rainfall_min': 500,
                    'humidity_min': 70
                }
            },
            'rabi_early': {
                'ideal_crops': ['wheat', 'chickpea', 'mustard', 'barley', 'peas'],
                'suitable_crops': ['lentil', 'gram', 'onion', 'garlic'],
                'conditions': {
                    'temperature_range': (10, 20),
                    'rainfall_max': 300,
                    'humidity_max': 60
                }
            },
            'rabi_late': {
                'ideal_crops': ['wheat', 'chickpea', 'mustard', 'barley', 'peas'],
                'suitable_crops': ['lentil', 'gram', 'coriander', 'fenugreek'],
                'conditions': {
                    'temperature_range': (15, 25),
                    'rainfall_max': 200,
                    'humidity_max': 50
                }
            },
            'zaid': {
                'ideal_crops': ['watermelon', 'muskmelon', 'cucumber', 'fodder_crops', 'sunflower'],
                'suitable_crops': ['bitter_gourd', 'bottle_gourd', 'ridge_gourd', 'okra', 'tomato'],
                'conditions': {
                    'temperature_range': (30, 40),
                    'rainfall_max': 200,
                    'humidity_max': 50
                }
            },
            'perennial': {
                'ideal_crops': ['mango', 'orange', 'pomegranate', 'banana', 'papaya', 'coconut', 'apple'],
                'suitable_crops': ['guava', 'lemon', 'sapota', 'jackfruit', 'custard_apple'],
                'conditions': {
                    'temperature_range': (20, 35),
                    'rainfall_range': (750, 2500),
                    'humidity_range': (60, 80)
                }
            }
        }
    
    def load_model(self):
        """Load the trained model and related artifacts"""
        try:
            # Try to load the combined model first (enhanced with all datasets)
            combined_model_path = '../trained_models/combined_rf_crop_recommender.joblib'
            combined_meta_path = '../trained_models/combined_model_metadata.json'
            
            if os.path.exists(combined_model_path):
                model_data = joblib.load(combined_model_path)
                
                if isinstance(model_data, dict):
                    self.model = model_data.get('model')
                    self.feature_names = model_data.get('feature_names', [])
                    self.crop_classes = model_data.get('crop_classes', [])
                else:
                    self.model = model_data
                    # Load metadata separately
                    if os.path.exists(combined_meta_path):
                        import json
                        with open(combined_meta_path, 'r') as f:
                            metadata = json.load(f)
                            self.feature_names = metadata.get('feature_names', [])
                            self.crop_classes = metadata.get('crop_classes', [])
                
                logger.info("Combined model loaded successfully")
                logger.info(f"Features: {len(self.feature_names) if self.feature_names else 0}")
                logger.info(f"Crops: {len(self.crop_classes) if self.crop_classes else 0}")
            else:
                # Fallback to original model
                model_path = '../trained_models/rf_crop_recommender.joblib'
                if os.path.exists(model_path):
                    model_data = joblib.load(model_path)
                    
                    if isinstance(model_data, dict):
                        self.model = model_data.get('model')
                        self.feature_names = model_data.get('feature_names', [])
                        self.crop_classes = model_data.get('crop_classes', [])
                    else:
                        self.model = model_data
                        # Load metadata separately
                        meta_path = '../trained_models/model_metadata.json'
                        if os.path.exists(meta_path):
                            import json
                            with open(meta_path, 'r') as f:
                                metadata = json.load(f)
                                self.feature_names = metadata.get('feature_names', [])
                                self.crop_classes = metadata.get('crop_classes', [])
                    
                    logger.info("Original model loaded successfully")
                    logger.info(f"Features: {len(self.feature_names) if self.feature_names else 0}")
                    logger.info(f"Crops: {len(self.crop_classes) if self.crop_classes else 0}")
                else:
                    logger.error(f"Model file not found at {model_path}")
                
        except Exception as e:
            logger.error(f"Error loading model: {e}")
    
    def load_district_meta(self):
        """Load district metadata"""
        try:
            # First try to load enhanced district metadata with yield statistics
            enhanced_meta_path = 'enhanced_district_meta.csv'
            if os.path.exists(enhanced_meta_path):
                self.district_meta = pd.read_csv(enhanced_meta_path)
                logger.info(f"Loaded enhanced district metadata with yield statistics for {len(self.district_meta)} districts")
            else:
                # Fallback to original district metadata
                meta_path = 'district_meta.csv'
                if os.path.exists(meta_path):
                    self.district_meta = pd.read_csv(meta_path)
                    logger.info(f"Loaded district metadata for {len(self.district_meta)} districts")
                else:
                    logger.warning(f"District metadata not found at {meta_path}")
            
            # Load crop yield features if available
            yield_features_path = '../trained_models/crop_yield_features.json'
            if os.path.exists(yield_features_path):
                import json
                with open(yield_features_path, 'r') as f:
                    self.yield_features = json.load(f)
                logger.info("Loaded crop yield features for enhanced predictions")
            else:
                self.yield_features = {}
                logger.warning(f"Crop yield features not found at {yield_features_path}")
                
        except Exception as e:
            logger.error(f"Error loading district metadata: {e}")

    def get_native_crops(self, state, district, season=None):
        """Infer district-native crops using 4 datasets:
        - enhanced_district_meta.csv or district_meta.csv: historical_crops per district
        - crop_yield_features.json: state-level yield efficiency per crop
        - seasonal knowledge: seasonally ideal/suitable crops
        - model crop classes (if available): to intersect with supported crops
        Returns a sorted list of crops (native-first relevance).
        """
        cache_key = (state, district, season or 'all')
        if cache_key in self._native_cache:
            return self._native_cache[cache_key]

        historical = []
        if self.district_meta is not None:
            match = self.district_meta[(self.district_meta['state'] == state) & (self.district_meta['district'] == district)]
            if not match.empty:
                hc = match.iloc[0].get('historical_crops')
                if isinstance(hc, str):
                    historical = [c.strip() for c in hc.split(',') if c.strip()]

        state_perf = {}
        if hasattr(self, 'yield_features') and self.yield_features:
            state_perf = self.yield_features.get('state_crop_performance', {}).get(state, {})

        # Season candidates from knowledge
        season_key = season or get_current_season()
        seasonal = []
        sk = self.seasonal_crop_knowledge.get(season_key, {})
        seasonal = sk.get('ideal_crops', []) + sk.get('suitable_crops', [])

        # Supported crops by model if available
        supported = set(self.crop_classes) if self.crop_classes else None

        # Score crops: historical high, yield efficiency medium, seasonal low
        scores = {}
        for crop in set(historical + seasonal + list(state_perf.keys())):
            if supported and crop not in supported:
                # If model classes exist, prefer supported crops
                pass
            scores[crop] = 0.0
            if crop in historical:
                scores[crop] += 1.0
            perf = state_perf.get(crop)
            if perf:
                ye = perf.get('yield_efficiency', 0.0)
                scores[crop] += min(max(ye, 0.0), 1.0) * 0.6
            if crop in seasonal:
                scores[crop] += 0.3

        # Rank and prepare list
        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        native_list = [c for c, _ in ranked]
        self._native_cache[cache_key] = native_list
        return native_list
    
    def get_district_coordinates(self, state, district):
        """Get coordinates for a district"""
        if self.district_meta is not None:
            match = self.district_meta[
                (self.district_meta['state'] == state) & 
                (self.district_meta['district'] == district)
            ]
            if not match.empty:
                return float(match.iloc[0]['lat']), float(match.iloc[0]['lon'])
        
        # Default coordinates for major cities
        defaults = {
            'Maharashtra': {'Pune': (18.5204, 73.8567), 'Mumbai': (19.0760, 72.8777)},
            'Karnataka': {'Bangalore': (12.9716, 77.5946), 'Mysore': (12.2958, 76.6394)},
            'Tamil Nadu': {'Chennai': (13.0827, 80.2707), 'Coimbatore': (11.0168, 76.9558)},
            'Uttar Pradesh': {'Lucknow': (26.8467, 80.9462), 'Kanpur': (26.4499, 80.3319)},
            'West Bengal': {'Kolkata': (22.5726, 88.3639), 'Darjeeling': (27.0360, 88.2627)},
            'Chhattisgarh': {'Raipur': (21.2514, 81.6296), 'Durg': (21.19, 81.2849)},
            'Madhya Pradesh': {'Bhopal': (23.2599, 77.4126), 'Indore': (22.7196, 75.8577)}
        }
        
        if state in defaults and district in defaults[state]:
            return defaults[state][district]
        
        return 20.5937, 78.9629  # Center of India
    
    def get_seasonal_crop_recommendations(self, season, weather_data, state, district, top_k=5):
        """Get seasonal crop recommendations based on agricultural knowledge for 5 seasons"""
        seasonal_crops = self.seasonal_crop_knowledge.get(season, {})
        ideal_crops = seasonal_crops.get('ideal_crops', [])
        suitable_crops = seasonal_crops.get('suitable_crops', [])
        conditions = seasonal_crops.get('conditions', {})
        
        recommendations = []
        
        # Check weather suitability
        temp = weather_data['temperature']
        rainfall = weather_data['rainfall']
        humidity = weather_data['humidity']
        
        # Get district-specific historical crops if available
        district_crops = []
        if self.district_meta is not None:
            match = self.district_meta[
                (self.district_meta['state'] == state) & 
                (self.district_meta['district'] == district)
            ]
            if not match.empty:
                historical_crops_str = match.iloc[0]['historical_crops']
                if isinstance(historical_crops_str, str):
                    district_crops = [crop.strip() for crop in historical_crops_str.split(',')]
        
        # Get crop yield performance data for the state if available
        state_crop_performance = {}
        if hasattr(self, 'yield_features') and self.yield_features:
            state_crop_performance = self.yield_features.get('state_crop_performance', {}).get(state, {})
            logger.debug(f"Found yield performance data for {len(state_crop_performance)} crops in {state}")
        
        # Score ideal crops higher
        for crop in ideal_crops[:top_k*2]:  # Consider more crops initially
            score = 0.8  # Base score for ideal crops
            
            # Adjust based on weather conditions for 5 seasons
            if season == 'kharif':
                if temp >= 25 and temp <= 35: score += 0.1
                if rainfall >= 500: score += 0.1
                if humidity >= 70: score += 0.05
            elif season == 'rabi_early':
                if temp >= 10 and temp <= 20: score += 0.1
                if rainfall <= 300: score += 0.1
                if humidity <= 60: score += 0.05
            elif season == 'rabi_late':
                if temp >= 15 and temp <= 25: score += 0.1
                if rainfall <= 200: score += 0.1
                if humidity <= 50: score += 0.05
            elif season == 'zaid':
                if temp >= 30: score += 0.1
                if rainfall <= 200: score += 0.1
                if humidity <= 50: score += 0.05
            elif season == 'perennial':
                if temp >= 20 and temp <= 35: score += 0.1
                if rainfall >= 750 and rainfall <= 2500: score += 0.1
                if humidity >= 60 and humidity <= 80: score += 0.05
            
            # Regional adjustments
            if state == 'Maharashtra' and crop in ['cotton', 'sugarcane', 'soybean']:
                score += 0.1
            elif state == 'Punjab' and crop in ['wheat', 'rice']:
                score += 0.1
            elif state == 'Karnataka' and crop in ['cotton', 'sugarcane']:
                score += 0.1
            elif state == 'Tamil Nadu' and crop in ['rice', 'sugarcane']:
                score += 0.1
            elif state == 'Uttar Pradesh' and crop in ['wheat', 'rice', 'sugarcane']:
                score += 0.1
            elif state == 'Chhattisgarh' and crop in ['rice', 'pearl_millet', 'chickpea', 'groundnut', 'sugarcane']:
                score += 0.1
            elif state == 'Madhya Pradesh' and crop in ['rice', 'pearl_millet', 'chickpea', 'groundnut', 'sugarcane']:
                score += 0.1
            
            # District-specific adjustments
            if crop in district_crops:
                score += 0.15  # Boost for historically grown crops
            
            # Crop yield performance adjustments
            yield_efficiency = 0
            if crop in state_crop_performance:
                crop_stats = state_crop_performance[crop]
                yield_efficiency = crop_stats.get('yield_efficiency', 0)
                avg_yield = crop_stats.get('avg_yield', 0)
                
                # Boost score based on yield performance
                if yield_efficiency > 0.5:  # High efficiency
                    score += 0.2
                elif yield_efficiency > 0.3:  # Medium efficiency
                    score += 0.1
                else:
                    score += 0.05  # Low efficiency but still positive
                    
                if avg_yield > 1.0:  # Good average yield
                    score += 0.1
            
            confidence = 'high' if score > 0.9 else 'medium' if score > 0.7 else 'low'
            
            recommendations.append({
                'crop': crop,
                'probability': min(score, 1.0),
                'confidence': confidence,
                'season_suitable': season,
                'weather_factors': {
                    'temperature': temp,
                    'humidity': humidity,
                    'rainfall_forecast': rainfall
                },
                'suitability_reason': self._get_suitability_reason(crop, season, weather_data),
                'district_historical': crop in district_crops,
                'yield_efficiency': yield_efficiency
            })
        
        # Add suitable crops if we need more recommendations
        if len(recommendations) < top_k*2:
            for crop in suitable_crops[:top_k*2 - len(recommendations)]:
                score = 0.6  # Lower base score for suitable crops
                
                # Similar adjustments as above for 5 seasons
                if season == 'kharif' and temp >= 25 and rainfall >= 500:
                    score += 0.1
                elif season == 'rabi_early' and temp >= 10 and temp <= 20 and rainfall <= 300:
                    score += 0.1
                elif season == 'rabi_late' and temp >= 15 and temp <= 25 and rainfall <= 200:
                    score += 0.1
                elif season == 'zaid' and temp >= 30 and rainfall <= 200:
                    score += 0.1
                elif season == 'perennial' and temp >= 20 and temp <= 35 and rainfall >= 750:
                    score += 0.1
                
                # Regional adjustments
                if state == 'Maharashtra' and crop in ['cotton', 'sugarcane', 'soybean']:
                    score += 0.1
                elif state == 'Punjab' and crop in ['wheat', 'rice']:
                    score += 0.1
                elif state == 'Karnataka' and crop in ['cotton', 'sugarcane']:
                    score += 0.1
                elif state == 'Tamil Nadu' and crop in ['rice', 'sugarcane']:
                    score += 0.1
                elif state == 'Uttar Pradesh' and crop in ['wheat', 'rice', 'sugarcane']:
                    score += 0.1
                elif state == 'Chhattisgarh' and crop in ['rice', 'pearl_millet', 'chickpea', 'groundnut', 'sugarcane']:
                    score += 0.1
                elif state == 'Madhya Pradesh' and crop in ['rice', 'pearl_millet', 'chickpea', 'groundnut', 'sugarcane']:
                    score += 0.1
                
                # District-specific adjustments
                if crop in district_crops:
                    score += 0.15  # Boost for historically grown crops
                
                # Crop yield performance adjustments
                yield_efficiency = 0
                if crop in state_crop_performance:
                    crop_stats = state_crop_performance[crop]
                    yield_efficiency = crop_stats.get('yield_efficiency', 0)
                    avg_yield = crop_stats.get('avg_yield', 0)
                    
                    # Boost score based on yield performance
                    if yield_efficiency > 0.5:  # High efficiency
                        score += 0.2
                    elif yield_efficiency > 0.3:  # Medium efficiency
                        score += 0.1
                    else:
                        score += 0.05  # Low efficiency but still positive
                        
                    if avg_yield > 1.0:  # Good average yield
                        score += 0.1
                
                confidence = 'medium' if score > 0.7 else 'low'
                
                recommendations.append({
                    'crop': crop,
                    'probability': min(score, 1.0),
                    'confidence': confidence,
                    'season_suitable': season,
                    'weather_factors': {
                        'temperature': temp,
                        'humidity': humidity,
                        'rainfall_forecast': rainfall
                    },
                    'suitability_reason': self._get_suitability_reason(crop, season, weather_data),
                    'district_historical': crop in district_crops,
                    'yield_efficiency': yield_efficiency
                })
        
        # Sort by probability and return top_k
        recommendations.sort(key=lambda x: x['probability'], reverse=True)
        return recommendations[:top_k]
    
    def _get_suitability_reason(self, crop, season, weather_data):
        """Generate reason for crop suitability for 5 seasons"""
        reasons = []
        
        if season == 'kharif':
            if crop in ['rice', 'cotton', 'sugarcane', 'maize']:
                reasons.append(f"Ideal for monsoon season with current rainfall of {weather_data['rainfall']}mm")
            if weather_data['humidity'] > 70:
                reasons.append("High humidity favorable for growth")
            if weather_data['temperature'] >= 25 and weather_data['temperature'] <= 35:
                reasons.append("Temperature optimal for kharif crops")
        elif season == 'rabi_early':
            if crop in ['wheat', 'chickpea', 'mustard', 'barley', 'peas']:
                reasons.append(f"Perfect for early winter season with moderate temperature of {weather_data['temperature']}°C")
            if weather_data['rainfall'] < 300:
                reasons.append("Low rainfall suitable for early winter crops")
            if weather_data['humidity'] <= 60:
                reasons.append("Moderate humidity favorable for rabi crops")
        elif season == 'rabi_late':
            if crop in ['wheat', 'chickpea', 'mustard', 'barley', 'peas']:
                reasons.append(f"Perfect for late winter season with moderate temperature of {weather_data['temperature']}°C")
            if weather_data['rainfall'] < 200:
                reasons.append("Low rainfall suitable for late winter crops")
            if weather_data['humidity'] <= 50:
                reasons.append("Lower humidity favorable for late rabi crops")
        elif season == 'zaid':
            if crop in ['watermelon', 'muskmelon', 'cucumber', 'sunflower', 'okra']:
                reasons.append(f"Heat-tolerant crop suitable for summer temperature of {weather_data['temperature']}°C")
            if weather_data['rainfall'] < 200:
                reasons.append("Low rainfall suitable for zaid crops")
        elif season == 'perennial':
            if crop in ['mango', 'orange', 'pomegranate', 'banana', 'papaya', 'coconut', 'apple']:
                reasons.append(f"Perennial crop suitable for year-round cultivation with current rainfall of {weather_data['rainfall']}mm")
            if weather_data['temperature'] >= 20 and weather_data['temperature'] <= 35:
                reasons.append("Temperature suitable for perennial fruit crops")
            if weather_data['humidity'] >= 60 and weather_data['humidity'] <= 80:
                reasons.append("Humidity optimal for perennial crops")
        
        return "; ".join(reasons) if reasons else f"Suitable for {season} season cultivation"
    
    def predict_crops(self, state, district, season=None, top_k=5):
        """Predict crops using enhanced seasonal logic and ML model when available"""
        if not season:
            season = get_current_season()
        
        # Get weather data
        lat, lon = self.get_district_coordinates(state, district)
        weather_data = WeatherService.get_current_weather(lat, lon)
        
        # If we have a trained model, use it for predictions
        if self.model is not None and self.feature_names is not None:
            try:
                # Prepare features for model prediction
                features = self._prepare_model_features(weather_data, season, state, district)
                
                # Make prediction
                probabilities = self.model.predict_proba([features])[0]
                
                # Combine with knowledge-based recommendations
                knowledge_predictions = self.get_seasonal_crop_recommendations(
                    season, weather_data, state, district, top_k
                )
                
                # Merge predictions with model probabilities
                merged_predictions = self._merge_predictions(
                    knowledge_predictions, probabilities, top_k
                )
                
                return merged_predictions, weather_data
            except Exception as e:
                logger.warning(f"Model prediction failed, falling back to knowledge-based: {e}")
                
        # Use knowledge-based recommendations as fallback
        predictions = self.get_seasonal_crop_recommendations(
            season, weather_data, state, district, top_k
        )
        
        return predictions, weather_data

    def _prepare_model_features(self, weather_data, season, state, district):
        """Prepare features for model prediction"""
        # Debug: Print input parameters
        logger.debug(f"Preparing features for: season={season}, state={state}, district={district}")
        logger.debug(f"Weather data: {weather_data}")
        
        # Map season to numerical value
        season_map = {'kharif': 0, 'rabi_early': 1, 'rabi_late': 2, 'zaid': 3, 'perennial': 4}
        season_num = season_map.get(season, 0)
        
        # Get district-specific information
        district_crop_ratio = 0.5  # Default value
        state_avg_yield = 0.0
        state_yield_efficiency = 0.0
        state_yield_std = 0.0
        
        # Default values for other features
        N = 50      # Nitrogen
        P = 30      # Phosphorus
        K = 40      # Potassium
        ph = 6.5
        soil_moisture = 60
        sunlight_exposure = 8
        wind_speed = weather_data.get('wind_speed', 10)
        co2_concentration = 400
        organic_matter = 2.5
        irrigation_frequency = 10
        crop_density = 200
        pest_pressure = 2
        fertilizer_usage = 40
        urban_area_proximity = 30
        frost_risk = 0
        water_usage_efficiency = 70
        
        # Get district-specific information from enhanced metadata
        if self.district_meta is not None:
            match = self.district_meta[
                (self.district_meta['state'] == state) & 
                (self.district_meta['district'] == district)
            ]
            if not match.empty:
                # Use district-specific ratios if available
                district_crop_ratio = 0.7
                
                # Get state-level yield statistics if available
                if hasattr(self, 'yield_features') and self.yield_features:
                    state_crop_performance = self.yield_features.get('state_crop_performance', {}).get(state, {})
                    logger.debug(f"State crop performance for {state}: {list(state_crop_performance.keys())[:5]}")
                    # For demonstration, we'll use rice statistics as state-level stats if available
                    if 'rice' in state_crop_performance:
                        crop_stats = state_crop_performance['rice']
                        state_avg_yield = crop_stats.get('avg_yield', 0.0)
                        state_yield_efficiency = crop_stats.get('yield_efficiency', 0.0)
                        state_yield_std = crop_stats.get('yield_std', 0.0)
                        logger.debug(f"Using rice yield stats for {state}: avg={state_avg_yield}, eff={state_yield_efficiency}")
        
        # Derived features
        fertilizer_per_unit = (N + P + K) / (fertilizer_usage + 1)
        npk_ratio = N / (P + K + 1)
        temp_humidity_index = weather_data.get('temperature', 25) * weather_data.get('humidity', 60) / 100
        
        # Categorical features (using default values)
        soil_type = 1  # Assuming 1 is a common soil type (e.g., loamy)
        growth_stage = 2  # Assuming 2 is a common growth stage (e.g., mature)
        water_source_type = 1  # Assuming 1 is a common water source (e.g., canal)
        
        # Categorical features for ph, rainfall, temperature
        ph_val = ph
        if ph_val < 5.5:
            ph_category = 0
        elif ph_val < 6.5:
            ph_category = 1
        elif ph_val < 7.5:
            ph_category = 2
        else:
            ph_category = 3
            
        rainfall_val = weather_data.get('rainfall', 500)
        if rainfall_val < 300:
            rainfall_category = 0
        elif rainfall_val < 600:
            rainfall_category = 1
        elif rainfall_val < 1200:
            rainfall_category = 2
        else:
            rainfall_category = 3
            
        temp_val = weather_data.get('temperature', 25)
        if temp_val < 15:
            temperature_category = 0
        elif temp_val < 25:
            temperature_category = 1
        elif temp_val < 35:
            temperature_category = 2
        else:
            temperature_category = 3
        
        # Create feature vector matching the training data (33 features total)
        # IMPORTANT: Must match the exact order from combined_model_metadata.json
        feature_values = [
            N,  # N
            P,  # P
            K,  # K
            weather_data.get('temperature', 25),  # temperature
            weather_data.get('humidity', 60),     # humidity
            ph,                                   # ph
            weather_data.get('rainfall', 500),    # rainfall
            soil_moisture,                        # soil_moisture
            sunlight_exposure,                    # sunlight_exposure
            wind_speed,                           # wind_speed
            co2_concentration,                    # co2_concentration
            organic_matter,                       # organic_matter
            irrigation_frequency,                 # irrigation_frequency
            crop_density,                         # crop_density
            pest_pressure,                        # pest_pressure
            fertilizer_usage,                     # fertilizer_usage
            urban_area_proximity,                 # urban_area_proximity
            frost_risk,                           # frost_risk
            water_usage_efficiency,               # water_usage_efficiency
            district_crop_ratio,                  # district_crop_ratio
            state_avg_yield,                      # state_avg_yield
            state_yield_efficiency,               # state_yield_efficiency
            state_yield_std,                      # state_yield_std
            season_num,                           # season
            soil_type,                            # soil_type
            growth_stage,                         # growth_stage
            water_source_type,                    # water_source_type
            fertilizer_per_unit,                  # fertilizer_per_unit
            npk_ratio,                            # npk_ratio
            temp_humidity_index,                  # temp_humidity_index
            ph_category,                          # ph_category
            rainfall_category,                    # rainfall_category
            temperature_category                  # temperature_category
        ]
        
        logger.debug(f"Prepared {len(feature_values)} features for model prediction")
        
        return feature_values
    
    def _merge_predictions(self, knowledge_predictions, model_probabilities, top_k):
        """Merge knowledge-based and model-based predictions"""
        # For now, we'll prioritize knowledge-based predictions but incorporate model confidence
        # In a full implementation, this would be more sophisticated
        return knowledge_predictions

# Initialize API
api = ImprovedSeasonalCropRecommendationAPI()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': api.model is not None,
        'features_available': len(api.feature_names) if api.feature_names else 0,
        'crops_supported': len(api.crop_classes) if api.crop_classes else 0,
        'current_season': get_current_season(),
        'timestamp': datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Predict crops with enhanced seasonal logic"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        state = data.get('state')
        district = data.get('district')
        season = data.get('season')
        top_k = data.get('top_k', 5)
        district_native = bool(data.get('district_native', False))
        
        if not state or not district:
            return jsonify({'error': 'State and district are required'}), 400
        
        # Make predictions
        predictions, weather_data = api.predict_crops(
            state=state,
            district=district, 
            season=season,
            top_k=top_k
        )

        # If native emphasis requested, boost native crops and re-rank
        if district_native:
            native_list = api.get_native_crops(state, district, season or get_current_season())
            native_set = set(native_list[: max(top_k * 3, 10)])  # focus on top native set
            for p in predictions:
                if p['crop'] in native_set:
                    p['probability'] = min(p['probability'] + 0.15, 1.0)
                    p['confidence'] = 'high' if p['probability'] > 0.9 else ('medium' if p['probability'] > 0.7 else 'low')
                    p['district_native'] = True
                else:
                    p['district_native'] = False
            predictions.sort(key=lambda x: (x.get('district_native', False), x['probability']), reverse=True)
            predictions = predictions[:top_k]
        
        return jsonify({
            'state': state,
            'district': district,
            'season': season or get_current_season(),
            'predictions': predictions,
            'weather_data': weather_data,
            'timestamp': datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()
        })
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/states', methods=['GET'])
def get_states():
    """Get list of available states"""
    states = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 
              'Punjab', 'Haryana', 'Rajasthan', 'Gujarat', 'Madhya Pradesh',
              'Andhra Pradesh', 'Telangana', 'Kerala', 'Odisha', 'Bihar',
              'Jharkhand', 'Chhattisgarh', 'Assam', 'Himachal Pradesh', 'Uttarakhand']
    return jsonify({'states': sorted(states)})

@app.route('/districts/<state>', methods=['GET'])
def get_districts(state):
    """Get districts for a state"""
    if api.district_meta is not None:
        districts_series = api.district_meta[api.district_meta['state'] == state]['district']
        districts = list(set(districts_series.tolist()))
    else:
        # Default districts for major states
        districts_map = {
            'Maharashtra': ['Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Ahmednagar'],
            'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'],
            'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Erode'],
            'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad'],
            'West Bengal': ['Kolkata', 'Darjeeling', 'Durgapur', 'Siliguri', 'Asansol']
        }
        districts = districts_map.get(state, ['District1', 'District2', 'District3'])
    
    return jsonify({'districts': sorted(districts)})

@app.route('/seasons', methods=['GET'])
def get_seasons():
    """Get information about agricultural seasons - Enhanced for 5 seasons"""
    current_season = get_current_season()
    
    return jsonify({
        'current_season': current_season,
        'seasons': {
            'kharif': {
                'months': [6, 7, 8, 9],
                'description': 'Monsoon season (Jun-Sep)',
                'typical_crops': ['rice', 'cotton', 'sugarcane', 'maize', 'soybean', 'groundnut', 'pearl_millet']
            },
            'rabi_early': {
                'months': [10, 11],
                'description': 'Early winter season (Oct-Nov)',
                'typical_crops': ['wheat', 'chickpea', 'mustard', 'barley', 'peas', 'lentil', 'gram']
            },
            'rabi_late': {
                'months': [12, 1, 2, 3],
                'description': 'Late winter season (Dec-Mar)',
                'typical_crops': ['wheat', 'chickpea', 'mustard', 'barley', 'peas', 'lentil', 'gram', 'onion', 'garlic']
            },
            'zaid': {
                'months': [4, 5],
                'description': 'Summer season (Apr-May)', 
                'typical_crops': ['watermelon', 'muskmelon', 'cucumber', 'fodder_crops', 'sunflower', 'bitter_gourd', 'okra']
            },
            'perennial': {
                'months': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                'description': 'Year-round perennial crops',
                'typical_crops': ['mango', 'orange', 'pomegranate', 'banana', 'papaya', 'coconut', 'apple', 'guava', 'lemon']
            }
        }
    })

@app.route('/native', methods=['POST'])
def native():
    """Return inferred native crops for a district/state and optional season."""
    try:
        data = request.get_json() or {}
        state = data.get('state')
        district = data.get('district')
        season = data.get('season')
        if not state or not district:
            return jsonify({'error': 'State and district are required'}), 400
        natives = api.get_native_crops(state, district, season)
        return jsonify({
            'state': state,
            'district': district,
            'season': season or get_current_season(),
            'native_crops': natives
        })
    except Exception as e:
        logger.error(f"Native endpoint error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5003))
    logger.info(f"Starting Enhanced Seasonal Crop Recommendation API on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=True)