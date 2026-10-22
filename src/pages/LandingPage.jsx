import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Microscope, CloudSun, Sprout, TrendingUp, ShoppingCart, FileText,
  MessageSquare, CalendarDays, ArrowRight, Check, Star, ChevronDown,
  Leaf, Phone, Mail, MapPin, Menu, X, BarChart3, Users, Zap,
} from 'lucide-react';

const FEATURES = [
  { icon: Microscope, title: 'AI Disease Detection', desc: 'Upload crop photos and get instant simulated disease diagnosis with treatment recommendations.', color: 'bg-red-50 text-red-600', path: '/disease-detection' },
  { icon: CloudSun, title: 'Weather Alerts', desc: 'Get 7-day weather forecasts and farming precautions for your location.', color: 'bg-blue-50 text-blue-600', path: '/weather' },
  { icon: Sprout, title: 'Smart Crop Planning', desc: 'Get personalized crop recommendations based on soil, season, and resources.', color: 'bg-green-50 text-green-600', path: '/crop-planning' },
  { icon: TrendingUp, title: 'Yield Prediction', desc: 'Estimate your harvest yield with our interactive frontend calculator.', color: 'bg-yellow-50 text-yellow-600', path: '/yield-prediction' },
  { icon: ShoppingCart, title: 'Mandi Prices', desc: 'Compare live-like market prices across mandis to get the best deal.', color: 'bg-purple-50 text-purple-600', path: '/mandi-prices' },
  { icon: FileText, title: 'Govt Schemes', desc: 'Discover PM-KISAN, crop insurance, KCC, and other farmer support schemes.', color: 'bg-orange-50 text-orange-600', path: '/govt-schemes' },
];

const STEPS = [
  { step: '01', title: 'Create Your Profile', desc: 'Register and enter your land details, soil type, and preferred crops.' },
  { step: '02', title: 'Get Recommendations', desc: 'Our smart algorithms analyze your data and suggest the best crops and practices.' },
  { step: '03', title: 'Monitor & Act', desc: 'Track weather, check disease alerts, and manage your farming calendar.' },
  { step: '04', title: 'Sell at Best Price', desc: 'Compare mandi prices and list your produce on the farmer marketplace.' },
];

const STATS = [
  { value: '50,000+', label: 'Farmers Using Platform', icon: Users },
  { value: '200+', label: 'Crop Varieties Covered', icon: Leaf },
  { value: '98%', label: 'User Satisfaction', icon: Star },
  { value: '24/7', label: 'AI Assistant Available', icon: Zap },
];

