import { useEffect, useState } from 'react';
import { Trash2, AlertTriangle, TrendingUp, Truck, Activity } from 'lucide-react';
import { mockData } from '../lib/mockData';
import { calculateDashboardStats, formatWeight, formatTimeAgo } from '../utils/helpers';
import type { Bin, Vehicle, WasteStatistic, Alert } from '../types';

export default function Dashboard() {
  const [bins, setBins] = useState<Bin[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [statistics, setStatistics] = useState<WasteStatistic[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    setBins(mockData.bins);
    setVehicles(mockData.vehicles);
    setStatistics(mockData.wasteStatistics);
    setRecentAlerts(mockData.alerts.filter(a => !a.is_resolved).slice(0, 5));
  }, []);

  const stats = calculateDashboardStats(bins);
  const activeVehicles = vehicles.filter(v => v.current_status === 'active').length;
  const todayStats = statistics[0];

  const statCards = [
    {
      name: 'Total Smart Bins',
      value: stats.totalBins,
      icon: Trash2,
      color: 'bg-blue-500',
    },
    {
      name: 'Require Collection',
      value: stats.criticalBins,
      icon: AlertTriangle,
      color: 'bg-red-500',
      subtext: `${stats.moderateBins} approaching full`,
    },
    {
      name: 'Waste Today',
      value: todayStats ? formatWeight(todayStats.total_waste_collected_kg) : '0 kg',
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      name: 'Active Vehicles',
      value: `${activeVehicles}/${vehicles.length}`,
      icon: Truck,
      color: 'bg-cyan-500',
    },
    {
      name: 'System Health',
      value: `${stats.operationalSensors}/${stats.totalBins}`,
      icon: Activity,
      color: 'bg-amber-500',
      subtext: `${stats.malfunctioningSensors} sensors offline`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Real-time monitoring of your waste management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600 mt-1">{stat.name}</p>
            {stat.subtext && (
              <p className="text-xs text-gray-500 mt-2">{stat.subtext}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Critical Bins</h2>
          <div className="space-y-3">
            {bins
              .filter(b => b.status === 'requires_collection')
              .slice(0, 5)
              .map((bin) => (
                <div
                  key={bin.id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{bin.bin_id}</p>
                    <p className="text-sm text-gray-600">{bin.location_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">{bin.fill_level}%</p>
                    <p className="text-xs text-gray-500">{formatTimeAgo(bin.last_updated)}</p>
                  </div>
                </div>
              ))}
            {bins.filter(b => b.status === 'requires_collection').length === 0 && (
              <p className="text-gray-500 text-center py-4">No critical bins at this time</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Alerts</h2>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div
                  className={`${
                    alert.priority === 'critical'
                      ? 'bg-red-500'
                      : alert.priority === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-cyan-500'
                  } rounded-full w-2 h-2 mt-2`}
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{alert.title}</p>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(alert.created_at)}</p>
                </div>
              </div>
            ))}
            {recentAlerts.length === 0 && (
              <p className="text-gray-500 text-center py-4">No active alerts</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Weekly Collection Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {statistics.slice(0, 7).reduce((sum, s) => sum + s.collections_completed, 0)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Collections</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {formatWeight(statistics.slice(0, 7).reduce((sum, s) => sum + s.total_waste_collected_kg, 0))}
            </p>
            <p className="text-sm text-gray-600 mt-1">Waste Collected</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <p className="text-2xl font-bold text-amber-600">
              {statistics.slice(0, 7).reduce((sum, s) => sum + s.distance_traveled_km, 0).toFixed(0)} km
            </p>
            <p className="text-sm text-gray-600 mt-1">Distance Traveled</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">
              {statistics.slice(0, 7).reduce((sum, s) => sum + s.fuel_consumed_liters, 0).toFixed(0)} L
            </p>
            <p className="text-sm text-gray-600 mt-1">Fuel Consumed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
