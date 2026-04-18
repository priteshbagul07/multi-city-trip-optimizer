import React, { useState, useEffect } from 'react';
import { getNetworks, saveNetwork, deleteNetwork, solveById } from '../api';
import toast from 'react-hot-toast';

const Sidebar = ({ cities, edges, setCities, setEdges, onSolve, onLoadNetwork }) => {
  const [cityInput, setCityInput] = useState('');
  const [edgeFrom, setEdgeFrom] = useState('');
  const [edgeTo, setEdgeTo] = useState('');
  const [edgeCost, setEdgeCost] = useState('');
  const [networkName, setNetworkName] = useState('');
  const [savedNetworks, setSavedNetworks] = useState([]);
  const [activeTab, setActiveTab] = useState('build');

  useEffect(() => { fetchNetworks(); }, []);

  const fetchNetworks = async () => {
    try {
      const res = await getNetworks();
      setSavedNetworks(res.data);
    } catch { /* silent */ }
  };

  const addCity = () => {
    const name = cityInput.trim();
    if (!name) return;
    if (cities.includes(name)) return toast.error(`"${name}" already added`);
    setCities([...cities, name]);
    setCityInput('');
  };

  const removeCity = (city) => {
    setCities(cities.filter((c) => c !== city));
    setEdges(edges.filter((e) => e.from !== city && e.to !== city));
  };

  const addEdge = () => {
    if (!edgeFrom || !edgeTo || !edgeCost) return toast.error('Please fill From, To, and Cost');
    if (edgeFrom === edgeTo) return toast.error('From and To cities must be different');
    const cost = parseInt(edgeCost);
    if (isNaN(cost) || cost <= 0) return toast.error('Cost must be a positive number');
    const exists = edges.find(
      (e) => (e.from === edgeFrom && e.to === edgeTo) || (e.from === edgeTo && e.to === edgeFrom)
    );
    if (exists) return toast.error('This connection already exists');
    setEdges([...edges, { from: edgeFrom, to: edgeTo, cost }]);
    setEdgeCost('');
  };

  const removeEdge = (index) => setEdges(edges.filter((_, i) => i !== index));

  const handleSave = async () => {
    if (!networkName.trim()) return toast.error('Enter a name for this network');
    if (cities.length < 2) return toast.error('Add at least 2 cities first');
    try {
      await saveNetwork(networkName.trim(), cities, edges);
      toast.success('✅ Network saved to MongoDB!');
      setNetworkName('');
      fetchNetworks();
    } catch { toast.error('Save failed'); }
  };

  const handleLoadNetwork = async (network) => {
    try {
      const res = await solveById(network._id);
      onLoadNetwork(network.cities, network.edges, res.data);
      toast.success(`Loaded: ${network.name}`);
      setActiveTab('build');
    } catch { toast.error('Load failed'); }
  };

  const handleDeleteNetwork = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteNetwork(id);
      setSavedNetworks(savedNetworks.filter((n) => n._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  const loadSample = () => {
    setCities(['Mumbai', 'Pune', 'Nashik', 'Aurangabad', 'Nagpur', 'Solapur']);
    setEdges([
      { from: 'Mumbai', to: 'Pune', cost: 150 },
      { from: 'Mumbai', to: 'Nashik', cost: 167 },
      { from: 'Pune', to: 'Solapur', cost: 246 },
      { from: 'Pune', to: 'Aurangabad', cost: 235 },
      { from: 'Nashik', to: 'Aurangabad', cost: 185 },
      { from: 'Aurangabad', to: 'Nagpur', cost: 500 },
      { from: 'Solapur', to: 'Aurangabad', cost: 285 },
    ]);
    toast.success('📍 Sample Maharashtra network loaded!');
  };

  const clearAll = () => {
    setCities([]);
    setEdges([]);
    toast('Cleared', { icon: '🗑️' });
  };

  return (
    <div className="sidebar">
      {/* Tab switch */}
      <div className="sidebar-tabs">
        <button className={`stab ${activeTab === 'build' ? 'active' : ''}`} onClick={() => setActiveTab('build')}>
          🏗️ Build
        </button>
        <button className={`stab ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>
          💾 Saved {savedNetworks.length > 0 && <span className="stab-badge">{savedNetworks.length}</span>}
        </button>
      </div>

      {activeTab === 'build' && (
        <>
          {/* CITIES SECTION */}
          <div className="sb-section">
            <div className="sb-section-title">
              <span>📍 Cities</span>
              <span className="sb-count">{cities.length} added</span>
            </div>
            <div className="sb-input-row">
              <input
                type="text"
                className="sb-input"
                placeholder="Type city name & press Enter"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCity()}
              />
              <button className="sb-btn-add" onClick={addCity}>Add</button>
            </div>
            {cities.length > 0 && (
              <div className="city-tags">
                {cities.map((city) => (
                  <span key={city} className="city-tag">
                    {city}
                    <button onClick={() => removeCity(city)} title="Remove city">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* CONNECTIONS SECTION */}
          <div className="sb-section">
            <div className="sb-section-title">
              <span>🔗 Connections (Edges)</span>
              <span className="sb-count">{edges.length} added</span>
            </div>
            {cities.length < 2 ? (
              <div className="sb-hint">Add at least 2 cities first</div>
            ) : (
              <>
                <div className="sb-edge-selects">
                  <select className="sb-select" value={edgeFrom} onChange={(e) => setEdgeFrom(e.target.value)}>
                    <option value="">From city...</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <span className="sb-arrow-icon">↔</span>
                  <select className="sb-select" value={edgeTo} onChange={(e) => setEdgeTo(e.target.value)}>
                    <option value="">To city...</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sb-input-row">
                  <input
                    type="number"
                    className="sb-input"
                    placeholder="Distance in km (e.g. 150)"
                    value={edgeCost}
                    onChange={(e) => setEdgeCost(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addEdge()}
                    min="1"
                  />
                  <button className="sb-btn-add" onClick={addEdge}>Add</button>
                </div>
              </>
            )}

            {edges.length > 0 && (
              <div className="edge-list">
                {edges.map((e, i) => (
                  <div key={i} className="edge-item">
                    <span className="edge-from">{e.from}</span>
                    <span className="edge-mid">↔</span>
                    <span className="edge-to">{e.to}</span>
                    <span className="edge-cost">{e.cost} km</span>
                    <button className="edge-del" onClick={() => removeEdge(i)} title="Remove">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="sb-actions">
            <button
              className="sb-btn-solve"
              onClick={onSolve}
              disabled={cities.length < 2}
            >
              ⚡ Run Floyd-Warshall
            </button>
            <button className="sb-btn-sample" onClick={loadSample}>
              📍 Load Sample (Maharashtra)
            </button>
            {(cities.length > 0 || edges.length > 0) && (
              <button className="sb-btn-clear" onClick={clearAll}>
                🗑️ Clear All
              </button>
            )}
          </div>

          {/* SAVE NETWORK */}
          <div className="sb-section">
            <div className="sb-section-title">
              <span>💾 Save to MongoDB</span>
            </div>
            <div className="sb-input-row">
              <input
                type="text"
                className="sb-input"
                placeholder="Give this network a name..."
                value={networkName}
                onChange={(e) => setNetworkName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
              <button className="sb-btn-add" onClick={handleSave}>Save</button>
            </div>
          </div>
        </>
      )}

      {activeTab === 'saved' && (
        <div className="sb-section">
          <div className="sb-section-title">
            <span>💾 Saved Networks</span>
            <span className="sb-count">{savedNetworks.length} total</span>
          </div>
          {savedNetworks.length === 0 ? (
            <div className="sb-hint">No saved networks yet. Build one and save it!</div>
          ) : (
            <div className="saved-list">
              {savedNetworks.map((net) => (
                <div key={net._id} className="saved-item" onClick={() => handleLoadNetwork(net)}>
                  <div className="saved-info">
                    <div className="saved-name">{net.name}</div>
                    <div className="saved-meta">{net.cities.length} cities · {net.edges.length} connections</div>
                  </div>
                  <button
                    className="edge-del"
                    onClick={(e) => handleDeleteNetwork(net._id, e)}
                    title="Delete"
                  >✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
