import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMarketData } from '../services/api';

export function DashboardLayout() {
  const [searchTerm, setSearchTerm] = useState('');
  const [btcData, setBtcData] = useState<{ price: number, change: number }>({ price: 0, change: 0 });
  const [ethData, setEthData] = useState<{ price: number, change: number }>({ price: 0, change: 0 });
  const navigate = useNavigate();
  const { user } = useAuth();
  const fearIndex = 72; // Mocking "Greed" index as requested by user

  useEffect(() => {
    getMarketData({ per_page: 5 }).then(data => {
      const btc = data.find((c: any) => c.symbol === 'btc');
      const eth = data.find((c: any) => c.symbol === 'eth');
      if (btc) setBtcData({ price: btc.current_price, change: btc.price_change_percentage_24h });
      if (eth) setEthData({ price: eth.current_price, change: eth.price_change_percentage_24h });
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/scanner?q=${searchTerm}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg-void text-text-primary pl-64">
      <Sidebar />

      {/* Top Bar */}
      <header className="h-16 border-b border-border bg-bg-void/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">

        {/* Global Market Widget */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-medium border-r border-border/50 pr-6 mr-4">
          <div className="flex flex-col">
            <span className="text-text-muted">BTC</span>
            <div className="flex items-center gap-1">
              <span>${btcData.price.toLocaleString()}</span>
              <span className={btcData.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                {btcData.change >= 0 ? '+' : ''}{btcData.change?.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted">ETH</span>
            <div className="flex items-center gap-1">
              <span>${ethData.price.toLocaleString()}</span>
              <span className={ethData.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                {ethData.change >= 0 ? '+' : ''}{ethData.change?.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
            <span className="text-green-500 font-bold">Fear & Greed Index: {fearIndex} (Greed)</span>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search coins, contracts, or wallets..."
            className="w-full bg-bg-surface border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-purple/50 transition-colors placeholder:text-text-muted"
          />
        </form>

        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-bg-elevated rounded-full transition-colors">
            <Bell className="w-5 h-5 text-text-secondary" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-bg-void"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple to-brand-cyan flex items-center justify-center text-xs font-bold uppercase">
            {user?.name?.slice(0, 2) || 'JD'}
          </div>
        </div>
      </header>

      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
}
