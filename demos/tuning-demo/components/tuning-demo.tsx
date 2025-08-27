"use client";
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const TuningDemo = () => {
  const [temperature, setTemperature] = useState(1.0);
  const [topP, setTopP] = useState(0.9);
  const [isMounted, setIsMounted] = useState(false);
  const [activeSlider, setActiveSlider] = useState<'temperature' | 'topP'>('temperature');

  // Ensure consistent initial state between server and client
  useEffect(() => {
    setTemperature(1.0);
    setTopP(0.9);
    setIsMounted(true);
  }, []);

  // Keyboard event handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      
      if (activeSlider === 'temperature') {
        const step = 0.1;
        const min = 0.1;
        const max = 1.0;
        
        setTemperature(prev => {
          const newValue = event.key === 'ArrowLeft' 
            ? Math.max(min, prev - step)
            : Math.min(max, prev + step);
          return Math.round(newValue * 10) / 10; // Round to 1 decimal place
        });
      } else if (activeSlider === 'topP') {
        const step = 0.05;
        const min = 0;
        const max = 1;
        
        setTopP(prev => {
          const newValue = event.key === 'ArrowLeft' 
            ? Math.max(min, prev - step)
            : Math.min(max, prev + step);
          return Math.round(newValue * 20) / 20; // Round to 0.05 precision
        });
      }
    } else if (event.key === 'Tab') {
      // Switch between sliders with Tab key
      event.preventDefault();
      setActiveSlider(prev => prev === 'temperature' ? 'topP' : 'temperature');
    }
  }, [activeSlider]);

  // Add and remove event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Initial probabilities for colors with more precise values
  const baseColors = [
    { name: 'autumn', probability: 0.3145 },
    { name: 'breeze', probability: 0.2532 },
    { name: 'garden', probability: 0.1987 },
    { name: 'water', probability: 0.1488 }
  ];

  // Calculate adjusted probabilities based on temperature
  const temperatureData = useMemo(() => {
    const adjustProbability = (prob: number) => {
      const adjusted = Math.pow(prob, 1 / temperature);
      return adjusted;
    };

    const adjustedProbs = baseColors.map(color => ({
      ...color,
      adjustedProb: adjustProbability(color.probability)
    }));

    const sum = adjustedProbs.reduce((acc, curr) => acc + curr.adjustedProb, 0);
    return adjustedProbs.map(color => ({
      name: color.name,
      'Original Probability': color.probability,
      'Adjusted Probability': color.adjustedProb / sum
    }));
  }, [baseColors, temperature]);

  // Calculate top-p selection
  const topPData = useMemo(() => {
    const sortedColors = [...baseColors].sort((a, b) => b.probability - a.probability);
    let cumulativeSum = 0;
    
    return sortedColors.map(color => {
      cumulativeSum += color.probability;
      return {
        ...color,
        cumulativeSum,
        included: cumulativeSum <= topP
      };
    });
  }, [topP]);

  if (!isMounted) {
    return null; // Render nothing on the server
  }

  return (
    <div className="space-y-8">
      {/* Keyboard controls info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <p className="font-medium text-blue-800 mb-1">Keyboard Controls:</p>
        <p className="text-blue-700">
          ← → Arrow keys: Adjust {activeSlider === 'temperature' ? 'Temperature' : 'Top-p'} • 
          Tab: Switch between sliders • 
          Currently controlling: <span className="font-semibold">{activeSlider === 'temperature' ? 'Temperature' : 'Top-p'}</span>
        </p>
      </div>

      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className={activeSlider === 'temperature' ? 'text-green-600' : ''}>
            Temperature Effects on Token Probabilities {activeSlider === 'temperature' ? '← Active' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div 
              className={`bg-slate-50 p-4 rounded-lg border-2 ${activeSlider === 'temperature' ? 'border-green-400 bg-green-50' : 'border-transparent'}`}
              onClick={() => setActiveSlider('temperature')}
            >
              <p className="text-lg font-medium mb-2">Prompt: "The leaves fall in the..."</p>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Temperature: {temperature.toFixed(1)}
                </label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1.0" 
                  step="0.1" 
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  onFocus={() => setActiveSlider('temperature')}
                  className="w-full"
                />
              </div>
              <div className="text-sm bg-white p-3 rounded border">
                <p className="font-medium">Formula (simplified):</p>
                <p>1. Take original probability (p)</p>
                <p>2. Adjust: p' = p^(1/temperature)</p>
                <p>3. Normalize results to sum to 1</p>
              </div>
            </div>

            <BarChart
              width={700}
              height={400}
              data={temperatureData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="Original Probability" 
                fill="#3b82f6" 
                animationDuration={300} 
              />
              <Bar 
                dataKey="Adjusted Probability" 
                fill="#22c55e" 
                animationDuration={300} 
              />
            </BarChart>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className={activeSlider === 'topP' ? 'text-green-600' : ''}>
            Top-p (Nucleus) Sampling {activeSlider === 'topP' ? '← Active' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div 
              className={`bg-slate-50 p-4 rounded-lg border-2 ${activeSlider === 'topP' ? 'border-green-400 bg-green-50' : 'border-transparent'}`}
              onClick={() => setActiveSlider('topP')}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Top-p threshold: {topP.toFixed(2)}
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05" 
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                  onFocus={() => setActiveSlider('topP')}
                  className="w-full"
                />
              </div>
              <div className="text-sm bg-white p-3 rounded border">
                <p className="font-medium">How it works:</p>
                <p>Tokens are selected if their cumulative probability ≤ top-p threshold</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-2 text-left">Color</th>
                    <th className="p-2 text-right">Probability</th>
                    <th className="p-2 text-right">Cumulative Sum</th>
                  </tr>
                </thead>
                <tbody>
                  {topPData.map((color) => (
                    <tr 
                      key={color.name}
                      className={color.included ? '' : 'bg-red-400 text-white'}
                    >
                      <td className="p-2">{color.name}</td>
                      <td className="p-2 text-right">{color.probability.toFixed(4)}</td>
                      <td className="p-2 text-right">{color.cumulativeSum.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TuningDemo;