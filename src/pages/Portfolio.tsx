import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, AlertTriangle, ArrowUpRight, MoreHorizontal, Loader2 } from 'lucide-react';
import { getMarketData } from '../services/api';
import { calculateRiskScore, getRiskLevel } from '../utils/risk';

const staticHoldings = [
  { id: 'bitcoin', name: 'Bitcoin', sym: 'BTC', amount: 0.45, color: '#F7931A' },
  { id: 'ethereum', name: 'Ethereum', sym: 'ETH', amount: 6.2, color: '#627EEA' },
  { id: 'solana', name: 'Solana', sym: 'SOL', amount: 45, color: '#14F195' },
  { id: 'chainlink', name: 'Chainlink', sym: 'LINK', amount: 120, color: '#2A5ADA' },
  { id: 'pepe', name: 'Pepe', sym: 'PEPE', amount: 500000000, color: '#E01F1F' },
];

export function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [avgRisk, setAvgRisk] = useState(0);
  const [allocationData, setAllocationData] = useState<any[]>([]);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const data = await getMarketData({ per_page: 100 });
        let total = 0;
        let totalRisk = 0;

        const newPortfolio = staticHoldings.map(holding => {
          const coinData = data.find((c: any) => c.id === holding.id);
          const price = coinData?.current_price || 0;
          const value = holding.amount * price;
          const change = coinData?.price_change_percentage_24h || 0;
          const scoreData = calculateRiskScore(coinData);
          const score = scoreData.score;
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
        setAvgRisk(Math.round(totalRisk / staticHoldings.length));

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
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand-purple animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl mb-2">Portfolio Analyzer</h1>
          <p className="text-text-secondary">Real-time risk monitoring and diversification health.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-bg-elevated border border-border rounded-xl text-sm font-medium hover:bg-bg-elevated/80 transition-colors">
            View History
          </button>
          <button className="px-4 py-2 bg-brand-purple text-white rounded-xl text-sm font-medium hover:bg-brand-purple/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Holding
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-bg-surface border border-border rounded-2xl">
          <p className="text-text-secondary text-sm font-medium mb-1">Total Value</p>
          <div className="flex items-end gap-3">
            <h2 className="font-display font-bold text-3xl">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            <span className="text-green-500 text-sm font-bold mb-1 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +5.2%
            </span>
          </div>
        </div>
        <div className="p-6 bg-bg-surface border border-border rounded-2xl">
          <p className="text-text-secondary text-sm font-medium mb-1">Avg Risk Score</p>
          <div className="flex items-end gap-3">
            <h2 className={`font-display font-bold text-3xl ${avgRisk > 60 ? 'text-red-500' : avgRisk > 30 ? 'text-orange-500' : 'text-green-500'}`}>{avgRisk}</h2>
            <span className="text-text-secondary text-sm mb-1">Moderate Risk Profile</span>
          </div>
        </div>
        <div className="p-6 bg-bg-surface border border-border rounded-2xl">
          <p className="text-text-secondary text-sm font-medium mb-1">Health Grade</p>
          <div className="flex items-end gap-3">
            <h2 className="font-display font-bold text-3xl text-green-500">B+</h2>
            <span className="text-text-secondary text-sm mb-1">Diversified Portfolio</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Asset List */}
        <div className="lg:col-span-2 bg-bg-surface border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-lg">Asset Risk Ledger</h3>
            <button className="text-sm text-brand-purple hover:text-white transition-colors">Manage Assets</button>
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
                {portfolio.map((asset, idx) => (
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
                    <td className="py-4 text-right">
                      <button className="p-1 hover:bg-bg-elevated rounded text-text-secondary hover:text-white transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
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

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-orange-500 mb-1">High Asset Correlation Warning</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Your holdings in <span className="text-white font-medium">SOL</span> and <span className="text-white font-medium">PEPE</span> have shown a 0.85 correlation in recent volatility spikes.
                </p>
              </div>
            </div>
            <div className="bg-bg-void/50 rounded-lg p-3 border border-orange-500/10 mb-4">
              <p className="text-xs text-orange-400 italic">
                "Reducing meme-token exposure to under 3% could lower your systemic risk score by 12 points."
              </p>
            </div>
            <button className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-bold transition-colors">
              Execute Rebalancing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
