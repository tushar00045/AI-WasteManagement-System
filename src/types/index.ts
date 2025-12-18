export interface Bin {
  id: string;
  bin_id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  fill_level: number;
  recyclable_percentage: number;
  organic_percentage: number;
  general_percentage: number;
  hazardous_percentage: number;
  status: 'normal' | 'approaching_full' | 'requires_collection' | 'offline';
  sensor_status: 'operational' | 'malfunctioning' | 'offline';
  zone: string;
  last_collection: string | null;
  last_updated: string;
  created_at: string;
}

export interface Vehicle {
  id: string;
  vehicle_id: string;
  driver_name: string | null;
  current_status: 'active' | 'idle' | 'maintenance';
  current_latitude: number | null;
  current_longitude: number | null;
  assigned_zone: string | null;
  capacity_kg: number;
  fuel_efficiency: number;
  last_maintenance: string | null;
  created_at: string;
}

export interface Route {
  id: string;
  route_id: string;
  route_name: string;
  vehicle_id: string | null;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  total_bins: number;
  estimated_distance_km: number | null;
  estimated_time_minutes: number | null;
  estimated_fuel_cost: number | null;
  bins_collected: number;
  route_date: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  vehicle?: Vehicle;
}

export interface RouteBin {
  id: string;
  route_id: string;
  bin_id: string;
  sequence_order: number;
  collected: boolean;
  collected_at: string | null;
}

export interface Alert {
  id: string;
  alert_type: 'bin_overflow' | 'sensor_malfunction' | 'unusual_pattern' | 'collection_completed' | 'route_delay' | 'maintenance_required';
  priority: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  bin_id: string | null;
  vehicle_id: string | null;
  is_resolved: boolean;
  resolved_at: string | null;
  created_at: string;
}

export interface CitizenReport {
  id: string;
  report_type: 'missed_collection' | 'illegal_dumping' | 'special_pickup' | 'bin_damage' | 'other';
  description: string;
  location_name: string;
  latitude: number | null;
  longitude: number | null;
  photo_url: string | null;
  reporter_name: string | null;
  reporter_email: string | null;
  reporter_phone: string | null;
  status: 'submitted' | 'under_review' | 'resolved' | 'rejected';
  assigned_to: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface AIInsight {
  id: string;
  insight_type: 'prediction' | 'trend' | 'recommendation' | 'anomaly';
  title: string;
  description: string;
  confidence_score: number | null;
  data_source: string | null;
  relevant_bin_id: string | null;
  relevant_zone: string | null;
  created_at: string;
}

export interface WasteStatistic {
  id: string;
  stat_date: string;
  total_waste_collected_kg: number;
  recyclable_kg: number;
  organic_kg: number;
  general_kg: number;
  hazardous_kg: number;
  collections_completed: number;
  fuel_consumed_liters: number;
  distance_traveled_km: number;
  created_at: string;
}

export interface DashboardStats {
  totalBins: number;
  criticalBins: number;
  moderateBins: number;
  lowBins: number;
  totalWasteToday: number;
  activeVehicles: number;
  operationalSensors: number;
  malfunctioningSensors: number;
}
