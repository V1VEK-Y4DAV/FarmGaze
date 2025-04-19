import { useState, useEffect, useRef } from "react";
import Plot from 'react-plotly.js';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Papa from 'papaparse';
import { Download, RefreshCw, Info, BarChart2, LineChart, ScatterChart, Palette, Grid, List, SlidersHorizontal, LayoutGrid, Droplet, LineChart as LineChartIcon, BarChart as BarChartIcon, ScatterChart as ScatterChartIcon, ChevronDown, ChevronUp, Settings2, Paintbrush, Eye } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the column options based on the dataset
const columnOptions = [
  { value: "N", label: "Nitrogen (N)" },
  { value: "P", label: "Phosphorus (P)" },
  { value: "K", label: "Potassium (K)" },
  { value: "temperature", label: "Temperature" },
  { value: "humidity", label: "Humidity" },
  { value: "ph", label: "pH" },
  { value: "rainfall", label: "Rainfall" },
  { value: "soil_moisture", label: "Soil Moisture" },
  { value: "sunlight_exposure", label: "Sunlight Exposure" },
  { value: "wind_speed", label: "Wind Speed" },
  { value: "co2_concentration", label: "CO2 Concentration" },
  { value: "organic_matter", label: "Organic Matter" },
  { value: "irrigation_frequency", label: "Irrigation Frequency" },
  { value: "crop_density", label: "Crop Density" },
  { value: "pest_pressure", label: "Pest Pressure" },
  { value: "fertilizer_usage", label: "Fertilizer Usage" },
  { value: "water_usage_efficiency", label: "Water Usage Efficiency" }
];

const graphTypes = [
  { value: "scatter", label: "Scatter Plot" },
  { value: "line", label: "Line Graph" },
  { value: "bar", label: "Bar Chart" }
];

