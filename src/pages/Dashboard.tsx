import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Activity, ArrowUpRight, ArrowDownRight, Shield, Bot, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getMarketData } from '../services/api';
import { calculateRiskScore } from '../utils/risk';
import { AITradingSimModal } from '../components/AITradingSimModal';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [whaleAlerts, setWhaleAlerts] = useState([
    { amount: '1,420 BTC', from: 'Unknown', to: 'Binance', time: '2m ago', type: 'inflow' },
    { amount: '25M USDC', from: 'Circle', to: 'Unknown', time: '14m ago', type: 'mint' },
    { amount: '120,000 SOL', from: 'Unknown', to: 'Kraken', time: '45m ago', type: 'inflow' },
    { amount: '800 BTC', from: 'Gemini', to: 'Unknown', time: '1h ago', type: 'outflow' },
  ]);
  const [isSimOpen, setIsSimOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate live whale tracker feed every 10s
    const interval = setInterval(() => {
      const amounts = ['500 BTC', '1,200 ETH', '10M USDT', '45,000 SOL', '2M XRP'];
      const froms = ['Unknown', 'Binance', 'Coinbase', 'Kraken', 'KuCoin'];
      const tos = ['Unknown', 'Binance', 'Coinbase', 'Kraken', 'KuCoin'];
      const types = ['inflow', 'outflow', 'mint'];

      const rItem = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

      setWhaleAlerts(prev => {
        const newAlert = {
          amount: rItem(amounts),
          from: rItem(froms),
          to: rItem(tos),
          time: 'Just now',
          type: rItem(types)
        };
        // keep last 4
        return [newAlert, ...prev].slice(0, 4);
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMarketData({ per_page: 12, sparkline: true });
        setMarketData(data);
      } catch (error) {
        console.error("Failed to fetch market data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand-purple animate-spin" />
      </div>
    );
  }

  // Mock Risk Score Historical Trend Data
  const chartData = [
    { name: 'Day 1', value: 45 },
    { name: 'Day 2', value: 42 },
    { name: 'Day 3', value: 38 },
    { name: 'Day 4', value: 55 },
    { name: 'Day 5', value: 60 },
    { name: 'Day 6', value: 50 },
    { name: 'Day 7', value: 48 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-bold text-3xl mb-2">Dashboard Overview</h1>
        <p className="text-text-secondary">Real-time risk intelligence and portfolio surveillance.</p>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Market Risk Index', value: '67/100', sub: 'Elevated', icon: Activity, color: 'text-orange-500' },
          { label: 'Coins Tracked', value: '12,847', sub: '+124 today', icon: Shield, color: 'text-brand-cyan' },
          { label: 'High Risk Alerts', value: '12', sub: 'Critical', icon: AlertTriangle, color: 'text-red-500' },
          { label: 'Portfolio Health', value: '88/100', sub: 'Safe', icon: ArrowUpRight, color: 'text-green-500' },
        ].map((widget, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-bg-surface border border-border rounded-2xl hover:border-brand-purple/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-bg-elevated ${widget.color} bg-opacity-10`}>
                <widget.icon className={`w-6 h-6 ${widget.color}`} />
              </div>
              <span className={`text-xs font-mono px-2 py-1 rounded bg-bg-elevated ${widget.color}`}>{widget.sub}</span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">{widget.label}</h3>
            <p className="font-display font-bold text-2xl">{widget.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-bg-surface border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-lg">Systemic Risk Score Over Time</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 text-xs font-medium rounded-lg bg-orange-500 text-white">
                Last 7 Days
              </span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F2040', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(value: number) => [`${value}/100`, 'Risk Score']}
                />
                <Area type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Whale Alerts */}
        <div className="bg-bg-surface border border-border rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Whale Alerts (Live Feed)
          </h3>
          <div className="space-y-4">
            {whaleAlerts.map((alert, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-bg-elevated/30 hover:bg-bg-elevated transition-colors cursor-pointer border border-transparent hover:border-border">
                <div className="mt-1">
                  {alert.type === 'inflow' ? (
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    <span className="text-brand-cyan">{alert.amount}</span> moved
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {alert.from} → {alert.to}
                  </p>
                  <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wide">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Heatmap & Command Center */}
      <div className="bg-bg-surface border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-3xl mb-2">Command Center</h1>
            <p className="text-text-secondary">Overview of your risk exposure and market conditions.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsSimOpen(true)}
              className="px-4 py-2 bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 rounded-xl text-sm font-medium hover:bg-brand-cyan/20 transition-colors flex items-center gap-2"
            >
              <Bot className="w-4 h-4" /> AI Trading Sim
            </button>
            <button className="px-4 py-2 bg-brand-purple text-white rounded-xl text-sm font-medium hover:bg-brand-purple/90 transition-colors flex items-center gap-2">
              <Shield className="w-4 h-4" /> Full Audit
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
          {marketData.map((coin) => {
            const risk = calculateRiskScore(coin).score;
            return (
              <div
                key={coin.id}
                onClick={() => navigate(`/scanner?q=${coin.id}`)}
                className="p-4 rounded-xl bg-bg-elevated/50 border border-border hover:border-brand-purple/50 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-lg uppercase">{coin.symbol}</span>
                  <span className={`text-sm font-bold ${risk > 80 ? 'text-red-500' : risk > 50 ? 'text-orange-500' : 'text-green-500'}`}>{risk}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className={`text-xs ${(coin.price_change_percentage_24h || 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(coin.price_change_percentage_24h || 0).toFixed(2)}%
                  </span>
                  <div className={`w-2 h-2 rounded-full ${risk > 80 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : risk > 50 ? 'bg-orange-500' : 'bg-green-500'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AITradingSimModal isOpen={isSimOpen} onClose={() => setIsSimOpen(false)} />
    </div>
  );
}
