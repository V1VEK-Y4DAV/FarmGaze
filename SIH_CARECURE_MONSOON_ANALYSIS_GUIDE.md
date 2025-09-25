# CareCure Page Monsoon Analysis Guide

This document explains how to use the monsoon dry spell analysis feature that has been integrated directly into the CareCure page.

## Overview

The CareCure page now includes a monsoon analysis feature that allows users to:
1. Analyze dry spells during user-selected 21-day periods within the monsoon season
2. Predict impacts on crop yield and fertilizer consumption
3. Visualize results through interactive charts

## Accessing the Feature

1. Open your browser and navigate to `http://localhost:8085`
2. Navigate to the "CareCure" page in the application
3. Use the search bar to find and select a location
4. Click on the "Monsoon Analysis" tab

## Using the Monsoon Analysis

### Traditional Analysis
The "Traditional Analysis" view provides an overview of monsoon patterns for the selected location.

### Dry Spell Analyzer
The "Dry Spell Analyzer" view allows for detailed analysis of specific 21-day periods:

1. Click on "Dry Spell Analyzer" tab
2. Select start and end dates for a 21-day period within the monsoon season (June-September)
3. Click "Analyze Period"

The analyzer will display:

#### Dry Spell Periods Chart
- Shows the duration of dry spells detected within the selected period
- Identifies sequences of 4-5 consecutive days with no rainfall

#### Crop Yield Prediction Chart
- Compares predicted crop yield with previous year's data
- Shows confidence level of the prediction

#### Fertilizer Usage Prediction Chart
- Compares predicted fertilizer usage with previous year's data
- Shows confidence level of the prediction

## Technical Implementation

### Components
- **SimpleMonsoonAnalyzer.tsx**: Main component for the dry spell analysis
- **DrySpellVisualization.tsx**: Component for traditional monsoon analysis
- **CareCure.tsx**: Main page that integrates both components

### Features
- Date range selection for 21-day periods
- Interactive charts using Recharts library
- Responsive design for different screen sizes
- Error handling and loading states

## API Integration

The system is designed to work with the monsoon analysis API that:
- Detects dry spells within specific date ranges
- Trains models on agricultural data
- Provides predictions based on state and dry spell information

## Future Enhancements

Potential improvements include:
- Integration with real weather APIs for actual rainfall data
- Enhanced visualization options
- Export functionality for reports
- Additional filtering options

## Troubleshooting

### Common Issues
1. **Charts not displaying**: Ensure the development server is running
2. **Date selection not working**: Verify dates are within June-September range
3. **Analysis not loading**: Check browser console for errors

### Getting Help
If you encounter issues:
- Check browser developer tools for errors
- Ensure all required files are present in the project directory
- Verify the development server is running correctly