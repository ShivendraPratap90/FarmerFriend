import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsService, profileService } from '../services/mockServices';
import { DEMO_USER } from '../data/demoData';

const AppContext = createContext();

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('ff_auth'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ff_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [profile, setProfile] = useState(() => profileService.getProfile() || DEMO_USER);
  const [settings, setSettings] = useState(() => settingsService.getSettings());
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apply dark mode
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const login = (userData) => {
    const u = userData || DEMO_USER;
    setUser(u);
    setProfile(u);
    setIsLoggedIn(true);
    localStorage.setItem('ff_auth', 'true');
    localStorage.setItem('ff_user', JSON.stringify(u));
    localStorage.setItem('ff_profile', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    setIsLoggedIn(false);
    localStorage.removeItem('ff_auth');
    localStorage.removeItem('ff_user');
    localStorage.removeItem('ff_profile');
  };

  const updateSettings = (newSettings) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    settingsService.saveSettings(merged);
  };

  const updateProfile = (newProfile) => {
    const merged = { ...profile, ...newProfile };
    setProfile(merged);
    profileService.saveProfile(merged);
  };

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn, user, profile, settings,
      login, logout, updateSettings, updateProfile,
      toasts, showToast, removeToast,
      sidebarOpen, setSidebarOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
};
