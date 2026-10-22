import React, { useState } from 'react';
import {
  User, MapPin, Phone, Mail, Sprout, ShieldCheck,
  Save, CheckCircle, Award, Landmark, Tractor, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STATES_DISTRICTS } from '../data/demoData';

export const ProfilePage = () => {
  const { profile, updateProfile, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    state: profile?.state || 'Uttar Pradesh',
    district: profile?.district || 'Ghaziabad',
    village: profile?.village || '',
    landSize: profile?.landSize || '5.0',
    landUnit: profile?.landUnit || 'acres',
    soilType: profile?.soilType || 'Alluvial',
    primaryCrop: profile?.primaryCrop || 'Wheat',
    secondaryCrops: profile?.secondaryCrops || 'Mustard, Potato, Gram',
    irrigationSource: profile?.irrigationSource || 'Tube Well & Drip',
    farmingMethod: profile?.farmingMethod || 'Precision Farming',
    kccHolder: profile?.kccHolder ?? true,
    pmKisanBeneficiary: profile?.pmKisanBeneficiary ?? true,
  });

  React.useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.name || prev.name,
        email: profile.email || prev.email,
        phone: profile.phone || prev.phone,
        state: profile.state || prev.state,
        district: profile.district || prev.district,
        village: profile.village || prev.village,
        landSize: profile.landSize || prev.landSize,
        landUnit: profile.landUnit || prev.landUnit,
        soilType: profile.soilType || prev.soilType,
        primaryCrop: profile.primaryCrop || prev.primaryCrop,
      }));
    }
  }, [profile]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const availableDistricts = STATES_DISTRICTS[formData.state] || STATES_DISTRICTS['Uttar Pradesh'];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      updateProfile(formData);
      setIsSaving(false);
      setIsEditing(false);
      showToast('Farmer profile updated successfully!', 'success');
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-400">
              <User size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Farmer Profile & Land Records
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Manage your agricultural profile, farm holdings, and government identification
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary text-sm"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Profile Overview Card / Digital Kisan ID */}
      <div className="card overflow-hidden border border-gray-200/80 dark:border-gray-800">
        <div className="h-28 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-600 relative p-6">
          <div className="absolute right-4 top-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-300" />
            <span>Verified Farmer (Demo ID: FF-UP-8492)</span>
          </div>
        </div>

        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-800 p-1.5 shadow-md flex-shrink-0">
                <div className="w-full h-full rounded-xl bg-primary-700 flex items-center justify-center text-white text-3xl font-extrabold shadow-inner">
                  {formData.name.charAt(0)}
                </div>
              </div>
              <div className="mb-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  {formData.name}
                  <Award size={18} className="text-amber-500" />
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPin size={13} className="text-primary-600" />
                  {formData.village}, {formData.district}, {formData.state}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="badge-green flex items-center gap-1">
                <CheckCircle size={12} /> PM-KISAN Active
              </span>
              <span className="badge-blue flex items-center gap-1">
                <Landmark size={12} /> KCC Card Holder
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <p className="text-xs text-gray-400">Total Cultivable Land</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">{formData.landSize} Acres</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <p className="text-xs text-gray-400">Primary Crop</p>
              <p className="text-lg font-bold text-primary-700 dark:text-primary-400 mt-0.5">{formData.primaryCrop}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <p className="text-xs text-gray-400">Soil Quality</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">{formData.soilType}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <p className="text-xs text-gray-400">Farming Method</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">{formData.farmingMethod}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit or Details Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal & Contact */}
        <div className="card p-6 border border-gray-200/80 dark:border-gray-800 space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <User size={18} className="text-primary-600" />
            Personal & Location Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Farmer Full Name *</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="input disabled:bg-gray-50 dark:disabled:bg-gray-800/60 disabled:cursor-not-allowed"
                required
              />
            </div>

            <div>
              <label className="label">Mobile Number</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="input pl-9 disabled:bg-gray-50 dark:disabled:bg-gray-800/60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="input pl-9 disabled:bg-gray-50 dark:disabled:bg-gray-800/60 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">State</label>
              <select
                disabled={!isEditing}
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value, district: STATES_DISTRICTS[e.target.value]?.[0] || '' })}
                className="input disabled:bg-gray-50 dark:disabled:bg-gray-800/60 disabled:cursor-not-allowed"
              >
                {Object.keys(STATES_DISTRICTS).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">District</label>
              <select
                disabled={!isEditing}
                value={formData.district}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
                className="input disabled:bg-gray-50 dark:disabled:bg-gray-800/60 disabled:cursor-not-allowed"
              >
                {availableDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Village / Gram Panchayat</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.village}
                onChange={e => setFormData({ ...formData, village: e.target.value })}
                className="input disabled:bg-gray-50 dark:disabled:bg-gray-800/60 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Farm & Agriculture Details */}
        <div className="card p-6 border border-gray-200/80 dark:border-gray-800 space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <Tractor size={18} className="text-primary-600" />
            Agricultural Land & Cultivation Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Total Land Holding</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  disabled={!isEditing}
                  value={formData.landSize}
                  onChange={e => setFormData({ ...formData, landSize: e.target.value })}
                  className="input disabled:bg-gray-50 dark:disabled:bg-gray-800/60 disabled:cursor-not-allowed"
                />
                <select
                  disabled={!isEditing}
                  value={formData.landUnit}
                  onChange={e => setFormData({ ...formData, landUnit: e.target.value })}
                  className="input w-28 disabled:bg-gray-50 dark:disabled:bg-gray-800/60 disabled:cursor-not-allowed"
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                  <option value="bigha">Bigha</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Predominant Soil Type</label>
              <select
                disabled={!isEditing}
                value={formData.soilType}
                onChange={e => setFormData({ ...formData, soilType: e.target.value })}
                className="input disabled:bg-gray-50 dark:disabled:bg-gray-800/60 disabled:cursor-not-allowed"
              >
                <option value="Alluvial">Alluvial Soil (जलोढ़ मिट्टी)</option>
                <option value="Black">Black Soil (काली मिट्टी)</option>
                <option value="Red">Red & Yellow Soil (लाल मिट्टी)</option>
                <option value="Loamy">Loamy Soil (दोमट मिट्टी)</option>
                <option value="Sandy">Sandy Loam (बलुई दोमट)</option>
                <option value="Clay">Clay Soil (चिकनी मिट्टी)</option>
              </select>
            </div>

            <div>
              <label className="label">Primary Crop</label>
              <select
                disabled={!isEditing}
                value={formData.primaryCrop}
                onChange={e => setFormData({ ...formData, primaryCrop: e.target.value })}
                className="input disabled:bg-gray-50 dark:disabled:bg-gray-800/60 disabled:cursor-not-allowed"
              >
                <option value="Wheat">Wheat (गेहूं)</option>
                <option value="Rice">Rice / Paddy (धान)</option>
                <option value="Mustard">Mustard (सरसों)</option>
                <option value="Potato">Potato (आलू)</option>
                <option value="Maize">Maize (मक्का)</option>
                <option value="Cotton">Cotton (कपास)</option>
                <option value="Sugarcane">Sugarcane (गन्ना)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Secondary Crops Grown</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.secondaryCrops}
                onChange={e => setFormData({ ...formData, secondaryCrops: e.target.value })}
                className="input disabled:bg-gray-50 dark:disabled:bg-gray-800/60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="label">Irrigation System</label>
              <select
                disabled={!isEditing}
                value={formData.irrigationSource}
                onChange={e => setFormData({ ...formData, irrigationSource: e.target.value })}
                className="input disabled:bg-gray-50 dark:disabled:bg-gray-800/60 disabled:cursor-not-allowed"
              >
                <option value="Tube Well & Drip">Tube Well + Drip Irrigation</option>
                <option value="Canal Irrigation">Canal Irrigation</option>
                <option value="Sprinkler System">Sprinkler System</option>
                <option value="Borewell Flood">Borewell Flood Irrigation</option>
                <option value="Rainfed Only">Rainfed (Barani)</option>
              </select>
            </div>

            <div>
              <label className="label">Farming Practice</label>
              <select
                disabled={!isEditing}
                value={formData.farmingMethod}
                onChange={e => setFormData({ ...formData, farmingMethod: e.target.value })}
                className="input disabled:bg-gray-50 dark:disabled:bg-gray-800/60 disabled:cursor-not-allowed"
              >
                <option value="Precision Farming">Precision & Modern Farming</option>
                <option value="Organic Farming">Certified Organic Farming</option>
                <option value="Natural Farming (ZBNF)">Zero Budget Natural Farming</option>
                <option value="Conventional">Conventional Chemical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {isEditing && (
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Save size={16} />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;
