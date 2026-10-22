import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppLayout from './layouts/AppLayout';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// App pages
import DashboardPage from './pages/DashboardPage';
import DiseaseDetectionPage from './pages/DiseaseDetectionPage';
import WeatherPage from './pages/WeatherPage';
import CropPlanningPage from './pages/CropPlanningPage';
import YieldPredictionPage from './pages/YieldPredictionPage';
import MandiPricesPage from './pages/MandiPricesPage';
import MarketplacePage from './pages/MarketplacePage';
import GovtSchemesPage from './pages/GovtSchemesPage';
import AIAssistantPage from './pages/AIAssistantPage';
import FarmCalendarPage from './pages/FarmCalendarPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Auth */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* App Layout for Farmer Tools */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/crop-planning" element={<CropPlanningPage />} />
            <Route path="/yield-prediction" element={<YieldPredictionPage />} />
            <Route path="/mandi-prices" element={<MandiPricesPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/govt-schemes" element={<GovtSchemesPage />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            <Route path="/farming-calendar" element={<FarmCalendarPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
