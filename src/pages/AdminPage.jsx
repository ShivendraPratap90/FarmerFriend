import React, { useState } from 'react';
import {
  Shield, Users, Activity, Microscope, FileText, ShoppingBag,
  TrendingUp, Download, CheckCircle, AlertTriangle, Search,
  Filter, Eye, ArrowUpRight, BarChart2, Check
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { useApp } from '../context/AppContext';
import { ADMIN_STATS } from '../data/demoData';

const DEMO_FARMERS = [
  { id: 'F001', name: 'Rajesh Kumar', state: 'Uttar Pradesh', district: 'Lucknow', crop: 'Wheat', acres: 5.5, status: 'Verified', joined: '2024-01-15' },
  { id: 'F002', name: 'Sukhwinder Singh', state: 'Punjab', district: 'Ludhiana', crop: 'Rice', acres: 12.0, status: 'Verified', joined: '2024-02-10' },
  { id: 'F003', name: 'Ramesh Patil', state: 'Maharashtra', district: 'Nashik', crop: 'Grapes', acres: 4.2, status: 'Pending', joined: '2024-03-01' },
  { id: 'F004', name: 'Kishan Lal', state: 'Rajasthan', district: 'Jaipur', crop: 'Mustard', acres: 7.8, status: 'Verified', joined: '2024-03-18' },
  { id: 'F005', name: 'Venkatesh Rao', state: 'Telangana', district: 'Warangal', crop: 'Cotton', acres: 8.5, status: 'Verified', joined: '2024-04-05' },
  { id: 'F006', name: 'Mahesh Sharma', state: 'Madhya Pradesh', district: 'Indore', crop: 'Soybean', acres: 6.0, status: 'Pending', joined: '2024-05-12' },
  { id: 'F007', name: 'Anil Kumar', state: 'Bihar', district: 'Patna', crop: 'Maize', acres: 3.5, status: 'Verified', joined: '2024-06-20' },
];

export const AdminPage = () => {
  const { showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState('all');

  const filteredFarmers = DEMO_FARMERS.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.crop.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = filterState === 'all' || f.state === filterState;
    return matchesSearch && matchesState;
  });

  const handleExportCSV = () => {
    const headers = ['ID,Name,State,District,Crop,Acres,Status,JoinedDate\n'];
    const rows = DEMO_FARMERS.map(f => `${f.id},"${f.name}","${f.state}","${f.district}","${f.crop}",${f.acres},${f.status},${f.joined}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FarmerFriend_Adoption_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Adoption analytics report exported to CSV', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-700 dark:text-purple-400">
              <Shield size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                Extension Officer & Admin Portal
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                  Analytics
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                National agricultural digital adoption metrics, platform health, and farmer outreach
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="btn-primary text-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Download size={16} />
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400">Total Enrolled Farmers</p>
            <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-2">
            {ADMIN_STATS.totalUsers.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-1 text-xs text-green-600 font-semibold">
            <TrendingUp size={12} />
            <span>+14.8% this month</span>
          </div>
        </div>

        <div className="card p-5 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400">AI Disease Diagnoses</p>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center">
              <Microscope size={18} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-2">
            {ADMIN_STATS.diseaseAnalyses.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">94.2% diagnostic match rate</p>
        </div>

        <div className="card p-5 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400">Scheme Inquiries</p>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
              <FileText size={18} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-2">
            {ADMIN_STATS.schemeViews.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">Direct benefit access views</p>
        </div>

        <div className="card p-5 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400">Produce Marketplace</p>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-2">
            {ADMIN_STATS.activeListings} Active
          </p>
          <p className="text-xs text-gray-400 mt-1">{ADMIN_STATS.totalListings} total posted</p>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Daily Active Users */}
        <div className="card p-5 border border-gray-200/80 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                Daily Active Farmers Trend
              </h3>
              <p className="text-xs text-gray-400">Weekly engagement trajectory</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
              Avg: 395/day
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMIN_STATS.dailyActiveUsers}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15803d" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#15803d" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="users" stroke="#15803d" strokeWidth={2.5} fillOpacity={1} fill="url(#userGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Top Consulted Crops */}
        <div className="card p-5 border border-gray-200/80 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                Top Crop Advisory Queries
              </h3>
              <p className="text-xs text-gray-400">Farmer search volume breakdown</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              5 Major Crops
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_STATS.topCrops}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#4ade80" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* System Health Status */}
      <div className="card p-5 border border-gray-200/80 dark:border-gray-800">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-3 flex items-center gap-2">
          <Activity size={16} className="text-primary-600" />
          Platform Microservice & Engine Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Weather API</p>
              <p className="text-[11px] text-gray-400">IMD / Simulated Feed</p>
            </div>
            <span className="badge-green flex items-center gap-1">
              <CheckCircle size={10} /> Online
            </span>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Disease Detection</p>
              <p className="text-[11px] text-gray-400">Vision Model v2.4</p>
            </div>
            <span className="badge-green flex items-center gap-1">
              <CheckCircle size={10} /> Ready
            </span>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Mandi Feeds</p>
              <p className="text-[11px] text-gray-400">Agmarknet Sync</p>
            </div>
            <span className="badge-green flex items-center gap-1">
              <CheckCircle size={10} /> Synced
            </span>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Client Cache</p>
              <p className="text-[11px] text-gray-400">LocalStorage API</p>
            </div>
            <span className="badge-blue flex items-center gap-1">
              <Check size={10} /> Active
            </span>
          </div>
        </div>
      </div>

      {/* Farmers Directory Table */}
      <div className="card overflow-hidden border border-gray-200/80 dark:border-gray-800">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
              Registered Farmers Registry
            </h3>
            <p className="text-xs text-gray-400">Demo registry of active agricultural producers</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search farmers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input pl-8 py-1.5 text-xs w-48"
              />
            </div>

            <select
              value={filterState}
              onChange={e => setFilterState(e.target.value)}
              className="input py-1.5 px-3 text-xs w-auto"
            >
              <option value="all">All States</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Punjab">Punjab</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Telangana">Telangana</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Bihar">Bihar</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 font-semibold border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3">Farmer ID</th>
                <th className="px-5 py-3">Farmer Name</th>
                <th className="px-5 py-3">State & District</th>
                <th className="px-5 py-3">Primary Crop</th>
                <th className="px-5 py-3">Land Holding</th>
                <th className="px-5 py-3">Verification</th>
                <th className="px-5 py-3">Enrolled</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredFarmers.map(farmer => (
                <tr key={farmer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-5 py-3 font-mono font-semibold text-gray-600 dark:text-gray-400">{farmer.id}</td>
                  <td className="px-5 py-3 font-semibold text-gray-900 dark:text-gray-100">{farmer.name}</td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{farmer.district}, {farmer.state}</td>
                  <td className="px-5 py-3">
                    <span className="badge bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                      {farmer.crop}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300 font-medium">{farmer.acres} Acres</td>
                  <td className="px-5 py-3">
                    <span className={farmer.status === 'Verified' ? 'badge-green' : 'badge-yellow'}>
                      {farmer.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{farmer.joined}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => showToast(`Farmer profile ${farmer.id} inspected (Demo)`, 'info')}
                      className="text-primary-600 hover:text-primary-800 font-semibold inline-flex items-center gap-1"
                    >
                      <Eye size={12} />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
