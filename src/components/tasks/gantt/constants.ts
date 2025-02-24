
export const ZOOM_LEVELS = {
  hours: {
    scales: [
      { unit: 'day', format: '%d %M' },
      { unit: 'hour', format: '%H:00' }
    ]
  },
  days: {
    scales: [
      { unit: 'month', format: '%F %Y' },
      { unit: 'day', format: '%j %D' }
    ]
  },
  weeks: {
    scales: [
      { unit: 'year', format: '%Y' },
      { unit: 'week', format: 'Semaine %W' }
    ]
  },
  months: {
    scales: [
      { unit: 'year', format: '%Y' },
      { unit: 'month', format: '%F' }
    ]
  }
};

export const PRIORITY_COLORS = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#3b82f6',
  urgent: '#e11d48'
};

export const STATUS_COLORS = {
  todo: '#94a3b8',
  in_progress: '#3b82f6',
  review: '#f59e0b',
  done: '#22c55e',
  pending: '#9333ea',
  rejected: '#ef4444',
  assigned: '#0ea5e9'
};
