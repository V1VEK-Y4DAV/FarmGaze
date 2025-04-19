import { motion } from "framer-motion";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Cloud, Droplet, Leaf, LineChart, Map, Settings2, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import Plot from "react-plotly.js";
import { useState, useEffect } from "react";
import Papa from "papaparse";

const Index = () => {
  const [dataset, setDataset] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentGraphIndex, setCurrentGraphIndex] = useState(0);

  const graphs = [
    {
      title: "Environmental Factors Analysis",
      type: "scatter3d",
      data: {
        x: dataset.map(row => parseFloat(row.temperature)),
        y: dataset.map(row => parseFloat(row.humidity)),
        z: dataset.map(row => parseFloat(row.rainfall)),
        mode: 'markers',
        marker: {
          size: 8,
          color: dataset.map(row => parseFloat(row.temperature)),
          colorscale: 'Viridis',
          showscale: true,
          colorbar: {
            title: 'Temperature (°C)',
            titleside: 'right',
            titlefont: { size: 14, color: '#4c871e' },
            tickfont: { size: 12, color: '#4c871e' }
          },
          opacity: 0.8,
          line: {
            color: '#4c871e',
            width: 1
          }
        },
        text: dataset.map(row => `Temp: ${row.temperature}°C<br>Humidity: ${row.humidity}%<br>Rainfall: ${row.rainfall}mm`),
        hoverinfo: 'text'
      },
      layout: {
        title: {
          text: 'Environmental Factors Analysis',
          font: { size: 24, color: '#4c871e' },
          x: 0.5,
          y: 0.95
        },
        scene: {
          xaxis: { 
            title: 'Temperature (°C)',
            titlefont: { size: 16, color: '#4c871e' },
            tickfont: { size: 14, color: '#4c871e' },
            showgrid: true,
            gridcolor: 'rgba(76, 135, 30, 0.1)',
            zerolinecolor: 'rgba(76, 135, 30, 0.2)',
            showbackground: true,
            backgroundcolor: 'rgba(0,0,0,0)'
          },
          yaxis: { 
            title: 'Humidity (%)',
            titlefont: { size: 16, color: '#4c871e' },
            tickfont: { size: 14, color: '#4c871e' },
            showgrid: true,
            gridcolor: 'rgba(76, 135, 30, 0.1)',
            zerolinecolor: 'rgba(76, 135, 30, 0.2)',
            showbackground: true,
            backgroundcolor: 'rgba(0,0,0,0)'
          },
          zaxis: { 
            title: 'Rainfall (mm)',
            titlefont: { size: 16, color: '#4c871e' },
            tickfont: { size: 14, color: '#4c871e' },
            showgrid: true,
            gridcolor: 'rgba(76, 135, 30, 0.1)',
            zerolinecolor: 'rgba(76, 135, 30, 0.2)',
            showbackground: true,
            backgroundcolor: 'rgba(0,0,0,0)'
          },
          camera: {
            eye: { x: 1.5, y: 1.5, z: 1.5 },
            up: { x: 0, y: 0, z: 1 },
            center: { x: 0, y: 0, z: 0 }
          },
          aspectmode: 'cube',
          aspectratio: { x: 1, y: 1, z: 1 }
        },
        margin: { l: 60, r: 60, t: 60, b: 60 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { family: 'Arial' }
      },
      insights: [
        "Temperature, humidity, and rainfall are key environmental factors affecting crop growth",
        "The scatter plot shows the relationship between these three variables",
        "Warmer colors indicate higher temperatures",
        "This visualization helps identify optimal growing conditions"
      ]
    },
    {
      title: "Crop Growth Analysis",
      type: "scatter3d",
      data: {
        x: dataset.map(row => parseFloat(row.growth_stage)),
        y: dataset.map(row => parseFloat(row.leaf_area)),
        z: dataset.map(row => parseFloat(row.plant_height)),
        mode: 'markers',
        marker: {
          size: 8,
          color: dataset.map(row => parseFloat(row.growth_stage)),
          colorscale: 'Viridis',
          showscale: true,
          colorbar: {
            title: 'Growth Stage',
            titleside: 'right',
            titlefont: { size: 14, color: '#4c871e' },
            tickfont: { size: 12, color: '#4c871e' }
          },
          opacity: 0.8,
          line: {
            color: '#4c871e',
            width: 1
          }
        },
        text: dataset.map(row => `Growth Stage: ${row.growth_stage}<br>Leaf Area: ${row.leaf_area} cm²<br>Plant Height: ${row.plant_height} cm`),
        hoverinfo: 'text'
      },
      layout: {
        title: {
          text: 'Crop Growth Analysis',
          font: { size: 24, color: '#4c871e' },
          x: 0.5,
          y: 0.95
        },
        scene: {
          xaxis: { 
            title: 'Growth Stage',
            titlefont: { size: 16, color: '#4c871e' },
            tickfont: { size: 14, color: '#4c871e' },
            showgrid: true,
            gridcolor: 'rgba(76, 135, 30, 0.1)',
            zerolinecolor: 'rgba(76, 135, 30, 0.2)',
            showbackground: true,
            backgroundcolor: 'rgba(0,0,0,0)'
          },
          yaxis: { 
            title: 'Leaf Area (cm²)',
            titlefont: { size: 16, color: '#4c871e' },
            tickfont: { size: 14, color: '#4c871e' },
            showgrid: true,
            gridcolor: 'rgba(76, 135, 30, 0.1)',
            zerolinecolor: 'rgba(76, 135, 30, 0.2)',
            showbackground: true,
            backgroundcolor: 'rgba(0,0,0,0)'
          },
          zaxis: { 
            title: 'Plant Height (cm)',
            titlefont: { size: 16, color: '#4c871e' },
            tickfont: { size: 14, color: '#4c871e' },
            showgrid: true,
            gridcolor: 'rgba(76, 135, 30, 0.1)',
            zerolinecolor: 'rgba(76, 135, 30, 0.2)',
            showbackground: true,
            backgroundcolor: 'rgba(0,0,0,0)'
          },
          camera: {
            eye: { x: 1.5, y: 1.5, z: 1.5 },
            up: { x: 0, y: 0, z: 1 },
            center: { x: 0, y: 0, z: 0 }
          },
          aspectmode: 'cube',
          aspectratio: { x: 1, y: 1, z: 1 }
        },
        margin: { l: 60, r: 60, t: 60, b: 60 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { family: 'Arial' }
      },
      insights: [
        "Shows the relationship between growth stage, leaf area, and plant height",
        "Helps track crop development and health",
        "Useful for monitoring plant growth patterns",
        "Can identify optimal growth conditions"
      ]
    },
    {
      title: "Environmental Factors",
      type: "bar3d",
      data: {
        x: dataset.map(row => row.label),
        y: ['Temperature', 'Humidity', 'Rainfall'],
        z: dataset.map(row => [
          parseFloat(row.temperature),
          parseFloat(row.humidity),
          parseFloat(row.rainfall)
        ]),
        colorscale: 'Viridis',
        showscale: true,
        colorbar: {
          title: 'Value',
          titleside: 'right',
          titlefont: { size: 14 },
          tickfont: { size: 12 }
        }
      },
      layout: {
        title: {
          text: 'Crop-Specific Environmental Conditions',
          font: { size: 20, color: '#4c871e' }
        },
        scene: {
          xaxis: { 
            title: 'Crop Type',
            titlefont: { size: 14 },
            tickfont: { size: 12 },
            showgrid: true,
            gridcolor: 'rgba(255,255,255,0.1)',
            zerolinecolor: 'rgba(255,255,255,0.1)'
          },
          yaxis: { 
            title: 'Environmental Factor',
            titlefont: { size: 14 },
            tickfont: { size: 12 },
            showgrid: true,
            gridcolor: 'rgba(255,255,255,0.1)',
            zerolinecolor: 'rgba(255,255,255,0.1)'
          },
          zaxis: { 
            title: 'Value',
            titlefont: { size: 14 },
            tickfont: { size: 12 },
            showgrid: true,
            gridcolor: 'rgba(255,255,255,0.1)',
            zerolinecolor: 'rgba(255,255,255,0.1)'
          },
          camera: {
            eye: { x: 1.5, y: 1.5, z: 1.5 }
          }
        },
        margin: { l: 0, r: 0, b: 0, t: 50 }
      },
      insights: [
        "Compares environmental factors across different crop types",
        "Helps identify which crops thrive in specific conditions",
        "Useful for crop selection and planning",
        "Shows the range of environmental conditions for each crop"
      ]
    },
    {
      title: "Time Series Analysis",
      type: "scatter3d",
      data: {
        x: dataset.map((_, i) => i),
        y: dataset.map(row => parseFloat(row.temperature)),
        z: dataset.map(row => parseFloat(row.humidity)),
        mode: 'lines+markers',
        line: {
          color: '#4c871e',
          width: 3
        },
        marker: {
          size: 4,
          color: '#4c871e'
        }
      },
      layout: {
        title: {
          text: 'Environmental Trends Over Time',
          font: { size: 20, color: '#4c871e' }
        },
        scene: {
          xaxis: { 
            title: 'Time (Days)',
            titlefont: { size: 14 },
            tickfont: { size: 12 },
            showgrid: true,
            gridcolor: 'rgba(255,255,255,0.1)',
            zerolinecolor: 'rgba(255,255,255,0.1)'
          },
          yaxis: { 
            title: 'Temperature (°C)',
            titlefont: { size: 14 },
            tickfont: { size: 12 },
            showgrid: true,
            gridcolor: 'rgba(255,255,255,0.1)',
            zerolinecolor: 'rgba(255,255,255,0.1)'
          },
          zaxis: { 
            title: 'Humidity (%)',
            titlefont: { size: 14 },
            tickfont: { size: 12 },
            showgrid: true,
            gridcolor: 'rgba(255,255,255,0.1)',
            zerolinecolor: 'rgba(255,255,255,0.1)'
          },
          camera: {
            eye: { x: 1.5, y: 1.5, z: 1.5 }
          }
        },
        margin: { l: 0, r: 0, b: 0, t: 50 }
      },
      insights: [
        "Shows how temperature and humidity change over time",
        "Helps identify seasonal patterns and trends",
        "Useful for predicting future conditions",
        "Can help plan irrigation schedules"
      ]
    },
    {
      title: "Soil Properties Analysis",
      type: "scatter3d",
      data: {
        x: dataset.map(row => parseFloat(row.ph)),
        y: dataset.map(row => parseFloat(row.soil_moisture)),
        z: dataset.map(row => parseFloat(row.organic_matter)),
        mode: 'markers',
        marker: {
          size: 8,
          color: dataset.map(row => parseFloat(row.ph)),
          colorscale: 'Viridis',
          showscale: true,
          colorbar: {
            title: 'pH Level',
            titleside: 'right',
            titlefont: { size: 14, color: '#4c871e' },
            tickfont: { size: 12, color: '#4c871e' }
          },
          opacity: 0.8,
          line: {
            color: '#4c871e',
            width: 1
          }
        },
        text: dataset.map(row => `pH: ${row.ph}<br>Moisture: ${row.soil_moisture}%<br>Organic Matter: ${row.organic_matter}%`),
        hoverinfo: 'text'
      },
      layout: {
        title: {
          text: 'Soil Properties Analysis',
          font: { size: 24, color: '#4c871e' },
          x: 0.5,
          y: 0.95
        },
        scene: {
          xaxis: { 
            title: 'Soil pH Level',
            titlefont: { size: 16, color: '#4c871e' },
            tickfont: { size: 14, color: '#4c871e' },
            showgrid: true,
            gridcolor: 'rgba(76, 135, 30, 0.1)',
            zerolinecolor: 'rgba(76, 135, 30, 0.2)',
            showbackground: true,
            backgroundcolor: 'rgba(0,0,0,0)'
          },
          yaxis: { 
            title: 'Soil Moisture Content (%)',
            titlefont: { size: 16, color: '#4c871e' },
            tickfont: { size: 14, color: '#4c871e' },
            showgrid: true,
            gridcolor: 'rgba(76, 135, 30, 0.1)',
            zerolinecolor: 'rgba(76, 135, 30, 0.2)',
            showbackground: true,
            backgroundcolor: 'rgba(0,0,0,0)'
          },
          zaxis: { 
            title: 'Organic Matter Content (%)',
            titlefont: { size: 16, color: '#4c871e' },
            tickfont: { size: 14, color: '#4c871e' },
            showgrid: true,
            gridcolor: 'rgba(76, 135, 30, 0.1)',
            zerolinecolor: 'rgba(76, 135, 30, 0.2)',
            showbackground: true,
            backgroundcolor: 'rgba(0,0,0,0)'
          },
          camera: {
            eye: { x: 1.5, y: 1.5, z: 1.5 },
            up: { x: 0, y: 0, z: 1 },
            center: { x: 0, y: 0, z: 0 }
          },
          aspectmode: 'cube',
          aspectratio: { x: 1, y: 1, z: 1 }
        },
        margin: { l: 60, r: 60, t: 60, b: 60 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { family: 'Arial' }
      },
      insights: [
        "Shows the relationship between soil pH, moisture, and organic matter",
        "pH affects nutrient availability to plants",
        "Soil moisture and organic matter are crucial for plant health",
        "Helps in soil management decisions"
      ]
    }
  ];

  const handleNextGraph = () => {
    setCurrentGraphIndex((prevIndex) => (prevIndex + 1) % graphs.length);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        Papa.parse('/data/data_set.csv', {
          download: true,
          header: true,
          complete: (results) => {
            setDataset(results.data);
            setIsLoading(false);
          },
          error: (error) => {
            console.error('Error loading dataset:', error);
            setIsLoading(false);
          }
        });
      } catch (err) {
        console.error('Error loading dataset:', err);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 overflow-x-hidden">
          {/* Title Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full py-12 px-4 md:px-8 lg:px-16 bg-white dark:bg-gray-900 shadow-sm mb-8 relative"
          >
            <div className="max-w-6xl mx-auto relative">
              <p className="text-gray-300/40 text-8xl md:text-9xl font-black text-center absolute -top-6 left-1/2 -translate-x-1/2 w-full">FarmGaze</p>
              <h1 className="text-5xl md:text-6xl font-bold text-[#4c871e] text-center relative z-10">FarmGaze</h1>
            </div>
          </motion.div>

          {/* Hero Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative flex items-center justify-center min-h-[80vh] p-8 md:p-12 lg:p-16 overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
          >
            <div className="absolute inset-0 flex items-center justify-center mt-16 md:mt-20">
              <div className="absolute text-[#4c871e]/5 text-[220px] md:text-[320px] font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-[#4c871e]/5 to-[#4c871e]/10">
                FarmGaze
              </div>
              <div className="absolute text-[#4c871e]/10 text-[200px] md:text-[300px] font-black tracking-tight -rotate-12 bg-clip-text text-transparent bg-gradient-to-b from-[#4c871e]/10 to-[#4c871e]/15">
                FarmGaze
              </div>
              <div className="absolute text-[#4c871e]/15 text-[180px] md:text-[280px] font-black tracking-tight rotate-12 bg-clip-text text-transparent bg-gradient-to-b from-[#4c871e]/15 to-[#4c871e]/20">
              FarmGaze
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/50 dark:to-gray-900/50 pointer-events-none" />
            </div>
            
            <div className="relative z-10 max-w-4xl text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#4c871e] to-emerald-600"
              >
                Smart Irrigation for Precision Farming
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8"
              >
                Optimize your farming operations with data-driven insights and intelligent irrigation solutions
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col md:flex-row gap-4 justify-center"
              >
                <Button size="lg" className="bg-[#4c871e] hover:bg-[#4c871e]/90">
                  Get Started
                </Button>
                <Button size="lg" variant="outline" className="border-[#4c871e] text-[#4c871e] hover:bg-[#4c871e]/10">
                  Learn More
                </Button>
              </motion.div>
            </div>
          </motion.section>

          {/* Features Section */}
          <section className="py-16 px-4 md:px-8 lg:px-16 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Discover how FarmGaze can transform your farming operations with advanced features
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-[#4c871e]/10 flex items-center justify-center mb-4">
                          {feature.icon}
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Data-Driven Insights */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-24 px-4 md:px-8 lg:px-16 bg-white dark:bg-gray-900"
          >
            <div className="max-w-7xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#4c871e] to-[#6ba32a]">
                  Data-Driven Insights
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Explore comprehensive analytics and visualizations to optimize your farming operations
                </p>
              </motion.div>

              {/* Graph Container - Now Full Width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative w-full h-[600px] mb-12"
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  <CardContent className="p-8 h-full flex items-center justify-center">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="w-16 h-16 border-4 border-[#4c871e]/20 border-t-[#4c871e] rounded-full animate-spin" />
                        <p className="text-xl text-gray-600 dark:text-gray-300">Loading data...</p>
                      </div>
                    ) : (
                      <div className="w-full h-full">
                        <Plot
                          data={[{
                            ...graphs[currentGraphIndex].data,
                            type: 'scatter3d',
                            mode: 'markers',
                            marker: {
                              ...graphs[currentGraphIndex].data.marker,
                              size: 8,
                              opacity: 0.8,
                              line: {
                                color: '#4c871e',
                                width: 1
                              }
                            }
                          }]}
                          layout={{
                            ...graphs[currentGraphIndex].layout,
                            paper_bgcolor: 'transparent',
                            plot_bgcolor: 'transparent',
                            margin: { l: 60, r: 60, t: 60, b: 60 },
                            font: { color: '#4c871e' },
                            title: {
                              text: graphs[currentGraphIndex].title,
                              font: { size: 24, color: '#4c871e' },
                              x: 0.5,
                              y: 0.95
                            },
                            scene: {
                              ...graphs[currentGraphIndex].layout.scene,
                              xaxis: {
                                ...graphs[currentGraphIndex].layout.scene.xaxis,
                                titlefont: { size: 16, color: '#4c871e' },
                                tickfont: { size: 14, color: '#4c871e' },
                                showgrid: true,
                                gridcolor: 'rgba(76, 135, 30, 0.1)',
                                zerolinecolor: 'rgba(76, 135, 30, 0.2)',
                                showbackground: true,
                                backgroundcolor: 'rgba(0,0,0,0)'
                              },
                              yaxis: {
                                ...graphs[currentGraphIndex].layout.scene.yaxis,
                                titlefont: { size: 16, color: '#4c871e' },
                                tickfont: { size: 14, color: '#4c871e' },
                                showgrid: true,
                                gridcolor: 'rgba(76, 135, 30, 0.1)',
                                zerolinecolor: 'rgba(76, 135, 30, 0.2)',
                                showbackground: true,
                                backgroundcolor: 'rgba(0,0,0,0)'
                              },
                              zaxis: {
                                ...graphs[currentGraphIndex].layout.scene.zaxis,
                                titlefont: { size: 16, color: '#4c871e' },
                                tickfont: { size: 14, color: '#4c871e' },
                                showgrid: true,
                                gridcolor: 'rgba(76, 135, 30, 0.1)',
                                zerolinecolor: 'rgba(76, 135, 30, 0.2)',
                                showbackground: true,
                                backgroundcolor: 'rgba(0,0,0,0)'
                              },
                              camera: {
                                eye: { x: 1.5, y: 1.5, z: 1.5 },
                                up: { x: 0, y: 0, z: 1 },
                                center: { x: 0, y: 0, z: 0 }
                              },
                              aspectmode: 'cube',
                              aspectratio: { x: 1, y: 1, z: 1 }
                            }
                          }}
                          config={{
                            responsive: true,
                            displayModeBar: true,
                            displaylogo: false,
                            modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                            scrollZoom: true,
                            toImageButtonOptions: {
                              format: 'png',
                              filename: '3d-graph',
                              height: 600,
                              width: 800,
                              scale: 2
                            }
                          }}
                          className="w-full h-full"
                          useResizeHandler={true}
                          style={{ width: '100%', height: '100%' }}
                        />
                </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Controls and Analysis - Now Below the Graph */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Graph Controls */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="space-y-8"
                >
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="bg-[#4c871e]/5 dark:bg-[#4c871e]/10 p-6">
                      <CardTitle className="text-2xl font-bold text-[#4c871e]">Graph Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <span className="text-lg text-gray-700 dark:text-gray-300">Current Graph: {graphs[currentGraphIndex].title}</span>
                          <div className="flex items-center space-x-4">
                            <Button
                              onClick={() => setCurrentGraphIndex((prevIndex) => (prevIndex - 1 + graphs.length) % graphs.length)}
                              variant="outline"
                              size="icon"
                              className="rounded-full border-[#4c871e]/20 hover:border-[#4c871e] hover:bg-[#4c871e]/5 h-10 w-10"
                            >
                              <ChevronLeft className="h-5 w-5 text-[#4c871e]" />
                            </Button>
                            <Button
                              onClick={handleNextGraph}
                              variant="outline"
                              size="icon"
                              className="rounded-full border-[#4c871e]/20 hover:border-[#4c871e] hover:bg-[#4c871e]/5 h-10 w-10"
                            >
                              <ChevronRight className="h-5 w-5 text-[#4c871e]" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {graphs.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentGraphIndex(index)}
                              className={`h-3 rounded-full transition-all duration-300 ${
                                index === currentGraphIndex
                                  ? 'w-12 bg-[#4c871e]'
                                  : 'w-3 bg-[#4c871e]/20 hover:bg-[#4c871e]/40'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Graph Description */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {graphs[currentGraphIndex].title}
                        </h3>
                        <ul className="space-y-4">
                          {graphs[currentGraphIndex].insights.map((insight, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <div className="w-2 h-2 rounded-full bg-[#4c871e] mt-2" />
                              <p className="text-lg text-gray-600 dark:text-gray-300">{insight}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Testimonials */}
          <section className="py-16 px-4 md:px-8 lg:px-16 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">What Farmers Say</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Hear from farmers who have transformed their operations with FarmGaze
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <p className="text-gray-600 dark:text-gray-300 mb-4">"{testimonial.quote}"</p>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-[#4c871e]/10 flex items-center justify-center mr-4">
                            {testimonial.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold">{testimonial.name}</p>
                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-16 px-4 md:px-8 lg:px-16 bg-[#4c871e] text-white">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Farming?</h2>
                <p className="text-lg mb-8 opacity-90">
                  Join thousands of farmers who have already improved their operations with FarmGaze
                </p>
                <Button size="lg" variant="secondary" className="bg-white text-[#4c871e] hover:bg-gray-100">
                  Start Your Free Trial
                </Button>
              </motion.div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    title: "Smart Irrigation",
    description: "Automated irrigation systems that optimize water usage based on real-time data",
    icon: <Droplet className="h-6 w-6 text-[#4c871e]" />,
  },
  {
    title: "Data Analytics",
    description: "Comprehensive data analysis tools to track and improve farm performance",
    icon: <BarChart2 className="h-6 w-6 text-[#4c871e]" />,
  },
  {
    title: "Weather Monitoring",
    description: "Real-time weather data integration for better decision making",
    icon: <Cloud className="h-6 w-6 text-[#4c871e]" />,
  },
  {
    title: "Crop Health",
    description: "Monitor and maintain optimal crop health with advanced tracking",
    icon: <Leaf className="h-6 w-6 text-[#4c871e]" />,
  },
  {
    title: "Field Mapping",
    description: "Detailed field mapping and area management tools",
    icon: <Map className="h-6 w-6 text-[#4c871e]" />,
  },
  {
    title: "Performance Tracking",
    description: "Track and analyze farm performance metrics over time",
    icon: <LineChart className="h-6 w-6 text-[#4c871e]" />,
  },
  {
    title: "System Integration",
    description: "Seamless integration with existing farm management systems",
    icon: <Settings2 className="h-6 w-6 text-[#4c871e]" />,
  },
  {
    title: "Data Security",
    description: "Enterprise-grade security for your farm data",
    icon: <Shield className="h-6 w-6 text-[#4c871e]" />,
  },
];

const testimonials = [
  {
    quote: "FarmGaze has revolutionized how we manage our irrigation. The water savings alone have paid for the system.",
    name: "John Smith",
    role: "Farm Owner, California",
  },
  {
    quote: "The data visualization tools are incredibly powerful. We've seen a 20% increase in crop yield since implementation.",
    name: "Sarah Johnson",
    role: "Agricultural Manager, Texas",
  },
  {
    quote: "The support team is amazing. They helped us set up the system and provided excellent training.",
    name: "Michael Brown",
    role: "Farm Operations Director, Iowa",
  },
];

export default Index;
