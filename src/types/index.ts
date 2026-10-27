export type UserRole = 'planner' | 'engineer' | 'manager' | 'public';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department: string;
  organization: string;
  savedScenariosCount?: number;
}

export interface CityPreset {
  id: string;
  name: string;
  country: string;
  center: [number, number];
  zoom: number;
  totalPopulation: string;
  dailyTrips: string;
}

export interface DistrictBoundary {
  id: string;
  name: string;
  center: [number, number];
  polygon: [number, number][]; // Polygons [lat, lng]
  aqi: number;
  aqiStatus: 'Good' | 'Moderate' | 'Unhealthy' | 'Hazardous';
}

export type TransportMode = 'car' | 'bus' | 'rail' | 'bike' | 'pedestrian' | 'scooter';

export type CongestionLevel = 'free_flow' | 'moderate' | 'heavy' | 'severe' | 'gridlock';

export interface ModalSplit {
  car: number;
  bus: number;
  bike: number;
  walk: number;
  other: number;
}

export interface CorridorSegment {
  id: string;
  name: string;
  district: string;
  coordinates: [number, number][]; // Polyline points [lat, lng]
  lengthKm: number;
  speedLimitKmh: number;
  currentAvgSpeedKmh: number;
  freeFlowSpeedKmh: number;
  hourlyVolume: number; // Vehicles per hour
  capacityVehiclesPerHour: number;
  congestionLevel: CongestionLevel;
  congestionScore: number; // 0 - 100 composite index
  delayIndex: number; // 1.0 = normal, 2.5 = 2.5x travel time
  airQualityAQI: number; // 0 - 500
  co2EmissionsKgPerHour: number;
  dominantMode: TransportMode;
  modalSplit: ModalSplit;
  incidentsCount: number;
  lastUpdated: string;
}

export interface Incident {
  id: string;
  title: string;
  type: 'accident' | 'roadwork' | 'hazard' | 'signal_failure' | 'breakdown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  locationName: string;
  district: string;
  coordinates: [number, number];
  reportedTime: string;
  estimatedResolutionTime: string;
  status: 'active' | 'in_progress' | 'cleared';
  delayImpactMinutes: number;
  description: string;
}

export interface TransitStop {
  id: string;
  name: string;
  coordinates: [number, number];
  routes: string[];
}

export interface TransitLine {
  id: string;
  name: string;
  code: string;
  type: 'bus' | 'subway' | 'light_rail' | 'ferry';
  color: string;
  routes: [number, number][];
  activeVehicles: number;
  frequencyMins: number;
  onTimePerformancePercent: number;
  dailyRidership: number;
  stops: TransitStop[];
}

export interface OriginDestinationFlow {
  id: string;
  originDistrict: string;
  destinationDistrict: string;
  originCoords: [number, number];
  destinationCoords: [number, number];
  dailyCommuters: number;
  avgTravelTimeMinutes: number;
  peakModeShare: Record<TransportMode, number>;
}

export interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  parameters: {
    dedicatedBusLanesKm: number;
    congestionTollFeeUSD: number;
    microMobilityHighwaysKm: number;
    trafficSignalAIEnable: boolean;
    transitFrequencyIncreasePercent: number;
    roadClosureCorridorId?: string;
  };
  projectedMetrics: {
    congestionReductionPercent: number;
    avgTransitSpeedIncreaseKmh: number;
    dailyCo2ReductionTons: number;
    publicApprovalScore: number;
    estimatedCostUSD: number;
    annualEconomicSavingsUSD: number;
  };
}
