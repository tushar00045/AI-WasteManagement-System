import { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { mockData } from '../lib/mockData';
import {
  getBinStatusColor,
  getBinStatusText,
  formatTimeAgo,
  getFillLevelColor,
} from '../utils/helpers';
import type { Bin } from '../types';

export default function BinMonitoring() {
  const [bins, setBins] = useState<Bin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');

  useEffect(() => {
    setBins(mockData.bins);
  }, []);

  const filteredBins = bins.filter((bin) => {
    const matchesSearch =
      bin.bin_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bin.location_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bin.status === statusFilter;
    const matchesZone = zoneFilter === 'all' || bin.zone === zoneFilter;

    return matchesSearch && matchesStatus && matchesZone;
  });

  const zones = Array.from(new Set(bins.map((b) => b.zone)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bin Monitoring</h1>
        <p className="text-gray-500 mt-1">Real-time status of all smart bins</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by bin ID or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="requires_collection">Requires Collection</option>
                <option value="approaching_full">Approaching Full</option>
                <option value="normal">Normal</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Zones</option>
              {zones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone} Zone
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBins.map((bin) => (
          <div
            key={bin.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900">{bin.bin_id}</h3>
                <p className="text-sm text-gray-600">{bin.location_name}</p>
              </div>
              <div className={`${getBinStatusColor(bin.status)} rounded-full w-3 h-3`} />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Fill Level</span>
                <span className="text-sm font-bold text-gray-900">{bin.fill_level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${getFillLevelColor(bin.fill_level)} h-3 rounded-full transition-all`}
                  style={{ width: `${bin.fill_level}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Recyclable:</span>
                <span className="font-medium text-gray-900">{bin.recyclable_percentage}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Organic:</span>
                <span className="font-medium text-gray-900">{bin.organic_percentage}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">General:</span>
                <span className="font-medium text-gray-900">{bin.general_percentage}%</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium text-gray-700">{getBinStatusText(bin.status)}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-gray-500">Zone:</span>
                <span className="font-medium text-gray-700">{bin.zone}</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Updated {formatTimeAgo(bin.last_updated)}
              </div>
            </div>

            {bin.status === 'requires_collection' && (
              <button className="w-full mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                Schedule Collection
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredBins.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No bins found matching your criteria</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <p className="text-sm text-gray-600">
          Showing {filteredBins.length} of {bins.length} bins
        </p>
      </div>
    </div>
  );
}
