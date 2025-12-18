import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BinMonitoring from './pages/BinMonitoring';
import MapView from './pages/MapView';
import Analytics from './pages/Analytics';
import RoutesPage from './pages/Routes';
import Alerts from './pages/Alerts';
import CitizenReports from './pages/CitizenReports';
import AIInsights from './pages/AIInsights';
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bins" element={<BinMonitoring />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<CitizenReports />} />
          <Route path="/insights" element={<AIInsights />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
