import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Filter, Calendar, AlertCircle } from 'lucide-react';

const riskData = [
  { name: 'Oct 01', score: 42 },
  { name: 'Oct 05', score: 38 },
  { name: 'Oct 10', score: 55 },
  { name: 'Oct 15', score: 48 },
  { name: 'Oct 20', score: 62 },
  { name: 'Oct 25', score: 58 },
  { name: 'Oct 30', score: 65 },
];

const volatilityData = [
  { name: 'Oct 01', value: 12 },
  { name: 'Oct 05', value: 15 },
  { name: 'Oct 10', value: 22 },
  { name: 'Oct 15', value: 18 },
  { name: 'Oct 20', value: 28 },
  { name: 'Oct 25', value: 25 },
  { name: 'Oct 30', value: 30 },
];

export function Reports() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl mb-2">Risk Analytics Reports</h1>
          <p className="text-text-secondary">Comprehensive overview of historical security data and market exposure.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-bg-elevated border border-border rounded-xl text-sm font-medium hover:bg-bg-elevated/80 transition-colors flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Last 30 Days
          </button>
          <button className="px-4 py-2 bg-brand-purple text-white rounded-xl text-sm font-medium hover:bg-brand-purple/90 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> PDF Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Average Risk Score', value: '48.2', change: '+5.4%', color: 'text-orange-500' },
          { label: 'Total Alerts', value: '1,284', change: '-12%', color: 'text-white' },
          { label: 'Whale Activity', value: '42 High', change: '+2.1%', color: 'text-red-500' },
          { label: 'Compliance Rating', value: '98.5%', change: '+0.3%', color: 'text-green-500' },
        ].map((stat, idx) => (
          <div key={idx} className="p-6 bg-bg-surface border border-border rounded-2xl">
            <p className="text-text-secondary text-sm font-medium mb-1">{stat.label}</p>
            <div className="flex items-end gap-3">
              <h2 className={`font-display font-bold text-3xl ${stat.color}`}>{stat.value}</h2>
              <span className={`text-xs font-bold mb-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-bg-surface border border-border rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg mb-6">Risk Exposure Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F2040', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="score" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-bg-surface border border-border rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg mb-6">Asset Volatility Analytics</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volatilityData}>
                <defs>
                  <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F2040', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorVol)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-bg-surface border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            Historical Alerts Log
          </h3>
          <button className="text-sm text-brand-purple hover:text-white transition-colors">View Full History</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-text-muted uppercase tracking-wider border-b border-border">
                <th className="pb-3 font-medium">Timestamp</th>
                <th className="pb-3 font-medium">Asset</th>
                <th className="pb-3 font-medium">Alert Type</th>
                <th className="pb-3 font-medium">Risk Level</th>
                <th className="pb-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { time: '2024-10-30 14:22', asset: 'BTC', type: 'Whale Movement', level: 'High', status: 'Flagged' },
                { time: '2024-10-30 11:05', asset: 'ETH', type: 'Contract Vulnerability', level: 'Critical', status: 'Investigating' },
                { time: '2024-10-29 18:45', asset: 'SOL', type: 'Market Anomaly', level: 'Medium', status: 'Resolved' },
                { time: '2024-10-29 09:12', asset: 'LINK', type: 'Liquidity Drain', level: 'High', status: 'Monitoring' },
                { time: '2024-10-28 22:30', asset: 'DOT', type: 'Network Congestion', level: 'Low', status: 'Closed' },
              ].map((alert, idx) => (
                <tr key={idx} className="border-b border-border/50 hover:bg-bg-elevated/20 transition-colors">
                  <td className="py-4 text-text-secondary">{alert.time}</td>
                  <td className="py-4 font-bold">{alert.asset}</td>
                  <td className="py-4">{alert.type}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      alert.level === 'Critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                      alert.level === 'High' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                      alert.level === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                      'bg-green-500/10 text-green-500 border border-green-500/20'
                    }`}>
                      {alert.level}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <span className="text-text-secondary italic">{alert.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
