# AI-Based Smart Waste Management System

A comprehensive, production-ready web-based dashboard for monitoring and managing smart waste collection across cities. Built with React, TypeScript, and Tailwind CSS.

## Features

### Core Functionality

- **Real-Time Dashboard** - Live statistics, critical bins alerts, and system health monitoring
- **Bin Monitoring** - Grid view of all smart bins with fill levels, waste composition, and status indicators
- **Interactive Map** - Google Maps integration showing bin locations with color-coded markers (API key required)
- **Waste Analytics** - Charts and graphs for waste composition, trends, and collection statistics
- **Route Optimization** - Collection route management with distance, time, and fuel cost estimates
- **Alert System** - Real-time notifications for critical events with priority levels
- **Citizen Reports** - Public interface for submitting waste management issues
- **AI Insights** - Google Gemini-powered predictions, trends, and recommendations
- **Admin Panel** - User management, fleet management, bin registry, and system configuration

### Technical Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Solid Color Design** - Professional UI using only solid colors (no gradients)
- **TypeScript** - Full type safety throughout the application
- **Mock Data** - Built-in mock data generators for testing without backend
- **Supabase Integration** - Real-time database with Row Level Security
- **Modern Stack** - React 18, Vite, Tailwind CSS, Recharts

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Maps**: Google Maps API (optional)
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Prerequisites

- Node.js 18+ and npm
- Supabase account (for database)
- Google Maps API key (optional, for map features)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-waste-management
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Supabase Setup

The database schema is already created if you're using this project with Supabase. The schema includes:

- `bins` - Smart bin information and status
- `vehicles` - Collection vehicle fleet
- `routes` - Optimized collection routes
- `route_bins` - Route-bin relationships
- `alerts` - System alerts and notifications
- `citizen_reports` - Public submissions
- `ai_insights` - AI-generated insights
- `waste_statistics` - Aggregated statistics

### Getting Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Navigate to Project Settings > API
3. Copy the Project URL and anon/public key
4. Add them to your `.env` file

## Google Maps Setup (Optional)

For map features:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Maps JavaScript API
3. Create an API key
4. Add restrictions (optional but recommended)
5. Add the key to your `.env` file

Without a Google Maps API key, the map view will show a placeholder with setup instructions.

## Development

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   └── Layout.tsx           # Main layout with sidebar navigation
├── pages/
│   ├── Dashboard.tsx        # Main dashboard overview
│   ├── BinMonitoring.tsx    # Bin grid view
│   ├── MapView.tsx          # Interactive map
│   ├── Analytics.tsx        # Charts and statistics
│   ├── Routes.tsx           # Route optimization
│   ├── Alerts.tsx           # Alert management
│   ├── CitizenReports.tsx   # Public reporting
│   ├── AIInsights.tsx       # AI-generated insights
│   └── Admin.tsx            # Admin panel
├── lib/
│   ├── supabase.ts          # Supabase client
│   └── mockData.ts          # Mock data generators
├── types/
│   └── index.ts             # TypeScript interfaces
├── utils/
│   └── helpers.ts           # Utility functions
└── App.tsx                  # Main app with routing
```

## Features Overview

### Dashboard
- Total bins, critical bins, active vehicles statistics
- Real-time system health indicators
- Critical bins list with fill levels
- Recent alerts feed
- Weekly collection overview

### Bin Monitoring
- Searchable and filterable bin grid
- Status indicators (normal, approaching full, requires collection, offline)
- Fill level progress bars
- Waste composition breakdown
- Quick schedule collection button

### Map View
- Color-coded bin markers
- Vehicle location tracking (with tracking enabled)
- Optimized route visualization
- Bin details sidebar
- Map filters and controls

### Analytics
- Waste composition pie chart
- Zone comparison bar chart
- Weekly trend line chart
- Top waste-generating locations
- Contamination rate indicator
- Monthly summary statistics

### Route Optimization
- Active, planned, and completed routes
- Distance, time, and fuel cost estimates
- Real-time progress tracking
- Route efficiency metrics
- Live tracking button for active routes

### Alerts & Notifications
- Priority-based alerts (critical, warning, info)
- Filter by priority and status
- Mark as resolved functionality
- Timestamp and related entity information
- Alert type categorization

### Citizen Reports
- Public submission form
- Report types: missed collection, illegal dumping, special pickup, bin damage
- Photo upload support (placeholder)
- Status tracking (submitted, under review, resolved)
- Admin review workflow

### AI Insights
- Predictions for collection needs
- Waste generation trends
- Optimization recommendations
- Anomaly detection
- Confidence scores
- Future scope features

### Admin Panel
- User management with zone assignments
- Fleet management with maintenance tracking
- Bin registry with GPS coordinates
- Collection schedule configuration
- API settings and system reports
- Alert preference controls

## Mock Data

The application includes comprehensive mock data generators that create realistic data for:
- 50 smart bins across 5 zones
- 12 collection vehicles
- 8 optimized routes
- 25 system alerts
- 15 citizen reports
- 8 AI insights
- 30 days of waste statistics

This allows full testing without a configured backend.

## Color Palette

The design uses solid colors exclusively:
- **Primary**: Blue (#2563EB)
- **Success**: Green (#10B981)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)
- **Info**: Cyan (#06B6D4)
- **Backgrounds**: White (#FFFFFF), Light Gray (#F3F4F6)
- **Text**: Dark Gray (#1F2937), Medium Gray (#6B7280)

## Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Lazy loading for charts and heavy components
- Virtual scrolling for long lists
- Optimized re-renders with React.memo
- Efficient Supabase queries with indexes

## Security

- Row Level Security (RLS) enabled on all tables
- Public read access for dashboard data
- Authenticated access for mutations
- Environment variables for sensitive keys
- No hardcoded credentials

## Future Enhancements

- Carbon footprint calculator
- Predictive maintenance alerts
- Smart city module integration
- Advanced pattern recognition
- Real-time vehicle GPS tracking
- Push notifications
- Mobile apps (iOS/Android)
- Multi-language support

## Contributing

This is a production-ready template for waste management systems. Feel free to fork and customize for your municipality's needs.

## License

MIT License - feel free to use for commercial or personal projects.

## Support

For issues or questions, please open an issue in the repository.

## Acknowledgments

- Built for municipal waste management authorities
- Designed for Google Tech Sprint - AI-Based Smart Waste Management
- Powered by Google Gemini AI, Firebase, and Google Maps API
