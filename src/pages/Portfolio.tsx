import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Plus, AlertTriangle, ArrowUpRight, MoreHorizontal, Loader2, Bot, Sparkles, CheckCircle2, X, Trash2, Edit2, History, Info } from 'lucide-react';
import { getMarketData } from '../services/api';
import { calculateRiskScore, getRiskLevel } from '../utils/risk';
import axios from 'axios';

const portfolioCache: {
  data: {
    portfolio: any[];
    totalValue: number;
    avgRisk: number;
    allocationData: any[];
  } | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

const PortfolioRowSkeleton = () => (
  <tr className="border-b border-border/50 animate-pulse">
    <td className="py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-700"></div><div><div className="h-4 w-20 bg-slate-700 rounded mb-1"></div><div className="h-3 w-10 bg-slate-700 rounded"></div></div></div></td>
    <td className="py-4"><div className="h-4 w-16 bg-slate-700 rounded mb-1"></div><div className="h-3 w-20 bg-slate-700 rounded"></div></td>
    <td className="py-4"><div className="h-4 w-24 bg-slate-700 rounded mb-1"></div><div className="h-3 w-12 bg-slate-700 rounded"></div></td>
    <td className="py-4">
      <div className="flex items-center gap-2">
        <div className="h-5 w-12 bg-slate-700 rounded"></div>
        <div className="w-16 h-1.5 rounded-full bg-slate-700"></div>
      </div>
    </td>
    <td className="py-4 text-right">
      <div className="w-4 h-4 bg-slate-700 rounded-full inline-block"></div>
    </td>
  </tr>
);

const COMMON_TICKER_MAP: Record<string, { id: string; name: string; sym: string; color: string }> = {
  btc: { id: 'bitcoin', name: 'Bitcoin', sym: 'BTC', color: '#F7931A' },
  bitcoin: { id: 'bitcoin', name: 'Bitcoin', sym: 'BTC', color: '#F7931A' },
  eth: { id: 'ethereum', name: 'Ethereum', sym: 'ETH', color: '#627EEA' },
  ethereum: { id: 'ethereum', name: 'Ethereum', sym: 'ETH', color: '#627EEA' },
  sol: { id: 'solana', name: 'Solana', sym: 'SOL', color: '#14F195' },
  solana: { id: 'solana', name: 'Solana', sym: 'SOL', color: '#14F195' },
  ada: { id: 'cardano', name: 'Cardano', sym: 'ADA', color: '#0033AD' },
  cardano: { id: 'cardano', name: 'Cardano', sym: 'ADA', color: '#0033AD' },
  xrp: { id: 'ripple', name: 'XRP', sym: 'XRP', color: '#23292F' },
  ripple: { id: 'ripple', name: 'XRP', sym: 'XRP', color: '#23292F' },
  doge: { id: 'dogecoin', name: 'Dogecoin', sym: 'DOGE', color: '#C2A633' },
  dogecoin: { id: 'dogecoin', name: 'Dogecoin', sym: 'DOGE', color: '#C2A633' },
  dot: { id: 'polkadot', name: 'Polkadot', sym: 'DOT', color: '#E6007A' },
  polkadot: { id: 'polkadot', name: 'Polkadot', sym: 'DOT', color: '#E6007A' },
  bnb: { id: 'binancecoin', name: 'BNB', sym: 'BNB', color: '#F3BA2F' },
  binancecoin: { id: 'binancecoin', name: 'BNB', sym: 'BNB', color: '#F3BA2F' },
  link: { id: 'chainlink', name: 'Chainlink', sym: 'LINK', color: '#2A5ADA' },
  chainlink: { id: 'chainlink', name: 'Chainlink', sym: 'LINK', color: '#2A5ADA' },
  pepe: { id: 'pepe', name: 'Pepe', sym: 'PEPE', color: '#E01F1F' },
  shib: { id: 'shiba-inu', name: 'Shiba Inu', sym: 'SHIB', color: '#FFA409' },
  'shiba-inu': { id: 'shiba-inu', name: 'Shiba Inu', sym: 'SHIB', color: '#FFA409' },
  avax: { id: 'avalanche-2', name: 'Avalanche', sym: 'AVAX', color: '#E84142' },
  avalanche: { id: 'avalanche-2', name: 'Avalanche', sym: 'AVAX', color: '#E84142' },
  matic: { id: 'matic-network', name: 'Polygon', sym: 'POL', color: '#8247E5' },
  polygon: { id: 'matic-network', name: 'Polygon', sym: 'POL', color: '#8247E5' },
  pol: { id: 'matic-network', name: 'Polygon', sym: 'POL', color: '#8247E5' },
  near: { id: 'near', name: 'NEAR Protocol', sym: 'NEAR', color: '#000000' },
  trx: { id: 'tron', name: 'TRON', sym: 'TRX', color: '#FF0013' },
  tron: { id: 'tron', name: 'TRON', sym: 'TRX', color: '#FF0013' },
  ton: { id: 'the-open-network', name: 'Toncoin', sym: 'TON', color: '#0098EA' },
  toncoin: { id: 'the-open-network', name: 'Toncoin', sym: 'TON', color: '#0098EA' },
  sui: { id: 'sui', name: 'Sui', sym: 'SUI', color: '#4DA2FF' },
  apt: { id: 'aptos', name: 'Aptos', sym: 'APT', color: '#2ED8A7' },
  aptos: { id: 'aptos', name: 'Aptos', sym: 'APT', color: '#2ED8A7' },
  usdt: { id: 'tether', name: 'Tether', sym: 'USDT', color: '#26A17B' },
  tether: { id: 'tether', name: 'Tether', sym: 'USDT', color: '#26A17B' },
  usdc: { id: 'usd-coin', name: 'USD Coin', sym: 'USDC', color: '#2775CA' },
};

const findCoinData = (query: string, dataList: any[]) => {
  if (!query || !dataList || dataList.length === 0) return null;
  const q = query.toLowerCase().trim();

  // 1. Check common ticker map
  const mapped = COMMON_TICKER_MAP[q];
  if (mapped) {
    const found = dataList.find((c: any) => 
      c.id?.toLowerCase() === mapped.id || 
      c.symbol?.toLowerCase() === mapped.sym.toLowerCase()
    );
    if (found) return found;
  }

  // 2. Direct match on id, symbol, or name
  return dataList.find((c: any) => 
    c.id?.toLowerCase() === q ||
    c.symbol?.toLowerCase() === q ||
    c.name?.toLowerCase() === q
  ) || null;
};

const initialHoldings = [
  { id: 'bitcoin', name: 'Bitcoin', sym: 'BTC', amount: 0.45, price: 85000, purchasePrice: 85000, color: '#F7931A' },
  { id: 'ethereum', name: 'Ethereum', sym: 'ETH', amount: 6.2, price: 2700, purchasePrice: 2700, color: '#627EEA' },
  { id: 'solana', name: 'Solana', sym: 'SOL', amount: 45, price: 140, purchasePrice: 140, color: '#14F195' },
  { id: 'chainlink', name: 'Chainlink', sym: 'LINK', amount: 120, price: 15, purchasePrice: 15, color: '#2A5ADA' },
  { id: 'pepe', name: 'Pepe', sym: 'PEPE', amount: 500000000, price: 0.000008, purchasePrice: 0.000008, color: '#E01F1F' },
];

const loadSavedHoldings = () => {
  try {
    const saved = localStorage.getItem('cryptoguard_holdings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load saved holdings', e);
  }
  return initialHoldings;
};

const historyData = [
  { date: 'Jan', value: 45000 },
  { date: 'Feb', value: 52000 },
  { date: 'Mar', value: 48000 },
  { date: 'Apr', value: 61000 },
  { date: 'May', value: 59000 },
  { date: 'Jun', value: 68000 },
  { date: 'Jul', value: 72000 },
];

export function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [avgRisk, setAvgRisk] = useState(0);
  const [allocationData, setAllocationData] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<any>(null);
  const [holdings, setHoldings] = useState(loadSavedHoldings);
  const [marketCoins, setMarketCoins] = useState<any[]>([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  // Form state
  const [newCoin, setNewCoin] = useState({ name: '', amount: '', price: '', date: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      setLoading(true);

      try {
        let data = marketCoins;
        if (!data || data.length === 0) {
          // Simulating a slightly longer load time to see skeletons on initial load
          await new Promise(res => setTimeout(res, 300));
          data = await getMarketData({ per_page: 100 });
          setMarketCoins(data);
        }

        let total = 0;
        let totalRisk = 0;

        const newPortfolio = holdings.map(holding => {
          const coinData = findCoinData(holding.id, data) || 
                           findCoinData(holding.sym, data) || 
                           findCoinData(holding.name, data);

          // Priority: live market current_price > holding.purchasePrice > holding.price > 0
          const livePrice = (coinData?.current_price && coinData.current_price > 0) ? coinData.current_price : 0;
          const price = livePrice > 0 ? livePrice : (holding.purchasePrice || holding.price || 0);
          const value = (holding.amount || 0) * price;
          const change = coinData?.price_change_percentage_24h || 0;
          const scoreData = coinData ? calculateRiskScore(coinData) : { score: 50 };
          const score = scoreData?.score || 50;
          const riskObj = getRiskLevel(score);

          total += value;
          totalRisk += score;

          return {
            ...holding,
            price,
            value,
            change,
            score,
            riskColor: riskObj.color.replace('text-', ''),
            riskLabel: riskObj.label.toLowerCase()
          };
        });

        setTotalValue(total);
        setAvgRisk(Math.round(totalRisk / (holdings.length || 1)));

        const alloc = newPortfolio.map(p => ({
          name: p.name,
          value: total > 0 ? Number(((p.value / total) * 100).toFixed(1)) : 0,
          color: p.color
        }));

        setAllocationData(alloc);
        setPortfolio(newPortfolio);
      } catch (err) {
        console.error("Failed to load portfolio", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolioData();
  }, [holdings]);

  const generateAIInsights = async () => {
    if (portfolio.length === 0) return;
    setAnalyzing(true);
    try {
      const holdingsSummary = portfolio.map(p => 
        `${p.name} ($${p.value.toFixed(0)})`
      ).join(', ');

      const prompt = `
        Analyze this crypto portfolio: ${holdingsSummary}. Total Value: $${totalValue.toFixed(0)}.
        Provide a risk assessment in this JSON format:
        {
          "riskLevel": "High" | "Medium" | "Low",
          "problems": ["Brief bullet point 1", "Brief bullet point 2"],
          "actions": ["Specific action 1 (e.g. Reduce SOL by 20%)", "Specific action 2"]
        }
        Be critical and actionable.
      `;

      const response = await axios.post('/api/analyze', {
        prompt,
        config: { responseMimeType: "application/json" },
      });
      
      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const cleanJson = text.replace(/```json|```/g, '').trim();
      if (cleanJson) setAiAdvice(JSON.parse(cleanJson));
    } catch (e) {
      console.error("AI Error", e);
      // Dynamic fallback based on local state
      const highRiskCount = portfolio.filter(p => p.score > 60).length;
      const totalAssets = portfolio.length;
      const riskRatio = highRiskCount / totalAssets;
      
      let riskLevel = "Low";
      let problems = [];
      let actions = [];

      if (avgRisk > 60) {
        riskLevel = "High";
        problems.push("Overall portfolio risk is elevated.");
        problems.push("Heavy exposure to volatile assets.");
        actions.push("Consider taking profits on high-risk coins.");
        actions.push("Rebalance into stablecoins or BTC.");
      } else if (avgRisk > 35) {
        riskLevel = "Medium";
        problems.push("Some assets showing increased volatility.");
        actions.push("Monitor high-risk positions closely.");
      } else {
        problems.push("Portfolio is conservative.");
        actions.push("Consider small allocation to growth assets.");
      }

      setAiAdvice({
        riskLevel,
        problems: problems.length ? problems : ["Portfolio looks balanced."],
        actions: actions.length ? actions : ["Maintain current strategy."]
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    const query = newCoin.name.trim();
    if (!query) return;

    const matched = findCoinData(query, marketCoins);
    const mapped = COMMON_TICKER_MAP[query.toLowerCase()];

    const id = matched?.id || mapped?.id || query.toLowerCase().replace(/\s+/g, '-');
    const name = matched?.name || mapped?.name || newCoin.name;
    const sym = matched?.symbol?.toUpperCase() || mapped?.sym || query.slice(0, 4).toUpperCase();
    
    // Purchase price entered by user, or live price from matched coin
    const enteredPrice = parseFloat(newCoin.price);
    const livePrice = matched?.current_price || 0;
    const price = !isNaN(enteredPrice) && enteredPrice > 0 ? enteredPrice : livePrice;

    const newHolding = {
      id,
      name,
      sym,
      amount: parseFloat(newCoin.amount) || 0,
      price,
      purchasePrice: price,
      color: mapped?.color || '#8C8C8C'
    };

    const updated = [...holdings, newHolding];
    setHoldings(updated);
    try {
      localStorage.setItem('cryptoguard_holdings', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    
    portfolioCache.data = null;
    setIsAddModalOpen(false);
    setNewCoin({ name: '', amount: '', price: '', date: '' });
  };

  const handleDeleteAsset = (id: string) => {
    const updated = holdings.filter(h => h.id !== id);
    setHoldings(updated);
    try {
      localStorage.setItem('cryptoguard_holdings', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    portfolioCache.data = null;
  };

  const handleUpdateAmount = (id: string, newAmount: number) => {
    const updated = holdings.map(h => h.id === id ? { ...h, amount: newAmount } : h);
    setHoldings(updated);
    try {
      localStorage.setItem('cryptoguard_holdings', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    portfolioCache.data = null;
  };

  const getProfitLoss = () => {
    // Mock calculation for demo purposes
    const initialInvestment = totalValue * 0.85; 
    return totalValue - initialInvestment;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl mb-2">Portfolio Analyzer</h1>
          <p className="text-text-secondary">Real-time risk monitoring and diversification health.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsHistoryModalOpen(true)}
            className="px-4 py-2 bg-bg-elevated border border-border rounded-xl text-sm font-medium hover:bg-bg-elevated/80 transition-colors flex items-center gap-2"
          >
            <History className="w-4 h-4" />
            View History
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Holding
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-bg-surface border border-border rounded-2xl">
          <p className="text-text-secondary text-sm font-medium mb-1">Total Value</p>
          {loading ? (
            <div className="h-9 w-48 bg-slate-700 rounded animate-pulse mt-1" />
          ) : (
            <div className="flex items-end gap-3">
              <h2 className="font-display font-bold text-3xl">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              <span className="text-green-500 text-sm font-bold mb-1 flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +5.2%
              </span>
            </div>
          )}
        </div>
        <div className="p-6 bg-bg-surface border border-border rounded-2xl">
          <p className="text-text-secondary text-sm font-medium mb-1">Avg Risk Score</p>
          {loading ? (
            <div className="h-9 w-32 bg-slate-700 rounded animate-pulse mt-1" />
          ) : (
            <div className="flex items-end gap-3">
              <h2 className={`font-display font-bold text-3xl ${avgRisk > 60 ? 'text-red-500' : avgRisk > 30 ? 'text-orange-500' : 'text-green-500'}`}>{avgRisk}</h2>
              <span className="text-text-secondary text-sm mb-1">Moderate Risk Profile</span>
            </div>
          )}
        </div>
        <div className="p-6 bg-bg-surface border border-border rounded-2xl relative group">
          <p className="text-text-secondary text-sm font-medium mb-1">Health Grade</p>
          <div className="absolute top-6 right-6 text-text-muted hover:text-white cursor-help">
            <Info className="w-4 h-4" />
            <div className="absolute right-0 top-6 w-48 p-3 bg-bg-elevated border border-border rounded-xl text-xs text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
              <p className="font-bold text-white mb-1">Grading Scale</p>
              <p>A+ (Best) → F (Worst)</p>
              <p className="mt-1">Based on diversification, risk score, and asset quality.</p>
            </div>
          </div>
          {loading ? (
            <div className="h-9 w-24 bg-slate-700 rounded animate-pulse mt-1" />
          ) : (
            <div className="flex items-end gap-3">
              <h2 className="font-display font-bold text-3xl text-green-500">B+</h2>
              <span className="text-text-secondary text-sm mb-1">Diversified Portfolio</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Asset List */}
        <div className="lg:col-span-2 bg-bg-surface border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-lg">Asset Risk Ledger</h3>
            <button 
              onClick={() => setIsManageModalOpen(true)}
              className="text-sm text-orange-500 hover:text-white transition-colors"
            >
              Manage Assets
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-text-muted uppercase tracking-wider border-b border-border">
                  <th className="pb-3 font-medium">Asset</th>
                  <th className="pb-3 font-medium">Holdings</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Risk Score</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <PortfolioRowSkeleton key={i} />)
                  : portfolio.map((asset, idx) => (
                    <tr key={idx} className="border-b border-border/50 hover:bg-bg-elevated/20 transition-colors group">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center font-bold text-xs" style={{ color: asset.color }}>
                            {asset.sym[0]}
                          </div>
                          <div>
                            <div className="font-bold">{asset.name}</div>
                            <div className="text-xs text-text-muted">{asset.sym}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="font-medium">{asset.amount >= 1000000 ? `${(asset.amount / 1000000).toFixed(1)}M` : asset.amount}</div>
                        <div className="text-xs text-text-muted">${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      </td>
                      <td className="py-4">
                        <div className="font-medium">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</div>
                        <div className={`text-xs ${asset.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {asset.change > 0 ? '+' : ''}{asset.change.toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-${asset.riskColor}`}>
                            {asset.score}/100
                          </span>
                          <div className={`w-16 h-1.5 rounded-full bg-bg-elevated overflow-hidden`}>
                            <div
                              className={`h-full bg-${asset.riskColor}`}
                              style={{ width: `${asset.score}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => {
                            const newAmt = prompt("Enter new amount:", asset.amount.toString());
                            if (newAmt && !isNaN(parseFloat(newAmt))) handleUpdateAmount(asset.id, parseFloat(newAmt));
                          }}
                          className="p-2 hover:bg-bg-elevated rounded-lg text-text-secondary hover:text-white transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg text-text-secondary hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Allocation & Alerts */}
        <div className="space-y-6">
          <div className="bg-bg-surface border border-border rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg mb-6">Asset Allocation</h3>
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F2040', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="text-xs text-text-muted">Total</span>
                  <div className="font-bold text-xl">${(totalValue / 1000).toFixed(1)}k</div>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {allocationData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-text-secondary">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Advisor Section */}
          <div className="bg-bg-surface border border-border rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Bot className="w-24 h-24 text-orange-500" />
            </div>
            
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h3 className="font-display font-bold text-lg">AI Portfolio Advisor</h3>
            </div>

            {!aiAdvice ? (
              <div className="text-center py-8 relative z-10">
                <p className="text-text-secondary text-sm mb-4">Generate actionable insights to optimize your holdings.</p>
                <button 
                  onClick={generateAIInsights}
                  disabled={analyzing}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-70 flex items-center gap-2 mx-auto"
                >
                  {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                  {analyzing ? 'Analyzing Portfolio...' : 'Run AI Audit'}
                </button>
              </div>
            ) : (
              <div className="space-y-4 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <span className="text-sm text-text-secondary">Portfolio Risk</span>
                  <span className={`font-bold ${aiAdvice.riskLevel === 'High' ? 'text-red-500' : aiAdvice.riskLevel === 'Medium' ? 'text-orange-500' : 'text-green-500'}`}>
                    {aiAdvice.riskLevel.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Detected Issues</h4>
                  <ul className="space-y-2">
                    {aiAdvice.problems.map((prob: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-400"><AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {prob}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2">AI Recommendation</h4>
                  <ul className="space-y-2">
                    {aiAdvice.actions.map((action: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white"><CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" /> {action}</li>
                    ))}
                  </ul>
                </div>
                
                <button onClick={() => setAiAdvice(null)} className="text-xs text-text-muted hover:text-white underline w-full text-center mt-2">Reset Analysis</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Holding Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-bg-surface border border-border rounded-2xl p-6 w-full max-w-md relative">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-text-muted hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display font-bold text-xl mb-4">Add New Holding</h3>
            <form onSubmit={handleAddHolding} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Coin Name or Ticker</label>
                <input 
                  type="text" 
                  required
                  list="crypto-suggestions"
                  placeholder="e.g. Bitcoin, BTC, Solana, or SOL"
                  value={newCoin.name}
                  onChange={e => {
                    const val = e.target.value;
                    const matched = findCoinData(val, marketCoins);
                    if (matched && matched.current_price && (!newCoin.price || newCoin.price === '0')) {
                      setNewCoin({ ...newCoin, name: val, price: matched.current_price.toString() });
                    } else {
                      setNewCoin({ ...newCoin, name: val });
                    }
                  }}
                  className="w-full bg-bg-elevated border border-border rounded-xl p-3 text-sm focus:border-brand-purple outline-none text-white"
                />
                <datalist id="crypto-suggestions">
                  <option value="Bitcoin (BTC)" />
                  <option value="Ethereum (ETH)" />
                  <option value="Solana (SOL)" />
                  <option value="Cardano (ADA)" />
                  <option value="Ripple (XRP)" />
                  <option value="Dogecoin (DOGE)" />
                  <option value="Polkadot (DOT)" />
                  <option value="BNB (BNB)" />
                  <option value="Chainlink (LINK)" />
                  <option value="Avalanche (AVAX)" />
                  <option value="Polygon (POL)" />
                  <option value="Shiba Inu (SHIB)" />
                  <option value="Pepe (PEPE)" />
                  <option value="Sui (SUI)" />
                  <option value="Toncoin (TON)" />
                  <option value="Near (NEAR)" />
                  <option value="Tether (USDT)" />
                  <option value="USD Coin (USDC)" />
                </datalist>

                {/* Live Match Indicator */}
                {(() => {
                  const matched = findCoinData(newCoin.name, marketCoins);
                  if (matched) {
                    return (
                      <div className="mt-2 p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-xs flex items-center justify-between">
                        <span className="text-green-400 font-medium">
                          ✓ Identified: <strong className="text-white">{matched.name}</strong> ({matched.symbol.toUpperCase()})
                        </span>
                        <span className="text-white font-mono font-bold">
                          ${matched.current_price?.toLocaleString()}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Amount</label>
                <input 
                  type="number" 
                  required
                  step="any"
                  placeholder="0.00"
                  value={newCoin.amount}
                  onChange={e => setNewCoin({...newCoin, amount: e.target.value})}
                  className="w-full bg-bg-elevated border border-border rounded-xl p-3 text-sm focus:border-brand-purple outline-none text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Purchase Price ($)</label>
                  <input 
                    type="number" 
                    step="any"
                    placeholder="0.00"
                    value={newCoin.price}
                    onChange={e => setNewCoin({...newCoin, price: e.target.value})}
                    className="w-full bg-bg-elevated border border-border rounded-xl p-3 text-sm focus:border-brand-purple outline-none text-white"
                  />
                  <span className="text-[10px] text-text-muted mt-1 block">Live price auto-filled or custom</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Date Purchased</label>
                  <input 
                    type="date" 
                    max={new Date().toISOString().split('T')[0]}
                    value={newCoin.date}
                    onChange={e => setNewCoin({...newCoin, date: e.target.value})}
                    className="w-full bg-bg-elevated border border-border rounded-xl p-3 text-sm focus:border-brand-purple outline-none text-text-secondary"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl font-bold mt-2 transition-colors cursor-pointer shadow-lg shadow-brand-purple/20">
                Add Asset
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View History Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-bg-surface border border-border rounded-2xl p-6 w-full max-w-3xl relative">
            <button onClick={() => setIsHistoryModalOpen(false)} className="absolute top-4 right-4 text-text-muted hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display font-bold text-xl mb-2">Portfolio Performance</h3>
            <p className="text-text-secondary text-sm mb-6">Historical value tracking over the last 6 months.</p>
            
            <div className="h-[300px] w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="colorHistory" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F2040', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#F97316" strokeWidth={2} fillOpacity={1} fill="url(#colorHistory)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-bg-elevated/30 rounded-xl">
                <p className="text-xs text-text-secondary uppercase">Total Profit/Loss</p>
                <p className="text-xl font-bold text-green-500">+${getProfitLoss().toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
              </div>
              <div className="p-4 bg-bg-elevated/30 rounded-xl">
                <p className="text-xs text-text-secondary uppercase">Best Performer</p>
                <p className="text-xl font-bold text-white">Bitcoin</p>
              </div>
              <div className="p-4 bg-bg-elevated/30 rounded-xl">
                <p className="text-xs text-text-secondary uppercase">Transactions</p>
                <p className="text-xl font-bold text-white">12</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Assets Modal */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-bg-surface border border-border rounded-2xl p-6 w-full max-w-lg relative">
            <button onClick={() => setIsManageModalOpen(false)} className="absolute top-4 right-4 text-text-muted hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display font-bold text-xl mb-6">Manage Assets</h3>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {holdings.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-3 bg-bg-elevated/30 rounded-xl border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center font-bold text-xs" style={{ color: asset.color }}>
                      {asset.sym[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{asset.name}</p>
                      <p className="text-xs text-text-muted">{asset.amount} {asset.sym}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const newAmt = prompt("Enter new amount:", asset.amount.toString());
                        if (newAmt && !isNaN(parseFloat(newAmt))) handleUpdateAmount(asset.id, parseFloat(newAmt));
                      }}
                      className="p-2 hover:bg-bg-elevated rounded-lg text-text-secondary hover:text-white transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg text-text-secondary hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
