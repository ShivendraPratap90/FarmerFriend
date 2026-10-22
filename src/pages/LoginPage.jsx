import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf, ArrowRight, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/mockServices';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, showToast } = useApp();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 4) errs.password = 'Password must be at least 4 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await authService.login(form.email, form.password);
      login(res.user);
      showToast(`Welcome back, ${res.user.name}! 🌾`, 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Login failed. Please check your email and password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setForm({ email: 'rajesh.kumar@demo.com', password: 'demo1234', remember: false });
    setLoading(true);
    try {
      const res = await authService.login('rajesh.kumar@demo.com', 'demo1234');
      login(res.user);
      showToast('Demo login successful! Welcome, Rajesh 🌾', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast('Demo login failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = () => {
    if (!form.email) { setErrors({ email: 'Enter your email first to reset password' }); return; }
    setForgotSent(true);
    showToast(`Demo: Reset link sent to ${form.email}`, 'info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <Leaf size={28} className="text-white" />
            </div>
            <span className="text-white font-bold text-2xl">FarmerFriend</span>
          </Link>
          <p className="text-primary-200 mt-2 text-sm">Sign in to your farming dashboard</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-modal p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Welcome back</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Enter your credentials to continue</p>

          {/* Demo notice */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3 mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-700 dark:text-amber-400">
                <strong>Demo Mode:</strong> Any email and password (4+ chars) will work. Or use the Demo Login button below.
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <input type="email" value={form.email} onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })); }}
                placeholder="rajesh@example.com" className={`input ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <button type="button" onClick={handleForgot} className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  {forgotSent ? 'Reset link sent ✓' : 'Forgot password?'}
                </button>
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setErrors(p => ({ ...p, password: '' })); }}
                  placeholder="Enter your password" className={`input pr-11 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.remember} onChange={e => setForm(p => ({ ...p, remember: e.target.checked }))}
                className="w-4 h-4 rounded accent-primary-600"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base disabled:opacity-70">
              {loading ? <LoadingSpinner size="sm" /> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div>
            <div className="relative flex justify-center"><span className="bg-white dark:bg-gray-900 px-3 text-xs text-gray-400">or</span></div>
          </div>

          {/* Demo Login */}
          <button onClick={handleDemoLogin} disabled={loading} className="btn-secondary w-full justify-center py-3 text-base gap-2 disabled:opacity-70">
            <span className="text-lg">🚀</span>
            Quick Demo Login
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            New to FarmerFriend?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">Create a free account</Link>
          </p>
        </div>

        <p className="text-center text-primary-200 text-xs mt-6">
          This is a demo application. No real authentication is performed.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
