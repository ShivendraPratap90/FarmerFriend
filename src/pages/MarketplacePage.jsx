import React, { useState, useEffect } from 'react';
import { Store, Plus, Search, Filter, Heart, Trash2, Edit, X, MessageSquare, Check, AlertCircle, Leaf } from 'lucide-react';
import { marketplaceService } from '../services/mockServices';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Modal, ConfirmDialog } from '../components/common/Modal';
import { useApp } from '../context/AppContext';

const CROP_TYPES = ['Rice', 'Wheat', 'Tomato', 'Potato', 'Onion', 'Mustard', 'Cotton', 'Maize', 'Soybean', 'Gram', 'Other'];

const ListingCard = ({ listing, onFav, onDelete, onEdit, onInquiry }) => {
  const isFav = listing.isFavorite;
  return (
    <div className="card-hover p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">{listing.cropName}</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">• {listing.variety}</span>
            {listing.isOrganic && <span className="badge badge-green flex items-center gap-0.5"><Leaf size={10} />Organic</span>}
            {listing.isOwner && <span className="badge badge-blue">Your Listing</span>}
            <span className="demo-label text-xs">Demo</span>
          </div>
          <p className="text-xs text-gray-400">{listing.location} • Posted {listing.postedDate}</p>
        </div>
        <button onClick={() => onFav(listing.id)}
          className={`p-1.5 rounded-lg flex-shrink-0 transition-colors ${isFav ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:text-red-400 hover:bg-red-50'}`}
        >
          <Heart size={16} className={isFav ? 'fill-current' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Quantity', value: `${listing.quantity} ${listing.quantityUnit}` },
          { label: 'Price', value: `₹${listing.price}/${listing.priceUnit}` },
          { label: 'Quality', value: listing.quality },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2 text-center">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{value}</p>
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p><strong>Farmer:</strong> {listing.farmerName} | <strong>Harvest:</strong> {listing.harvestDate}</p>
        {listing.description && <p className="mt-1 text-gray-400 line-clamp-2">{listing.description}</p>}
      </div>

      <div className="flex gap-2 pt-1">
        {listing.isOwner ? (
          <>
            <button onClick={() => onEdit(listing)} className="btn-ghost flex-1 justify-center text-sm py-2 border border-gray-200 dark:border-gray-700">
              <Edit size={14} /> Edit
            </button>
            <button onClick={() => onDelete(listing.id)} className="btn-ghost flex-1 justify-center text-sm py-2 text-red-500 hover:bg-red-50">
              <Trash2 size={14} /> Delete
            </button>
          </>
        ) : (
          <button onClick={() => onInquiry(listing)} className="btn-primary flex-1 justify-center text-sm py-2">
            <MessageSquare size={14} /> Send Inquiry (Demo)
          </button>
        )}
      </div>
    </div>
  );
};

export const MarketplacePage = () => {
  const { showToast, profile } = useApp();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editListing, setEditListing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [inquiryListing, setInquiryListing] = useState(null);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [form, setForm] = useState({
    cropName: '', variety: '', quantity: '', quantityUnit: 'quintal', price: '', priceUnit: 'quintal',
    quality: 'Grade A', isOrganic: false, harvestDate: '', description: '',
  });

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await marketplaceService.getListings({ crop: cropFilter !== 'all' ? cropFilter : undefined, search });
      setListings(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, [cropFilter]);

  const handleSearch = () => fetchListings();

  const toggleFav = async (id) => {
    const item = listings.find(l => l.id === id);
    await marketplaceService.updateListing(id, { isFavorite: !item.isFavorite });
    setListings(prev => prev.map(l => l.id === id ? { ...l, isFavorite: !l.isFavorite } : l));
    showToast(!item.isFavorite ? 'Added to favorites!' : 'Removed from favorites', 'success');
  };

  const handleAddSubmit = async () => {
    if (!form.cropName || !form.quantity || !form.price) { showToast('Please fill required fields', 'warning'); return; }
    const listing = { ...form, farmerName: profile?.name || 'Demo Farmer', location: `${profile?.district}, ${profile?.state}` };
    await marketplaceService.addListing(listing);
    setShowAddForm(false);
    setEditListing(null);
    resetForm();
    fetchListings();
    showToast('Listing added to marketplace! (Demo)', 'success');
  };

  const handleEdit = (listing) => {
    setEditListing(listing);
    setForm({ cropName: listing.cropName, variety: listing.variety, quantity: listing.quantity, quantityUnit: listing.quantityUnit, price: listing.price, priceUnit: listing.priceUnit, quality: listing.quality, isOrganic: listing.isOrganic, harvestDate: listing.harvestDate, description: listing.description });
    setShowAddForm(true);
  };

  const handleEditSave = async () => {
    if (!form.cropName || !form.quantity || !form.price) { showToast('Fill required fields', 'warning'); return; }
    await marketplaceService.updateListing(editListing.id, form);
    setShowAddForm(false);
    setEditListing(null);
    resetForm();
    fetchListings();
    showToast('Listing updated!', 'success');
  };

  const handleDelete = async () => {
    await marketplaceService.deleteListing(deleteId);
    setDeleteId(null);
    setListings(prev => prev.filter(l => l.id !== deleteId));
    showToast('Listing deleted', 'info');
  };

  const handleInquiry = async () => {
    if (!inquiryMessage.trim()) { showToast('Please enter a message', 'warning'); return; }
    await marketplaceService.submitInquiry(inquiryListing.id, { message: inquiryMessage });
    setInquiryListing(null);
    setInquiryMessage('');
    showToast('Inquiry sent! (Demo — seller not actually notified)', 'success');
  };

  const resetForm = () => setForm({ cropName: '', variety: '', quantity: '', quantityUnit: 'quintal', price: '', priceUnit: 'quintal', quality: 'Grade A', isOrganic: false, harvestDate: '', description: '' });

  const filtered = listings.filter(l => {
    if (!search) return true;
    return l.cropName.toLowerCase().includes(search.toLowerCase()) || l.farmerName.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Store className="text-primary-600" size={26} />
            Farmer-Buyer Marketplace
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Buy and sell crops directly with farmers</p>
        </div>
        <button onClick={() => { setEditListing(null); resetForm(); setShowAddForm(true); }} className="btn-primary flex-shrink-0">
          <Plus size={16} /> Add Listing
        </button>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3 flex gap-2">
        <AlertCircle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-400">This is a demo marketplace. Listings are stored locally. Inquiries are simulated — no real buyers or sellers are contacted. No real payments are processed.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Search crops, farmers, locations..." className="input pl-9" />
        </div>
        <select className="input w-auto" value={cropFilter} onChange={e => setCropFilter(e.target.value)}>
          <option value="all">All Crops</option>
          {CROP_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={handleSearch} className="btn-primary px-5">Search</button>
      </div>

      {loading ? <div className="card p-12"><LoadingSpinner size="lg" text="Loading marketplace..." /></div> : (
        filtered.length === 0 ? (
          <div className="card"><EmptyState icon={Store} title="No listings found" description="Try adjusting your search or filters. Or add a new listing!" action={<button onClick={() => setShowAddForm(true)} className="btn-primary">Add First Listing</button>} /></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(listing => (
              <ListingCard key={listing.id} listing={listing} onFav={toggleFav} onDelete={id => setDeleteId(id)} onEdit={handleEdit} onInquiry={l => setInquiryListing(l)} />
            ))}
          </div>
        )
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showAddForm} onClose={() => { setShowAddForm(false); setEditListing(null); }} title={editListing ? 'Edit Listing' : 'Add New Listing'} size="md"
        footer={<><button onClick={() => { setShowAddForm(false); setEditListing(null); }} className="btn-secondary">Cancel</button><button onClick={editListing ? handleEditSave : handleAddSubmit} className="btn-primary">{editListing ? 'Save Changes' : 'Publish Listing'}</button></>}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Crop Name <span className="text-red-500">*</span></label>
              <select className="input" value={form.cropName} onChange={e => setForm(p => ({ ...p, cropName: e.target.value }))}>
                <option value="">Select crop</option>
                {CROP_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Variety</label>
              <input className="input" placeholder="e.g. Basmati 1509" value={form.variety} onChange={e => setForm(p => ({ ...p, variety: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Quantity <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <input className="input" type="number" placeholder="e.g. 50" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} />
                <select className="input w-28" value={form.quantityUnit} onChange={e => setForm(p => ({ ...p, quantityUnit: e.target.value }))}>
                  <option value="quintal">Qtl</option>
                  <option value="kg">Kg</option>
                  <option value="tonne">Tonne</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Price (₹) <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <input className="input" type="number" placeholder="e.g. 1850" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
                <select className="input w-28" value={form.priceUnit} onChange={e => setForm(p => ({ ...p, priceUnit: e.target.value }))}>
                  <option value="quintal">/ Qtl</option>
                  <option value="kg">/ Kg</option>
                  <option value="tonne">/ Tonne</option>
                </select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Quality Grade</label>
              <select className="input" value={form.quality} onChange={e => setForm(p => ({ ...p, quality: e.target.value }))}>
                {['Premium', 'Grade A', 'Grade B', 'Grade C'].map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Harvest Date</label>
              <input className="input" type="date" value={form.harvestDate} onChange={e => setForm(p => ({ ...p, harvestDate: e.target.value }))} />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isOrganic} onChange={e => setForm(p => ({ ...p, isOrganic: e.target.checked }))} className="w-4 h-4 accent-primary-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Organically grown (no synthetic chemicals)</span>
          </label>
          <div>
            <label className="label">Description</label>
            <textarea className="input h-20 resize-none" placeholder="Describe crop quality, storage, payment terms..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
        </div>
      </Modal>

      {/* Inquiry Modal */}
      <Modal isOpen={!!inquiryListing} onClose={() => { setInquiryListing(null); setInquiryMessage(''); }} title="Send Buyer Inquiry (Demo)" size="sm"
        footer={<><button onClick={() => setInquiryListing(null)} className="btn-secondary">Cancel</button><button onClick={handleInquiry} className="btn-primary">Send Inquiry (Demo)</button></>}
      >
        {inquiryListing && (
          <div className="space-y-4">
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-3">
              <p className="text-sm font-semibold text-primary-700 dark:text-primary-400">{inquiryListing.cropName} — ₹{inquiryListing.price}/{inquiryListing.priceUnit}</p>
              <p className="text-xs text-gray-500">{inquiryListing.farmerName} • {inquiryListing.location}</p>
            </div>
            <div>
              <label className="label">Your Message</label>
              <textarea className="input h-24 resize-none" placeholder="Interested in buying. Please confirm availability and final price..." value={inquiryMessage} onChange={e => setInquiryMessage(e.target.value)} />
            </div>
            <p className="text-xs text-amber-600">⚠️ Demo only — seller will not actually be contacted</p>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Listing" message="Are you sure you want to delete this listing? This action cannot be undone." confirmText="Delete" confirmVariant="danger" />
    </div>
  );
};

export default MarketplacePage;
