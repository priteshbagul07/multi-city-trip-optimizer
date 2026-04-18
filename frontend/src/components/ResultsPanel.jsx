import React, { useState } from 'react';

const ResultsPanel = ({ results, cities, distMatrix, steps, onSelectPath }) => {
  const [activeTab, setActiveTab] = useState('paths');
  const [activePath, setActivePath] = useState(null);

  if (!results) {
    return (
      <div className="results-panel results-empty">
        <span>⚡ Run Floyd-Warshall to see shortest paths between all city pairs</span>
      </div>
    );
  }

  const handleCardClick = (r) => {
    if (!r.cost) return;
    setActivePath(r);
    onSelectPath(r.path);
  };

  const clearPath = () => {
    setActivePath(null);
    onSelectPath([]);
  };

  return (
    <div className="results-panel">
      {/* Tab bar + active path info */}
      <div className="results-header">
        <div className="tabs">
          <button className={`tab ${activeTab === 'paths' ? 'active' : ''}`} onClick={() => setActiveTab('paths')}>
            All Shortest Paths
          </button>
          <button className={`tab ${activeTab === 'matrix' ? 'active' : ''}`} onClick={() => setActiveTab('matrix')}>
            Distance Matrix
          </button>
          <button className={`tab ${activeTab === 'steps' ? 'active' : ''}`} onClick={() => setActiveTab('steps')}>
            Algorithm Steps ({steps.length})
          </button>
        </div>

        {activePath && (
          <div className="path-info-bar">
            <span className="path-route">
              📍 {activePath.from} <span className="path-arrow">→</span> {activePath.to}
            </span>
            <span className="path-cost-label">Shortest Distance: <strong>{activePath.cost} km</strong></span>
            <span className="path-stops">Via: {activePath.path.join(' → ')}</span>
            <button className="clear-path-btn" onClick={clearPath}>✕ Clear</button>
          </div>
        )}
      </div>

      {/* ALL PATHS */}
      {activeTab === 'paths' && (
        <div className="results-scroll">
          {results.map((r, i) => (
            <div
              key={i}
              className={`result-card ${!r.cost ? 'unreachable' : ''} ${activePath === r ? 'active' : ''}`}
              onClick={() => handleCardClick(r)}
              title={r.cost ? `Click to highlight path on graph` : 'No route exists'}
            >
              <div className="rc-header">
                <span className="rc-city">{r.from}</span>
                <span className="rc-arrow">→</span>
                <span className="rc-city">{r.to}</span>
              </div>
              <div className="rc-cost">
                {r.cost !== null ? `${r.cost} km` : '∞  No Route'}
              </div>
              {r.path.length > 1 && (
                <div className="rc-path">
                  {r.path.length === 2 ? '✅ Direct' : `🔀 Via ${r.path.slice(1, -1).join(', ')}`}
                </div>
              )}
              {r.cost && <div className="rc-hint">Click to highlight ↗</div>}
            </div>
          ))}
        </div>
      )}

      {/* DISTANCE MATRIX */}
      {activeTab === 'matrix' && distMatrix && (
        <div className="matrix-wrapper">
          <div className="matrix-note">
            📊 All-pairs shortest distances (in km). <strong>0</strong> = same city, <strong>∞</strong> = unreachable
          </div>
          <div className="matrix-scroll">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th className="matrix-corner">From ↓ / To →</th>
                  {cities.map((c) => <th key={c}>{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {cities.map((row, i) => (
                  <tr key={row}>
                    <th>{row}</th>
                    {cities.map((col, j) => {
                      const val = distMatrix[i][j];
                      const isInf = val === null || val === undefined || val > 1e9;
                      const isZero = val === 0;
                      return (
                        <td key={col} className={isZero ? 'cell-zero' : isInf ? 'cell-inf' : 'cell-val'}>
                          {isZero ? '—' : isInf ? '∞' : `${val}`}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ALGORITHM STEPS */}
      {activeTab === 'steps' && (
        <div className="steps-wrapper">
          <div className="steps-note">
            🔁 Floyd-Warshall relaxation steps — each line shows when a shorter path was discovered via an intermediate city
          </div>
          <div className="algo-steps">
            {steps.length === 0 && (
              <div className="step-empty">No relaxations needed — all direct connections are already optimal.</div>
            )}
            {steps.map((s, i) => (
              <div key={i} className="algo-step">
                <span className="step-num">{i + 1}</span>
                <span className="step-text">
                  <span className="step-city">{s.from}</span>
                  <span className="step-op"> → </span>
                  <span className="step-city">{s.to}</span>
                  <span className="step-op"> updated via </span>
                  <span className="step-via">{s.via}</span>
                  <span className="step-op"> → new cost: </span>
                  <span className="step-cost">{s.newCost} km</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
