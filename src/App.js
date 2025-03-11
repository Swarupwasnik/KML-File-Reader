import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { parseKML, getSummary, getDetailed } from './utils/kmlParser';
import './App.css';

function App() {
  const [geoData, setGeoData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [details, setDetails] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const parsed = parseKML(evt.target.result);
      setGeoData(parsed);
    };
    reader.readAsText(file);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>KML File Viewer</h1>
        <div className="file-upload-container">
          <label className="custom-file-upload">
            <input 
              type="file" 
              accept=".kml" 
              onChange={handleFileUpload} 
            />
            <span className="upload-button">
              📁 Upload KML File
            </span>
          </label>
          {fileName && <span className="file-name">{fileName}</span>}
        </div>

        <div className="button-group">
          <button 
            className="action-btn summary-btn"
            onClick={() => setSummary(getSummary(geoData))}
            disabled={!geoData}
          >
            📊 Show Summary
          </button>
          <button 
            className="action-btn detailed-btn"
            onClick={() => setDetails(getDetailed(geoData))}
            disabled={!geoData}
          >
            📏 Show Detailed
          </button>
        </div>
      </div>

      {(summary || details) && (
        <div className="data-tables">
          {summary && (
            <div className="table-container">
              <h2>Element Summary</h2>
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Element Type</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(summary).map(([type, count]) => (
                    <tr key={type}>
                      <td>{type}</td>
                      <td>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {details && (
            <div className="table-container">
              <h2>Line Details</h2>
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Element Type</th>
                    <th>Length (km)</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((item, i) => (
                    <tr key={i}>
                      <td>{item.type}</td>
                      <td>{item.length.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="map-container">
        <MapContainer 
          center={[51.505, -0.09]} 
          zoom={13} 
          className="leaflet-map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {geoData && <GeoJSON data={geoData} />}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;

