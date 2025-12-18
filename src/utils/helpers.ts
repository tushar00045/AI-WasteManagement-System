import { formatDistanceToNow, format } from 'date-fns';
import type { Bin, DashboardStats } from '../types';

export function formatDate(dateString: string): string {
  return format(new Date(dateString), 'MMM dd, yyyy');
}

export function formatDateTime(dateString: string): string {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
}

export function formatTimeAgo(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
}

export function getBinStatusColor(status: Bin['status']): string {
  switch (status) {
    case 'normal':
      return 'bg-green-500';
    case 'approaching_full':
      return 'bg-amber-500';
    case 'requires_collection':
      return 'bg-red-500';
    case 'offline':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
}

export function getBinStatusText(status: Bin['status']): string {
  switch (status) {
    case 'normal':
      return 'Normal';
    case 'approaching_full':
      return 'Approaching Full';
    case 'requires_collection':
      return 'Requires Collection';
    case 'offline':
      return 'Offline';
    default:
      return 'Unknown';
  }
}

export function getAlertPriorityColor(priority: 'critical' | 'warning' | 'info'): string {
  switch (priority) {
    case 'critical':
      return 'bg-red-500';
    case 'warning':
      return 'bg-amber-500';
    case 'info':
      return 'bg-cyan-500';
    default:
      return 'bg-gray-400';
  }
}

export function calculateDashboardStats(bins: Bin[]): DashboardStats {
  const totalBins = bins.length;
  const criticalBins = bins.filter(b => b.fill_level >= 80).length;
  const moderateBins = bins.filter(b => b.fill_level >= 50 && b.fill_level < 80).length;
  const lowBins = bins.filter(b => b.fill_level < 50).length;
  const operationalSensors = bins.filter(b => b.sensor_status === 'operational').length;
  const malfunctioningSensors = bins.filter(b => b.sensor_status !== 'operational').length;

  return {
    totalBins,
    criticalBins,
    moderateBins,
    lowBins,
    totalWasteToday: 0,
    activeVehicles: 0,
    operationalSensors,
    malfunctioningSensors,
  };
}

export function calculateFillLevelPercentage(fillLevel: number): string {
  return `${fillLevel}%`;
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)} tons`;
  }
  return `${kg.toFixed(0)} kg`;
}

export function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`;
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function getFillLevelColor(fillLevel: number): string {
  if (fillLevel >= 80) return 'bg-red-500';
  if (fillLevel >= 50) return 'bg-amber-500';
  return 'bg-green-500';
}

export function getRouteStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-cyan-500';
    case 'completed':
      return 'bg-green-500';
    case 'planned':
      return 'bg-blue-500';
    case 'cancelled':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
}

export function getVehicleStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'idle':
      return 'bg-amber-500';
    case 'maintenance':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
}
