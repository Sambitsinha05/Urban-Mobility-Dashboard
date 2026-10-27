import { 
  CityPreset, 
  CorridorSegment, 
  Incident, 
  TransitLine, 
  OriginDestinationFlow, 
  SimulationScenario, 
  User,
  DistrictBoundary
} from '../types';

export const CITY_PRESETS: CityPreset[] = [
  {
    id: 'metropolis',
    name: 'Metropolis Core',
    country: 'United States',
    center: [40.73061, -73.935242],
    zoom: 12,
    totalPopulation: '3.4M',
    dailyTrips: '8.2M',
  },
  {
    id: 'pacific_bay',
    name: 'Pacific Bay Metro',
    country: 'United States',
    center: [37.774929, -122.419416],
    zoom: 12,
    totalPopulation: '1.9M',
    dailyTrips: '4.5M',
  },
  {
    id: 'capital_metro',
    name: 'Capital City',
    country: 'United Kingdom',
    center: [51.507351, -0.127758],
    zoom: 12,
    totalPopulation: '8.8M',
    dailyTrips: '14.1M',
  }
];

export const DEMO_USERS: User[] = [
  {
    id: 'user_planner_1',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@citytransit.gov',
    role: 'planner',
    department: 'Urban Transport & Spatial Planning',
    organization: 'Department of Transportation',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    savedScenariosCount: 6,
  },
  {
    id: 'user_engineer_2',
    name: 'Marcus Vance',
    email: 'marcus.vance@traffic-control.gov',
    role: 'engineer',
    department: 'Intelligent Traffic Systems (ITS)',
    organization: 'City Traffic Operations Center',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    savedScenariosCount: 3,
  },
  {
    id: 'user_manager_3',
    name: 'Sarah Chen',
    email: 'sarah.chen@metromobility.org',
    role: 'manager',
    department: 'Executive Mobility Oversight',
    organization: 'Regional Transit Authority',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    savedScenariosCount: 12,
  },
  {
    id: 'user_public_4',
    name: 'Alex Rivera',
    email: 'alex.rivera@guest.org',
    role: 'public',
    department: 'Public Citizen Access',
    organization: 'Urban Mobility Observatory',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    savedScenariosCount: 0,
  }
];

export const DISTRICT_BOUNDARIES: DistrictBoundary[] = [
  {
    id: 'dist_01',
    name: 'Downtown Financial',
    center: [40.718, -74.005],
    aqi: 142,
    aqiStatus: 'Unhealthy',
    polygon: [
      [40.705, -74.018],
      [40.728, -74.015],
      [40.725, -73.990],
      [40.705, -73.995]
    ]
  },
  {
    id: 'dist_02',
    name: 'Central Business District',
    center: [40.742, -73.982],
    aqi: 135,
    aqiStatus: 'Unhealthy',
    polygon: [
      [40.728, -73.998],
      [40.755, -73.992],
      [40.752, -73.968],
      [40.725, -73.974]
    ]
  },
  {
    id: 'dist_03',
    name: 'West End',
    center: [40.735, -74.035],
    aqi: 82,
    aqiStatus: 'Moderate',
    polygon: [
      [40.720, -74.050],
      [40.750, -74.045],
      [40.748, -74.015],
      [40.718, -74.020]
    ]
  },
  {
    id: 'dist_04',
    name: 'Riverside',
    center: [40.768, -73.990],
    aqi: 68,
    aqiStatus: 'Moderate',
    polygon: [
      [40.755, -74.005],
      [40.785, -73.995],
      [40.782, -73.965],
      [40.752, -73.975]
    ]
  },
  {
    id: 'dist_05',
    name: 'Eastwood',
    center: [40.725, -73.955],
    aqi: 78,
    aqiStatus: 'Moderate',
    polygon: [
      [40.710, -73.970],
      [40.740, -73.965],
      [40.738, -73.935],
      [40.708, -73.940]
    ]
  },
  {
    id: 'dist_06',
    name: 'Tech Park',
    center: [40.775, -73.948],
    aqi: 45,
    aqiStatus: 'Good',
    polygon: [
      [40.758, -73.960],
      [40.788, -73.955],
      [40.785, -73.925],
      [40.755, -73.930]
    ]
  }
];