const TESTIMONIALS = [
  { name: 'Gurpreet Singh', location: 'Punjab', crop: 'Wheat & Rice', rating: 5, text: 'FarmerFriend helped me increase my wheat yield by understanding the right fertilizer timing. The disease detection feature saved my potato crop last season!' },
  { name: 'Kavita Devi', location: 'Maharashtra', crop: 'Tomato & Onion', rating: 5, text: 'The mandi price comparison is incredible. I sold my tomatoes at ₹1,400/quintal by finding the right market. The AI assistant answers all my farming doubts in Hindi!' },
  { name: 'Suresh Patel', location: 'Gujarat', crop: 'Cotton & Groundnut', rating: 4, text: 'Government schemes section helped me apply for PM-KISAN and crop insurance. Simple to understand even for less educated farmers like me.' },
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-700 rounded-xl flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl text-primary-800 dark:text-primary-400">FarmerFriend</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {['features', 'how-it-works', 'benefits', 'testimonials'].map(id => (
              <button key={id} onClick={() => scrollTo(id)} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 transition-colors capitalize">
                {id.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm">Get Started</Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-4 space-y-3 animate-fade-in">
            {['features', 'how-it-works', 'benefits', 'testimonials'].map(id => (
              <button key={id} onClick={() => scrollTo(id)} className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-700 capitalize rounded-lg hover:bg-primary-50">
                {id.replace('-', ' ')}
              </button>
            ))}
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="btn-secondary text-sm flex-1 justify-center">Sign In</Link>
              <Link to="/register" className="btn-primary text-sm flex-1 justify-center">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-yellow-300 blur-3xl" />
        </div>

        {/* Decorative circles */}
        <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-yellow-400 rounded-full opacity-60 animate-bounce-soft" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full opacity-40 animate-bounce-soft" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-green-300 rounded-full opacity-50 animate-bounce-soft" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-32 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/20">
              <Leaf size={14} />
              <span>India's Smart Farming Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Grow Smarter.{' '}
              <span className="text-yellow-400">Harvest Better.</span>
            </h1>

            <p className="text-lg text-primary-100 mb-8 leading-relaxed max-w-lg">
              FarmerFriend empowers Indian farmers with AI-powered crop insights, real-time weather alerts, mandi price comparisons, and government scheme guidance — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button onClick={() => navigate('/register')} className="flex items-center justify-center gap-2 px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-primary-900 font-bold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 text-base">
                Explore Dashboard
                <ArrowRight size={18} />
              </button>
              <button onClick={() => scrollTo('features')} className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/30 backdrop-blur-sm transition-all duration-200 text-base">
                Discover Features
                <ChevronDown size={18} />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-primary-200">
              {['100% Free to Use', 'No Registration Required to Explore', 'Works in Hindi & English'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <Check size={14} className="text-green-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="hidden lg:flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Main card */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-white/20">
                  <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                    <BarChart3 size={20} className="text-primary-900" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Crop Health Dashboard</p>
                    <p className="text-primary-200 text-xs">Rajesh Kumar's Farm • Demo</p>
                  </div>
                </div>

                {[
                  { label: 'Wheat Field', status: 'Healthy', pct: 88, color: 'bg-green-400' },
                  { label: 'Mustard Crop', status: 'Needs attention', pct: 65, color: 'bg-yellow-400' },
                  { label: 'Gram Crop', status: 'Good', pct: 78, color: 'bg-blue-400' },
                ].map(c => (
                  <div key={c.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white font-medium">{c.label}</span>
                      <span className="text-primary-200">{c.status}</span>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full">
                      <div className={`h-full ${c.color} rounded-full transition-all`} style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/10 rounded-2xl p-3 text-center">
                    <p className="text-2xl font-bold text-yellow-400">₹1,880</p>
                    <p className="text-primary-200 text-xs">Wheat/Quintal</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-3 text-center">
                    <p className="text-2xl font-bold text-white">28°C</p>
                    <p className="text-primary-200 text-xs">Today's Temp</p>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-lg animate-bounce-soft">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><Microscope size={14} className="text-green-600" /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Disease Alert</p>
                    <p className="text-xs text-green-600">No threat detected ✓</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-3 shadow-lg animate-bounce-soft" style={{ animationDelay: '0.7s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><CloudSun size={14} className="text-blue-600" /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Rain Expected</p>
                    <p className="text-xs text-blue-600">Tomorrow 75% chance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <Icon size={28} className="text-yellow-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-primary-200 text-sm mt-1">{label}</p>
                <p className="text-primary-300 text-xs mt-0.5">(Illustrative figures)</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-cream-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="demo-label mb-3 inline-block">Platform Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Everything You Need to Farm Smarter</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              A complete agricultural intelligence platform built specifically for Indian farmers with multilingual support.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color, path }) => (
              <button key={title} onClick={() => navigate('/login')} className="group card-hover p-6 text-left hover:border-primary-200 dark:hover:border-primary-700 cursor-pointer transition-all">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
                <div className="flex items-center gap-1 mt-4 text-primary-600 dark:text-primary-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore feature</span>
                  <ArrowRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">How FarmerFriend Works</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Get started in minutes, no technical knowledge required</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map(({ step, title, desc }, i) => (
              <div key={step} className="relative text-center">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-primary-100 dark:bg-primary-900" />
                )}
                <div className="relative z-10 w-16 h-16 bg-primary-700 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg">
                  {step}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white text-sm font-medium rounded-full border border-white/20 mb-6">
                <Leaf size={14} />
                Why Choose FarmerFriend
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Built for the Indian Farmer's Real Needs</h2>
              <p className="text-primary-200 text-lg mb-8 leading-relaxed">
                Designed with input from farmers across India — supports local languages, addresses real problems, and works even on basic smartphones.
              </p>

              <div className="space-y-4">
                {[
                  { title: 'Hindi & English Support', desc: 'Switch languages instantly within the app' },
                  { title: 'Works on All Devices', desc: 'Fully responsive — phone, tablet, or computer' },
                  { title: 'Offline-Friendly Design', desc: 'Core information accessible without constant internet' },
                  { title: 'Privacy First', desc: 'No data sold to third parties — your farm data stays yours' },
                  { title: 'Free to Use', desc: 'All core features available at no cost' },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={14} className="text-primary-900" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{title}</p>
                      <p className="text-primary-200 text-sm">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '40%', label: 'Average water savings with smart irrigation guidance', icon: '💧' },
                { value: '25%', label: 'Higher yields reported using crop planning tools', icon: '🌾' },
                { value: '₹15K', label: 'Average extra income from better mandi price selection', icon: '💰' },
                { value: '3 hrs', label: 'Saved weekly on market research and scheme tracking', icon: '⏱️' },
              ].map(({ value, label, icon }) => (
                <div key={value} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                  <span className="text-2xl mb-2 block">{icon}</span>
                  <p className="text-3xl font-bold text-yellow-400 mb-1">{value}</p>
                  <p className="text-primary-200 text-xs leading-relaxed">{label}</p>
                  <p className="text-primary-300 text-xs mt-1">*Illustrative demo figures</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-cream-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="demo-label mb-3 inline-block">Sample Testimonials — Demo Content</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Farmers Are Saying</h2>
            <p className="text-gray-500 dark:text-gray-400">These are illustrative sample testimonials for demonstration purposes</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card p-6 space-y-4">
                <div className="flex gap-1">
                  {Array(t.rating).fill(null).map((_, j) => (
                    <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.location} • {t.crop}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Transform Your Farming?</h2>
          <p className="text-primary-100 text-lg mb-8">Join thousands of farmers making smarter decisions with FarmerFriend.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="flex items-center justify-center gap-2 px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-primary-900 font-bold rounded-2xl transition-all duration-200 shadow-lg text-base">
              Start for Free
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/30 transition-all duration-200 text-base">
              Demo Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-900 text-primary-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
                  <Leaf size={16} className="text-white" />
                </div>
                <span className="text-white font-bold text-lg">FarmerFriend</span>
              </div>
              <p className="text-sm leading-relaxed">India's smart farming platform. This is a demo frontend application — no real backend services.</p>
            </div>

            {[
              { title: 'Features', links: ['Disease Detection', 'Weather Alerts', 'Crop Planning', 'Yield Prediction', 'Mandi Prices'] },
              { title: 'Support', links: ['AI Assistant', 'Govt Schemes', 'Marketplace', 'Farming Calendar'] },
              { title: 'Contact', links: [] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="text-white font-semibold mb-4">{title}</h4>
                {title === 'Contact' ? (
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2"><Phone size={14} /><span>+91 XXXX XXX XXX (Demo)</span></div>
                    <div className="flex items-center gap-2"><Mail size={14} /><span>support@farmerfriend.demo</span></div>
                    <div className="flex items-center gap-2"><MapPin size={14} /><span>New Delhi, India (Demo)</span></div>
                  </div>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {links.map(l => <li key={l}><Link to="/login" className="hover:text-white transition-colors">{l}</Link></li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-primary-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© 2025 FarmerFriend. Built as a demo frontend application. No real services are connected.</p>
            <div className="flex gap-4">
              <span className="cursor-pointer hover:text-white">Privacy Policy (Demo)</span>
              <span className="cursor-pointer hover:text-white">Terms of Use (Demo)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
