import { useEffect, useState } from 'react';
import { MapPin, Navigation, Layers } from 'lucide-react';
import { mockData } from '../lib/mockData';
import { getBinStatusColor, getBinStatusText, getFillLevelColor } from '../utils/helpers';
import type { Bin } from '../types';

export default function MapView() {
  const [bins, setBins] = useState<Bin[]>([]);
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showRoutes, setShowRoutes] = useState(false);

  useEffect(() => {
    setBins(mockData.bins);
  }, []);

  const displayedBins = showCriticalOnly
    ? bins.filter((b) => b.status === 'requires_collection')
    : bins;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Map View</h1>
        <p className="text-gray-500 mt-1">Interactive map of all smart bins and collection routes</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowCriticalOnly(!showCriticalOnly)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showCriticalOnly
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Critical Bins Only
          </button>
          <button
            onClick={() => setShowVehicles(!showVehicles)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showVehicles
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Show Vehicles
          </button>
          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showRoutes
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Show Routes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative bg-gray-200 h-[600px] flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-700 mb-2">Google Maps Integration</h3>
                <p className="text-gray-500 max-w-md">
                  Add your Google Maps API key to the .env file as VITE_GOOGLE_MAPS_API_KEY to
                  display the interactive map with bin locations, vehicle tracking, and optimized
                  routes.
                </p>
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-300 text-left">
                  <p className="text-sm font-medium text-gray-700 mb-2">Quick Setup:</p>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                    <li>Get API key from Google Cloud Console</li>
                    <li>Enable Maps JavaScript API</li>
                    <li>Add key to .env file</li>
                    <li>Restart development server</li>
                  </ol>
                </div>
              </div>

              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-sm text-gray-600">Critical</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full" />
                  <span className="text-sm text-gray-600">Moderate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm text-gray-600">Normal</span>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Navigation className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Layers className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-bold text-gray-900 mb-4">Bin Locations</h3>
            <div className="space-y-2 max-h-[550px] overflow-y-auto">
              {displayedBins.map((bin) => (
                <button
                  key={bin.id}
                  onClick={() => setSelectedBin(bin)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedBin?.id === bin.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{bin.bin_id}</span>
                    <div className={`${getBinStatusColor(bin.status)} rounded-full w-3 h-3`} />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{bin.location_name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{bin.zone} Zone</span>
                    <span className="text-xs font-bold text-gray-700">{bin.fill_level}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedBin && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 mb-4">Bin Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Bin ID</p>
                  <p className="font-medium text-gray-900">{selectedBin.bin_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{selectedBin.location_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium text-gray-900">{getBinStatusText(selectedBin.status)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Fill Level</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${getFillLevelColor(selectedBin.fill_level)} h-3 rounded-full`}
                      style={{ width: `${selectedBin.fill_level}%` }}
                    />
                  </div>
                  <p className="text-right text-sm font-bold text-gray-900 mt-1">
                    {selectedBin.fill_level}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Waste Composition</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Recyclable</span>
                      <span className="font-medium">{selectedBin.recyclable_percentage}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Organic</span>
                      <span className="font-medium">{selectedBin.organic_percentage}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">General</span>
                      <span className="font-medium">{selectedBin.general_percentage}%</span>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Schedule Collection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
