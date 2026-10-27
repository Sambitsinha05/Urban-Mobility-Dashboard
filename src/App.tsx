import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar, ViewMode } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';

import { OverviewDashboard } from './components/OverviewDashboard';
import { GISMapView } from './components/GISMapView';
import { AnalyticsTrendsView } from './components/AnalyticsTrendsView';
import { CongestionIncidentsView } from './components/CongestionIncidentsView';
import { ScenarioPlannerView } from './components/ScenarioPlannerView';
import { ReportsExportView } from './components/ReportsExportView';

import { INITIAL_CORRIDORS, INITIAL_INCIDENTS, INITIAL_TRANSIT_LINES } from './data/mockData';
import { CorridorSegment, Incident, TransitLine } from './types';
import { calculateCorridorCongestionScore } from './utils/mobilityMath';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Dashboard:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', background: '#090d16', color: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#ef4444', marginBottom: 12 }}>Urban Mobility Dashboard Notice</h2>
          <p style={{ color: '#94a3b8', marginBottom: 20 }}>An operational component exception occurred. Click below to reset state.</p>
          <button 
            style={{ padding: '10px 20px', borderRadius: 8, background: '#06b6d4', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => window.location.reload()}
          >
            Reload Mobility Command Center
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const DashboardContent: React.FC = () => {
  const { isLiveSimulating } = useAuth();

  const [activeView, setActiveView] = useState<ViewMode>('overview');
  const [corridors, setCorridors] = useState<CorridorSegment[]>(INITIAL_CORRIDORS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [transitLines] = useState<TransitLine[]>(INITIAL_TRANSIT_LINES);
  const [selectedCorridorId, setSelectedCorridorId] = useState<string | null>(null);

  // Live Telemetry Simulation Loop (Updates every 5s when live simulation is toggled ON)
  useEffect(() => {
    if (!isLiveSimulating) return;

    const interval = setInterval(() => {
      setCorridors(prev => prev.map(c => {
        const speedDelta = (Math.random() * 4 - 2);
        const newSpeed = Math.max(10, Math.min(c.speedLimitKmh, Math.round((c.currentAvgSpeedKmh + speedDelta) * 10) / 10));
        const delayIdx = Math.max(1.0, Math.round((c.freeFlowSpeedKmh / newSpeed) * 100) / 100);
        const score = calculateCorridorCongestionScore(newSpeed, c.freeFlowSpeedKmh, c.hourlyVolume, c.capacityVehiclesPerHour);

        let newCongestion = c.congestionLevel;
        if (score >= 85) newCongestion = 'gridlock';
        else if (score >= 66) newCongestion = 'severe';
        else if (score >= 31) newCongestion = 'moderate';
        else newCongestion = 'free_flow';

        return {
          ...c,
          currentAvgSpeedKmh: newSpeed,
          delayIndex: delayIdx,
          congestionScore: score,
          congestionLevel: newCongestion,
          lastUpdated: 'Just now'
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveSimulating]);

  const handleAddIncident = (newInc: Incident) => {
    setIncidents([newInc, ...incidents]);
    setCorridors(prev => prev.map(c => {
      if (c.district === newInc.district) {
        const newSpeed = Math.max(12, c.currentAvgSpeedKmh - 6);
        const score = Math.min(98, (c.congestionScore ?? 75) + 12);
        return {
          ...c,
          currentAvgSpeedKmh: newSpeed,
          congestionScore: score,
          incidentsCount: c.incidentsCount + 1,
          congestionLevel: 'severe'
        };
      }
      return c;
    }));
  };

  const handleResolveIncident = (incId: string) => {
    setIncidents(prev => prev.filter(i => i.id !== incId));
  };

  const handleSelectCorridorFromOverview = (corridorId: string) => {
    setSelectedCorridorId(corridorId);
    setActiveView('gis_map');
  };

  return (
    <div className="app-container">
      <AuthModal />

      <div className="main-content">
        <Navbar />

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar activeView={activeView} setActiveView={setActiveView} />

          <main className="content-body" style={{ overflowY: 'auto' }}>
            {activeView === 'overview' && (
              <OverviewDashboard 
                corridors={corridors} 
                incidents={incidents} 
                onNavigateView={setActiveView} 
                onSelectCorridor={handleSelectCorridorFromOverview}
              />
            )}

            {activeView === 'gis_map' && (
              <GISMapView 
                corridors={corridors} 
                incidents={incidents} 
                transitLines={transitLines} 
                selectedCorridorId={selectedCorridorId}
                onSelectCorridorForSimulation={(corridorId) => setActiveView('simulation')}
              />
            )}

            {activeView === 'analytics' && (
              <AnalyticsTrendsView corridors={corridors} />
            )}

            {activeView === 'incidents' && (
              <CongestionIncidentsView 
                corridors={corridors} 
                incidents={incidents} 
                onAddIncident={handleAddIncident} 
                onResolveIncident={handleResolveIncident} 
              />
            )}

            {activeView === 'simulation' && (
              <ScenarioPlannerView />
            )}

            {activeView === 'reports' && (
              <ReportsExportView corridors={corridors} incidents={incidents} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DashboardContent />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
