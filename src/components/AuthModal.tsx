import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { X, Lock, Mail, User as UserIcon, Building2, Briefcase, Zap, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login, register, loginAsDemo } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('planner');
  const [department, setDepartment] = useState('');
  const [organization, setOrganization] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!email) return;
      login(email, role);
    } else {
      if (!email || !name) return;
      register(name, email, role, department, organization);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button 
          onClick={closeAuthModal} 
          style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #06b6d4, #0284c7)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Zap size={24} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {mode === 'login' ? 'Sign In to Mobility Portal' : 'Create Mobility Account'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Access real-time traffic telemetry & transport simulation tools
          </p>
        </div>

        {/* 1-Click Quick Demo Sign-In Box */}
        <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={14} /> 1-Click Quick Demo Sign-In (Select Persona)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button 
              type="button" 
              onClick={() => loginAsDemo('planner')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '8px 10px', justifyContent: 'flex-start' }}
            >
              <CheckCircle2 size={14} color="var(--accent-cyan)" /> Urban Planner
            </button>
            <button 
              type="button" 
              onClick={() => loginAsDemo('engineer')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '8px 10px', justifyContent: 'flex-start' }}
            >
              <CheckCircle2 size={14} color="var(--accent-emerald)" /> Traffic Engineer
            </button>
            <button 
              type="button" 
              onClick={() => loginAsDemo('manager')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '8px 10px', justifyContent: 'flex-start' }}
            >
              <CheckCircle2 size={14} color="var(--accent-amber)" /> Transit Director
            </button>
            <button 
              type="button" 
              onClick={() => loginAsDemo('public')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '8px 10px', justifyContent: 'flex-start' }}
            >
              <CheckCircle2 size={14} color="var(--accent-violet)" /> Public Viewer
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: 8, padding: 4, marginBottom: 20 }}>
          <button
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 6,
              background: mode === 'login' ? 'var(--bg-secondary)' : 'transparent',
              color: mode === 'login' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 6,
              background: mode === 'register' ? 'var(--bg-secondary)' : 'transparent',
              color: mode === 'register' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
            onClick={() => setMode('register')}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="e.g. Dr. Jane Doe"
                  className="input-field"
                  style={{ paddingLeft: 36 }}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>
              Work Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="planner@citytransit.gov"
                className="input-field"
                style={{ paddingLeft: 36 }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="••••••••••••"
                className="input-field"
                style={{ paddingLeft: 36 }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>
              System Role & Access Level
            </label>
            <select
              className="input-field"
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
            >
              <option value="planner">Urban Transport Planner (Full Simulation)</option>
              <option value="engineer">Traffic Control Engineer (ITS & Incidents)</option>
              <option value="manager">Transit Director (Executive Reports)</option>
              <option value="public">Public Viewer (Read-only Analytics)</option>
            </select>
          </div>

          {mode === 'register' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>
                  Department
                </label>
                <div style={{ position: 'relative' }}>
                  <Briefcase size={16} style={{ position: 'absolute', left: 10, top: 12, color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="ITS Division"
                    className="input-field"
                    style={{ paddingLeft: 32 }}
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>
                  Organization
                </label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={16} style={{ position: 'absolute', left: 10, top: 12, color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="City Transit"
                    className="input-field"
                    style={{ paddingLeft: 32 }}
                    value={organization}
                    onChange={e => setOrganization(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ marginTop: 10, width: '100%', padding: '12px' }}>
            {mode === 'login' ? 'Sign In' : 'Create Account & Launch'}
          </button>
        </form>
      </div>
    </div>
  );
};
