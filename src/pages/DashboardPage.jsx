import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CloudSun, Thermometer, Droplets, Wind, TrendingUp, ShoppingCart,
  CalendarDays, AlertTriangle, Zap, Microscope, Sprout, MapPin,
  ArrowRight, Leaf, BarChart3,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { useApp } from '../context/AppContext';
import { StatCard, ChartCard, DashboardCard } from '../components/dashboard/DashboardCards';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { WEATHER_DATA, EXPENSE_CHART_DATA, YIELD_CHART_DATA, MANDI_PRICES, DEMO_TASKS } from '../data/demoData';
import { taskService } from '../services/mockServices';

const QUICK_ACTIONS = [
  { icon: Microscope, label: 'Detect Disease', path: '/disease-detection', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
  { icon: Sprout, label: 'Plan Crops', path: '/crop-planning', color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  { icon: ShoppingCart, label: 'Mandi Prices', path: '/mandi-prices', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { icon: CalendarDays, label: 'Farm Calendar', path: '/farming-calendar', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { profile, settings } = useApp();
  const [tasks, setTasks] = useState([]);
  const weather = WEATHER_DATA['Lucknow'];

  useEffect(() => {
    const stored = taskService.getTasks();
    if (stored.length > 0) setTasks(stored);
    else {
      taskService.saveTasks(DEMO_TASKS);
      setTasks(DEMO_TASKS);
    }
  }, []);

  const upcomingTasks = tasks.filter(t => !t.completed).slice(0, 4);
  const recentMandi = MANDI_PRICES.slice(0, 4);

  const todayStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Leaf size={20} className="text-primary-600" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{todayStr}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {getGreeting()}, {profile?.name?.split(' ')[0] || 'Rajesh'}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
            <MapPin size={14} />
            {profile?.district}, {profile?.state} • {profile?.primaryCrop} Farmer • {profile?.landSize} {profile?.landUnit}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/ai-assistant')} className="btn-primary text-sm">
            <Zap size={15} />
            Ask AI Assistant
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Crops" value="3" subtitle="Wheat, Mustard, Gram" icon={Sprout} iconBg="bg-green-100" trend="+1 this season" trendUp />
        <StatCard title="Tasks Pending" value={upcomingTasks.length.toString()} subtitle="Next 7 days" icon={CalendarDays} iconBg="bg-purple-100" />
        <StatCard title="Wheat Price" value="₹1,880" subtitle="Per quintal • Lucknow" icon={TrendingUp} iconBg="bg-blue-100" trend="+₹40 this week" trendUp />
        <StatCard title="Est. Yield" value="22 qtl" subtitle="Per acre • Wheat" icon={BarChart3} iconBg="bg-yellow-100" trend="+15% vs last yr" trendUp />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Weather Card */}
        <DashboardCard title="Today's Weather" icon={CloudSun}
          badge={<span className="demo-label text-xs ml-1">Demo</span>}
          actions={<button onClick={() => navigate('/weather')} className="btn-ghost text-xs">Full Forecast <ArrowRight size={12} /></button>}
          className="lg:col-span-1"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">{weather.temperature}°C</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{weather.condition}</p>
                <p className="text-xs text-gray-400 mt-1">Feels like {weather.feelsLike}°C</p>
              </div>
              <CloudSun size={52} className="text-yellow-400" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Droplets, label: 'Humidity', value: `${weather.humidity}%` },
                { icon: Wind, label: 'Wind', value: `${weather.windSpeed} km/h` },
                { icon: CloudSun, label: 'Rain', value: `${weather.rainfall}%` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5 text-center">
                  <Icon size={16} className="text-primary-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{value}</p>
                </div>
              ))}
            </div>

            {/* Weather alert */}
            {weather.alerts?.[0] && (
              <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3">
                <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-400">{weather.alerts[0].message}</p>
              </div>
            )}

            {/* 7-day mini */}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">7-Day Forecast</p>
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {weather.forecast.slice(0, 7).map(f => (
                  <div key={f.day} className="flex-shrink-0 text-center px-2 py-2 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <p className="text-xs text-gray-400">{f.day.substring(0, 3)}</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1">{f.high}°</p>
                    <p className="text-xs text-blue-500">{f.rain}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Charts Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Yield chart */}
          <ChartCard title="Estimated Crop Yield" subtitle="Current season comparison (Demo figures)" actions={
            <button onClick={() => navigate('/yield-prediction')} className="btn-ghost text-xs">Predict <ArrowRight size={12} /></button>
          }>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={YIELD_CHART_DATA} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="crop" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v, n) => [`${v} qtl`, n]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="lastYear" name="Last Year" fill="#a7f3d0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expected" name="Expected" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual" fill="#166534" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Expense chart */}
          <ChartCard title="Monthly Farming Expenses" subtitle="Last 6 months — demo illustrative data" actions={
            <span className="demo-label text-xs">Sample Data</span>
          }>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={EXPENSE_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, '']} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="fertilizer" name="Fertilizer" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="labor" name="Labor" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="seeds" name="Seeds" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Tasks */}
        <DashboardCard title="Upcoming Tasks" icon={CalendarDays}
          actions={<button onClick={() => navigate('/farming-calendar')} className="btn-ghost text-xs">View All <ArrowRight size={12} /></button>}
        >
          {upcomingTasks.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No upcoming tasks. Add tasks in the Farming Calendar!</p>
          ) : (
            <div className="space-y-2">
              {upcomingTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{task.title}</p>
                    <p className="text-xs text-gray-400">{task.crop} • {new Date(task.date).toLocaleDateString('en-IN')}</p>
                  </div>
                  <span className={`badge text-xs ${task.priority === 'high' ? 'badge-red' : task.priority === 'medium' ? 'badge-yellow' : 'badge-green'}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>

        {/* Mandi prices */}
        <DashboardCard title="Nearby Mandi Prices" icon={ShoppingCart}
          badge={<span className="demo-label text-xs ml-1">Sample Data</span>}
          actions={<button onClick={() => navigate('/mandi-prices')} className="btn-ghost text-xs">View All <ArrowRight size={12} /></button>}
        >
          <div className="space-y-2">
            {recentMandi.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{m.crop}</p>
                  <p className="text-xs text-gray-400">{m.market}, {m.state}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary-700 dark:text-primary-400">₹{m.modal.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Modal/qtl</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Quick Actions */}
      <DashboardCard title="Quick Actions" icon={Zap}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ icon: Icon, label, path, color }) => (
            <button key={path} onClick={() => navigate(path)}
              className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-md transition-all duration-200 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                <Icon size={22} />
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">{label}</span>
            </button>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export default DashboardPage;
