import type { Bin, Vehicle, Route, Alert, CitizenReport, AIInsight, WasteStatistic } from '../types';

const zones = ['North', 'South', 'East', 'West', 'Central'];
const locations = [
  'Main Street & 5th Avenue',
  'Central Park Entrance',
  'City Hall Plaza',
  'Shopping District',
  'Residential Area A',
  'Industrial Zone B',
  'University Campus',
  'Hospital District',
  'Business Park',
  'Waterfront Promenade',
  'Market Square',
  'Transit Station',
  'Sports Complex',
  'Community Center',
  'Museum Quarter',
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysAgo));
  return date.toISOString();
}

function randomElement<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

export function generateBins(count: number = 50): Bin[] {
  const bins: Bin[] = [];
  const baseLatitude = 40.7128;
  const baseLongitude = -74.006;

  for (let i = 0; i < count; i++) {
    const fillLevel = randomInt(0, 100);
    let status: Bin['status'];

    if (fillLevel >= 80) status = 'requires_collection';
    else if (fillLevel >= 50) status = 'approaching_full';
    else status = 'normal';

    if (Math.random() < 0.05) status = 'offline';

    const recyclable = randomInt(20, 40);
    const organic = randomInt(15, 35);
    const hazardous = randomInt(0, 5);
    const general = 100 - recyclable - organic - hazardous;

    bins.push({
      id: `bin-${i + 1}`,
      bin_id: `BIN-${String(i + 1).padStart(4, '0')}`,
      location_name: randomElement(locations),
      latitude: baseLatitude + randomFloat(-0.1, 0.1, 6),
      longitude: baseLongitude + randomFloat(-0.1, 0.1, 6),
      fill_level: fillLevel,
      recyclable_percentage: recyclable,
      organic_percentage: organic,
      general_percentage: general,
      hazardous_percentage: hazardous,
      status,
      sensor_status: Math.random() < 0.95 ? 'operational' : 'malfunctioning',
      zone: randomElement(zones),
      last_collection: Math.random() < 0.8 ? randomDate(7) : null,
      last_updated: randomDate(0),
      created_at: randomDate(180),
    });
  }

  return bins;
}

export function generateVehicles(count: number = 12): Vehicle[] {
  const vehicles: Vehicle[] = [];
  const driverNames = ['John Smith', 'Maria Garcia', 'Robert Chen', 'Sarah Johnson', 'Michael Brown', 'Lisa Anderson', 'David Wilson', 'Jennifer Lee', 'James Taylor', 'Emily Martinez', 'Daniel Rodriguez', 'Jessica Davis'];
  const baseLatitude = 40.7128;
  const baseLongitude = -74.006;

  for (let i = 0; i < count; i++) {
    const statuses: Vehicle['current_status'][] = ['active', 'idle', 'maintenance'];
    const status = randomElement(statuses);

    vehicles.push({
      id: `vehicle-${i + 1}`,
      vehicle_id: `VH-${String(i + 1).padStart(3, '0')}`,
      driver_name: driverNames[i] || `Driver ${i + 1}`,
      current_status: status,
      current_latitude: status === 'active' ? baseLatitude + randomFloat(-0.1, 0.1, 6) : null,
      current_longitude: status === 'active' ? baseLongitude + randomFloat(-0.1, 0.1, 6) : null,
      assigned_zone: status !== 'maintenance' ? randomElement(zones) : null,
      capacity_kg: randomInt(4000, 6000),
      fuel_efficiency: randomFloat(6, 10),
      last_maintenance: randomDate(90),
      created_at: randomDate(365),
    });
  }

  return vehicles;
}

