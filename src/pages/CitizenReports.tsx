import { useEffect, useState } from 'react';
import { MessageSquare, Upload, MapPin } from 'lucide-react';
import { mockData } from '../lib/mockData';
import { formatTimeAgo } from '../utils/helpers';
import type { CitizenReport } from '../types';

export default function CitizenReports() {
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    report_type: 'missed_collection' as CitizenReport['report_type'],
    description: '',
    location_name: '',
    reporter_name: '',
    reporter_email: '',
    reporter_phone: '',
  });

  useEffect(() => {
    setReports(mockData.citizenReports);
  }, []);
  
  function startReview(reportId: string) {
    setReports(prev =>
      prev.map(r =>
        r.id === reportId
          ? { ...r, status: "under_review" }
          : r
      )
    );
  }
  
  function rejectReport(reportId: string) {
    setReports(prev =>
      prev.filter(r => r.id !== reportId)
    );
  }


  const submittedCount = reports.filter((r) => r.status === 'submitted').length;
  const underReviewCount = reports.filter((r) => r.status === 'under_review').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: CitizenReport = {
      id: `report-${reports.length + 1}`,
      ...formData,
      latitude: null,
      longitude: null,
      photo_url: null,
      status: 'submitted',
      assigned_to: null,
      resolved_at: null,
      created_at: new Date().toISOString(),
    };
    setReports([newReport, ...reports]);
    setShowForm(false);
    setFormData({
      report_type: 'missed_collection',
      description: '',
      location_name: '',
      reporter_name: '',
      reporter_email: '',
      reporter_phone: '',
    });
  };

  const getStatusColor = (status: CitizenReport['status']) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-500';
      case 'under_review':
        return 'bg-amber-500';
      case 'resolved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Citizen Reports</h1>
          <p className="text-gray-500 mt-1">Public submissions and feedback</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          {showForm ? 'Cancel' : 'Submit New Report'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Submit a Report</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select title="hello"
                value={formData.report_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    report_type: e.target.value as CitizenReport['report_type'],
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="missed_collection">Missed Collection</option>
                <option value="illegal_dumping">Illegal Dumping</option>
                <option value="special_pickup">Special Pickup Request</option>
                <option value="bin_damage">Bin Damage</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.location_name}
                  onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                  placeholder="Enter location address"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the issue in detail..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.reporter_name}
                  onChange={(e) => setFormData({ ...formData, reporter_name: e.target.value })}
                  placeholder="Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.reporter_email}
                  onChange={(e) => setFormData({ ...formData, reporter_email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.reporter_phone}
                  onChange={(e) => setFormData({ ...formData, reporter_phone: e.target.value })}
                  placeholder="555-1234"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                Photo upload (coming soon - requires storage configuration)
              </span>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Submit Report
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Submitted</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{submittedCount}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Under Review</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{underReviewCount}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Resolved</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{resolvedCount}</p>
        </div>
      </div>

      <div className="space-y-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span
                    className={`${getStatusColor(report.status)} text-white text-xs font-medium px-3 py-1 rounded-full`}
                  >
                    {report.status.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {report.report_type.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-gray-900 mb-2">{report.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{report.location_name}</span>
                  </div>
                  {report.reporter_name && <span>By: {report.reporter_name}</span>}
                  <span>{formatTimeAgo(report.created_at)}</span>
                </div>
              </div>
              {report.photo_url && (
                <img
                  src={report.photo_url}
                  alt="Report"
                  className="w-24 h-24 object-cover rounded-lg ml-4"
                />
              )}
            </div>
            {report.status === 'submitted' && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={() => startReview(report.id)}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  Start Review
                </button>
            
                <button
                  onClick={() => rejectReport(report.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {reports.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No Reports Yet</h3>
          <p className="text-gray-500">Be the first to submit a report</p>
        </div>
      )}
    </div>
  );
}