const Visualizations = () => {
  const [xAxis, setXAxis] = useState("temperature");
  const [yAxis, setYAxis] = useState("rainfall");
  const [graphType, setGraphType] = useState("scatter");
  const [plotData, setPlotData] = useState<any[]>([]);
  const [dataset, setDataset] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const plotRef = useRef<Plot>(null);
  const [markerSize, setMarkerSize] = useState(8);
  const [lineWidth, setLineWidth] = useState(2);
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [colorScheme, setColorScheme] = useState("default");
  const [pointOpacity, setPointOpacity] = useState(0.8);
  const [activeTab, setActiveTab] = useState("data");

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        Papa.parse('/data/data_set.csv', {
          download: true,
          header: true,
          complete: (results) => {
            setDataset(results.data);
            setIsLoading(false);
          },
          error: (error) => {
            setError('Failed to load dataset. Please try again.');
            setIsLoading(false);
          }
        });
      } catch (err) {
        setError('An error occurred while loading the data.');
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (dataset.length === 0) return;

    // Group data by crop label
    const groupedData = dataset.reduce((acc: any, row: any) => {
      const label = row.label;
      if (!acc[label]) {
        acc[label] = {
          x: [],
          y: [],
          label: label
        };
      }
      acc[label].x.push(parseFloat(row[xAxis]));
      acc[label].y.push(parseFloat(row[yAxis]));
      return acc;
    }, {});

    // Define color schemes
    const colorSchemes = {
      default: [
        '#4c871e', // Primary green
        '#2ecc71', // Emerald
        '#3498db', // Blue
        '#9b59b6', // Purple
        '#e74c3c', // Red
        '#f1c40f', // Yellow
        '#1abc9c', // Turquoise
        '#34495e'  // Dark blue
      ],
      dark: [
        '#2ecc71', // Bright green
        '#3498db', // Blue
        '#9b59b6', // Purple
        '#e74c3c', // Red
        '#f1c40f', // Yellow
        '#1abc9c', // Turquoise
        '#e67e22', // Orange
        '#95a5a6'  // Gray
      ],
      light: [
        '#4c871e', // Primary green
        '#27ae60', // Forest green
        '#2980b9', // Ocean blue
        '#8e44ad', // Deep purple
        '#c0392b', // Dark red
        '#f39c12', // Orange
        '#16a085', // Sea green
        '#7f8c8d'  // Steel gray
      ]
    };

    // Update plot data with style options
    const newPlotData = Object.values(groupedData).map((data: any, index: number) => ({
      x: data.x,
      y: data.y,
      type: graphType,
      name: data.label,
      mode: graphType === "scatter" ? "markers" : "lines",
      marker: {
        size: graphType === "scatter" ? markerSize : undefined,
        color: colorSchemes[colorScheme as keyof typeof colorSchemes][index % colorSchemes[colorScheme as keyof typeof colorSchemes].length],
        opacity: pointOpacity,
        line: {
          width: 1,
          color: '#ffffff'
        }
      },
      line: {
        width: lineWidth,
        color: colorSchemes[colorScheme as keyof typeof colorSchemes][index % colorSchemes[colorScheme as keyof typeof colorSchemes].length]
      }
    }));

    setPlotData(newPlotData);
  }, [xAxis, yAxis, graphType, dataset, markerSize, lineWidth, colorScheme, pointOpacity]);

  const handleDownload = () => {
    if (plotRef.current) {
      const plotElement = plotRef.current;
      const image = plotElement.toImage('png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `farmgaze-${xAxis}-vs-${yAxis}.png`;
      link.click();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4"
          >
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4c871e] to-emerald-600">
                Data Visualizations
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
                Explore and analyze agricultural data through interactive visualizations. Select variables, customize styles, and gain insights into crop relationships.
              </p>
            </div>
            <motion.div 
              className="flex gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handleDownload}
                      className="hover:bg-[#4c871e]/10 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download Plot</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => window.location.reload()}
                      className="hover:bg-[#4c871e]/10 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh Data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-4 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <CardContent className="p-4 text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  {error}
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Card className="mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-4 border-b bg-gradient-to-r from-[#4c871e]/10 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-[#4c871e]" />
                    <CardTitle className="text-lg font-semibold">Visualization Controls</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* Data Selection Section */}
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between bg-[#4c871e]/5 p-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <LayoutGrid className="h-4 w-4 text-[#4c871e]" />
                        <h3 className="text-sm font-medium">Data Selection</h3>
                      </div>
                      <ChevronDown className="h-4 w-4 text-[#4c871e]" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                      <div className="space-y-2">
                        <Label htmlFor="x-axis" className="text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <BarChart2 className="h-4 w-4 text-[#4c871e]" />
                          X-Axis
                        </Label>
                        <Select value={xAxis} onValueChange={setXAxis}>
                          <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <SelectValue placeholder="Select X-Axis" />
                          </SelectTrigger>
                          <SelectContent>
                            {columnOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <BarChart2 className="h-4 w-4 text-[#4c871e]" />
                                  <span>{option.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="y-axis" className="text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <BarChart2 className="h-4 w-4 text-[#4c871e]" />
                          Y-Axis
                        </Label>
                        <Select value={yAxis} onValueChange={setYAxis}>
                          <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <SelectValue placeholder="Select Y-Axis" />
                          </SelectTrigger>
                          <SelectContent>
                            {columnOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <BarChart2 className="h-4 w-4 text-[#4c871e]" />
                                  <span>{option.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="graph-type" className="text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <BarChart2 className="h-4 w-4 text-[#4c871e]" />
                          Graph Type
                        </Label>
                        <Select value={graphType} onValueChange={setGraphType}>
                          <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <SelectValue placeholder="Select Graph Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {graphTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  {type.value === "scatter" && <ScatterChartIcon className="h-4 w-4 text-[#4c871e]" />}
                                  {type.value === "line" && <LineChartIcon className="h-4 w-4 text-[#4c871e]" />}
                                  {type.value === "bar" && <BarChartIcon className="h-4 w-4 text-[#4c871e]" />}
                                  <span>{type.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="color-scheme" className="text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Palette className="h-4 w-4 text-[#4c871e]" />
                          Color Scheme
                        </Label>
                        <Select value={colorScheme} onValueChange={setColorScheme}>
                          <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <SelectValue placeholder="Select Color Scheme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default" className="flex items-center gap-2">
                              <Palette className="h-4 w-4 text-[#4c871e]" />
                              Default
                            </SelectItem>
                            <SelectItem value="dark" className="flex items-center gap-2">
                              <Palette className="h-4 w-4 text-[#4c871e]" />
                              Dark
                            </SelectItem>
                            <SelectItem value="light" className="flex items-center gap-2">
                              <Palette className="h-4 w-4 text-[#4c871e]" />
                              Light
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Style Options Section */}
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between bg-[#4c871e]/5 p-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Paintbrush className="h-4 w-4 text-[#4c871e]" />
                        <h3 className="text-sm font-medium">Style Options</h3>
                      </div>
                      <ChevronUp className="h-4 w-4 text-[#4c871e]" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                      <div className="space-y-2">
                        <Label htmlFor="marker-size" className="text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Droplet className="h-4 w-4 text-[#4c871e]" />
                          Marker Size
                        </Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="marker-size"
                            min={4}
                            max={20}
                            step={1}
                            value={[markerSize]}
                            onValueChange={(value) => setMarkerSize(value[0])}
                            disabled={graphType !== "scatter"}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-500 w-8 text-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {markerSize}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="line-width" className="text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <LineChart className="h-4 w-4 text-[#4c871e]" />
                          Line Width
                        </Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="line-width"
                            min={1}
                            max={5}
                            step={0.5}
                            value={[lineWidth]}
                            onValueChange={(value) => setLineWidth(value[0])}
                            disabled={graphType === "scatter"}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-500 w-8 text-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {lineWidth}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="point-opacity" className="text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Eye className="h-4 w-4 text-[#4c871e]" />
                          Point Opacity
                        </Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="point-opacity"
                            min={0.1}
                            max={1}
                            step={0.1}
                            value={[pointOpacity]}
                            onValueChange={(value) => setPointOpacity(value[0])}
                            disabled={graphType !== "scatter"}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-500 w-8 text-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {pointOpacity.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <Label htmlFor="show-grid" className="text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Grid className="h-4 w-4 text-[#4c871e]" />
                            Show Grid
                          </Label>
                          <Switch
                            id="show-grid"
                            checked={showGrid}
                            onCheckedChange={setShowGrid}
                            className="data-[state=checked]:bg-[#4c871e]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <Label htmlFor="show-legend" className="text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <List className="h-4 w-4 text-[#4c871e]" />
                            Show Legend
                          </Label>
                          <Switch
                            id="show-legend"
                            checked={showLegend}
                            onCheckedChange={setShowLegend}
                            className="data-[state=checked]:bg-[#4c871e]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-2 md:p-4">
                <div className="w-full h-[400px] md:h-[600px]">
                  {isLoading ? (
                    <motion.div 
                      className="w-full h-full flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4c871e]"></div>
                    </motion.div>
                  ) : (
                    <Plot
                      ref={plotRef}
                      data={plotData}
                      layout={{
                        title: {
                          text: 'Farm Data Visualization',
                          font: {
                            size: 14,
                          },
                        },
                        xaxis: { 
                          title: {
                            text: columnOptions.find(opt => opt.value === xAxis)?.label || xAxis,
                            font: {
                              size: 12,
                            },
                          },
                          autorange: true,
                          showgrid: showGrid,
                          gridcolor: '#e0e0e0',
                          gridwidth: 1,
                        },
                        yaxis: { 
                          title: {
                            text: columnOptions.find(opt => opt.value === yAxis)?.label || yAxis,
                            font: {
                              size: 12,
                            },
                          },
                          autorange: true,
                          showgrid: showGrid,
                          gridcolor: '#e0e0e0',
                          gridwidth: 1,
                        },
                        showlegend: showLegend,
                        legend: {
                          font: {
                            size: 10,
                          },
                          orientation: 'h',
                          y: -0.2,
                        },
                        margin: {
                          l: 50,
                          r: 20,
                          t: 50,
                          b: 50,
                        },
                        height: undefined,
                        autosize: true,
                        paper_bgcolor: 'transparent',
                        plot_bgcolor: 'transparent',
                        font: {
                          color: colorScheme === 'dark' ? '#ffffff' : '#000000',
                        },
                      }}
                      config={{ 
                        responsive: true,
                        displayModeBar: true,
                        displaylogo: false,
                        modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                      }}
                      useResizeHandler={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="mt-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">About This Visualization</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      This interactive visualization allows you to explore relationships between different agricultural parameters. Each data point represents a specific crop type, and you can analyze how various factors like temperature, rainfall, and soil nutrients affect crop performance.
                    </p>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">How to Use:</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li>Select different parameters for X and Y axes to explore relationships</li>
                        <li>Choose between scatter, line, or bar charts for different perspectives</li>
                        <li>Use the style options to customize the visualization</li>
                        <li>Hover over data points to see detailed information</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Data Insights</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Total Data Points:</span>
                        <span className="text-sm font-medium">{dataset.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Unique Crops:</span>
                        <span className="text-sm font-medium">{new Set(dataset.map((row: any) => row.label)).size}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Current View:</span>
                        <span className="text-sm font-medium">
                          {columnOptions.find(opt => opt.value === xAxis)?.label} vs {columnOptions.find(opt => opt.value === yAxis)?.label}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setXAxis("temperature");
                          setYAxis("rainfall");
                          setGraphType("scatter");
                        }}
                      >
                        Reset to Default View
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Visualizations;
