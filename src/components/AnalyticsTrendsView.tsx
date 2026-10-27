import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CorridorSegment, OriginDestinationFlow } from '../types';
import { ORIGIN_DESTINATION_FLOWS, HOURLY_TRAFFIC_DATA } from '../data/mockData';
import { 
  TrendingUp, 
  BarChart3, 
  Clock, 
  Compass, 
  Car, 
  Bus, 
  Leaf, 
  ArrowRight,
  Filter
} from 'lucide-react';

interface AnalyticsProps {
  corridors: CorridorSegment[];
}

export const AnalyticsTrendsView: React.FC<AnalyticsProps> = ({ corridors }) => {
  const { currentCity } = useAuth();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  const filteredCorridors = selectedDistrict === 'all' 
    ? corridors 
    : corridors.filter(c => c.district.toLowerCase().includes(selectedDistrict.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header & Filter Bar */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Transportation Analytics & Commuter Flow Trends
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Statistical analysis of travel time reliability, Origin-Destination matrices, and corridor throughput
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Filter size={16} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Filter District:</span>
          <select
            className="input-field"
            style={{ width: 180, padding: '6px 12px' }}
            value={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
          >
            <option value="all">All City Districts</option>
            <option value="downtown">Downtown Financial</option>
            <option value="port">Port & Cargo Hub</option>
            <option value="innovation">Innovation District</option>
            <option value="suburbs">West Suburbs</option>
          </select>
        </div>
      </div>

      {/* Row 1: Speed Distribution vs Travel Time Buffer Index */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        
        {/* Speed Distribution Histogram */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Speed Profile Distribution (km/h)
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
              Peak vs Off-Peak Delta
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: '< 20 km/h (Gridlock / Severe Delay)', pct: 28, color: '#ef4444' },
              { label: '20 - 40 km/h (Heavy Traffic)', pct: 36, color: '#f59e0b' },
              { label: '40 - 60 km/h (Moderate Flow)', pct: 22, color: '#3b82f6' },
              { label: '> 60 km/h (Free-Flow Conditions)', pct: 14, color: '#10b981' }
            ].map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                  <span style={{ color: item.color }}>{item.pct}% of Network</span>
                </div>
                <div style={{ width: '100%', height: 8, background: 'var(--bg-input)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: 12, borderRadius: 8, background: 'var(--bg-input)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            ℹ️ <strong>Travel Time Buffer Index: 1.42</strong> (Commuters must add 42% extra travel buffer time during peak hours to arrive on schedule).
          </div>
        </div>

        {/* Environmental Emissions & AQI Matrix */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Corridor Carbon & Air Quality Matrix
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
              CO2 & PM2.5 Telemetry
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredCorridors.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 10, background: 'var(--bg-input)', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {c.district}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: c.airQualityAQI > 100 ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
                      AQI {c.airQualityAQI}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      Air Quality Index
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: 90 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {c.co2EmissionsKgPerHour} kg/hr
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      CO2 Output
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 2: Origin-Destination (O-D) Commuter Flow Matrix */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Origin-Destination (O-D) Commuter Matrix
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Major commuter flow corridors connecting residential suburbs to commercial employment hubs
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 6, background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', fontWeight: 700 }}>
            375,000 DAILY COMMUTERS
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {ORIGIN_DESTINATION_FLOWS.map(od => (
            <div key={od.id} className="glass-panel glass-panel-interactive" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {od.originDistrict} <ArrowRight size={14} /> {od.destinationDistrict}
                </div>
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', fontWeight: 700 }}>
                  {od.avgTravelTimeMinutes} MINS
                </span>
              </div>

              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
                {od.dailyCommuters.toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>daily commuters</span>
              </div>

              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                Mode Share Split:
              </div>

              <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: 2 }}>
                <div style={{ width: `${od.peakModeShare.car}%`, background: '#06b6d4' }} title={`Car: ${od.peakModeShare.car}%`} />
                <div style={{ width: `${od.peakModeShare.bus}%`, background: '#3b82f6' }} title={`Bus: ${od.peakModeShare.bus}%`} />
                <div style={{ width: `${od.peakModeShare.rail}%`, background: '#10b981' }} title={`Rail: ${od.peakModeShare.rail}%`} />
                <div style={{ width: `${od.peakModeShare.bike}%`, background: '#f59e0b' }} title={`Bike: ${od.peakModeShare.bike}%`} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 8 }}>
                <span>Car: {od.peakModeShare.car}%</span>
                <span>Bus: {od.peakModeShare.bus}%</span>
                <span>Rail: {od.peakModeShare.rail}%</span>
                <span>Bike: {od.peakModeShare.bike}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
