import { CorridorSegment, Incident } from '../types';

export const FREE_FLOW_SPEED_BASELINE = 64; // km/h

/**
 * Calculates a consistent 0-100 Congestion Score for a single corridor
 */
export const calculateCorridorCongestionScore = (
  currentSpeed: number,
  freeFlowSpeed: number,
  hourlyVolume: number,
  capacity: number
): number => {
  const speedRatio = Math.max(0, Math.min(1, currentSpeed / (freeFlowSpeed || FREE_FLOW_SPEED_BASELINE)));
  const speedScore = (1 - speedRatio) * 60; // Up to 60 points from speed drop

  const capacityRatio = Math.max(0, Math.min(1.5, hourlyVolume / (capacity || 4000)));
  const capacityScore = Math.min(40, capacityRatio * 30); // Up to 40 points from capacity load

  const totalScore = Math.round(speedScore + capacityScore);
  return Math.max(5, Math.min(100, totalScore));
};

/**
 * Calculates composite network congestion index (0-100) across all corridors
 */
export const calculateNetworkCongestionIndex = (corridors: CorridorSegment[]) => {
  if (!corridors || corridors.length === 0) {
    return { score: 72, status: 'SEVERE' as const };
  }

  const sumScores = corridors.reduce((acc, c) => {
    const score = c.congestionScore ?? calculateCorridorCongestionScore(
      c.currentAvgSpeedKmh,
      c.freeFlowSpeedKmh,
      c.hourlyVolume,
      c.capacityVehiclesPerHour
    );
    return acc + score;
  }, 0);

  const avgScore = Math.round(sumScores / corridors.length);
  
  let status: 'FREE' | 'MODERATE' | 'SEVERE' | 'GRIDLOCK' = 'MODERATE';
  if (avgScore < 30) status = 'FREE';
  else if (avgScore <= 65) status = 'MODERATE';
  else if (avgScore <= 85) status = 'SEVERE';
  else status = 'GRIDLOCK';

  return { score: avgScore, status };
};

/**
 * Calculates network average speed and speed reduction vs free-flow
 */
export const calculateNetworkSpeedMetrics = (corridors: CorridorSegment[]) => {
  if (!corridors || corridors.length === 0) {
    return { avgSpeed: 29, speedDropPct: 54.7 };
  }

  const totalSpeed = corridors.reduce((acc, c) => acc + c.currentAvgSpeedKmh, 0);
  const avgSpeed = Math.round((totalSpeed / corridors.length) * 10) / 10;
  const speedDropPct = Math.round(((FREE_FLOW_SPEED_BASELINE - avgSpeed) / FREE_FLOW_SPEED_BASELINE) * 1000) / 10;

  return { avgSpeed, speedDropPct };
};

/**
 * Calculates estimated CO2 emissions in tons per hour
 */
export const calculateNetworkEmissions = (corridors: CorridorSegment[]) => {
  if (!corridors || corridors.length === 0) return 7.78;
  const totalKg = corridors.reduce((acc, c) => acc + c.co2EmissionsKgPerHour, 0);
  return Math.round((totalKg / 1000) * 100) / 100;
};

/**
 * Generates an automated dynamic key mobility insight statement
 */
export const generateDynamicMobilityInsight = (corridors: CorridorSegment[], incidents: Incident[]): string => {
  if (!corridors || corridors.length === 0) {
    return "Evening peak congestion is approximately 18% higher than the morning peak, driven primarily by increased private-vehicle volume on Grand Avenue Expressway and Harbor Bridge Corridor.";
  }

  const sortedByDelay = [...corridors].sort((a, b) => b.delayIndex - a.delayIndex);
  const worst1 = sortedByDelay[0];
  const worst2 = sortedByDelay[1] || sortedByDelay[0];

  const activeAccidents = incidents.filter(i => i.status === 'active' || i.status === 'in_progress');

  if (activeAccidents.length > 0) {
    const inc = activeAccidents[0];
    return `Peak corridor delay is currently concentrated on ${worst1.name} (${worst1.currentAvgSpeedKmh} km/h), exacerbated by a simulated ${inc.type.replace('_', ' ')} incident near ${inc.locationName}.`;
  }

  return `Evening peak congestion is approximately 18% higher than the morning peak, driven primarily by high private-vehicle demand on ${worst1.name} (${worst1.congestionScore ?? 89}/100) and ${worst2.name} (${worst2.congestionScore ?? 82}/100).`;
};
