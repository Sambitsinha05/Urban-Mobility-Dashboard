import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Map, 
  TrendingUp, 
  AlertTriangle, 
  SlidersHorizontal, 
  FileSpreadsheet, 
  Shield, 
  Layers
} from 'lucide-react';

export type ViewMode = 'overview' | 'gis_map' | 'analytics' | 'incidents' | 'simulation' | 'reports';

interface SidebarProps {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const { user } = useAuth();

  const menuItems: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview Command', icon: <LayoutDashboard size={18} /> },
    { id: 'gis_map', label: 'GIS Spatial Map', icon: <Map size={18} />, badge: 'HEATMAP' },
    { id: 'analytics', label: 'Traffic & Modal Trends', icon: <TrendingUp size={18} /> },
    { id: 'incidents', label: 'Bottlenecks & Incidents', icon: <AlertTriangle size={18} />, badge: 'LIVE 3' },
    { id: 'simulation', label: 'Scenario Sandbox', icon: <SlidersHorizontal size={18} />, badge: 'WHAT-IF' },
    { id: 'reports', label: 'Executive Export', icon: <FileSpreadsheet size={18} /> }
  ];

  return (
    <aside 
      className="glass-panel" 
      style={{ 
        width: 260, 
        borderRadius: 0, 
        borderTop: 'none', 
        borderLeft: 'none', 
        borderBottom: 'none', 
        padding: '20px 14px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        height: '100%'
      }}
    >
      <div>
        <div style={{ paddingLeft: 12, marginBottom: 16, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          NAVIGATION MODULES
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {menuItems.map(item => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: 'none',
                  background: isActive ? 'linear-gradient(90deg, rgba(6, 182, 212, 0.18), transparent)' : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  borderLeft: isActive ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{ 
                    fontSize: '0.625rem', 
                    fontWeight: 700, 
                    padding: '2px 6px', 
                    borderRadius: 4, 
                    background: isActive ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.08)', 
                    color: isActive ? '#000000' : 'var(--text-muted)' 
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Operational Role Card */}
      <div style={{ background: 'var(--bg-input)', borderRadius: 12, padding: 14, border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Shield size={16} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            ROLE PERMISSIONS
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {user ? (
            <>
              Active Persona: <strong style={{ color: 'var(--accent-cyan)' }}>{user.role.toUpperCase()}</strong>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                {user.role === 'planner' && '✓ Unlimited simulation & scenario exports'}
                {user.role === 'engineer' && '✓ Traffic signal & incident control enabled'}
                {user.role === 'manager' && '✓ Executive executive report generator'}
                {user.role === 'public' && '• Public citizen view mode'}
              </div>
            </>
          ) : (
            'Sign in to enable scenario writing & incident dispatch privileges.'
          )}
        </div>
      </div>
    </aside>
  );
};