export const INITIAL_CORRIDORS: CorridorSegment[] = [
  {
    id: 'cor_01',
    name: 'Grand Avenue Expressway',
    district: 'Downtown Financial',
    coordinates: [
      [40.758896, -73.985130],
      [40.751000, -73.978000],
      [40.742000, -73.973000],
      [40.730000, -73.975000]
    ],
    lengthKm: 4.8,
    speedLimitKmh: 65,
    currentAvgSpeedKmh: 22.5,
    freeFlowSpeedKmh: 62,
    hourlyVolume: 4850,
    capacityVehiclesPerHour: 5200,
    congestionLevel: 'severe',
    congestionScore: 89,
    delayIndex: 2.76,
    airQualityAQI: 142,
    co2EmissionsKgPerHour: 1850,
    dominantMode: 'car',
    modalSplit: { car: 68, bus: 15, bike: 10, walk: 5, other: 2 },
    incidentsCount: 2,
    lastUpdated: 'Just now'
  },
  {
    id: 'cor_02',
    name: 'Riverside Connector',
    district: 'Riverside',
    coordinates: [
      [40.775000, -73.990000],
      [40.760000, -73.985000],
      [40.750000, -73.978000]
    ],
    lengthKm: 3.5,
    speedLimitKmh: 60,
    currentAvgSpeedKmh: 31.0,
    freeFlowSpeedKmh: 58,
    hourlyVolume: 3600,
    capacityVehiclesPerHour: 4500,
    congestionLevel: 'moderate',
    congestionScore: 68,
    delayIndex: 1.94,
    airQualityAQI: 68,
    co2EmissionsKgPerHour: 1240,
    dominantMode: 'car',
    modalSplit: { car: 55, bus: 22, bike: 14, walk: 6, other: 3 },
    incidentsCount: 0,
    lastUpdated: 'Just now'
  },
  {
    id: 'cor_03',
    name: 'Central Boulevard',
    district: 'Central Business District',
    coordinates: [
      [40.755000, -73.990000],
      [40.750000, -73.980000],
      [40.745000, -73.970000]
    ],
    lengthKm: 3.8,
    speedLimitKmh: 60,
    currentAvgSpeedKmh: 27.0,
    freeFlowSpeedKmh: 58,
    hourlyVolume: 4200,
    capacityVehiclesPerHour: 4500,
    congestionLevel: 'severe',
    congestionScore: 82,
    delayIndex: 2.41,
    airQualityAQI: 135,
    co2EmissionsKgPerHour: 1620,
    dominantMode: 'car',
    modalSplit: { car: 62, bus: 20, bike: 10, walk: 5, other: 3 },
    incidentsCount: 1,
    lastUpdated: 'Just now'
  },
  {
    id: 'cor_04',
    name: 'Tech Park Highway',
    district: 'Tech Park',
    coordinates: [
      [40.765000, -73.960000],
      [40.778000, -73.950000],
      [40.790000, -73.945000]
    ],
    lengthKm: 5.1,
    speedLimitKmh: 50,
    currentAvgSpeedKmh: 44.0,
    freeFlowSpeedKmh: 48,
    hourlyVolume: 2200,
    capacityVehiclesPerHour: 4000,
    congestionLevel: 'free_flow',
    congestionScore: 28,
    delayIndex: 1.14,
    airQualityAQI: 45,
    co2EmissionsKgPerHour: 720,
    dominantMode: 'bus',
    modalSplit: { car: 30, bus: 42, bike: 18, walk: 8, other: 2 },
    incidentsCount: 0,
    lastUpdated: '3 mins ago'
  },
  {
    id: 'cor_05',
    name: 'West End Corridor',
    district: 'West End',
    coordinates: [
      [40.740000, -74.040000],
      [40.735000, -74.025000],
      [40.730000, -74.010000]
    ],
    lengthKm: 4.2,
    speedLimitKmh: 70,
    currentAvgSpeedKmh: 52.0,
    freeFlowSpeedKmh: 68,
    hourlyVolume: 3100,
    capacityVehiclesPerHour: 5000,
    congestionLevel: 'free_flow',
    congestionScore: 35,
    delayIndex: 1.31,
    airQualityAQI: 82,
    co2EmissionsKgPerHour: 1100,
    dominantMode: 'car',
    modalSplit: { car: 58, bus: 22, bike: 12, walk: 5, other: 3 },
    incidentsCount: 0,
    lastUpdated: 'Just now'
  },
  {
    id: 'cor_06',
    name: 'Airport Link',
    district: 'Eastwood',
    coordinates: [
      [40.720000, -73.965000],
      [40.715000, -73.950000],
      [40.710000, -73.935000]
    ],
    lengthKm: 4.8,
    speedLimitKmh: 80,
    currentAvgSpeedKmh: 48.0,
    freeFlowSpeedKmh: 76,
    hourlyVolume: 3900,
    capacityVehiclesPerHour: 5500,
    congestionLevel: 'moderate',
    congestionScore: 48,
    delayIndex: 1.58,
    airQualityAQI: 78,
    co2EmissionsKgPerHour: 1450,
    dominantMode: 'car',
    modalSplit: { car: 70, bus: 18, bike: 5, walk: 4, other: 3 },
    incidentsCount: 0,
    lastUpdated: '2 mins ago'
  },
  {
    id: 'cor_07',
    name: 'Downtown Ring Road',
    district: 'Downtown Financial',
    coordinates: [
      [40.725000, -74.015000],
      [40.718000, -74.000000],
      [40.710000, -73.990000]
    ],
    lengthKm: 3.6,
    speedLimitKmh: 50,
    currentAvgSpeedKmh: 19.5,
    freeFlowSpeedKmh: 48,
    hourlyVolume: 3950,
    capacityVehiclesPerHour: 4000,
    congestionLevel: 'severe',
    congestionScore: 92,
    delayIndex: 2.95,
    airQualityAQI: 155,
    co2EmissionsKgPerHour: 1780,
    dominantMode: 'car',
    modalSplit: { car: 64, bus: 20, bike: 8, walk: 6, other: 2 },
    incidentsCount: 1,
    lastUpdated: 'Just now'
  },
  {
    id: 'cor_08',
    name: 'Eastwood Avenue',
    district: 'Eastwood',
    coordinates: [
      [40.735000, -73.965000],
      [40.730000, -73.955000],
      [40.725000, -73.945000]
    ],
    lengthKm: 3.2,
    speedLimitKmh: 50,
    currentAvgSpeedKmh: 38.0,
    freeFlowSpeedKmh: 48,
    hourlyVolume: 2800,
    capacityVehiclesPerHour: 4200,
    congestionLevel: 'moderate',
    congestionScore: 54,
    delayIndex: 1.62,
    airQualityAQI: 78,
    co2EmissionsKgPerHour: 980,
    dominantMode: 'bus',
    modalSplit: { car: 44, bus: 36, bike: 12, walk: 6, other: 2 },
    incidentsCount: 0,
    lastUpdated: 'Just now'
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc_101',
    title: 'Vehicle Accident',
    type: 'accident',
    severity: 'high',
    locationName: 'Grand Avenue Expressway at 42nd St',
    district: 'Downtown Financial',
    coordinates: [40.751000, -73.978000],
    reportedTime: '17:32',
    estimatedResolutionTime: '18:45',
    status: 'in_progress',
    delayImpactMinutes: 28,
    description: 'Two lanes blocked due to commercial vehicle collision. Emergency responders on scene. Synthetic Telemetry.'
  },
  {
    id: 'inc_102',
    title: 'Road Construction',
    type: 'roadwork',
    severity: 'medium',
    locationName: 'Central Boulevard Segment B',
    district: 'Central Business District',
    coordinates: [40.750000, -73.980000],
    reportedTime: '16:48',
    estimatedResolutionTime: '20:00',
    status: 'active',
    delayImpactMinutes: 14,
    description: 'Utility line maintenance occupying rightmost lane. Synthetic Telemetry.'
  },
  {
    id: 'inc_103',
    title: 'Signal Failure',
    type: 'signal_failure',
    severity: 'low',
    locationName: 'Tech Park Highway Intersection',
    district: 'Tech Park',
    coordinates: [40.765000, -73.960000],
    reportedTime: '15:10',
    estimatedResolutionTime: '16:00',
    status: 'active',
    delayImpactMinutes: 6,
    description: 'Flashing yellow fallback mode. Traffic control officer on scene. Synthetic Telemetry.'
  }
];

