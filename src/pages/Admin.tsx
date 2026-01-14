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

type Worker = {
  id: string;
  name: string;
  email: string;
  zone: string;
};

function UserManagement() {
  const [workers, setWorkers] = useState<Worker[]>([
    { id: "1", name: "Worker 1", email: "worker1@waste-mgmt.city", zone: "North" },
    { id: "2", name: "Worker 2", email: "worker2@waste-mgmt.city", zone: "South" },
  ]);

  const [form, setForm] = useState({ name: "", email: "", zone: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  function addWorker() {
    setWorkers(prev => [
      ...prev,
      { ...form, id: Date.now().toString() }
    ]);
    reset();
  }

  function startEdit(w: Worker) {
    setEditingId(w.id);
    setForm(w);
    setShowForm(true);
  }

  function saveEdit() {
    setWorkers(prev =>
      prev.map(w =>
        w.id === editingId ? { ...form, id: w.id } : w
      )
    );
    reset();
  }

  function deleteWorker(id: string) {
    setWorkers(prev => prev.filter(w => w.id !== id));
  }

  function reset() {
    setForm({ name: "", email: "", zone: "" });
    setEditingId(null);
    setShowForm(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Municipal Workers</h2>

        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add New User
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            placeholder="Zone"
            value={form.zone}
            onChange={e => setForm({ ...form, zone: e.target.value })}
            className="w-full border p-2 rounded"
          />

          <div className="flex gap-2">
            {editingId ? (
              <button
                onClick={saveEdit}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
            ) : (
              <button
                onClick={addWorker}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            )}

            <button
              onClick={reset}
              className="px-3 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* LIST (OLD STYLE PRESERVED) */}
      <div className="space-y-2">
        {workers.map((w) => (
          <div
            key={w.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium text-gray-900">{w.name}</p>
              <p className="text-sm text-gray-600">{w.email}</p>
              <p className="text-xs text-gray-500">
                Zone: {w.zone}
              </p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => startEdit(w)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => deleteWorker(w.id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
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

type BinItem = {
  id: string;
  bin_id: string;
  location: string;
  zone: string;
};

function BinManagement() {
  const [bins, setBins] = useState<BinItem[]>([
    { id: "1", bin_id: "BIN-101", location: "Market Road", zone: "North" },
    { id: "2", bin_id: "BIN-102", location: "Bus Stand", zone: "South" },
  ]);

  const [form, setForm] = useState({ bin_id: "", location: "", zone: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  function addBin() {
    setBins(prev => [
      ...prev,
      { ...form, id: Date.now().toString() }
    ]);
    reset();
  }

  function startEdit(bin: BinItem) {
    setEditingId(bin.id);
    setForm(bin);
    setShowForm(true);
  }

  function saveEdit() {
    setBins(prev =>
      prev.map(b =>
        b.id === editingId ? { ...form, id: b.id } : b
      )
    );
    reset();
  }

  function deleteBin(id: string) {
    setBins(prev => prev.filter(b => b.id !== id));
  }

  function reset() {
    setForm({ bin_id: "", location: "", zone: "" });
    setEditingId(null);
    setShowForm(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Smart Bins</h2>

        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add New Bin
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <input
            placeholder="Bin ID"
            value={form.bin_id}
            onChange={e => setForm({ ...form, bin_id: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            placeholder="Location"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            placeholder="Zone"
            value={form.zone}
            onChange={e => setForm({ ...form, zone: e.target.value })}
            className="w-full border p-2 rounded"
          />

          <div className="flex gap-2">
            {editingId ? (
              <button
                onClick={saveEdit}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
            ) : (
              <button
                onClick={addBin}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            )}

            <button
              onClick={reset}
              className="px-3 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* LIST (OLD STYLE PRESERVED) */}
      <div className="space-y-2">
        {bins.map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium text-gray-900">{b.bin_id}</p>
              <p className="text-sm text-gray-600">{b.location}</p>
              <p className="text-xs text-gray-500">
                Zone: {b.zone}
              </p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => startEdit(b)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => deleteBin(b.id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type ZoneSchedule = {
  zone: string;
  days: string[];
};

function ScheduleManagement() {
  const [schedules, setSchedules] = useState<ZoneSchedule[]>([
    { zone: "North", days: ["Mon", "Wed", "Fri"] },
    { zone: "South", days: ["Tue", "Thu"] },
    { zone: "East", days: ["Mon", "Thu"] },
    { zone: "West", days: ["Wed", "Sat"] },
    { zone: "Central", days: ["Tue", "Fri"] },
  ]);

  const [editingZone, setEditingZone] = useState<string | null>(null);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  function toggleDay(zone: string, day: string) {
    setSchedules(prev =>
      prev.map(z =>
        z.zone === zone
          ? {
              ...z,
              days: z.days.includes(day)
                ? z.days.filter(d => d !== day)
                : [...z.days, day],
            }
          : z
      )
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">
        Collection Schedule Configuration
      </h2>

      <div className="space-y-4">
        {schedules.map((z) => (
          <div key={z.zone} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">{z.zone} Zone</h3>

              <button
                onClick={() =>
                  setEditingZone(editingZone === z.zone ? null : z.zone)
                }
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {editingZone === z.zone ? "Done" : "Edit Schedule"}
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((day) => {
                const active = z.days.includes(day);

                return (
                  <div
                    key={day}
                    onClick={() =>
                      editingZone === z.zone && toggleDay(z.zone, day)
                    }
                    className={`text-center p-2 rounded text-sm cursor-pointer ${
                      active
                        ? "bg-green-100 text-green-700 font-medium"
                        : "bg-white text-gray-400"
                    } ${
                      editingZone === z.zone
                        ? "hover:ring-2 hover:ring-blue-400"
                        : "cursor-default"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-gray-600 mt-2">
              Collection frequency: {z.days.length} times per week
            </p>
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
