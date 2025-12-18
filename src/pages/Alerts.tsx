import { useEffect, useState } from 'react';
import { Bell, CheckCircle, Filter } from 'lucide-react';
import { mockData } from '../lib/mockData';
import { getAlertPriorityColor, formatTimeAgo } from '../utils/helpers';
import type { Alert } from '../types';

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    setAlerts(mockData.alerts);
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesPriority = priorityFilter === 'all' || alert.priority === priorityFilter;
    const matchesResolved = showResolved || !alert.is_resolved;
    return matchesPriority && matchesResolved;
  });

  const criticalCount = alerts.filter((a) => a.priority === 'critical' && !a.is_resolved).length;
  const warningCount = alerts.filter((a) => a.priority === 'warning' && !a.is_resolved).length;
  const infoCount = alerts.filter((a) => a.priority === 'info' && !a.is_resolved).length;

  const handleResolve = (alertId: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId
          ? { ...alert, is_resolved: true, resolved_at: new Date().toISOString() }
          : alert
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
        <p className="text-gray-500 mt-1">Real-time system alerts and events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Alerts</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{criticalCount}</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <Bell className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Warnings</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">{warningCount}</p>
            </div>
            <div className="bg-amber-100 rounded-full p-3">
              <Bell className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Info</p>
              <p className="text-3xl font-bold text-cyan-600 mt-1">{infoCount}</p>
            </div>
            <div className="bg-cyan-100 rounded-full p-3">
              <Bell className="w-6 h-6 text-cyan-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
            </div>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Show Resolved</span>
            </label>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white rounded-lg shadow-sm border-l-4 ${
              alert.priority === 'critical'
                ? 'border-red-500'
                : alert.priority === 'warning'
                ? 'border-amber-500'
                : 'border-cyan-500'
            } p-5 ${alert.is_resolved ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`${getAlertPriorityColor(alert.priority)} rounded-full w-2 h-2`} />
                  <h3 className="font-bold text-gray-900">{alert.title}</h3>
                  {alert.is_resolved && (
                    <span className="flex items-center space-x-1 text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Resolved</span>
                    </span>
                  )}
                </div>
                <p className="text-gray-700 mb-3">{alert.message}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>Type: {alert.alert_type.replace('_', ' ')}</span>
                  <span>Priority: {alert.priority}</span>
                  {alert.bin_id && <span>Bin: {alert.bin_id}</span>}
                  {alert.vehicle_id && <span>Vehicle: {alert.vehicle_id}</span>}
                  <span>{formatTimeAgo(alert.created_at)}</span>
                </div>
              </div>
              {!alert.is_resolved && (
                <button
                  onClick={() => handleResolve(alert.id)}
                  className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No Alerts Found</h3>
          <p className="text-gray-500">There are no alerts matching your filter criteria</p>
        </div>
      )}
    </div>
  );
}
