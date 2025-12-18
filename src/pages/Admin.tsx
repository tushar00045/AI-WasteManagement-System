import { useState } from 'react';
import { Users, Truck, Trash2, Calendar, Settings as SettingsIcon, Download } from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'users' | 'vehicles' | 'bins' | 'schedule' | 'settings'>('users');

  const tabs = [
    { id: 'users' as const, label: 'User Management', icon: Users },
    { id: 'vehicles' as const, label: 'Fleet Management', icon: Truck },
    { id: 'bins' as const, label: 'Bin Management', icon: Trash2 },
    { id: 'schedule' as const, label: 'Collection Schedule', icon: Calendar },
    { id: 'settings' as const, label: 'System Settings', icon: SettingsIcon },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Municipal Admin Panel</h1>
        <p className="text-gray-500 mt-1">System configuration and management</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-1 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'vehicles' && <FleetManagement />}
          {activeTab === 'bins' && <BinManagement />}
          {activeTab === 'schedule' && <ScheduleManagement />}
          {activeTab === 'settings' && <SystemSettings />}
        </div>
      </div>
    </div>
  );
}

function UserManagement() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Municipal Workers</h2>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Add New User
        </button>
      </div>

      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Worker {i}</p>
              <p className="text-sm text-gray-600">worker{i}@waste-mgmt.city</p>
              <p className="text-xs text-gray-500">Zone: {['North', 'South', 'East', 'West', 'Central'][i - 1]}</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                Edit
              </button>
              <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FleetManagement() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Collection Vehicles</h2>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Register New Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">VH-{String(i).padStart(3, '0')}</h3>
              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Active</span>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600">Driver: John Doe {i}</p>
              <p className="text-gray-600">Capacity: 5000 kg</p>
              <p className="text-gray-600">Fuel Efficiency: 8.5 km/L</p>
              <p className="text-gray-600">Last Maintenance: 15 days ago</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="flex-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                Edit
              </button>
              <button className="px-3 py-1 text-sm bg-amber-500 text-white rounded hover:bg-amber-600">
                Maintenance
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BinManagement() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Smart Bin Registry</h2>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Register New Bin
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          Use this panel to register new smart bins, update locations, or deactivate faulty bins.
          Each bin must have a unique ID and GPS coordinates.
        </p>
      </div>

      <div className="space-y-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">BIN-{String(i).padStart(4, '0')}</p>
              <p className="text-sm text-gray-600">Location: Main Street & {i}th Avenue</p>
              <p className="text-xs text-gray-500">Status: Operational | Zone: North</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                Edit
              </button>
              <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                Deactivate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduleManagement() {
  const zones = ['North', 'South', 'East', 'West', 'Central'];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Collection Schedule Configuration</h2>

      <div className="space-y-4">
        {zones.map((zone) => (
          <div key={zone} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">{zone} Zone</h3>
              <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                Edit Schedule
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div
                  key={day}
                  className={`text-center p-2 rounded text-sm ${
                    ['Mon', 'Wed', 'Fri'].includes(day)
                      ? 'bg-green-100 text-green-700 font-medium'
                      : 'bg-white text-gray-400'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-2">Collection frequency: 3 times per week</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SystemSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">API Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supabase URL
            </label>
            <input
              type="text"
              placeholder="https://your-project.supabase.co"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Configured via environment variables</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Maps API Key
            </label>
            <input
              type="password"
              placeholder="AIza..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Configured via environment variables</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">System Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
            <Download className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium">Download Monthly Report (PDF)</span>
          </button>

          <button className="flex items-center justify-center space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
            <Download className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-medium">Export Data (Excel)</span>
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Alert Preferences</h2>
        <div className="space-y-3">
          {[
            'Email notifications for critical alerts',
            'SMS alerts for bin overflows',
            'Daily summary reports',
            'Weekly analytics digest',
          ].map((pref, i) => (
            <label key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={i < 2}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">{pref}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
