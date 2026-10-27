import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SimulationScenario } from '../types';
import { INITIAL_SCENARIOS } from '../data/mockData';
import { 
  SlidersHorizontal, 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  Bus, 
  DollarSign, 
  Leaf, 
  Save, 
  Plus, 
  Check, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const ScenarioPlannerView: React.FC = () => {
  const { user, currentCity } = useAuth();

  const [scenarios, setScenarios] = useState<SimulationScenario[]>(INITIAL_SCENARIOS);
  const [activeScenarioId, setActiveScenarioId] = useState<string>(INITIAL_SCENARIOS[0].id);

  // Live Interactive Sliders State
  const [dedicatedBusLanesKm, setDedicatedBusLanesKm] = useState(18.5);
  const [congestionTollFeeUSD, setCongestionTollFeeUSD] = useState(8.50);
  const [microMobilityHighwaysKm, setMicroMobilityHighwaysKm] = useState(12.0);
  const [trafficSignalAIEnable, setTrafficSignalAIEnable] = useState(true);
  const [transitFrequencyIncreasePercent, setTransitFrequencyIncreasePercent] = useState(35);

  const [scenarioTitle, setScenarioTitle] = useState('');
  const [scenarioDesc, setScenarioDesc] = useState('');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Compute dynamic impact math based on sliders
  const computedCongestionReduction = Math.min(65, Math.round(
    (dedicatedBusLanesKm * 0.8) + (congestionTollFeeUSD * 1.5) + (microMobilityHighwaysKm * 0.4) + (trafficSignalAIEnable ? 8 : 0) + (transitFrequencyIncreasePercent * 0.2)
  ));

  const computedSpeedIncrease = (
    (dedicatedBusLanesKm * 0.3) + (congestionTollFeeUSD * 0.4) + (trafficSignalAIEnable ? 3.5 : 0) + (transitFrequencyIncreasePercent * 0.08)
  ).toFixed(1);

  const computedCo2Reduction = Math.round(
    (dedicatedBusLanesKm * 1.2) + (congestionTollFeeUSD * 2.1) + (microMobilityHighwaysKm * 0.8) + (transitFrequencyIncreasePercent * 0.4)
  );

  const computedApprovalScore = Math.max(40, Math.min(96, Math.round(
    70 + (dedicatedBusLanesKm * 0.5) + (microMobilityHighwaysKm * 0.6) - (congestionTollFeeUSD * 1.2) + (transitFrequencyIncreasePercent * 0.3)
  )));

  const computedEconomicSavingsUSD = Math.round(computedCongestionReduction * 1850000);

  const handleSaveScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenarioTitle) return;

    const newScen: SimulationScenario = {
      id: `scen_${Date.now()}`,
      title: scenarioTitle,
      description: scenarioDesc || 'Custom transport policy intervention simulation scenario.',
      author: user?.name || 'Dr. Elena Rostova',
      createdAt: new Date().toISOString().split('T')[0],
      parameters: {
        dedicatedBusLanesKm,
        congestionTollFeeUSD,
        microMobilityHighwaysKm,
        trafficSignalAIEnable,
        transitFrequencyIncreasePercent
      },
      projectedMetrics: {
        congestionReductionPercent: -computedCongestionReduction,
        avgTransitSpeedIncreaseKmh: Number(computedSpeedIncrease),
        dailyCo2ReductionTons: -computedCo2Reduction,
        publicApprovalScore: computedApprovalScore,
        estimatedCostUSD: 12000000,
        annualEconomicSavingsUSD: computedEconomicSavingsUSD
      }
    };

    setScenarios([newScen, ...scenarios]);
    setActiveScenarioId(newScen.id);
    setScenarioTitle('');
    setScenarioDesc('');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '20px 24px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(15, 23, 42, 0.8))', border: '1px solid rgba(139, 92, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Sparkles size={18} color="var(--accent-violet)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Data-Driven Transport Planning Sandbox ("What-If" Simulator)
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Adjust infrastructure & policy parameters to compute real-time projections on travel speeds, carbon emissions, and economic ROI.
          </p>
        </div>

        {isSavedNotice && (
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', padding: '8px 14px', borderRadius: 8, color: '#34d399', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Check size={16} /> Scenario Saved to City Registry!
          </div>
        )}
      </div>

      {/* Main Grid: Parameter Sliders vs Live Dynamic Impact Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20 }}>
        
        {/* Sliders Sandbox */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
            Policy & Infrastructure Control Controls
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Control 1: Dedicated BRT Lanes */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                <span style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Bus size={16} color="var(--accent-cyan)" /> Dedicated Bus Rapid Transit (BRT) Lanes
                </span>
                <span style={{ color: 'var(--accent-cyan)' }}>{dedicatedBusLanesKm} km</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="0.5"
                value={dedicatedBusLanesKm}
                onChange={e => setDedicatedBusLanesKm(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
              />
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Converts rightmost traffic lanes into 24/7 dedicated zero-emission bus lanes.
              </div>
            </div>

            {/* Control 2: Congestion Toll Fee */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                <span style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <DollarSign size={16} color="var(--accent-amber)" /> Peak-Hour Congestion Zone Toll Fee
                </span>
                <span style={{ color: 'var(--accent-amber)' }}>${congestionTollFeeUSD.toFixed(2)} / trip</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                value={congestionTollFeeUSD}
                onChange={e => setCongestionTollFeeUSD(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-amber)', cursor: 'pointer' }}
              />
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Electronic toll gantry charging for single-occupancy vehicles entering Downtown core during rush hours.
              </div>
            </div>

            {/* Control 3: Micro-Mobility Bike Highway */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                <span style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Zap size={16} color="var(--accent-emerald)" /> Micro-Mobility Protected Bike Superhighways
                </span>
                <span style={{ color: 'var(--accent-emerald)' }}>{microMobilityHighwaysKm} km</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={microMobilityHighwaysKm}
                onChange={e => setMicroMobilityHighwaysKm(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
              />
            </div>

            {/* Control 4: Transit Frequency Boost */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                <span style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <SlidersHorizontal size={16} color="var(--accent-violet)" /> Public Transit Frequency Boost
                </span>
                <span style={{ color: 'var(--accent-violet)' }}>+{transitFrequencyIncreasePercent}% fleet</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={transitFrequencyIncreasePercent}
                onChange={e => setTransitFrequencyIncreasePercent(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-violet)', cursor: 'pointer' }}
              />
            </div>

            {/* Control 5: AI Signal Optimization Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, background: 'var(--bg-input)', borderRadius: 10 }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  🤖 Adaptive AI Traffic Signal Optimization
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Dynamic green wave signal timing prioritizing high-occupancy transit vehicles.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTrafficSignalAIEnable(!trafficSignalAIEnable)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: 'none',
                  background: trafficSignalAIEnable ? 'var(--accent-cyan)' : 'var(--border-color)',
                  color: trafficSignalAIEnable ? '#000000' : 'var(--text-muted)',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {trafficSignalAIEnable ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

          </div>
        </div>

        {/* Dynamic Impact Output Cards */}
        <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
              Projected Impact Telemetry
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: 14, borderRadius: 12 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Congestion Reduction</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                  -{computedCongestionReduction}%
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  Peak hour delay relief
                </div>
              </div>

              <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: 14, borderRadius: 12 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Transit Speed Delta</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-heading)' }}>
                  +{computedSpeedIncrease} <span style={{ fontSize: '0.8rem' }}>km/h</span>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  Average bus travel speed
                </div>
              </div>

              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: 14, borderRadius: 12 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Daily CO2 Saved</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-heading)' }}>
                  -{computedCo2Reduction} <span style={{ fontSize: '0.8rem' }}>tons/day</span>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  Corridor emission reduction
                </div>
              </div>

              <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: 14, borderRadius: 12 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Citizen Approval Index</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a78bfa', fontFamily: 'var(--font-heading)' }}>
                  {computedApprovalScore} / 100
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  Public survey forecast
                </div>
              </div>

            </div>

            <div style={{ background: 'var(--bg-input)', padding: 14, borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 20 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                ANNUAL ECONOMIC PRODUCTIVITY GAIN
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: 2 }}>
                +${(computedEconomicSavingsUSD / 1000000).toFixed(1)} Million / year
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Calculated from travel time savings & reduced commercial delay costs.
              </div>
            </div>
          </div>

          {/* Save Scenario Form */}
          <form onSubmit={handleSaveScenario} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input 
              className="input-field" 
              placeholder="Scenario Title (e.g. 2027 Transit Modernization Plan)" 
              value={scenarioTitle}
              onChange={e => setScenarioTitle(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
              <Save size={16} /> Save Scenario to City Registry
            </button>
          </form>
        </div>

      </div>

      {/* Registry of Saved Scenarios */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
          Saved Transport Planning Scenarios Comparison Matrix
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {scenarios.map(sc => (
            <div 
              key={sc.id} 
              className="glass-panel glass-panel-interactive" 
              style={{ padding: 16, border: activeScenarioId === sc.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)' }}
              onClick={() => setActiveScenarioId(sc.id)}
            >
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                {sc.title}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                Author: {sc.author} • Created {sc.createdAt}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.75rem' }}>
                <div style={{ background: 'var(--bg-input)', padding: 8, borderRadius: 6 }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Congestion</div>
                  <strong style={{ color: '#34d399' }}>{sc.projectedMetrics.congestionReductionPercent}%</strong>
                </div>
                <div style={{ background: 'var(--bg-input)', padding: 8, borderRadius: 6 }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>CO2 Delta</div>
                  <strong style={{ color: 'var(--accent-amber)' }}>{sc.projectedMetrics.dailyCo2ReductionTons} t/day</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
