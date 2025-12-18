import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { mockData } from '../lib/mockData';
import { formatDate, formatWeight } from '../utils/helpers';
import type { Bin, WasteStatistic } from '../types';

export default function Analytics() {
  const [bins, setBins] = useState<Bin[]>([]);
  const [statistics, setStatistics] = useState<WasteStatistic[]>([]);

  useEffect(() => {
    setBins(mockData.bins);
    setStatistics(mockData.wasteStatistics);
  }, []);

  const totalRecyclable = bins.reduce((sum, b) => sum + b.recyclable_percentage, 0) / bins.length;
  const totalOrganic = bins.reduce((sum, b) => sum + b.organic_percentage, 0) / bins.length;
  const totalGeneral = bins.reduce((sum, b) => sum + b.general_percentage, 0) / bins.length;
  const totalHazardous = bins.reduce((sum, b) => sum + b.hazardous_percentage, 0) / bins.length;

  const wasteCompositionData = [
    { name: 'Recyclable', value: parseFloat(totalRecyclable.toFixed(1)), color: '#10B981' },
    { name: 'Organic', value: parseFloat(totalOrganic.toFixed(1)), color: '#F59E0B' },
    { name: 'General', value: parseFloat(totalGeneral.toFixed(1)), color: '#6B7280' },
    { name: 'Hazardous', value: parseFloat(totalHazardous.toFixed(1)), color: '#EF4444' },
  ];

  const zoneData = Array.from(new Set(bins.map((b) => b.zone))).map((zone) => {
    const zoneBins = bins.filter((b) => b.zone === zone);
    return {
      zone,
      recyclable: zoneBins.reduce((sum, b) => sum + b.recyclable_percentage, 0) / zoneBins.length,
      organic: zoneBins.reduce((sum, b) => sum + b.organic_percentage, 0) / zoneBins.length,
      general: zoneBins.reduce((sum, b) => sum + b.general_percentage, 0) / zoneBins.length,
    };
  });

  const trendData = statistics.slice(0, 14).reverse().map((stat) => ({
    date: formatDate(stat.stat_date),
    waste: parseFloat((stat.total_waste_collected_kg / 1000).toFixed(1)),
  }));

  const topLocations = bins
    .sort((a, b) => b.fill_level - a.fill_level)
    .slice(0, 5)
    .map((bin) => ({
      location: bin.location_name.substring(0, 20),
      fillLevel: bin.fill_level,
    }));

  const totalContamination = 8.5;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Waste Analytics</h1>
        <p className="text-gray-500 mt-1">Data-driven insights and waste composition analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">City-Wide Waste Composition</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={wasteCompositionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {wasteCompositionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {wasteCompositionData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-700">
                  {item.name}: {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Waste Types by Zone</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={zoneData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="zone" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="recyclable" fill="#10B981" name="Recyclable" />
              <Bar dataKey="organic" fill="#F59E0B" name="Organic" />
              <Bar dataKey="general" fill="#6B7280" name="General" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Weekly Waste Generation Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" label={{ value: 'Tons', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="waste"
                stroke="#2563EB"
                strokeWidth={3}
                name="Waste Collected (tons)"
                dot={{ fill: '#2563EB', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Top 5 High-Waste Locations</h2>
          <div className="space-y-4">
            {topLocations.map((location, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{location.location}</span>
                  <span className="text-sm font-bold text-gray-900">{location.fillLevel}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${location.fillLevel}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Contamination Rate</h2>
          <div className="text-center">
            <div className="relative inline-block">
              <svg className="w-48 h-48" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="8"
                  strokeDasharray={`${totalContamination * 2.51} 251`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <p className="text-4xl font-bold text-gray-900">{totalContamination}%</p>
                  <p className="text-sm text-gray-500">Contamination</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Percentage of incorrectly sorted waste across all bins
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Monthly Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {formatWeight(statistics.slice(0, 30).reduce((sum, s) => sum + s.total_waste_collected_kg, 0))}
            </p>
            <p className="text-sm text-gray-600 mt-2">Total Waste Collected</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {formatWeight(statistics.slice(0, 30).reduce((sum, s) => sum + s.recyclable_kg, 0))}
            </p>
            <p className="text-sm text-gray-600 mt-2">Recyclable Waste</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-600">
              {statistics.slice(0, 30).reduce((sum, s) => sum + s.collections_completed, 0)}
            </p>
            <p className="text-sm text-gray-600 mt-2">Collections Completed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">
              {statistics.slice(0, 30).reduce((sum, s) => sum + s.fuel_consumed_liters, 0).toFixed(0)}L
            </p>
            <p className="text-sm text-gray-600 mt-2">Fuel Consumed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
