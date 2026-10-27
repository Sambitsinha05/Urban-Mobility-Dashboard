import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { CorridorSegment, Incident, TransitLine, DistrictBoundary } from '../types';
import { DISTRICT_BOUNDARIES } from '../data/mockData';
import { 
  Layers, 
  Flame, 
  Navigation, 
  Bus, 
  AlertTriangle, 
  Wind, 
  X, 
  Sliders, 
  Gauge, 
  Activity,
  Zap,
  CheckCircle2,
  Maximize2,
  RefreshCw,
  Plus,
  Minus,
  RotateCcw
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface GISMapProps {
  corridors: CorridorSegment[];
  incidents: Incident[];
  transitLines: TransitLine[];
  selectedCorridorId?: string | null;
  onSelectCorridorForSimulation?: (corridorId: string) => void;
}

export const GISMapView: React.FC<GISMapProps> = ({ 
  corridors, 
  incidents, 
  transitLines,
  selectedCorridorId,
  onSelectCorridorForSimulation 
}) => {
  const { currentCity } = useAuth();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Active Map Layer Toggles
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showFlows, setShowFlows] = useState(true);
  const [showTransit, setShowTransit] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showAirQuality, setShowAirQuality] = useState(false);

  // Selected Corridor for Inspector Drawer
  const [selectedCorridor, setSelectedCorridor] = useState<CorridorSegment | null>(() => {
    if (selectedCorridorId) {
      return corridors.find(c => c.id === selectedCorridorId) || corridors[0];
    }
    return corridors[0];
  });

  // Policy Intervention Simulation Modal State
  const [showInterventionDrawer, setShowInterventionDrawer] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState<'bus_lane' | 'toll' | 'signal' | 'bike_highway'>('bus_lane');

  useEffect(() => {
    if (selectedCorridorId) {
      const found = corridors.find(c => c.id === selectedCorridorId);
      if (found) setSelectedCorridor(found);
    }
  }, [selectedCorridorId, corridors]);

  // Leaflet Map Initialization & Re-rendering
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up existing map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet Map centered at Metropolis Core [40.7306, -73.9352]
    const map = L.map(mapContainerRef.current, {
      center: [40.7420, -73.9780],
      zoom: 12,
      zoomControl: false, // Custom styled zoom controls
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // CartoDB Dark Matter Basemap Tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    // Layer Group 1: District Boundaries & Labels
    DISTRICT_BOUNDARIES.forEach(district => {
      const polygon = L.polygon(district.polygon as [number, number][], {
        color: '#06b6d4',
        weight: 1.5,
        dashArray: '6,6',
        fillColor: '#06b6d4',
        fillOpacity: 0.06
      }).addTo(map);

      // District Permanent Tooltip Text Label
      polygon.bindTooltip(`<strong>${district.name}</strong>`, {
        permanent: true,
        direction: 'center',
        className: 'district-map-label'
      });

      // Air Quality Overlay if enabled
      if (showAirQuality) {
        L.circleMarker(district.center, {
          radius: 18,
          color: district.aqi > 100 ? '#f59e0b' : '#10b981',
          fillColor: district.aqi > 100 ? '#f59e0b' : '#10b981',
          fillOpacity: 0.35,
          weight: 2
        }).addTo(map).bindPopup(`
          <div style="color: #f8fafc; font-family: sans-serif;">
            <div style="font-weight: bold; font-size: 14px;">${district.name} AQI</div>
            <div style="font-size: 16px; color: ${district.aqi > 100 ? '#fbbf24' : '#34d399'}; font-weight: 800; margin-top: 4px;">${district.aqi} (${district.aqiStatus})</div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Synthetic Air Quality Telemetry</div>
          </div>
        `);
      }
    });

    // Layer Group 2: Heatmap Overlay circles if enabled
    if (showHeatmap) {
      corridors.filter(c => c.congestionLevel === 'severe' || c.congestionLevel === 'gridlock').forEach(c => {
        const center = c.coordinates[Math.floor(c.coordinates.length / 2)];
        L.circle(center, {
          radius: 450,
          color: '#ef4444',
          fillColor: '#ef4444',
          fillOpacity: 0.28,
          weight: 0
        }).addTo(map);
      });
    }

    // Layer Group 3: Corridors Polylines with Speed Color-Coding
    corridors.forEach(c => {
      const isSelected = selectedCorridor?.id === c.id;
      let lineColor = '#10b981'; // Green: Free Flow
      if (c.currentAvgSpeedKmh < 30) lineColor = '#ef4444'; // Red: Severe
      else if (c.currentAvgSpeedKmh <= 50) lineColor = '#f59e0b'; // Yellow: Moderate

      const polyline = L.polyline(c.coordinates, {
        color: isSelected ? '#06b6d4' : lineColor,
        weight: isSelected ? 10 : 7,
        opacity: isSelected ? 1 : 0.85,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Polyline Tooltip
      polyline.bindTooltip(`
        <strong>${c.name}</strong><br/>
        Speed: ${c.currentAvgSpeedKmh} km/h · Score: ${c.congestionScore}/100
      `, { sticky: true });

      // Click event to select corridor
      polyline.on('click', () => {
        setSelectedCorridor(c);
      });
    });

    // Layer Group 4: Public Transit Routes & Stops if enabled
    if (showTransit) {
      transitLines.forEach(line => {
        L.polyline(line.routes, {
          color: line.color,
          weight: 4,
          dashArray: '8,6',
          opacity: 0.9
        }).addTo(map).bindPopup(`
          <div style="color: #f8fafc; font-family: sans-serif;">
            <div style="font-weight: bold; font-size: 14px; color: ${line.color};">${line.name} (${line.code})</div>
            <div style="font-size: 12px; margin-top: 4px;">Route: Downtown → Terminus</div>
            <div style="font-size: 12px;">Frequency: ${line.frequencyMins} min | Active Fleet: ${line.activeVehicles} vehicles</div>
            <div style="font-size: 12px; color: #34d399; font-weight: bold; margin-top: 4px;">On-Time Performance: ${line.onTimePerformancePercent}%</div>
          </div>
        `);

        // Transit Stops Markers
        line.stops.forEach(stop => {
          L.circleMarker(stop.coordinates, {
            radius: 5,
            color: line.color,
            fillColor: '#ffffff',
            fillOpacity: 1,
            weight: 2
          }).addTo(map).bindPopup(`
            <div style="color: #f8fafc; font-family: sans-serif;">
              <div style="font-weight: bold; font-size: 13px;">🚏 ${stop.name}</div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Routes: ${stop.routes.join(', ')}</div>
            </div>
          `);
        });
      });
    }

    // Layer Group 5: Active Incidents Markers if enabled
    if (showIncidents) {
      incidents.forEach(inc => {
        const incidentIcon = L.divIcon({
          className: 'custom-incident-marker',
          html: `<div style="background: #ef4444; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 14px; border: 2px solid #fff; box-shadow: 0 0 12px rgba(239,68,68,0.8); animate: pulse 1.5s infinite;">⚠️</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        L.marker(inc.coordinates, { icon: incidentIcon }).addTo(map).bindPopup(`
          <div style="color: #f8fafc; font-family: sans-serif; min-width: 200px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-weight: bold; font-size: 14px; color: #ef4444;">${inc.title}</span>
              <span style="font-size: 10px; background: rgba(239,68,68,0.2); color: #f87171; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${inc.severity.toUpperCase()}</span>
            </div>
            <div style="font-size: 12px; color: #cbd5e1; margin-bottom: 6px;">📍 ${inc.locationName}</div>
            <div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">Started: ${inc.reportedTime} | Est. Clearance: ${inc.estimatedResolutionTime}</div>
            <div style="font-size: 11px; color: #f87171; font-weight: bold;">+${inc.delayImpactMinutes}m Delay Impact</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 6px; font-style: italic;">Simulated Telemetry</div>
          </div>
        `);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [corridors, incidents, transitLines, showHeatmap, showTransit, showIncidents, showAirQuality, selectedCorridor]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([40.7420, -73.9780], 12);
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: 'calc(100vh - 110px)' }}>
      
      {/* 13. MAP LAYER TOGGLE BUTTONS */}
      <div className="glass-panel" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Layers size={18} color="var(--accent-cyan)" />
          <div>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Metropolis Core GIS Map
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', marginLeft: 8, fontWeight: 700 }}>
              ● TELEMETRY: LIVE (5s)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              border: showHeatmap ? '1px solid var(--accent-rose)' : '1px solid var(--border-color)',
              background: showHeatmap ? 'rgba(239, 68, 68, 0.18)' : 'var(--bg-input)',
              color: showHeatmap ? '#f87171' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Flame size={14} /> Congestion Heatmap
          </button>

          <button
            onClick={() => setShowFlows(!showFlows)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              border: showFlows ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
              background: showFlows ? 'rgba(6, 182, 212, 0.18)' : 'var(--bg-input)',
              color: showFlows ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Navigation size={14} /> Traffic Vector Flow
          </button>

          <button
            onClick={() => setShowTransit(!showTransit)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              border: showTransit ? '1px solid var(--accent-emerald)' : '1px solid var(--border-color)',
              background: showTransit ? 'rgba(16, 185, 129, 0.18)' : 'var(--bg-input)',
              color: showTransit ? '#34d399' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Bus size={14} /> Public Transit Routes
          </button>

          <button
            onClick={() => setShowIncidents(!showIncidents)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              border: showIncidents ? '1px solid var(--accent-amber)' : '1px solid var(--border-color)',
              background: showIncidents ? 'rgba(245, 158, 11, 0.18)' : 'var(--bg-input)',
              color: showIncidents ? '#fbbf24' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <AlertTriangle size={14} /> Active Incidents
          </button>

          <button
            onClick={() => setShowAirQuality(!showAirQuality)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              border: showAirQuality ? '1px solid var(--accent-violet)' : '1px solid var(--border-color)',
              background: showAirQuality ? 'rgba(139, 92, 246, 0.18)' : 'var(--bg-input)',
              color: showAirQuality ? '#a78bfa' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Wind size={14} /> Air Quality (AQI)
          </button>
        </div>
      </div>

      {/* Main Map Container & Right-side Corridor Inspector */}
      <div style={{ flex: 1, position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-color)', display: 'flex' }}>
        
        {/* Leaflet Map Target DOM Div */}
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }} />

        {/* 8. MAP CONTROLS OVERLAY */}
        <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button onClick={handleZoomIn} style={{ width: 34, height: 34, background: 'var(--bg-secondary)', border: '1px solid var(--border-color-light)', borderRadius: 8, color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Zoom In">
            <Plus size={16} />
          </button>
          <button onClick={handleZoomOut} style={{ width: 34, height: 34, background: 'var(--bg-secondary)', border: '1px solid var(--border-color-light)', borderRadius: 8, color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Zoom Out">
            <Minus size={16} />
          </button>
          <button onClick={handleRecenter} style={{ width: 34, height: 34, background: 'var(--bg-secondary)', border: '1px solid var(--border-color-light)', borderRadius: 8, color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Recenter Map">
            <RotateCcw size={16} />
          </button>
        </div>

        {/* 9. TRAFFIC LEGEND OVERLAY */}
        <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 1000, background: 'rgba(7, 10, 18, 0.92)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-color-light)', fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: 6, backdropFilter: 'blur(10px)', width: 220 }}>
          <div style={{ fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            TRAFFIC FLOW SPEED LEGEND
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 14, height: 4, background: '#10b981', borderRadius: 2 }} />
            <span style={{ color: 'var(--text-secondary)' }}>Free Flow (&gt;50 km/h)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 14, height: 4, background: '#f59e0b', borderRadius: 2 }} />
            <span style={{ color: 'var(--text-secondary)' }}>Moderate Delay (30–50 km/h)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 14, height: 4, background: '#ef4444', borderRadius: 2 }} />
            <span style={{ color: 'var(--text-secondary)' }}>Severe Congestion (&lt;30 km/h)</span>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 6, marginTop: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ color: 'var(--text-muted)' }}>⚠️ Red Icon: Active Incident</div>
            <div style={{ color: 'var(--text-muted)' }}>--- Dashed Line: District Boundary</div>
          </div>
        </div>

        {/* 10. CORRIDOR TELEMETRY INSPECTOR DRAWER */}
        {selectedCorridor && (
          <div 
            className="glass-panel"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              bottom: 16,
              width: 360,
              padding: 22,
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)',
              overflowY: 'auto'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  CORRIDOR TELEMETRY INSPECTOR
                </span>
                <button onClick={() => setSelectedCorridor(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                {selectedCorridor.name}
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                District: <strong style={{ color: 'var(--accent-cyan)' }}>{selectedCorridor.district}</strong>
              </div>

              {/* Status Badges */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 18, alignItems: 'center' }}>
                <span className={`status-pill ${selectedCorridor.congestionLevel}`}>
                  {selectedCorridor.congestionLevel.replace('_', ' ').toUpperCase()} LEVEL
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: 20, background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  SCORE: {selectedCorridor.congestionScore ?? 85} / 100
                </span>
              </div>

              {/* Core Telemetry Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                <div style={{ background: 'var(--bg-input)', padding: 12, borderRadius: 10 }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Current Speed</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: selectedCorridor.currentAvgSpeedKmh < 30 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                    {selectedCorridor.currentAvgSpeedKmh} <span style={{ fontSize: '0.75rem' }}>km/h</span>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    Speed Limit: {selectedCorridor.speedLimitKmh} km/h
                  </div>
                </div>

                <div style={{ background: 'var(--bg-input)', padding: 12, borderRadius: 10 }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Delay Index</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                    {selectedCorridor.delayIndex}x
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    Free-Flow: 1.0x baseline
                  </div>
                </div>

                <div style={{ background: 'var(--bg-input)', padding: 12, borderRadius: 10 }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Hourly Volume</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {selectedCorridor.hourlyVolume.toLocaleString()} <span style={{ fontSize: '0.7rem' }}>veh/hr</span>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-input)', padding: 12, borderRadius: 10 }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Capacity Load</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: selectedCorridor.hourlyVolume > selectedCorridor.capacityVehiclesPerHour ? 'var(--accent-rose)' : 'var(--text-primary)' }}>
                    {Math.round((selectedCorridor.hourlyVolume / selectedCorridor.capacityVehiclesPerHour) * 100)}%
                  </div>
                </div>
              </div>

              {/* AQI & Mode Telemetry */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.78rem', marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Air Quality AQI:</span>
                  <strong style={{ color: selectedCorridor.airQualityAQI > 100 ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
                    {selectedCorridor.airQualityAQI} (Unhealthy)
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Dominant Mode:</span>
                  <strong style={{ color: 'var(--accent-cyan)', textTransform: 'capitalize' }}>{selectedCorridor.dominantMode}</strong>
                </div>
              </div>

              {/* Modal Split Breakdown Bars */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                  CORRIDOR MODAL SPLIT DISTRIBUTION
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { mode: 'Car', pct: selectedCorridor.modalSplit?.car ?? 68, color: '#06b6d4' },
                    { mode: 'Bus', pct: selectedCorridor.modalSplit?.bus ?? 15, color: '#3b82f6' },
                    { mode: 'Bike', pct: selectedCorridor.modalSplit?.bike ?? 10, color: '#f59e0b' },
                    { mode: 'Walk', pct: selectedCorridor.modalSplit?.walk ?? 5, color: '#10b981' },
                    { mode: 'Other', pct: selectedCorridor.modalSplit?.other ?? 2, color: '#8b5cf6' }
                  ].map((m, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 2, fontWeight: 600 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{m.mode}</span>
                        <span style={{ color: m.color }}>{m.pct}%</span>
                      </div>
                      <div style={{ width: '100%', height: 4, background: 'var(--bg-input)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${m.pct}%`, height: '100%', background: m.color, borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 12. SIMULATE INTERVENTION BUTTON */}
            <div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px' }}
                onClick={() => setShowInterventionDrawer(true)}
              >
                <Sliders size={16} /> Simulate Intervention on Corridor
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 12. SIMULATE POLICY INTERVENTION DRAWER / MODAL */}
      {showInterventionDrawer && selectedCorridor && (
        <div className="modal-overlay" onClick={() => setShowInterventionDrawer(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 580 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  POLICY INTERVENTION SIMULATION
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                  {selectedCorridor.name}
                </h3>
              </div>
              <button onClick={() => setShowInterventionDrawer(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Intervention Selection Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
              <button 
                className={`btn ${selectedIntervention === 'bus_lane' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '8px' }}
                onClick={() => setSelectedIntervention('bus_lane')}
              >
                🚌 Dedicated Bus Lane
              </button>
              <button 
                className={`btn ${selectedIntervention === 'toll' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '8px' }}
                onClick={() => setSelectedIntervention('toll')}
              >
                💵 Congestion Tolling ($8)
              </button>
              <button 
                className={`btn ${selectedIntervention === 'signal' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '8px' }}
                onClick={() => setSelectedIntervention('signal')}
              >
                🤖 AI Signal Optimization
              </button>
              <button 
                className={`btn ${selectedIntervention === 'bike_highway' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '8px' }}
                onClick={() => setSelectedIntervention('bike_highway')}
              >
                🚲 Bike Superhighway
              </button>
            </div>

            {/* BEFORE vs PROJECTED AFTER Comparison Table */}
            <div style={{ background: 'var(--bg-input)', borderRadius: 12, padding: 18, border: '1px solid var(--border-color)', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  TELEMETRY PROJECTION DELTA
                </span>
                <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                  SIMULATED / PROJECTED
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, textAlign: 'center', fontSize: '0.78rem' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: 10, borderRadius: 8 }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>CURRENT SPEED</div>
                  <div style={{ color: '#f87171', fontWeight: 800, fontSize: '1.1rem' }}>{selectedCorridor.currentAvgSpeedKmh} km/h</div>
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: 10, borderRadius: 8, border: '1px solid #10b981' }}>
                  <div style={{ color: '#34d399', fontSize: '0.65rem', fontWeight: 700 }}>PROJECTED SPEED</div>
                  <div style={{ color: '#34d399', fontWeight: 800, fontSize: '1.1rem' }}>
                    {(selectedCorridor.currentAvgSpeedKmh + (selectedIntervention === 'bus_lane' ? 6.2 : selectedIntervention === 'toll' ? 9.4 : 4.5)).toFixed(1)} km/h
                  </div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: 10, borderRadius: 8 }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>CONGESTION</div>
                  <div style={{ color: '#34d399', fontWeight: 800, fontSize: '1.1rem' }}>
                    -{selectedIntervention === 'toll' ? '24.5%' : '14.8%'}
                  </div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: 10, borderRadius: 8 }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>CO₂ SAVED</div>
                  <div style={{ color: 'var(--accent-amber)', fontWeight: 800, fontSize: '1.1rem' }}>
                    -{selectedIntervention === 'bus_lane' ? '18.2%' : '11.2%'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }}
                onClick={() => {
                  if (onSelectCorridorForSimulation) {
                    onSelectCorridorForSimulation(selectedCorridor.id);
                  }
                  setShowInterventionDrawer(false);
                }}
              >
                Launch Full Scenario Sandbox →
              </button>
              <button className="btn btn-secondary" onClick={() => setShowInterventionDrawer(false)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
