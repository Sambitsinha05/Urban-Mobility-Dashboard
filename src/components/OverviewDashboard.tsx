import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CorridorSegment, Incident } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Gauge, 
  Bus, 
  Leaf, 
  AlertTriangle, 
  ArrowRight,
  ShieldAlert,
  Zap,
  Clock,
  Car,
  Info,
  Layers,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { HOURLY_TRAFFIC_DATA } from '../data/mockData';
import { 
  calculateNetworkCongestionIndex, 
  calculateNetworkSpeedMetrics, 
  calculateNetworkEmissions, 
  generateDynamicMobilityInsight 
} from '../utils/mobilityMath';

interface OverviewProps {
  corridors: CorridorSegment[];
  incidents: Incident[];
  onNavigateView: (view: 'gis_map' | 'analytics' | 'incidents' | 'simulation' | 'reports') => void;
  onSelectCorridor?: (corridorId: string) => void;
}

export const OverviewDashboard: React.FC<OverviewProps> = ({ 
  corridors, 
  incidents, 
  onNavigateView,
  onSelectCorridor 
}) => {
  const { currentCity } = useAuth();
  const [hoveredHour, setHoveredHour] = useState<typeof HOURLY_TRAFFIC_DATA[0] | null>(null);

  // Unified Math Calculations
  const networkCongestion = calculateNetworkCongestionIndex(corridors);
  const { avgSpeed, speedDropPct } = calculateNetworkSpeedMetrics(corridors);
  const totalEmissionsTons = calculateNetworkEmissions(corridors);
  const mobilityInsightText = generateDynamicMobilityInsight(corridors, incidents);

  // Worst-performing corridors sorted by congestionScore / delayIndex
  const sortedCorridors = [...corridors].sort((a, b) => (b.congestionScore ?? 0) - (a.congestionScore ?? 0));

  const handleCorridorClick = (corridorId: string) => {
    if (onSelectCorridor) {
      onSelectCorridor(corridorId);
    }
    onNavigateView('gis_map');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* 1. HERO / HEADER SECTION */}
      <div className="glass-panel" style={{ padding: 24, background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(15, 23, 42, 0.85))', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span className="live-beacon" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', letterSpacing: '0.05em' }}>
              ● LIVE SIMULATION · Refresh: 5s
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              | {currentCity.name} Synthetic Telemetry
            </span>
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            City Mobility Operations Center
          </h1>
          
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 4, maxWidth: 680, lineHeight: 1.4 }}>
            "Live mobility telemetry simulation, corridor performance monitoring, and data-driven transport planning."
          </p>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>
            ℹ️ Simulated/synthetic traffic telemetry updating dynamically every 5 seconds.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary"
            onClick={() => onNavigateView('simulation')}
          >
            <Zap size={16} /> Run "What-If" Simulation
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => onNavigateView('gis_map')}
          >
            Inspect Spatial GIS Map <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 2. FOUR PRIMARY KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        
        {/* CARD 1: Network Congestion Index */}
        <div className="glass-panel glass-panel-interactive" style={{ padding: 20 }} title="Composite indicator of network congestion based on speed, delay, and capacity utilization.">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              NETWORK CONGESTION INDEX
            </span>
            <div style={{ padding: 8, borderRadius: 8, background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-rose)' }}>
              <Activity size={18} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              {networkCongestion.score}
            </div>
            <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
            <span className={`status-pill ${networkCongestion.status.toLowerCase()}`}>
              {networkCongestion.status}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-rose)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <TrendingUp size={12} /> +4.2% vs prev period
            </span>
          </div>
        </div>

        {/* CARD 2: Average Network Speed */}
        <div className="glass-panel glass-panel-interactive" style={{ padding: 20 }} title="Average vehicle speed across monitored road corridors.">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              AVERAGE NETWORK SPEED
            </span>
            <div style={{ padding: 8, borderRadius: 8, background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <Gauge size={18} />
            </div>
          </div>

          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            {avgSpeed} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>km/h</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, fontSize: '0.72rem' }}>
            <span style={{ color: 'var(--accent-rose)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <TrendingDown size={12} /> ↓ {speedDropPct}% vs free-flow
            </span>
            <span style={{ color: 'var(--text-muted)' }}>Free-flow: 64 km/h</span>
          </div>
        </div>

        {/* CARD 3: Transit On-Time Rate */}
        <div className="glass-panel glass-panel-interactive" style={{ padding: 20 }} title="Percentage of monitored public transit trips operating within the defined on-time threshold.">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              TRANSIT ON-TIME RATE
            </span>
            <div style={{ padding: 8, borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
              <Bus size={18} />
            </div>
          </div>

          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            88.5<span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 500 }}>%</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, fontSize: '0.72rem' }}>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <TrendingUp size={12} /> +1.8% vs prev period
            </span>
            <span style={{ color: 'var(--text-muted)' }}>Threshold: ±3 mins</span>
          </div>
        </div>

        {/* CARD 4: Estimated CO2 Emissions */}
        <div className="glass-panel glass-panel-interactive" style={{ padding: 20 }} title="Estimated transportation-related CO₂ emissions based on synthetic traffic and modal data.">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              ESTIMATED CO₂ EMISSIONS
            </span>
            <div style={{ padding: 8, borderRadius: 8, background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
              <Leaf size={18} />
            </div>
          </div>

          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            {totalEmissionsTons} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>t/hr</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, fontSize: '0.72rem' }}>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <TrendingDown size={12} /> ↓ 3.4% vs prev period
            </span>
            <span style={{ color: 'var(--text-muted)' }}>Estimated</span>
          </div>
        </div>

      </div>

      {/* 3. COMPACT NETWORK STATUS HORIZONTAL SCALE BAR */}
      <div className="glass-panel" style={{ padding: 18, background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              NETWORK STATUS:
            </span>
            <span className={`status-pill ${networkCongestion.status.toLowerCase()}`}>
              ● {networkCongestion.status} CONGESTION
            </span>
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Current Index: <span style={{ color: 'var(--accent-rose)' }}>{networkCongestion.score} / 100</span>
          </div>
        </div>

        {/* Horizontal Status Scale Line */}
        <div style={{ position: 'relative', width: '100%', height: 10, background: 'var(--bg-input)', borderRadius: 5, overflow: 'visible', margin: '14px 0 20px 0' }}>
          {/* Scale Segments */}
          <div style={{ display: 'flex', width: '100%', height: '100%', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ width: '30%', background: 'linear-gradient(90deg, #10b981, #34d399)' }} title="Free Flow (0 - 30)" />
            <div style={{ width: '35%', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} title="Moderate (31 - 65)" />
            <div style={{ width: '35%', background: 'linear-gradient(90deg, #ef4444, #dc2626)' }} title="Severe (66 - 100)" />
          </div>

          {/* Current Score Pin Indicator */}
          <div 
            style={{ 
              position: 'absolute', 
              top: -6, 
              left: `${networkCongestion.score}%`, 
              transform: 'translateX(-50%)', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              transition: 'left 0.5s ease'
            }}
          >
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#ffffff', border: '3px solid var(--accent-rose)', boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)' }} />
          </div>
        </div>

        {/* Scale Labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          <span>0 (Free-Flow)</span>
          <span style={{ color: '#34d399' }}>30 (Moderate)</span>
          <span style={{ color: '#fbbf24' }}>65 (Heavy)</span>
          <span style={{ color: '#f87171' }}>100 (Severe)</span>
        </div>
      </div>

      {/* 4. MAIN GRID: 24-HOUR TRAFFIC + SPEED CHART & COMMUTER MODAL SPLIT */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        
        {/* 24-HOUR TRAFFIC VOLUME & SPEED PROFILE */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                24-Hour Traffic Volume & Speed Profile
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Bars = Vehicle Volume (veh/hr) · Line = Average Speed (km/h)
              </p>
            </div>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => onNavigateView('analytics')}>
              Detailed Trends
            </button>
          </div>

          {/* Interactive Dual-Axis Chart Canvas */}
          <div style={{ height: 230, position: 'relative', width: '100%', display: 'flex', alignItems: 'flex-end', gap: 8, paddingBottom: 26, borderBottom: '1px solid var(--border-color)' }}>
            
            {/* Shaded Background Highlights for Morning Peak (07:00-09:00) & Evening Peak (17:00-19:00) */}
            <div style={{ position: 'absolute', top: 0, bottom: 26, left: '32%', width: '12%', background: 'rgba(239, 68, 68, 0.08)', borderLeft: '1px dashed rgba(239, 68, 68, 0.4)', borderRight: '1px dashed rgba(239, 68, 68, 0.4)', pointerEvents: 'none' }}>
              <span style={{ position: 'absolute', top: 4, left: 4, fontSize: '0.62rem', color: 'var(--accent-rose)', fontWeight: 700 }}>MORNING PEAK</span>
            </div>
            <div style={{ position: 'absolute', top: 0, bottom: 26, left: '73%', width: '12%', background: 'rgba(239, 68, 68, 0.08)', borderLeft: '1px dashed rgba(239, 68, 68, 0.4)', borderRight: '1px dashed rgba(239, 68, 68, 0.4)', pointerEvents: 'none' }}>
              <span style={{ position: 'absolute', top: 4, left: 4, fontSize: '0.62rem', color: 'var(--accent-rose)', fontWeight: 700 }}>EVENING PEAK</span>
            </div>

            {HOURLY_TRAFFIC_DATA.map((d, i) => {
              const maxVol = 10000;
              const heightPct = (d.volume / maxVol) * 100;
              const isPeak = d.isPeak;

              return (
                <div 
                  key={i} 
                  onMouseEnter={() => setHoveredHour(d)}
                  onMouseLeave={() => setHoveredHour(null)}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end', position: 'relative', cursor: 'pointer', zIndex: 5 }}
                >
                  {/* Speed Point Indicator */}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      bottom: `${(d.avgSpeed / 70) * 100}%`, 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      background: '#38bdf8', 
                      boxShadow: '0 0 8px #38bdf8',
                      zIndex: 10 
                    }} 
                  />

                  {/* Volume Bar */}
                  <div 
                    style={{ 
                      width: '80%', 
                      height: `${heightPct}%`, 
                      background: isPeak 
                        ? 'linear-gradient(180deg, var(--accent-rose), #9f1239)' 
                        : 'linear-gradient(180deg, var(--accent-cyan), #0284c7)', 
                      borderRadius: '4px 4px 0 0',
                      transition: 'all 0.2s ease',
                      opacity: hoveredHour && hoveredHour.time !== d.time ? 0.4 : 1
                    }} 
                  />
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>{d.time}</span>
                </div>
              );
            })}
          </div>

          {/* Interactive Hover Tooltip Box */}
          {hoveredHour ? (
            <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <div><strong>Time: {hoveredHour.time}</strong> {hoveredHour.label ? `(${hoveredHour.label})` : ''}</div>
              <div style={{ color: 'var(--accent-cyan)' }}>Volume: <strong>{hoveredHour.volume.toLocaleString()} veh/hr</strong></div>
              <div style={{ color: '#38bdf8' }}>Avg Speed: <strong>{hoveredHour.avgSpeed} km/h</strong></div>
              <span className={`status-pill ${hoveredHour.avgSpeed < 30 ? 'severe' : 'moderate'}`}>
                {hoveredHour.avgSpeed < 30 ? 'Severe Congestion' : 'Moderate Flow'}
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 14, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--accent-cyan)' }} />
                <span>Off-Peak Volume</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--accent-rose)' }} />
                <span>Peak Volume (Rush Hour)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8' }} />
                <span>Average Speed Line (km/h)</span>
              </div>
            </div>
          )}
        </div>

        {/* 5. COMMUTER MODAL SPLIT */}
        <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Commuter Modal Split
              </h3>
            </div>

            {/* Calculated Summary Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: 8, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>PRIVATE VEHICLE SHARE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>48%</div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: 8, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>PUBLIC TRANSIT SHARE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>42%</div>
              </div>
            </div>

            {/* Horizontal Bar Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { mode: 'Private Passenger Vehicle', pct: 48, color: '#06b6d4', icon: <Car size={14} /> },
                { mode: 'Bus Rapid Transit (BRT)', pct: 24, color: '#3b82f6', icon: <Bus size={14} /> },
                { mode: 'Subway & Light Rail', pct: 18, color: '#10b981', icon: <Activity size={14} /> },
                { mode: 'Micro-Mobility / Cycling', pct: 7, color: '#f59e0b', icon: <Zap size={14} /> },
                { mode: 'Pedestrian Walkway', pct: 3, color: '#8b5cf6', icon: <Leaf size={14} /> }
              ].map((item, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 4, fontWeight: 600 }}>
                    <span style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {item.icon} {item.mode}
                    </span>
                    <span style={{ color: item.color }}>{item.pct}%</span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'var(--bg-input)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 16, padding: 10, borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            💡 <strong>Analytical Insight:</strong> Private vehicles account for the largest share of commuter trips (48%).
          </div>
        </div>

      </div>

      {/* 6. BOTTOM GRID: TOP CONGESTED CORRIDORS & ACTIVE INCIDENT SUMMARY */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        
        {/* TOP CONGESTED CORRIDORS */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldAlert size={18} color="var(--accent-rose)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                TOP CONGESTED CORRIDORS
              </h3>
            </div>
            <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => onNavigateView('gis_map')}>
              Inspect on GIS Map →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sortedCorridors.slice(0, 4).map((c, idx) => (
              <div 
                key={c.id} 
                className="glass-panel glass-panel-interactive" 
                style={{ padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => handleCorridorClick(c.id)}
                title="Click to highlight corridor on GIS Spatial Map"
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {c.name} <ChevronRight size={14} color="var(--accent-cyan)" />
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    Speed: <strong>{c.currentAvgSpeedKmh} km/h</strong> · Capacity: <strong>{Math.round((c.hourlyVolume / c.capacityVehiclesPerHour) * 100)}%</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--accent-rose)' }}>
                      {c.congestionScore ?? 85} / 100
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      Delay: {c.delayIndex}x
                    </div>
                  </div>
                  <span className={`status-pill ${c.congestionLevel}`}>
                    {c.congestionLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVE INCIDENT SUMMARY */}
        <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={18} color="var(--accent-amber)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ACTIVE INCIDENTS
                </h3>
              </div>
              <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', fontWeight: 700 }}>
                SIMULATED TELEMETRY
              </span>
            </div>

            {/* Severity Counter Pill Summary */}
            <div style={{ display: 'flex', gap: 8, fontSize: '0.72rem', fontWeight: 700, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
                1 High Severity
              </span>
              <span style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                1 Medium Severity
              </span>
              <span style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                8 Resolved Today
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {incidents.slice(0, 2).map(inc => (
                <div 
                  key={inc.id}
                  style={{ background: 'var(--bg-input)', borderRadius: 10, padding: 12, borderLeft: '3px solid var(--accent-rose)', cursor: 'pointer' }}
                  onClick={() => onNavigateView('incidents')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    <span>● {inc.title}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-rose)' }}>{inc.severity.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <span>📍 {inc.locationName}</span>
                    <span><Clock size={10} style={{ display: 'inline' }} /> {inc.reportedTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', marginTop: 14, fontSize: '0.78rem' }}
            onClick={() => onNavigateView('incidents')}
          >
            Manage Incidents & Dispatch →
          </button>
        </div>

      </div>

      {/* 7. KEY MOBILITY INSIGHT SECTION */}
      <div className="glass-panel" style={{ padding: 24, background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(15, 23, 42, 0.8))', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-violet)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
              KEY MOBILITY INSIGHT
            </div>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: 850, lineHeight: 1.5 }}>
              "{mobilityInsightText}"
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => onNavigateView('gis_map')}>
              Investigate Corridors →
            </button>
            <button className="btn btn-primary" onClick={() => onNavigateView('simulation')}>
              <Zap size={15} /> Run What-If Simulation
            </button>
          </div>
        </div>
      </div>

      {/* 8. DATA TIMESTAMP / CONTEXT FOOTER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-input)', borderRadius: 10, border: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <div>
          Data Period: <strong style={{ color: 'var(--text-primary)' }}>Last 24 Hours Aggregated</strong>
        </div>
        <div>
          Telemetry: <strong style={{ color: 'var(--accent-emerald)' }}>● Simulated Live · 5s Refresh</strong>
        </div>
        <div>
          Last Updated: <strong style={{ color: 'var(--text-primary)' }}>{new Date().toLocaleTimeString()}</strong>
        </div>
      </div>

    </div>
  );
};
