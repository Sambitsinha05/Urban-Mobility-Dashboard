import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CorridorSegment, Incident } from '../types';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Calendar,
  Building,
  Sparkles
} from 'lucide-react';

interface ReportsProps {
  corridors: CorridorSegment[];
  incidents: Incident[];
}

export const ReportsExportView: React.FC<ReportsProps> = ({ corridors, incidents }) => {
  const { user, currentCity } = useAuth();
  
  const [reportTitle, setReportTitle] = useState(`${currentCity.name} Urban Mobility Executive Briefing`);
  const [executiveNotes, setExecutiveNotes] = useState(
    "Morning rush hour congestion on Harbor Bridge remains elevated due to commercial lane blockage. Dedicated BRT lane priority on Grand Ave recommended for immediate 18% speed restoration."
  );
  const [isExported, setIsExported] = useState(false);

  // CSV Export Engine
  const exportToCSV = () => {
    const headers = [
      'Corridor ID',
      'Corridor Name',
      'District',
      'Length (km)',
      'Speed Limit (km/h)',
      'Current Avg Speed (km/h)',
      'Delay Index',
      'Hourly Volume (veh/hr)',
      'Capacity (veh/hr)',
      'Congestion Level',
      'Air Quality AQI',
      'CO2 Emissions (kg/hr)',
      'Dominant Mode'
    ];

    const rows = corridors.map(c => [
      c.id,
      `"${c.name}"`,
      `"${c.district}"`,
      c.lengthKm,
      c.speedLimitKmh,
      c.currentAvgSpeedKmh,
      c.delayIndex,
      c.hourlyVolume,
      c.capacityVehiclesPerHour,
      c.congestionLevel,
      c.airQualityAQI,
      c.co2EmissionsKgPerHour,
      c.dominantMode
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${currentCity.id}_mobility_telemetry_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExported(true);
    setTimeout(() => setIsExported(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header Bar */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Executive Mobility Briefing & CSV Export
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Generate official transport authority summary reports or export granular telemetry datasets for GIS software
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={exportToCSV}>
            <Download size={16} /> Export CSV Dataset
          </button>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>
      </div>

      {isExported && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', padding: '12px 16px', borderRadius: 10, color: '#34d399', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={18} /> Telemetry CSV File Successfully Downloaded!
        </div>
      )}

      {/* Main Grid: Form Config vs Formatted Executive Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20 }}>
        
        {/* Report Customizer Controls */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
            Report Options
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>
                Executive Report Title
              </label>
              <input 
                className="input-field" 
                value={reportTitle} 
                onChange={e => setReportTitle(e.target.value)} 
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>
                Executive Assessment & Recommendations Notes
              </label>
              <textarea 
                className="input-field" 
                rows={5} 
                value={executiveNotes} 
                onChange={e => setExecutiveNotes(e.target.value)} 
              />
            </div>

            <div style={{ background: 'var(--bg-input)', padding: 14, borderRadius: 10, border: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Author Signature Metadata:</div>
              <div>Generated By: <strong>{user?.name || 'Dr. Elena Rostova'}</strong> ({user?.role.toUpperCase()})</div>
              <div>Organization: <strong>{user?.organization || 'Department of Transportation'}</strong></div>
              <div>Timestamp: <strong>{new Date().toLocaleString()}</strong></div>
            </div>
          </div>
        </div>

        {/* Live Executive Report Preview Sheet */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: 32, 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border-color-light)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            {/* Header Document Banner */}
            <div style={{ borderBottom: '2px solid var(--accent-cyan)', paddingBottom: 16, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  OFFICIAL MUNICIPAL MOBILITY REPORT
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                  {reportTitle}
                </h2>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {currentCity.name} Region • Total Population: {currentCity.totalPopulation}
                </div>
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <div>Date: <strong>{new Date().toISOString().split('T')[0]}</strong></div>
                <div>Status: <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>VERIFIED</span></div>
              </div>
            </div>

            {/* Key Metrics Table Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              <div style={{ background: 'var(--bg-input)', padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Congestion Index</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-rose)' }}>2.76x Peak</div>
              </div>
              <div style={{ background: 'var(--bg-input)', padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Avg Speed</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>28.4 km/h</div>
              </div>
              <div style={{ background: 'var(--bg-input)', padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Transit Score</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>88.5 / 100</div>
              </div>
            </div>

            {/* Assessment Notes */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Executive Assessment Summary
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, background: 'var(--bg-input)', padding: 14, borderRadius: 8, fontStyle: 'italic' }}>
                "{executiveNotes}"
              </p>
            </div>

            {/* Top Corridor Breakdown Table */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Key Corridor Summary Snapshot
              </h4>
              <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse', border: '1px solid var(--border-color)' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-input)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '8px 10px' }}>Corridor</th>
                    <th style={{ padding: '8px 10px' }}>Speed</th>
                    <th style={{ padding: '8px 10px' }}>Delay</th>
                    <th style={{ padding: '8px 10px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {corridors.slice(0, 4).map(c => (
                    <tr key={c.id} style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600 }}>{c.name}</td>
                      <td style={{ padding: '8px 10px' }}>{c.currentAvgSpeedKmh} km/h</td>
                      <td style={{ padding: '8px 10px' }}>{c.delayIndex}x</td>
                      <td style={{ padding: '8px 10px', textTransform: 'capitalize', color: c.congestionLevel === 'severe' ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                        {c.congestionLevel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Signature Box */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16, marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <div>
              Certified by: <strong>{user?.name || 'Dr. Elena Rostova'}</strong>
            </div>
            <div>
              Urban Mobility Telemetry System • Page 1 of 1
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
