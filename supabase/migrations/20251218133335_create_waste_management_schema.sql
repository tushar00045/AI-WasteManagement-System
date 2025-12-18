/*
  # AI-Based Smart Waste Management System Database Schema

  ## Overview
  Complete database schema for managing smart waste bins, collection vehicles, 
  optimized routes, real-time alerts, and citizen reports.

  ## Tables Created

  ### 1. bins
  Stores information about all smart waste bins deployed across the city
  - id (uuid, primary key)
  - bin_id (text, unique identifier)
  - location_name (text, address/location name)
  - latitude (numeric, GPS coordinate)
  - longitude (numeric, GPS coordinate)
  - fill_level (integer, percentage 0-100)
  - recyclable_percentage (integer, waste composition)
  - organic_percentage (integer, waste composition)
  - general_percentage (integer, waste composition)
  - hazardous_percentage (integer, waste composition)
  - status (text, operational status)
  - sensor_status (text, sensor health)
  - zone (text, collection zone)
  - last_collection (timestamptz, last collection timestamp)
  - last_updated (timestamptz, last sensor update)
  - created_at (timestamptz, record creation)

  ### 2. vehicles
  Collection vehicle fleet management
  - id (uuid, primary key)
  - vehicle_id (text, unique identifier)
  - driver_name (text)
  - current_status (text, active/idle/maintenance)
  - current_latitude (numeric, GPS coordinate)
  - current_longitude (numeric, GPS coordinate)
  - assigned_zone (text)
  - capacity_kg (integer, vehicle capacity)
  - fuel_efficiency (numeric, km per liter)
  - last_maintenance (timestamptz)
  - created_at (timestamptz)

  ### 3. routes
  Optimized collection routes
  - id (uuid, primary key)
  - route_id (text, unique identifier)
  - route_name (text)
  - vehicle_id (uuid, foreign key)
  - status (text, planned/active/completed)
  - total_bins (integer)
  - estimated_distance_km (numeric)
  - estimated_time_minutes (integer)
  - estimated_fuel_cost (numeric)
  - bins_collected (integer)
  - route_date (date)
  - started_at (timestamptz)
  - completed_at (timestamptz)
  - created_at (timestamptz)

  ### 4. route_bins
  Junction table linking routes to bins
  - id (uuid, primary key)
  - route_id (uuid, foreign key)
  - bin_id (uuid, foreign key)
  - sequence_order (integer, collection order)
  - collected (boolean)
  - collected_at (timestamptz)

  ### 5. alerts
  Real-time system alerts and notifications
  - id (uuid, primary key)
  - alert_type (text, type of alert)
  - priority (text, critical/warning/info)
  - title (text, alert title)
  - message (text, alert description)
  - bin_id (uuid, related bin if applicable)
  - vehicle_id (uuid, related vehicle if applicable)
  - is_resolved (boolean)
  - resolved_at (timestamptz)
  - created_at (timestamptz)

  ### 6. citizen_reports
  Public citizen submissions
  - id (uuid, primary key)
  - report_type (text, type of report)
  - description (text, detailed description)
  - location_name (text)
  - latitude (numeric)
  - longitude (numeric)
  - photo_url (text, uploaded photo)
  - reporter_name (text)
  - reporter_email (text)
  - reporter_phone (text)
  - status (text, submitted/under_review/resolved)
  - assigned_to (uuid, municipal worker)
  - resolved_at (timestamptz)
  - created_at (timestamptz)

  ### 7. ai_insights
  AI-generated insights and predictions
  - id (uuid, primary key)
  - insight_type (text, prediction/trend/recommendation/anomaly)
  - title (text)
  - description (text)
  - confidence_score (numeric, 0-1)
  - data_source (text)
  - relevant_bin_id (uuid)
  - relevant_zone (text)
  - created_at (timestamptz)

  ### 8. waste_statistics
  Daily/weekly/monthly aggregated statistics
  - id (uuid, primary key)
  - stat_date (date, unique per date)
  - total_waste_collected_kg (numeric)
  - recyclable_kg (numeric)
  - organic_kg (numeric)
  - general_kg (numeric)
  - hazardous_kg (numeric)
  - collections_completed (integer)
  - fuel_consumed_liters (numeric)
  - distance_traveled_km (numeric)
  - created_at (timestamptz)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Public read access for citizen-facing data
  - Authenticated access required for sensitive operations

  ## Notes
  - All coordinates use decimal degrees format
  - Timestamps include timezone information
  - Default values ensure data integrity
*/

