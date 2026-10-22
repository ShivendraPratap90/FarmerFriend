import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/mockServices';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { STATES_DISTRICTS } from '../data/demoData';

const CROPS = ['Wheat', 'Rice', 'Maize', 'Mustard', 'Potato', 'Tomato', 'Onion', 'Cotton', 'Soybean', 'Gram', 'Sugarcane', 'Other'];
const LANGUAGES = [{ value: 'en', label: 'English' }, { value: 'hi', label: 'हिंदी (Hindi)' }];

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login, showToast } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    state: '', district: '', language: 'en', landSize: '', landUnit: 'acres',
    soilType: '', primaryCrop: '', terms: false,
  });
  const [errors, setErrors] = useState({});

  const set = (key, val) => { setForm(p => ({ ...p, [key]: val })); setErrors(p => ({ ...p, [key]: '' })); };

  const validateStep1 = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.phone) errs.phone = 'Phone number is required';
    else if (!/^\+?[\d\s-]{10,}$/.test(form.phone)) errs.phone = 'Invalid phone number';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!form.state) errs.state = 'Please select a state';
    if (!form.district) errs.district = 'Please select a district';
    if (!form.primaryCrop) errs.primaryCrop = 'Please select your primary crop';
    if (!form.terms) errs.terms = 'You must accept the terms';
    return errs;
  };

  const handleNext = () => {
    const errs = validateStep1();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await authService.register(form);
      login(res.user);
      showToast(`Account created! Welcome, ${res.user.name} 🌾`, 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const districts = form.state ? STATES_DISTRICTS[form.state] || [] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <Leaf size={24} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl">FarmerFriend</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-modal p-8">
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-6">
            {[1, 2].map(s => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 ${s === step ? 'text-primary-700' : s < step ? 'text-green-600' : 'text-gray-300'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s === step ? 'bg-primary-700 text-white' : s < step ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                    {s < step ? <Check size={14} /> : s}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">{s === 1 ? 'Account Info' : 'Farm Details'}</span>
                </div>
                {s < 2 && <div className={`flex-1 h-0.5 rounded-full ${step > 1 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
              </React.Fragment>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{step === 1 ? 'Create your account' : 'Tell us about your farm'}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{step === 1 ? 'Join thousands of smart Indian farmers' : 'Help us personalize recommendations for you'}</p>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="label">Full Name <span className="text-red-500">*</span></label>
                <input className={`input ${errors.name ? 'border-red-400' : ''}`} placeholder="Rajesh Kumar" value={form.name} onChange={e => set('name', e.target.value)} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Email <span className="text-red-500">*</span></label>
                  <input className={`input ${errors.email ? 'border-red-400' : ''}`} type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="label">Phone <span className="text-red-500">*</span></label>
                  <input className={`input ${errors.phone ? 'border-red-400' : ''}`} type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="label">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input className={`input pr-11 ${errors.password ? 'border-red-400' : ''}`} type={showPass ? 'text' : 'password'} placeholder="Minimum 6 characters" value={form.password} onChange={e => set('password', e.target.value)} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="label">Confirm Password <span className="text-red-500">*</span></label>
                <input className={`input ${errors.confirmPassword ? 'border-red-400' : ''}`} type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} />
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>

              <button onClick={handleNext} className="btn-primary w-full justify-center py-3 text-base">
                Continue <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">State <span className="text-red-500">*</span></label>
                  <select className={`input ${errors.state ? 'border-red-400' : ''}`} value={form.state} onChange={e => { set('state', e.target.value); set('district', ''); }}>
                    <option value="">Select state</option>
                    {Object.keys(STATES_DISTRICTS).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label className="label">District <span className="text-red-500">*</span></label>
                  <select className={`input ${errors.district ? 'border-red-400' : ''}`} value={form.district} onChange={e => set('district', e.target.value)} disabled={!form.state}>
                    <option value="">Select district</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Land Size</label>
                  <input className="input" type="number" min="0" step="0.1" placeholder="e.g. 5.5" value={form.landSize} onChange={e => set('landSize', e.target.value)} />
                </div>
                <div>
                  <label className="label">Unit</label>
                  <select className="input" value={form.landUnit} onChange={e => set('landUnit', e.target.value)}>
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                    <option value="bigha">Bigha</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Soil Type</label>
                  <select className="input" value={form.soilType} onChange={e => set('soilType', e.target.value)}>
                    <option value="">Select soil</option>
                    {['Alluvial', 'Clay', 'Loam', 'Sandy', 'Black Cotton', 'Red Laterite'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Primary Crop <span className="text-red-500">*</span></label>
                  <select className={`input ${errors.primaryCrop ? 'border-red-400' : ''}`} value={form.primaryCrop} onChange={e => set('primaryCrop', e.target.value)}>
                    <option value="">Select crop</option>
                    {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.primaryCrop && <p className="text-xs text-red-500 mt-1">{errors.primaryCrop}</p>}
                </div>
              </div>

              <div>
                <label className="label">Preferred Language</label>
                <select className="input" value={form.language} onChange={e => set('language', e.target.value)}>
                  {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>

              <label className={`flex items-start gap-2 cursor-pointer p-3 rounded-xl border ${errors.terms ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                <input type="checkbox" checked={form.terms} onChange={e => set('terms', e.target.checked)} className="w-4 h-4 mt-0.5 rounded accent-primary-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the <span className="text-primary-600 font-medium">Terms of Service</span> and <span className="text-primary-600 font-medium">Privacy Policy</span> (Demo)
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-500 -mt-2">{errors.terms}</p>}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center py-3">Back</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center py-3 disabled:opacity-70">
                  {loading ? <LoadingSpinner size="sm" /> : <>Create Account <ArrowRight size={16} /></>}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
