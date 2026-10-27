import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CITY_PRESETS } from '../data/mockData';
import { 
  Activity, 
  Sun, 
  Moon, 
  User as UserIcon, 
  LogOut, 
  MapPin, 
  Clock, 
  Radio, 
  ChevronDown, 
  Zap,
  Sliders,
  ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    user, 
    logout, 
    openAuthModal, 
    currentCity, 
    setCity, 
    theme, 
    toggleTheme, 
    timeWindow, 
    setTimeWindow,
    isLiveSimulating,
    toggleLiveSimulation 
  } = useAuth();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '12px 24px', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      
      {/* Brand & City Preset */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent-cyan), #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px var(--accent-cyan-glow)' }}>
            <Activity size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
              URBAN<span style={{ color: 'var(--accent-cyan)' }}>MOBILITY</span>
              <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4, background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', border: '1px solid rgba(6, 182, 212, 0.3)', fontWeight: 700 }}>v2.4 PRO</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Spatial Telemetry & Transport Simulation
            </div>
          </div>
        </div>

        <div style={{ height: 24, width: 1, background: 'var(--border-color-light)' }} />

        {/* City Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-input)', padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border-color-light)' }}>
          <MapPin size={15} color="var(--accent-cyan)" />
          <select 
            value={currentCity.id} 
            onChange={e => setCity(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
          >
            {CITY_PRESETS.map(city => (
              <option key={city.id} value={city.id} style={{ background: 'var(--bg-secondary)' }}>
                {city.name} ({city.country})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Real-time Telemetry Status & Time Window */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        
        {/* Live Simulation Toggle */}
        <button
          onClick={toggleLiveSimulation}
          className="glass-panel"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            padding: '6px 12px', 
            borderRadius: 8, 
            background: isLiveSimulating ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-input)',
            border: isLiveSimulating ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color-light)',
            color: isLiveSimulating ? '#34d399' : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: 600
          }}
        >
          <div className={isLiveSimulating ? "live-beacon" : ""} style={!isLiveSimulating ? { width: 8, height: 8, borderRadius: '50%', background: 'var(--text-muted)' } : {}} />
          <Radio size={14} />
          {isLiveSimulating ? 'TELEMETRY: LIVE' : 'TELEMETRY: PAUSED'}
        </button>

        {/* Time Window Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-input)', padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border-color-light)' }}>
          <Clock size={15} color="var(--accent-amber)" />
          <select 
            value={timeWindow} 
            onChange={e => setTimeWindow(e.target.value as any)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
          >
            <option value="live" style={{ background: 'var(--bg-secondary)' }}>⚡ Real-Time Live Feed</option>
            <option value="morning_peak" style={{ background: 'var(--bg-secondary)' }}>🌅 Morning Peak (07:00-09:30)</option>
            <option value="evening_peak" style={{ background: 'var(--bg-secondary)' }}>🌇 Evening Rush (16:30-19:00)</option>
            <option value="past_24h" style={{ background: 'var(--bg-secondary)' }}>📊 Past 24 Hours Aggregated</option>
            <option value="past_7d" style={{ background: 'var(--bg-secondary)' }}>📅 7-Day Trend Baseline</option>
          </select>
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color-light)',
            color: 'var(--text-primary)',
            padding: '8px',
            borderRadius: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <Sun size={18} color="var(--accent-amber)" /> : <Moon size={18} color="var(--accent-violet)" />}
        </button>

        {/* User Profile / Auth State */}
        {user ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color-light)',
                padding: '6px 12px',
                borderRadius: 10,
                cursor: 'pointer',
                color: 'var(--text-primary)'
              }}
            >
              <img 
                src={user.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"} 
                alt={user.name}
                style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} 
              />
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{user.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', textTransform: 'capitalize', fontWeight: 600 }}>
                  {user.role} Persona
                </div>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {isProfileDropdownOpen && (
              <div 
                className="glass-panel"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  width: 240,
                  padding: 12,
                  zIndex: 200,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div style={{ paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid var(--border-color-light)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ShieldCheck size={12} /> {user.organization}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <button 
                    onClick={() => { openAuthModal('login'); setIsProfileDropdownOpen(false); }}
                    style={{ background: 'none', border: 'none', textAlign: 'left', padding: '8px', borderRadius: 6, color: 'var(--text-primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <UserIcon size={14} /> Switch User Persona
                  </button>
                  <button 
                    onClick={() => { logout(); setIsProfileDropdownOpen(false); }}
                    style={{ background: 'none', border: 'none', textAlign: 'left', padding: '8px', borderRadius: 6, color: 'var(--accent-rose)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <LogOut size={14} /> Sign Out Session
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button 
            className="btn btn-primary"
            onClick={() => openAuthModal('login')}
          >
            <UserIcon size={16} /> Sign In
          </button>
        )}
      </div>
    </header>
  );
};