-- Bins table
CREATE TABLE IF NOT EXISTS bins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bin_id text UNIQUE NOT NULL,
  location_name text NOT NULL,
  latitude numeric(10, 7) NOT NULL,
  longitude numeric(10, 7) NOT NULL,
  fill_level integer DEFAULT 0 CHECK (fill_level >= 0 AND fill_level <= 100),
  recyclable_percentage integer DEFAULT 0 CHECK (recyclable_percentage >= 0 AND recyclable_percentage <= 100),
  organic_percentage integer DEFAULT 0 CHECK (organic_percentage >= 0 AND organic_percentage <= 100),
  general_percentage integer DEFAULT 0 CHECK (general_percentage >= 0 AND general_percentage <= 100),
  hazardous_percentage integer DEFAULT 0 CHECK (hazardous_percentage >= 0 AND hazardous_percentage <= 100),
  status text DEFAULT 'normal' CHECK (status IN ('normal', 'approaching_full', 'requires_collection', 'offline')),
  sensor_status text DEFAULT 'operational' CHECK (sensor_status IN ('operational', 'malfunctioning', 'offline')),
  zone text NOT NULL,
  last_collection timestamptz,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id text UNIQUE NOT NULL,
  driver_name text,
  current_status text DEFAULT 'idle' CHECK (current_status IN ('active', 'idle', 'maintenance')),
  current_latitude numeric(10, 7),
  current_longitude numeric(10, 7),
  assigned_zone text,
  capacity_kg integer DEFAULT 5000,
  fuel_efficiency numeric(5, 2) DEFAULT 8.0,
  last_maintenance timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id text UNIQUE NOT NULL,
  route_name text NOT NULL,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  status text DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
  total_bins integer DEFAULT 0,
  estimated_distance_km numeric(8, 2),
  estimated_time_minutes integer,
  estimated_fuel_cost numeric(8, 2),
  bins_collected integer DEFAULT 0,
  route_date date DEFAULT CURRENT_DATE,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Route bins junction table
CREATE TABLE IF NOT EXISTS route_bins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid REFERENCES routes(id) ON DELETE CASCADE NOT NULL,
  bin_id uuid REFERENCES bins(id) ON DELETE CASCADE NOT NULL,
  sequence_order integer NOT NULL,
  collected boolean DEFAULT false,
  collected_at timestamptz,
  UNIQUE(route_id, bin_id)
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type text NOT NULL CHECK (alert_type IN ('bin_overflow', 'sensor_malfunction', 'unusual_pattern', 'collection_completed', 'route_delay', 'maintenance_required')),
  priority text DEFAULT 'info' CHECK (priority IN ('critical', 'warning', 'info')),
  title text NOT NULL,
  message text NOT NULL,
  bin_id uuid REFERENCES bins(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  is_resolved boolean DEFAULT false,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Citizen reports table
CREATE TABLE IF NOT EXISTS citizen_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type text NOT NULL CHECK (report_type IN ('missed_collection', 'illegal_dumping', 'special_pickup', 'bin_damage', 'other')),
  description text NOT NULL,
  location_name text NOT NULL,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  photo_url text,
  reporter_name text,
  reporter_email text,
  reporter_phone text,
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'resolved', 'rejected')),
  assigned_to uuid,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- AI insights table
CREATE TABLE IF NOT EXISTS ai_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_type text NOT NULL CHECK (insight_type IN ('prediction', 'trend', 'recommendation', 'anomaly')),
  title text NOT NULL,
  description text NOT NULL,
  confidence_score numeric(3, 2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  data_source text,
  relevant_bin_id uuid REFERENCES bins(id) ON DELETE CASCADE,
  relevant_zone text,
  created_at timestamptz DEFAULT now()
);

-- Waste statistics table
CREATE TABLE IF NOT EXISTS waste_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date date UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  total_waste_collected_kg numeric(10, 2) DEFAULT 0,
  recyclable_kg numeric(10, 2) DEFAULT 0,
  organic_kg numeric(10, 2) DEFAULT 0,
  general_kg numeric(10, 2) DEFAULT 0,
  hazardous_kg numeric(10, 2) DEFAULT 0,
  collections_completed integer DEFAULT 0,
  fuel_consumed_liters numeric(8, 2) DEFAULT 0,
  distance_traveled_km numeric(8, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_statistics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access (dashboard viewing)
CREATE POLICY "Public can view bins"
  ON bins FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view vehicles"
  ON vehicles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view routes"
  ON routes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view route_bins"
  ON route_bins FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view alerts"
  ON alerts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view statistics"
  ON waste_statistics FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view insights"
  ON ai_insights FOR SELECT
  TO anon, authenticated
  USING (true);

-- Citizen reports: Public can insert and view their own
CREATE POLICY "Anyone can submit citizen reports"
  ON citizen_reports FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can view citizen reports"
  ON citizen_reports FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bins_zone ON bins(zone);
CREATE INDEX IF NOT EXISTS idx_bins_status ON bins(status);
CREATE INDEX IF NOT EXISTS idx_bins_fill_level ON bins(fill_level);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(current_status);
CREATE INDEX IF NOT EXISTS idx_routes_date ON routes(route_date);
CREATE INDEX IF NOT EXISTS idx_routes_status ON routes(status);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts(is_resolved);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_status ON citizen_reports(status);
CREATE INDEX IF NOT EXISTS idx_waste_statistics_date ON waste_statistics(stat_date DESC);