# Monsoon Dry Spell Analysis System - User Guide

This guide explains how to use the monsoon dry spell analysis system that predicts the impact of dry spells during user-selected 21-day periods within the monsoon season.

## System Overview

The system analyzes agricultural data to detect dry spells (4-5 consecutive days with no rainfall) during user-selected 21-day periods within the monsoon season (June-September). It then predicts how these dry spells affect crop yield and fertilizer consumption using machine learning models trained on the [done.csv](file:///Users/vivekyadav/Downloads/FarmGaze2.0-Main/SIH/done.csv) dataset.

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation
1. Navigate to the project root directory:
   ```bash
   cd FarmGaze2.0-Main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Starting the System
1. Start the monsoon analysis server:
   ```bash
   npm run monsoon:dev
   ```

2. In a separate terminal, start the main application:
   ```bash
   npm run dev
   ```

3. The server will start on port 3001 and the main application on port 5173.

## Using the Web Interface

### Accessing the Application
1. Open your browser and navigate to `http://localhost:5173`

2. Navigate to the "CareCure" page in the application

### Weather Calendar
1. Use the search bar to find a location
2. Select a location from the search results
3. View the 21-day weather calendar showing past and future weather data

### Monsoon Analysis
1. After selecting a location, click on the "Monsoon Analysis" tab
2. Choose between two analysis modes:
   - **Traditional Analysis**: Overview of the entire monsoon season
   - **Dry Spell Analyzer**: Analysis of a specific 21-day period

### Dry Spell Analyzer
To analyze a specific 21-day period:

1. Select "Dry Spell Analyzer" from the view options
2. Choose a district from the dropdown (based on the [done.csv](file:///Users/vivekyadav/Downloads/FarmGaze2.0-Main/SIH/done.csv) dataset)
3. Select a year from the dropdown
4. Set the start date (must be within June-September of the selected year)
5. Set the end date (must be within June-September and create a 21-day period)
6. Click "Analyze" to see results

The system will display:
- Dry spell periods detected within the selected 21-day window
- Separate visualizations for predicted crop yield and fertilizer usage
- Confidence scores for predictions

## Using the API

### API Endpoints
The system exposes RESTful API endpoints for integration with other applications:

#### Health Check
```
GET /api/health
```
Returns the status of the API server.

#### Get Districts
```
GET /api/districts
```
Returns a list of available districts in the dataset.

#### Get Year Range
```
GET /api/year-range
```
Returns the range of years available in the dataset.

#### Detect Dry Spells
```
GET /api/dry-spells?startDate=:startDate&endDate=:endDate
```
Detects dry spells within a specific date range.

#### Analyze Historical Impact
```
GET /api/impact-analysis/:district/:year?startDate=:startDate&endDate=:endDate
```
Analyzes the historical impact of dry spells on crop yield and fertilizer usage.

#### Predict Impact
```
GET /api/predict-impact/:district?startDate=:startDate&endDate=:endDate
```
Predicts the impact of dry spells using machine learning models.

#### Get Comprehensive Analysis
```
GET /api/analysis/:district/:year?startDate=:startDate&endDate=:endDate
```
Returns a comprehensive analysis including dry spells, historical impact, and predictions.

### API Usage Examples

#### Analyze Specific 21-Day Period
```bash
curl -X GET "http://localhost:3001/api/analysis/Durg/2015?startDate=2015-07-01&endDate=2015-07-21"
```

#### Get Dry Spells for a Period
```bash
curl -X GET "http://localhost:3001/api/dry-spells?startDate=2015-07-01&endDate=2015-07-21"
```

## Understanding the Results

### Dry Spell Detection
The system identifies sequences of 4-5 consecutive days with no rainfall within the selected period.

### Prediction Model
- The model is trained on the [done.csv](file:///Users/vivekyadav/Downloads/FarmGaze2.0-Main/SIH/done.csv) dataset
- Input features for predictions: state code and current dry spell information
- Output predictions: crop yield and fertilizer usage
- Confidence score indicates reliability of predictions (0-100%)

### Visualization Types
1. **Dry Spell Periods**: Bar chart showing duration of dry spells within the selected period
2. **Crop Yield Analysis**: Bar chart comparing actual vs predicted crop yield
3. **Fertilizer Usage Analysis**: Bar chart comparing actual vs predicted fertilizer usage

## Data Sources

The system uses the `done.csv` dataset which contains agricultural data for various districts in India, including:
- Year
- State information (code and name)
- District name
- Total fertilizer consumption
- Crop production and yield
- Consumption data

## Technical Details

### Machine Learning Model
The system uses a TensorFlow.js neural network trained on the agricultural dataset to predict:
- Crop yield based on state and dry spell information
- Fertilizer consumption based on state and dry spell information

### Date Range Constraints
- Date ranges are constrained to monsoon months (June-September)
- The system works best with 21-day periods but can handle other ranges
- Date parameters are required for all analysis endpoints

## Troubleshooting

### Common Issues

1. **Server not starting**
   - Ensure all dependencies are installed: `npm install`
   - Check that port 3001 is not in use by another application

2. **API calls returning errors**
   - Verify the server is running
   - Check that district names and years are valid
   - Ensure date formats are YYYY-MM-DD
   - Verify that startDate and endDate parameters are provided

3. **UI not loading**
   - Verify the main application is running on port 5173
   - Check browser console for errors
   - Ensure all required files are present in the project directory

### Getting Help
If you encounter issues not covered in this guide, please check:
- Server logs for error messages
- Browser developer tools for frontend issues
- Ensure all required files are present in the project directory

## Future Enhancements

The system is designed to be extensible with potential future enhancements including:
- Integration with real weather APIs for actual rainfall data
- Enhanced visualization options
- Export functionality for reports
- Additional filtering and analysis options

## Conclusion

The monsoon dry spell analysis system provides valuable insights for agricultural planning by focusing on user-selected 21-day periods within the critical monsoon season. This targeted approach allows farmers and agricultural experts to make more precise decisions about crop management and resource allocation during specific windows of the growing season.