export const INITIAL_TRANSIT_LINES: TransitLine[] = [
  {
    id: 'tl_bus_42',
    name: 'Bus Route 42 Express',
    code: 'B-42',
    type: 'bus',
    color: '#3b82f6',
    routes: [
      [40.718000, -74.005000],
      [40.742000, -73.982000],
      [40.768000, -73.990000]
    ],
    activeVehicles: 12,
    frequencyMins: 8,
    onTimePerformancePercent: 88.5,
    dailyRidership: 42000,
    stops: [
      { id: 'stop_1', name: 'Downtown Financial Hub', coordinates: [40.718000, -74.005000], routes: ['B-42', 'M-RED'] },
      { id: 'stop_2', name: 'Central Business Square', coordinates: [40.742000, -73.982000], routes: ['B-42', 'LR-GREEN'] },
      { id: 'stop_3', name: 'Riverside North Terminal', coordinates: [40.768000, -73.990000], routes: ['B-42'] }
    ]
  },
  {
    id: 'tl_red_metro',
    name: 'Metro Red Line Express',
    code: 'M-RED',
    type: 'subway',
    color: '#ef4444',
    routes: [
      [40.708000, -74.010000],
      [40.730000, -73.985000],
      [40.755000, -73.970000],
      [40.775000, -73.948000]
    ],
    activeVehicles: 24,
    frequencyMins: 4,
    onTimePerformancePercent: 94.2,
    dailyRidership: 485000,
    stops: [
      { id: 'stop_4', name: 'Financial Center South', coordinates: [40.708000, -74.010000], routes: ['M-RED'] },
      { id: 'stop_5', name: 'Tech Park Central', coordinates: [40.775000, -73.948000], routes: ['M-RED'] }
    ]
  }
];

