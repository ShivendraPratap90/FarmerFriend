import React, { useState } from 'react';
import { FileText, Search, Filter, Bookmark, ExternalLink, CheckCircle, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { schemesService } from '../services/mockServices';
import { GOVT_SCHEMES, CROP_INSURANCE_INFO } from '../data/demoData';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { useApp } from '../context/AppContext';

const CATEGORIES = ['All', 'Income Support', 'Crop Insurance', 'Credit & Finance', 'Sustainable Farming', 'State Scheme'];
const STATES_FILTER = ['All India', 'Uttar Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Madhya Pradesh'];

export const GovtSchemesPage = () => {
  const { showToast } = useApp();
  const [schemes, setSchemes] = useState(GOVT_SCHEMES);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [stateFilter, setStateFilter] = useState('All India');
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_bookmarks') || '[]'); } catch { return []; }
  });
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [expandedInsurance, setExpandedInsurance] = useState(null);

  const filtered = schemes.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.shortDesc.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || s.category === category;
    const matchState = stateFilter === 'All India' || s.states.includes(stateFilter) || s.states.includes('All India');
    return matchSearch && matchCat && matchState;
  });

  const toggleBookmark = (id) => {
    const updated = bookmarks.includes(id) ? bookmarks.filter(b => b !== id) : [...bookmarks, id];
    setBookmarks(updated);
    localStorage.setItem('ff_bookmarks', JSON.stringify(updated));
    showToast(bookmarks.includes(id) ? 'Scheme removed from bookmarks' : 'Scheme bookmarked!', 'success');
  };

  const CAT_COLORS = {
    'Income Support': 'badge-green',
    'Crop Insurance': 'badge-blue',
    'Credit & Finance': 'badge-yellow',
    'Sustainable Farming': 'badge-green',
    'State Scheme': 'badge-red',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FileText className="text-primary-600" size={26} />
            Government Schemes & Crop Insurance
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Discover farming support programs and financial assistance</p>
        </div>
        <span className="demo-label flex-shrink-0">⚠️ Sample Information</span>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-4 flex gap-3">
        <AlertCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700 dark:text-blue-400">Information shown is for demo purposes only. Always verify eligibility and application details from official government sources. Official URLs lead to actual government websites when available.</p>
      </div>

      {/* Search & Filters */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search schemes..." className="input pl-9" />
          </div>
          <select className="input w-auto" value={stateFilter} onChange={e => setStateFilter(e.target.value)}>
            {STATES_FILTER.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${category === cat ? 'bg-primary-700 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100'}`}
            >{cat}</button>
          ))}
        </div>
        {bookmarks.length > 0 && <p className="text-xs text-gray-400">{bookmarks.length} scheme(s) bookmarked</p>}
      </div>

      {/* Scheme Cards */}
      {filtered.length === 0 ? (
        <div className="card"><EmptyState icon={FileText} title="No schemes found" description="Try adjusting your search or filters." /></div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map(scheme => (
            <div key={scheme.id} className="card-hover p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`badge ${CAT_COLORS[scheme.category] || 'badge-blue'}`}>{scheme.category}</span>
                    {scheme.states.includes('All India') && <span className="badge badge-green">Pan India</span>}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-tight">{scheme.name}</h3>
                </div>
                <button onClick={() => toggleBookmark(scheme.id)} className={`p-1.5 rounded-lg flex-shrink-0 transition-colors ${bookmarks.includes(scheme.id) ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300 hover:text-yellow-500 hover:bg-yellow-50'}`}>
                  <Bookmark size={16} className={bookmarks.includes(scheme.id) ? 'fill-current' : ''} />
                </button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">{scheme.shortDesc}</p>

              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Key Benefits:</p>
                <ul className="space-y-1">
                  {scheme.benefits.slice(0, 2).map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                      <CheckCircle size={12} className="text-green-500 flex-shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                  {scheme.benefits.length > 2 && <li className="text-xs text-primary-600">+{scheme.benefits.length - 2} more benefits...</li>}
                </ul>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button onClick={() => setSelectedScheme(scheme)} className="btn-primary text-xs py-2 flex-1 justify-center">View Details</button>
                {scheme.officialUrl ? (
                  <a href={scheme.officialUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-2 flex-shrink-0" title="Official website">
                    <ExternalLink size={13} />
                  </a>
                ) : (
                  <span className="btn-ghost text-xs py-2 text-gray-300 cursor-not-allowed" title="Official URL not configured">
                    <ExternalLink size={13} />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Crop Insurance Section */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-lg flex items-center gap-2">
          🛡️ Crop Insurance Quick Reference
          <span className="demo-label text-xs">Sample Data</span>
        </h2>
        <div className="space-y-3">
          {CROP_INSURANCE_INFO.map((info, i) => (
            <div key={i} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
              <button onClick={() => setExpandedInsurance(expandedInsurance === i ? null : i)}
                className="flex items-center justify-between w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🌾</span>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{info.crop} — {info.scheme}</p>
                    <p className="text-xs text-gray-400">{info.season} Season</p>
                  </div>
                </div>
                {expandedInsurance === i ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>
              {expandedInsurance === i && (
                <div className="px-4 pb-4 pt-2 bg-gray-50 dark:bg-gray-800/50 grid sm:grid-cols-2 gap-3 border-t border-gray-100 dark:border-gray-700">
                  {[
                    { label: 'Premium Rate', value: info.premium },
                    { label: 'Coverage', value: info.coverage },
                    { label: 'Cutoff Date', value: info.cutoffDate },
                    { label: 'Claim Process', value: info.claimProcess },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-gray-400 font-medium">{label}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <Modal isOpen={!!selectedScheme} onClose={() => setSelectedScheme(null)} title={selectedScheme.name} size="lg">
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className={`badge ${CAT_COLORS[selectedScheme.category] || 'badge-blue'}`}>{selectedScheme.category}</span>
              {selectedScheme.states.map(s => <span key={s} className="badge badge-green">{s}</span>)}
              <span className="demo-label">Sample Info</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{selectedScheme.shortDesc}</p>
            {[
              { title: 'Eligibility Criteria', items: selectedScheme.eligibility, icon: '✅' },
              { title: 'Benefits', items: selectedScheme.benefits, icon: '🎁' },
              { title: 'Required Documents', items: selectedScheme.documents, icon: '📄' },
              { title: 'Application Steps', items: selectedScheme.applicationSteps, icon: '📝' },
            ].map(({ title, items, icon }) => (
              <div key={title}>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{icon} {title}</h3>
                <ul className="space-y-1.5">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-primary-600 font-bold flex-shrink-0">{i + 1}.</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {selectedScheme.officialUrl ? (
              <a href={selectedScheme.officialUrl} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center w-full">
                <ExternalLink size={16} /> Visit Official Website
              </a>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-sm text-gray-500 text-center">
                ⚠️ Official application URL not configured for this demo entry. Please search the scheme name on the official government portal.
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GovtSchemesPage;
