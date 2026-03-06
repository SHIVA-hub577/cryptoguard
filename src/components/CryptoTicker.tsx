import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getMarketData } from '../services/api';

export function CryptoTicker() {
  const [tickerData, setTickerData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getMarketData({ per_page: 15 });
        // Duplicate the array to create a seamless loop effect
        setTickerData([...data, ...data]);
      } catch (err) {
        console.error("Ticker failed", err);
      }
    };
    loadData();
  }, []);

  if (!tickerData.length) return null;

  return (
    <div className="w-full overflow-hidden bg-bg-surface border border-border py-3 rounded-2xl mb-6 relative z-0">
      <motion.div 
        className="flex gap-12 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
      >
        {tickerData.map((coin, i) => (
          <div key={`${coin.id}-${i}`} className="flex items-center gap-3 text-sm font-medium">
            <div className="flex items-center gap-2">
               {coin.image && <img src={coin.image} alt={coin.symbol} className="w-5 h-5 rounded-full" />}
               <span className="text-text-secondary uppercase font-bold">{coin.symbol}</span>
            </div>
            <span className="text-white">${coin.current_price?.toLocaleString()}</span>
            <span className={`flex items-center ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {coin.price_change_percentage_24h >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}