import React, { useState } from 'react';
import {
  Settings, Moon, Sun, Globe, Bell, LayoutDashboard,
  Database, Trash2, RotateCcw, Check, Shield, Info, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { settingsService } from '../services/mockServices';

export const SettingsPage = () => {
  const { settings, updateSettings, showToast } = useApp();

  const [notifications, setNotifications] = useState(
    settings?.notifications || {
      weather: true,
      mandi: true,
      tasks: true,
      schemes: false,
    }
  );

  const [dashboardWidgets, setDashboardWidgets] = useState(
    settings?.dashboard || {
      showWeather: true,
      showMandi: true,
      showTasks: true,
      showYield: true,
    }
  );

  const handleThemeChange = (newTheme) => {
    updateSettings({ theme: newTheme });
    showToast(`Switched to ${newTheme} mode`, 'info');
  };

  const handleLanguageChange = (newLang) => {
    updateSettings({ language: newLang });
    showToast(`Default language set to ${newLang === 'en' ? 'English' : 'Hindi'}`, 'info');
  };

  const handleToggleNotif = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    updateSettings({ notifications: updated });
    showToast('Notification preference saved', 'info');
  };

  const handleToggleWidget = (key) => {
    const updated = { ...dashboardWidgets, [key]: !dashboardWidgets[key] };
    setDashboardWidgets(updated);
    updateSettings({ dashboard: updated });
    showToast('Dashboard layout preference saved', 'info');
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all AI chats and disease scan history? Saved profile will remain intact.')) {
      localStorage.removeItem('ff_chat_history');
      localStorage.removeItem('ff_disease_history');
      showToast('Activity logs cleared successfully', 'success');
    }
  };

  const handleResetAll = () => {
    if (window.confirm('Are you sure you want to reset all mock preferences and demo listings to initial defaults?')) {
      settingsService.clearAllData();
      showToast('All settings reset to defaults. Reloading app...', 'warning');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // Estimate storage usage
  const getStorageSize = () => {
    try {
      let total = 0;
      for (let x in localStorage) {
        if (localStorage.hasOwnProperty(x)) {
          total += (localStorage[x].length * 2);
        }
      }
      return (total / 1024).toFixed(1) + ' KB';
    } catch {
      return '14.2 KB';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-400">
              <Settings size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Application Preferences
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Customize appearance, alerts, language, and client data management
              </p>
            </div>
          </div>
        </div>

        <span className="text-xs px-3 py-1 rounded-full font-medium bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 self-start sm:self-auto">
          Local Storage Sync Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Appearance & Theme */}
        <div className="card p-6 border border-gray-200/80 dark:border-gray-800 space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <Sun size={18} className="text-primary-600" />
            Display & Appearance
          </h3>

          <div>
            <label className="label">Interface Theme</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                  settings?.theme !== 'dark'
                    ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/20 ring-2 ring-primary-200 dark:ring-primary-800'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Sun size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Light Mode</p>
                  <p className="text-[11px] text-gray-400">Crisp daytime display</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                  settings?.theme === 'dark'
                    ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/20 ring-2 ring-primary-200 dark:ring-primary-800'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-gray-800 text-primary-400 flex items-center justify-center">
                  <Moon size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Dark Mode</p>
                  <p className="text-[11px] text-gray-400">Saves battery in field</p>
                </div>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <label className="label">Preferred Primary Language</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  settings?.language === 'en'
                    ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/20 ring-2 ring-primary-200'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">English</span>
                {settings?.language === 'en' && <Check size={16} className="text-primary-600" />}
              </button>

              <button
                type="button"
                onClick={() => handleLanguageChange('hi')}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  settings?.language === 'hi'
                    ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/20 ring-2 ring-primary-200'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">हिन्दी (Hindi)</span>
                {settings?.language === 'hi' && <Check size={16} className="text-primary-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Alerts & Notifications */}
        <div className="card p-6 border border-gray-200/80 dark:border-gray-800 space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <Bell size={18} className="text-primary-600" />
            Notification Toggles
          </h3>

          <div className="space-y-3">
            {[
              { key: 'weather', title: 'Severe Weather Warnings', desc: 'Rainfall, frost, and heatwave alerts for your district' },
              { key: 'mandi', title: 'Mandi Price Fluctuations', desc: 'Alerts when your primary crop price changes by >5%' },
              { key: 'tasks', title: 'Farm Task Due Alarms', desc: 'Reminder notifications for scheduled sprayings and irrigations' },
              { key: 'schemes', title: 'New Government Subsidy Schemes', desc: 'Updates when central/state agricultural schemes launch' },
            ].map(({ key, title, desc }) => (
              <div
                key={key}
                onClick={() => handleToggleNotif(key)}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <div className="flex-1 pr-3">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
                <div
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                    notifications[key] ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      notifications[key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Dashboard Modular Widgets */}
        <div className="card p-6 border border-gray-200/80 dark:border-gray-800 space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <LayoutDashboard size={18} className="text-primary-600" />
            Dashboard Widget Personalization
          </h3>

          <div className="space-y-3">
            {[
              { key: 'showWeather', title: 'Live Weather Widget', desc: 'Show 7-day forecast preview on dashboard' },
              { key: 'showMandi', title: 'Live Mandi Price Board', desc: 'Display latest mandi commodity tickers' },
              { key: 'showTasks', title: 'Upcoming Tasks Card', desc: 'Keep track of scheduled calendar events' },
              { key: 'showYield', title: 'Harvest Yield Quick Estimator', desc: 'Shortcut to quick acreage estimator' },
            ].map(({ key, title, desc }) => (
              <div
                key={key}
                onClick={() => handleToggleWidget(key)}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <div className="flex-1 pr-3">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
                <div
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                    dashboardWidgets[key] ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      dashboardWidgets[key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Local Storage & Data Management */}
        <div className="card p-6 border border-gray-200/80 dark:border-gray-800 space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <Database size={18} className="text-primary-600" />
            Client Storage & Reset
          </h3>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Current Local Storage Usage</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">{getStorageSize()}</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Offline Ready
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleClearHistory}
              className="w-full btn-secondary text-sm flex items-center justify-center gap-2 py-2.5 border-gray-300 dark:border-gray-700"
            >
              <Trash2 size={16} className="text-gray-500" />
              <span>Clear Disease Scans & AI Chat History</span>
            </button>

            <button
              onClick={handleResetAll}
              className="w-full btn-danger text-sm flex items-center justify-center gap-2 py-2.5"
            >
              <RotateCcw size={16} />
              <span>Reset Entire App to Factory Demo State</span>
            </button>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 space-y-1">
            <p className="font-semibold text-gray-600 dark:text-gray-300">FarmerFriend Platform v1.0.0</p>
            <p>Smart Farming & Farmer Support Frontend System for Indian Agriculture.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
