import { useEffect, useState } from 'react';
import { Truck, MapPin, Clock, Fuel, DollarSign } from 'lucide-react';
import { mockData } from '../lib/mockData';
import { formatDistance, formatCurrency, getRouteStatusColor } from '../utils/helpers';
import type { Route } from '../types';
import { useNavigate } from "react-router-dom";

export default function Routes() {
  const navigate = useNavigate();
  function startRoute(routeId: string) {
    setRoutes(prev =>
      prev.map(route =>
        route.id === routeId
          ? { ...route, status: "active" }
          : route
      )
    );
  }

  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    setRoutes(mockData.routes);
  }, []);

  const activeRoutes = routes.filter((r) => r.status === 'active');
  const completedRoutes = routes.filter((r) => r.status === 'completed');
  const plannedRoutes = routes.filter((r) => r.status === 'planned');

  const totalDistance = routes.reduce((sum, r) => sum + (r.estimated_distance_km || 0), 0);
  const totalFuelCost = routes.reduce((sum, r) => sum + (r.estimated_fuel_cost || 0), 0);
  const totalBins = routes.reduce((sum, r) => sum + r.total_bins, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Route Optimization</h1>
        <p className="text-gray-500 mt-1">Manage and optimize collection routes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Distance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatDistance(totalDistance)}
              </p>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estimated Fuel Cost</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(totalFuelCost)}
              </p>
            </div>
            <div className="bg-red-100 rounded-lg p-3">
              <Fuel className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bins</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalBins}</p>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {activeRoutes.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Active Routes</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeRoutes.map((route) => (
                <RouteCard
                    key={route.id}
                    route={route}
                    onTrack={(id) => navigate(`/map?routeId=${id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {plannedRoutes.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Planned Routes</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {plannedRoutes.map((route) => (
                <RouteCard key={route.id} route={route} onStart={startRoute}/>
              ))}
            </div>
          </div>
        )}

        {completedRoutes.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Completed Routes</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completedRoutes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Route Efficiency Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">23%</p>
            <p className="text-sm text-gray-600 mt-1">Fuel Savings vs Traditional</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">18%</p>
            <p className="text-sm text-gray-600 mt-1">Time Savings</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <p className="text-2xl font-bold text-amber-600">95%</p>
            <p className="text-sm text-gray-600 mt-1">Route Completion Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RouteCard({
  route,
  onStart,
  onTrack,
}: {
  route: Route;
  onStart?: (id: string) => void;
  onTrack?: (id: string) => void;
}) {
  const completionPercentage = route.total_bins > 0
    ? Math.round((route.bins_collected / route.total_bins) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900">{route.route_name}</h3>
          <p className="text-sm text-gray-600">{route.route_id}</p>
        </div>
        <span
          className={`${getRouteStatusColor(route.status)} text-white text-xs font-medium px-3 py-1 rounded-full`}
        >
          {route.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Truck className="w-4 h-4" />
            <span>Vehicle</span>
          </div>
          <span className="font-medium text-gray-900">
            {route.vehicle?.vehicle_id || 'Unassigned'}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Distance</span>
          </div>
          <span className="font-medium text-gray-900">
            {route.estimated_distance_km ? formatDistance(route.estimated_distance_km) : 'N/A'}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Est. Time</span>
          </div>
          <span className="font-medium text-gray-900">
            {route.estimated_time_minutes ? `${route.estimated_time_minutes} min` : 'N/A'}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>Fuel Cost</span>
          </div>
          <span className="font-medium text-gray-900">
            {route.estimated_fuel_cost ? formatCurrency(route.estimated_fuel_cost) : 'N/A'}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">
            {route.bins_collected}/{route.total_bins} bins
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {route.status === 'active' && (
        <button 
          onClick={() => onTrack?.(route.id)}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
          View Live Tracking
        </button>
      )}

      {route.status === "planned" && (
        <button
          onClick={() => onStart?.(route.id)}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
        >
          Start Route
        </button>
      )}
    </div>
  );
}