export function generateRoutes(count: number = 8, vehicles: Vehicle[]): Route[] {
  const routes: Route[] = [];
  const statuses: Route['status'][] = ['planned', 'active', 'completed'];

  for (let i = 0; i < count; i++) {
    const status = randomElement(statuses);
    const totalBins = randomInt(5, 15);
    const binsCollected = status === 'completed' ? totalBins : status === 'active' ? randomInt(0, totalBins) : 0;

    routes.push({
      id: `route-${i + 1}`,
      route_id: `RT-${String(i + 1).padStart(3, '0')}`,
      route_name: `${randomElement(zones)} Zone Route ${i + 1}`,
      vehicle_id: vehicles[i % vehicles.length]?.id || null,
      status,
      total_bins: totalBins,
      estimated_distance_km: randomFloat(15, 45),
      estimated_time_minutes: randomInt(90, 240),
      estimated_fuel_cost: randomFloat(25, 85),
      bins_collected: binsCollected,
      route_date: new Date().toISOString().split('T')[0],
      started_at: status !== 'planned' ? randomDate(0) : null,
      completed_at: status === 'completed' ? randomDate(0) : null,
      created_at: randomDate(30),
      vehicle: vehicles[i % vehicles.length],
    });
  }

  return routes;
}

export function generateAlerts(count: number = 25): Alert[] {
  const alerts: Alert[] = [];
  const alertTypes: Alert['alert_type'][] = [
    'bin_overflow',
    'sensor_malfunction',
    'unusual_pattern',
    'collection_completed',
    'route_delay',
    'maintenance_required',
  ];

  const alertTemplates = {
    bin_overflow: { title: 'Bin Overflow Alert', priority: 'critical' as const },
    sensor_malfunction: { title: 'Sensor Malfunction Detected', priority: 'warning' as const },
    unusual_pattern: { title: 'Unusual Waste Pattern', priority: 'info' as const },
    collection_completed: { title: 'Collection Completed', priority: 'info' as const },
    route_delay: { title: 'Route Delay', priority: 'warning' as const },
    maintenance_required: { title: 'Maintenance Required', priority: 'warning' as const },
  };

  for (let i = 0; i < count; i++) {
    const alertType = randomElement(alertTypes);
    const template = alertTemplates[alertType];
    const isResolved = Math.random() < 0.6;

    alerts.push({
      id: `alert-${i + 1}`,
      alert_type: alertType,
      priority: template.priority,
      title: template.title,
      message: `${template.title} at ${randomElement(locations)}`,
      bin_id: Math.random() < 0.7 ? `bin-${randomInt(1, 50)}` : null,
      vehicle_id: Math.random() < 0.3 ? `vehicle-${randomInt(1, 12)}` : null,
      is_resolved: isResolved,
      resolved_at: isResolved ? randomDate(7) : null,
      created_at: randomDate(30),
    });
  }

  return alerts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function generateCitizenReports(count: number = 15): CitizenReport[] {
  const reports: CitizenReport[] = [];
  const reportTypes: CitizenReport['report_type'][] = [
    'missed_collection',
    'illegal_dumping',
    'special_pickup',
    'bin_damage',
    'other',
  ];
  const statuses: CitizenReport['status'][] = ['submitted', 'under_review', 'resolved', 'rejected'];
  const baseLatitude = 40.7128;
  const baseLongitude = -74.006;

  for (let i = 0; i < count; i++) {
    const reportType = randomElement(reportTypes);

    reports.push({
      id: `report-${i + 1}`,
      report_type: reportType,
      description: `Citizen reported ${reportType.replace('_', ' ')} issue`,
      location_name: randomElement(locations),
      latitude: baseLatitude + randomFloat(-0.1, 0.1, 6),
      longitude: baseLongitude + randomFloat(-0.1, 0.1, 6),
      photo_url: Math.random() < 0.4 ? `https://picsum.photos/400/300?random=${i}` : null,
      reporter_name: Math.random() < 0.8 ? `Citizen ${i + 1}` : null,
      reporter_email: Math.random() < 0.7 ? `citizen${i + 1}@email.com` : null,
      reporter_phone: Math.random() < 0.6 ? `555-${String(randomInt(1000, 9999))}` : null,
      status: randomElement(statuses),
      assigned_to: Math.random() < 0.5 ? `worker-${randomInt(1, 5)}` : null,
      resolved_at: Math.random() < 0.4 ? randomDate(14) : null,
      created_at: randomDate(60),
    });
  }

  return reports.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function generateAIInsights(count: number = 8): AIInsight[] {
  const insights: AIInsight[] = [];
  const insightTemplates = [
    {
      type: 'prediction' as const,
      title: 'Zone Prediction',
      description: 'Zone 5 likely to need collection in 6 hours based on current fill rates',
    },
    {
      type: 'trend' as const,
      title: 'Recyclable Waste Increase',
      description: 'Recyclable waste increased 15% this month compared to last month',
    },
    {
      type: 'recommendation' as const,
      title: 'Route Consolidation',
      description: 'Consolidate routes 3 and 7 to save 23% fuel based on historical data',
    },
    {
      type: 'trend' as const,
      title: 'Weekend Pattern',
      description: 'Organic waste peaks on weekends by an average of 28%',
    },
    {
      type: 'anomaly' as const,
      title: 'Abnormal Fill Rate',
      description: 'Bin 142 fill rate abnormally high - possible sensor error or unusual dumping',
    },
    {
      type: 'recommendation' as const,
      title: 'Collection Frequency Optimization',
      description: 'Reduce North Zone collection frequency from daily to every 36 hours to save resources',
    },
    {
      type: 'prediction' as const,
      title: 'Heavy Load Forecast',
      description: 'Expected 40% increase in waste generation during upcoming holiday weekend',
    },
    {
      type: 'trend' as const,
      title: 'Contamination Rate Improvement',
      description: 'Waste sorting accuracy improved by 12% since educational campaign launch',
    },
  ];

  for (let i = 0; i < Math.min(count, insightTemplates.length); i++) {
    const template = insightTemplates[i];

    insights.push({
      id: `insight-${i + 1}`,
      insight_type: template.type,
      title: template.title,
      description: template.description,
      confidence_score: randomFloat(0.7, 0.99),
      data_source: 'Google Gemini AI',
      relevant_bin_id: Math.random() < 0.3 ? `bin-${randomInt(1, 50)}` : null,
      relevant_zone: Math.random() < 0.4 ? randomElement(zones) : null,
      created_at: randomDate(7),
    });
  }

  return insights.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function generateWasteStatistics(days: number = 30): WasteStatistic[] {
  const statistics: WasteStatistic[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const totalWaste = randomFloat(2000, 5000);
    const recyclablePercent = randomFloat(0.25, 0.35);
    const organicPercent = randomFloat(0.20, 0.30);
    const hazardousPercent = randomFloat(0.01, 0.03);
    const generalPercent = 1 - recyclablePercent - organicPercent - hazardousPercent;

    statistics.push({
      id: `stat-${i + 1}`,
      stat_date: date.toISOString().split('T')[0],
      total_waste_collected_kg: totalWaste,
      recyclable_kg: totalWaste * recyclablePercent,
      organic_kg: totalWaste * organicPercent,
      general_kg: totalWaste * generalPercent,
      hazardous_kg: totalWaste * hazardousPercent,
      collections_completed: randomInt(20, 50),
      fuel_consumed_liters: randomFloat(200, 500),
      distance_traveled_km: randomFloat(300, 800),
      created_at: date.toISOString(),
    });
  }

  return statistics.sort((a, b) => new Date(b.stat_date).getTime() - new Date(a.stat_date).getTime());
}

export const mockData = {
  bins: generateBins(50),
  vehicles: generateVehicles(12),
  routes: [] as Route[],
  alerts: generateAlerts(25),
  citizenReports: generateCitizenReports(15),
  aiInsights: generateAIInsights(8),
  wasteStatistics: generateWasteStatistics(30),
};

mockData.routes = generateRoutes(8, mockData.vehicles);
