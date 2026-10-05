import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Activity, Lock, BarChart3, TrendingUp, Github, Twitter, MessageCircle, Search, Brain, ShieldCheck, Send, Bitcoin, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CryptoTicker } from '../components/CryptoTicker';

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleAppClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-bg-void text-text-primary font-sans overflow-hidden relative">
      {/* Background Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-cyan/20 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-purple to-brand-cyan rounded-xl flex items-center justify-center shadow-lg shadow-brand-purple/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight">CryptoGuard</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <a href="#" className="hover:text-white transition-colors">Home</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-bg-elevated transition-colors text-text-secondary hover:text-white mr-1"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-6 py-2.5 bg-gradient-to-r from-brand-purple via-brand-glow to-brand-cyan hover:opacity-95 rounded-full text-white font-semibold text-sm transition-all shadow-lg shadow-brand-purple/25 flex items-center gap-2"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/auth?mode=login"
                className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/auth?mode=signup"
                className="px-5 py-2.5 bg-gradient-to-r from-brand-purple via-brand-glow to-brand-cyan hover:opacity-95 rounded-full text-white font-semibold text-sm transition-all shadow-lg shadow-brand-purple/25 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Create Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-elevated/50 border border-border mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">AI Powered Risk Intelligence</span>
          </div>

          <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-[1.1] tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Understand Crypto Risk
            <br className="hidden md:block" />
            Before You Invest
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            AI powered crypto risk intelligence platform analyzing volatility,
            <br />
            whale movements and smart contract risks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/scanner"
              onClick={(e) => handleAppClick(e, '/scanner')}
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold text-lg transition-all transform hover:-translate-y-0.5 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Scan Token <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/dashboard"
              onClick={(e) => handleAppClick(e, '/dashboard')}
              className="px-8 py-4 bg-bg-elevated/50 border border-border text-white rounded-full font-bold text-lg hover:bg-bg-elevated transition-colors w-full sm:w-auto backdrop-blur-sm"
            >
              Live Demo
            </Link>
          </div>

          {/* 3 Key Metrics Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-bg-surface/50 border border-border backdrop-blur-sm flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="font-display font-bold text-xl text-white">AI Risk Scanner</p>
                <p className="text-sm text-text-secondary">Analyze tokens for volatility, liquidity and smart contract vulnerabilities.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-bg-surface/50 border border-border backdrop-blur-sm flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Activity className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="font-display font-bold text-xl text-white">Whale Activity Tracker</p>
                <p className="text-sm text-text-secondary">Monitor large wallet movements across exchanges in real time.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-bg-surface/50 border border-border backdrop-blur-sm flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="font-display font-bold text-xl text-white">Portfolio Risk Intelligence</p>
                <p className="text-sm text-text-secondary">Measure diversification, exposure and portfolio health.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating UI Elements (Mock) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-24 relative mx-auto max-w-5xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-bg-void via-transparent to-transparent z-20" />
          
          {/* Animated Dashboard Preview */}
          <div className="relative w-full aspect-video bg-bg-surface/50 border border-border rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl shadow-orange-500/10 group">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            {/* Animated Line Chart */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <motion.path
                d="M0,300 Q200,250 400,100 T800,150 T1200,50"
                fill="none"
                stroke="#F97316"
                strokeWidth="3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <motion.path
                d="M0,300 Q200,250 400,100 T800,150 T1200,50 V600 H0 Z"
                fill="url(#orangeGradient)"
                stroke="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ delay: 1, duration: 1 }}
              />
              <defs>
                <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F97316" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Central Stylish Bitcoin Animation */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              {/* Shockwave Pulse */}
              <motion.div
                className="absolute w-4 h-4 bg-orange-500 rounded-full"
                animate={{
                  scale: [0, 50],
                  opacity: [0.5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeOut"
                }}
              />

              {/* Orbiting Elements */}
              {[
                { size: 250, duration: 20, direction: 1 },
                { size: 400, duration: 30, direction: -1 },
                { size: 550, duration: 45, direction: 1 },
              ].map((orbit, i) => (
                <motion.div
                  key={i}
                  className="absolute border border-dashed border-white/5 rounded-full"
                  style={{ width: orbit.size, height: orbit.size }}
                  animate={{ rotate: 360 * orbit.direction }}
                  transition={{ duration: orbit.duration, repeat: Infinity, ease: "linear" }}
                >
                  {/* Orbiter 1 (metallic sphere) */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-slate-400 rounded-full shadow-inner" />
                  {/* Orbiter 2 (glowing orb) */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  {/* Orbiter 3 (mini bitcoin) */}
                  {i === 1 && (
                    <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-5 h-5 text-orange-500/70">
                      <Bitcoin className="w-full h-full" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Central Bitcoin */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full animate-pulse"></div>
                <Bitcoin className="w-32 h-32 text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.6)]" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Ticker */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <CryptoTicker />
      </div>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-bg-elevated/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl mb-4">How It Works</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Three simple steps to secure your crypto journey.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-orange-500/0 via-orange-500/30 to-orange-500/0 border-t border-dashed border-text-muted/30 z-0"></div>

            {[
              { step: "01", title: "Scan Token", desc: "Enter any cryptocurrency or contract address. CryptoGuard analyzes liquidity, volatility, and smart contract risk.", icon: Search },
              { step: "02", title: "AI Risk Analysis", desc: "AI evaluates whale movements, market sentiment, and contract security vulnerabilities.", icon: Brain },
              { step: "03", title: "Protect Portfolio", desc: "Get portfolio insights and risk recommendations before making investment decisions.", icon: ShieldCheck }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-bg-surface border border-border rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-black/20 group hover:border-orange-500/50 transition-colors">
                  <item.icon className="w-10 h-10 text-orange-500" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-4 border-bg-void">
                    {item.step}
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-display font-bold text-4xl mb-4">Why CryptoGuard?</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">We process millions of data points to give you a single, actionable number.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Shield, title: "AI Risk Score", desc: "0–100 composite score from 6 data sources." },
            { icon: Activity, title: "Whale Activity", desc: "Detect large wallet movements before price moves." },
            { icon: Lock, title: "Rug Pull Radar", desc: "Smart contract red flags & liquidity traps." },
            { icon: BarChart3, title: "Portfolio Analyzer", desc: "Assess your full crypto exposure in seconds." }
          ].map((feature, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-bg-surface border border-border hover:border-brand-purple/50 transition-colors group">
              <div className="w-12 h-12 bg-bg-elevated rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                <feature.icon className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3">{feature.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-bg-void py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1 - Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-orange-500">
              <Shield className="w-5 h-5 text-brand-purple" />
              <span className="font-display font-bold text-xl">CryptoGuard</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              AI-powered crypto risk intelligence platform helping investors analyze market volatility, whale movements, and smart-contract risks.
            </p>
          </div>

          {/* Column 2 - Product */}
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-white transition-colors">Risk Scanner</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Portfolio Analyzer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Whale Tracker</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Assistant</a></li>
            </ul>
          </div>

          {/* Column 3 - Resources */}
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-white transition-colors">Risk Methodology</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Policy</a></li>
            </ul>
          </div>

          {/* Column 4 - Contact / Community */}
          <div>
            <h4 className="font-bold mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Twitter className="w-4 h-4" /> Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Discord</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Send className="w-4 h-4" /> Telegram</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm">© CryptoGuard 2026 — Real-time crypto risk intelligence platform</p>
        </div>
      </footer>
    </div>
  );
}
