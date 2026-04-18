import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import GraphCanvas from './components/GraphCanvas';
import ResultsPanel from './components/ResultsPanel';
import { solveNetwork } from './api';
import './styles/global.css';

function App() {
  const [cities, setCities] = useState([]);
  const [edges, setEdges] = useState([]);
  const [results, setResults] = useState(null);
  const [distMatrix, setDistMatrix] = useState(null);
  const [steps, setSteps] = useState([]);
  const [highlightPath, setHighlightPath] = useState([]);
  const [solving, setSolving] = useState(false);

  const handleSolve = async () => {
    if (cities.length < 2) return toast.error('Add at least 2 cities');
    setSolving(true);
    try {
      const res = await solveNetwork(cities, edges);
      setResults(res.data.result);
      setDistMatrix(res.data.distMatrix);
      setSteps(res.data.steps);
      setHighlightPath([]);
      const reachable = res.data.result.filter(r => r.cost !== null).length;
      toast.success(`✅ Done! ${reachable} shortest paths found across ${cities.length} cities.`);
    } catch (err) {
      toast.error('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setSolving(false);
    }
  };

  const handleLoadNetwork = (loadedCities, loadedEdges, solveData) => {
    setCities(loadedCities);
    setEdges(loadedEdges);
    setResults(solveData.result);
    setDistMatrix(solveData.distMatrix);
    setSteps(solveData.steps);
    setHighlightPath([]);
  };

  return (
    <div className="app-layout">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1c1c2e',
            color: '#e8e8f2',
            border: '1px solid #2e2e4a',
            fontFamily: 'Syne, sans-serif',
            fontSize: '0.85rem',
          },
          duration: 3000,
        }}
      />

      {/* HEADER */}
      <header className="header">
        <div className="header-logo">Route<span>Forge</span></div>
        <div className="header-badge">Floyd-Warshall · O(V³)</div>
        <div className="header-right">
          {solving ? '⚡ Computing...' : 'Multi-City Trip Optimizer · DAA Mini Project'}
        </div>
      </header>

      {/* SIDEBAR */}
      <Sidebar
        cities={cities}
        edges={edges}
        setCities={setCities}
        setEdges={setEdges}
        onSolve={handleSolve}
        onLoadNetwork={handleLoadNetwork}
      />

      {/* MAIN AREA */}
      <div className="main-area">
        <div className="graph-container">
          <GraphCanvas cities={cities} edges={edges} highlightPath={highlightPath} />

          {/* Stats chips */}
          {cities.length > 0 && (
            <div className="graph-stats">
              <div className="stat-chip">Cities: <span>{cities.length}</span></div>
              <div className="stat-chip">Edges: <span>{edges.length}</span></div>
              {results && <div className="stat-chip">Paths: <span>{results.filter(r => r.cost).length}</span></div>}
            </div>
          )}

          {/* Legend */}
          {cities.length > 0 && (
            <div className="graph-legend">
              🟣 City node<br />
              — Connection<br />
              🔵 Highlighted path<br />
              Scroll to zoom · Drag to pan
            </div>
          )}

          {/* Solving overlay */}
          {solving && (
            <div className="solving-overlay">
              <div className="spinner" />
              <div className="solving-text">Running Floyd-Warshall O(V³)...</div>
            </div>
          )}
        </div>

        <ResultsPanel
          results={results}
          cities={cities}
          distMatrix={distMatrix}
          steps={steps}
          onSelectPath={setHighlightPath}
        />
      </div>
    </div>
  );
}

export default App;
