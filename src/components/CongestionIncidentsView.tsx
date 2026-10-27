import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CorridorSegment, Incident } from '../types';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Plus, 
  Clock, 
  MapPin, 
  TrafficCone, 
  Wrench, 
  CloudRain, 
  Radio,
  Check,
  PlusCircle
} from 'lucide-react';

interface IncidentsProps {
  corridors: CorridorSegment[];
  incidents: Incident[];
  onAddIncident: (incident: Incident) => void;
  onResolveIncident: (incidentId: string) => void;
}

export const CongestionIncidentsView: React.FC<IncidentsProps> = ({ 
  corridors, 
  incidents, 
  onAddIncident, 
  onResolveIncident 
}) => {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Incident['type']>('accident');
  const [severity, setSeverity] = useState<Incident['severity']>('medium');
  const [locationName, setLocationName] = useState('');
  const [district, setDistrict] = useState('Downtown Financial');
  const [delayImpactMinutes, setDelayImpactMinutes] = useState(15);
  const [description, setDescription] = useState('');

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !locationName) return;

    const newInc: Incident = {
      id: `inc_${Date.now()}`,
      title,
      type,
      severity,
      locationName,
      district,
      coordinates: [40.730000, -73.975000],
      reportedTime: 'Just now',
      estimatedResolutionTime: '45 mins from now',
      status: 'active',
      delayImpactMinutes: Number(delayImpactMinutes),
      description: description || 'Traffic officer dispatched to monitor situation.'
    };

    onAddIncident(newInc);
    setShowAddModal(false);
    setTitle('');
    setLocationName('');
    setDescription('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header Bar */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <AlertTriangle size={20} color="var(--accent-rose)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Congestion Leaderboard & Incident Response Command
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Real-time bottleneck identification, traffic incident management, and dispatch response logs
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <PlusCircle size={16} /> Log Traffic Incident
        </button>
      </div>

      {/* Main Grid: Corridor Bottlenecks Leaderboard & Active Incidents Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        
        {/* Ranked Bottleneck Corridors */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
            Ranked Bottleneck Corridors
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {corridors.map((c, idx) => (
              <div 
                key={c.id} 
                style={{ 
                  background: 'var(--bg-input)', 
                  borderRadius: 12, 
                  padding: 16, 
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: idx === 0 ? 'var(--accent-rose)' : idx === 1 ? 'var(--accent-amber)' : 'var(--bg-secondary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                    #{idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {c.district} • Dominant Mode: {c.dominantMode.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: c.currentAvgSpeedKmh < 25 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                      {c.currentAvgSpeedKmh} km/h
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {c.delayIndex}x Delay Index
                    </div>
                  </div>
                  <span className={`status-pill ${c.congestionLevel}`}>
                    {c.congestionLevel.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Management & Dispatch Panel */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
            Incident Dispatch Feed ({incidents.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {incidents.map(inc => (
              <div 
                key={inc.id}
                style={{ 
                  background: 'var(--bg-input)', 
                  borderRadius: 12, 
                  padding: 16, 
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {inc.title}
                  </span>
                  <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-rose)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {inc.severity} Severity
                  </span>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {inc.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', paddingTop: 6, borderTop: '1px solid var(--border-color)' }}>
                  <span>📍 {inc.locationName}</span>
                  <span style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>+{inc.delayImpactMinutes}m Delay</span>
                </div>

                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', padding: '6px', fontSize: '0.75rem', marginTop: 4 }}
                  onClick={() => onResolveIncident(inc.id)}
                >
                  <Check size={14} color="var(--accent-emerald)" /> Mark Incident as Resolved & Clear Lane
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Log Incident Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
              Log Traffic Incident / Hazard
            </h3>
            <form onSubmit={handleCreateIncident} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Incident Title</label>
                <input className="input-field" placeholder="e.g. Stalled Bus on Grand Ave" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Type</label>
                  <select className="input-field" value={type} onChange={e => setType(e.target.value as any)}>
                    <option value="accident">Collision / Accident</option>
                    <option value="roadwork">Roadwork / Utility</option>
                    <option value="hazard">Debris / Hazard</option>
                    <option value="signal_failure">Signal Failure</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Severity</label>
                  <select className="input-field" value={severity} onChange={e => setSeverity(e.target.value as any)}>
                    <option value="low">Low Impact</option>
                    <option value="medium">Medium Delay</option>
                    <option value="high">High Bottleneck</option>
                    <option value="critical">Critical Closure</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Specific Location</label>
                <input className="input-field" placeholder="e.g. Grand Ave at 42nd St" value={locationName} onChange={e => setLocationName(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Delay Impact (Minutes)</label>
                <input type="number" className="input-field" value={delayImpactMinutes} onChange={e => setDelayImpactMinutes(Number(e.target.value))} required />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Description</label>
                <textarea className="input-field" rows={3} placeholder="Notes for traffic response teams..." value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Incident</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
