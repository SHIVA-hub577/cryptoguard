import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Activity, Lock, BarChart3, TrendingUp } from 'lucide-react';

export function LandingPage() {
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
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/auth" className="text-sm font-medium hover:text-white transition-colors">Log In</Link>
          <Link
            to="/dashboard"
            className="px-6 py-2.5 bg-gradient-to-r from-brand-purple to-brand-cyan rounded-full text-white font-semibold text-sm hover:shadow-lg hover:shadow-brand-purple/25 transition-all transform hover:-translate-y-0.5"
          >
            Launch App
          </Link>
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
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-brand-cyan uppercase tracking-wider">v2.0 Live Now</span>
          </div>

          <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-[1.1] tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            AI Powered Crypto <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-cyan">Risk Analyzer</span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            <span className="text-white font-semibold">Understand crypto risks before you invest.</span><br />
            Analyze volatility, liquidity, whale activity and scams in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/scanner"
              className="px-8 py-4 bg-gradient-to-r from-brand-purple to-brand-cyan text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-brand-purple/25 transition-all transform hover:-translate-y-0.5 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Scan a Token <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-bg-elevated/50 border border-border text-white rounded-full font-bold text-lg hover:bg-bg-elevated transition-colors w-full sm:w-auto backdrop-blur-sm"
            >
              View Dashboard
            </Link>
          </div>

          {/* 3 Key Metrics Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-bg-surface/50 border border-border backdrop-blur-sm flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-brand-purple/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-brand-purple" />
              </div>
              <div>
                <p className="font-display font-bold text-2xl text-white">12,000+</p>
                <p className="text-sm text-text-secondary">Supported Coins</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-bg-surface/50 border border-border backdrop-blur-sm flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-brand-cyan/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Activity className="w-6 h-6 text-brand-cyan" />
              </div>
              <div>
                <p className="font-display font-bold text-2xl text-white">6 Multi-layer</p>
                <p className="text-sm text-text-secondary">Risk Models</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-bg-surface/50 border border-border backdrop-blur-sm flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="font-display font-bold text-2xl text-white">Real-time</p>
                <p className="text-sm text-text-secondary">Live Market Signals</p>
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
          <img
            src="https://placehold.co/1200x800/0A1628/FFF?text=Dashboard+Preview"
            alt="App Dashboard"
            className="rounded-xl border border-border shadow-2xl shadow-brand-purple/10 opacity-80"
          />
        </motion.div>
      </section>

      {/* Ticker */}
      <div className="w-full bg-bg-surface border-y border-border overflow-hidden py-3">
        <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
          {[1, 2, 3, 4].map((i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-2">
                <span className="font-bold">BTC</span>
                <span className="text-green-500 font-mono text-sm">$64,231.50 (+2.4%)</span>
                <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-xs rounded border border-green-500/20">LOW RISK: 28</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">ETH</span>
                <span className="text-green-500 font-mono text-sm">$3,450.12 (+1.8%)</span>
                <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-xs rounded border border-yellow-500/20">MED RISK: 45</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">PEPE</span>
                <span className="text-red-500 font-mono text-sm">$0.000008 (-12.4%)</span>
                <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-xs rounded border border-red-500/20">HIGH RISK: 89</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

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
              <div className="w-12 h-12 bg-bg-elevated rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-purple/20 transition-colors">
                <feature.icon className="w-6 h-6 text-brand-purple" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3">{feature.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
