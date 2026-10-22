import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Moon, Sun, ChevronDown, User, Settings, LogOut, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar = ({ onMenuClick }) => {
  const { profile, settings, updateSettings, logout, showToast } = useApp();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
    showToast(`Switched to ${settings.theme === 'dark' ? 'light' : 'dark'} mode`, 'info');
  };

  const toggleLanguage = () => {
    const newLang = settings.language === 'en' ? 'hi' : 'en';
    updateSettings({ language: newLang });
    showToast(`Language changed to ${newLang === 'en' ? 'English' : 'Hindi'}`, 'info');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    showToast('Signed out successfully', 'success');
  };

  const DEMO_NOTIFICATIONS = [
    { id: 1, title: 'Weather Alert', message: 'Heavy rainfall expected tomorrow', time: '2 hrs ago', type: 'warning', read: false },
    { id: 2, title: 'Market Update', message: 'Wheat price increased to ₹1,900/qtl', time: '5 hrs ago', type: 'info', read: false },
    { id: 3, title: 'Task Reminder', message: 'Fertilizer application due tomorrow', time: '1 day ago', type: 'success', read: true },
    { id: 4, title: 'Scheme Deadline', message: 'PM-KISAN registration ends Dec 31', time: '2 days ago', type: 'info', read: true },
  ];

  const unreadCount = DEMO_NOTIFICATIONS.filter(n => !n.read).length;

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      showToast(`Search for "${searchQuery}" - Demo mode`, 'info');
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 z-20 flex items-center px-4 gap-3 shadow-sm">
      {/* Mobile menu toggle */}
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-md hidden sm:block">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search crops, schemes, prices..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
        />
      </div>

      <div className="flex-1 lg:hidden" />

      {/* Right actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Language toggle */}
        <button onClick={toggleLanguage} title="Toggle Language"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
        >
          <Globe size={15} />
          <span className="hidden sm:inline">{settings.language === 'en' ? 'EN' : 'हिं'}</span>
        </button>

        {/* Theme toggle */}
        <button onClick={toggleTheme} title="Toggle Theme"
          className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {settings.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-modal border border-gray-100 dark:border-gray-800 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                <span className="text-xs text-gray-400">Demo notifications</span>
              </div>
              <div className="max-h-72 overflow-y-auto scrollbar-thin">
                {DEMO_NOTIFICATIONS.map(n => (
                  <div key={n.id} className={`px-4 py-3 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${!n.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                    <div className="flex gap-2">
                      {!n.read && <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1.5" />}
                      <div className={!n.read ? '' : 'ml-4'}>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2">
                <button onClick={() => setNotifOpen(false)} className="w-full text-sm text-primary-600 font-medium hover:text-primary-700 py-1 transition-colors">
                  Mark all as read (Demo)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 bg-primary-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {profile?.name?.charAt(0) || 'R'}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
              {profile?.name?.split(' ')[0] || 'Rajesh'}
            </span>
            <ChevronDown size={14} className={`hidden md:block text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-52 bg-white dark:bg-gray-900 rounded-2xl shadow-modal border border-gray-100 dark:border-gray-800 z-50 animate-fade-in overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{profile?.name}</p>
                <p className="text-xs text-gray-400">{profile?.state}</p>
              </div>
              {[
                { icon: User, label: 'My Profile', path: '/profile' },
                { icon: Settings, label: 'Settings', path: '/settings' },
              ].map(({ icon: Icon, label, path }) => (
                <button key={path} onClick={() => { navigate(path); setProfileOpen(false); }}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 w-full text-left transition-colors"
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
              <div className="border-t border-gray-100 dark:border-gray-800" />
              <button onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
