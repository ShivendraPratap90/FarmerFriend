import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Microscope, CloudSun, Sprout, TrendingUp,
  ShoppingCart, Store, FileText, MessageSquare, CalendarDays,
  User, Settings, LogOut, ChevronRight, Leaf, Shield, X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Microscope, label: 'Disease Detection', path: '/disease-detection' },
  { icon: CloudSun, label: 'Weather', path: '/weather' },
  { icon: Sprout, label: 'Crop Planning', path: '/crop-planning' },
  { icon: TrendingUp, label: 'Yield Prediction', path: '/yield-prediction' },
  { icon: ShoppingCart, label: 'Mandi Prices', path: '/mandi-prices' },
  { icon: Store, label: 'Marketplace', path: '/marketplace' },
  { icon: FileText, label: 'Govt Schemes', path: '/govt-schemes' },
  { icon: MessageSquare, label: 'AI Assistant', path: '/ai-assistant' },
  { icon: CalendarDays, label: 'Farm Calendar', path: '/farming-calendar' },
];

const BOTTOM_ITEMS = [
  { icon: User, label: 'My Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: Shield, label: 'Admin', path: '/admin' },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, profile, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-primary-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">FarmerFriend</h1>
              <p className="text-primary-200 text-xs mt-0.5">Smart Farming Platform</p>
            </div>
          </div>
          {/* Mobile close */}
          <button onClick={onClose} className="lg:hidden text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-primary-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {profile?.name?.charAt(0) || 'F'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{profile?.name || 'Farmer'}</p>
            <p className="text-primary-200 text-xs truncate">{profile?.primaryCrop || 'Wheat'} Farmer • {profile?.landSize || '5.5'} acres</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin px-3 space-y-0.5">
        <p className="px-2 py-1.5 text-xs font-semibold text-primary-200 uppercase tracking-wider">Main Menu</p>
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
          <NavLink key={path} to={path} onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${isActive ? 'bg-white/20 text-white shadow-sm' : 'text-primary-100 hover:bg-white/10 hover:text-white'}`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            <span className="flex-1">{label}</span>
          </NavLink>
        ))}

        <div className="my-2 border-t border-primary-600" />
        <p className="px-2 py-1.5 text-xs font-semibold text-primary-200 uppercase tracking-wider">Account</p>
        {BOTTOM_ITEMS.map(({ icon: Icon, label, path }) => (
          <NavLink key={path} to={path} onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${isActive ? 'bg-white/20 text-white shadow-sm' : 'text-primary-100 hover:bg-white/10 hover:text-white'}`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            <span className="flex-1">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-primary-600">
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-primary-100 hover:bg-white/10 hover:text-white transition-all duration-200 w-full"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
        <p className="text-primary-300 text-xs text-center mt-3">FarmerFriend v1.0 • Demo Mode</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary-800 shadow-sidebar fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile overlay sidebar */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <aside className="relative w-72 bg-primary-800 shadow-sidebar flex flex-col animate-slide-in-right">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