export const ORIGIN_DESTINATION_FLOWS: OriginDestinationFlow[] = [
  {
    id: 'od_01',
    originDistrict: 'West End',
    destinationDistrict: 'Downtown Financial',
    originCoords: [40.735000, -74.035000],
    destinationCoords: [40.718000, -74.005000],
    dailyCommuters: 165000,
    avgTravelTimeMinutes: 44,
    peakModeShare: { car: 52, bus: 24, rail: 18, bike: 4, pedestrian: 1, scooter: 1 }
  },
  {
    id: 'od_02',
    originDistrict: 'Tech Park',
    destinationDistrict: 'Central Business District',
    originCoords: [40.775000, -73.948000],
    destinationCoords: [40.742000, -73.982000],
    dailyCommuters: 98000,
    avgTravelTimeMinutes: 22,
    peakModeShare: { car: 22, bus: 30, rail: 32, bike: 11, pedestrian: 3, scooter: 2 }
  }
];

export const INITIAL_SCENARIOS: SimulationScenario[] = [
  {
    id: 'scen_01',
    title: 'Downtown Dedicated BRT & Zero-Emission Zone',
    description: 'Convert Grand Ave and Central Blvd rightmost lanes into 24/7 dedicated Bus Rapid Transit corridors with zero-emission fleet priority.',
    author: 'Dr. Elena Rostova',
    createdAt: '2026-09-10',
    parameters: {
      dedicatedBusLanesKm: 18.5,
      congestionTollFeeUSD: 8.50,
      microMobilityHighwaysKm: 12.0,
      trafficSignalAIEnable: true,
      transitFrequencyIncreasePercent: 35
    },
    projectedMetrics: {
      congestionReductionPercent: -22.4,
      avgTransitSpeedIncreaseKmh: +8.4,
      dailyCo2ReductionTons: -36.2,
      publicApprovalScore: 84,
      estimatedCostUSD: 14500000,
      annualEconomicSavingsUSD: 42000000
    }
  }
];

export const HOURLY_TRAFFIC_DATA = [
  { time: '00:00', volume: 1200, avgSpeed: 58, delayIndex: 1.05, isPeak: false },
  { time: '02:00', volume: 750, avgSpeed: 61, delayIndex: 1.02, isPeak: false },
  { time: '04:00', volume: 980, avgSpeed: 60, delayIndex: 1.04, isPeak: false },
  { time: '06:00', volume: 3400, avgSpeed: 46, delayIndex: 1.35, isPeak: false },
  { time: '08:00', volume: 8420, avgSpeed: 24, delayIndex: 2.76, isPeak: true, label: 'Morning Peak (07:00–09:00)' },
  { time: '10:00', volume: 6200, avgSpeed: 38, delayIndex: 1.70, isPeak: false },
  { time: '12:00', volume: 6800, avgSpeed: 34, delayIndex: 1.88, isPeak: false },
  { time: '14:00', volume: 7100, avgSpeed: 31, delayIndex: 2.05, isPeak: false },
  { time: '16:00', volume: 7800, avgSpeed: 28, delayIndex: 2.30, isPeak: false },
  { time: '18:00', volume: 8760, avgSpeed: 22, delayIndex: 3.15, isPeak: true, label: 'Evening Peak (17:00–19:00)' },
  { time: '20:00', volume: 4800, avgSpeed: 42, delayIndex: 1.48, isPeak: false },
  { time: '22:00', volume: 2600, avgSpeed: 52, delayIndex: 1.18, isPeak: false }
];
