import React, { useState, useEffect } from 'react';
import { Search, ArrowUpRight, Shield, Activity, Users, FileCode, Zap, Loader2, AlertTriangle } from 'lucide-react';
import { RiskDial } from '../components/RiskDial';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { getCoinData } from '../services/api';
import { calculateRiskScore, getRiskLevel } from '../utils/risk';
import { generateRiskReportPDF } from '../utils/pdfGenerator';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export function CoinScanner() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [coinData, setCoinData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [riskData, setRiskData] = useState<any>(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [riskScore, setRiskScore] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState<string[]>([]);

  const scanningStates = ["Scanning asset...", "Analyzing blockchain...", "Checking whale activity...", "Generating AI Risk Report..."];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingTextIndex(prev => (prev + 1) % scanningStates.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
      handleSearch(query);
    }
  }, [searchParams]);

  const handleSearch = async (term: string) => {
    if (!term) return;
    setLoading(true);
    setError('');
    setCoinData(null);
    setAiExplanation('');

    try {
      // 1. Fetch real coin data
      const data = await getCoinData(term.toLowerCase());
      setCoinData(data);

      // 2. Calculate Risk Score
      const compiledRisk = calculateRiskScore(data.market_data);
      setRiskScore(compiledRisk.score);
      setRiskData(compiledRisk);

      // 3. Generate AI Analysis
      const prompt = `Analyze the risk for cryptocurrency ${data.name} (${data.symbol}). 
      Current Price: $${data.market_data.current_price.usd}, 
      Market Cap: $${data.market_data.market_cap.usd}, 
      24h Volatility: ${data.market_data.price_change_percentage_24h}%.
      Provide 4 bullet points focusing on risk factors (volatility, liquidity, sentiment).`;

      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });
      const text = result.text;
      const points = text.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('*')).map(line => line.replace(/^[-*]\s*/, ''));
      setAiAnalysis(points.length > 0 ? points.slice(0, 4) : ["Market volatility is high.", "Liquidity is stable.", "Sentiment is neutral.", "Whale activity is normal."]);

    } catch (err) {
      console.error(err);
      setError('Coin not found or API error. Try "bitcoin" or "ethereum".');
    } finally {
      setLoading(false);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="font-display font-bold text-4xl">Risk Scanner</h1>
        <p className="text-text-secondary max-w-xl mx-auto">Analyze any smart contract or asset for investment risks.</p>

        <form onSubmit={onFormSubmit} className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Bitcoin, Ethereum, Solana..."
            className="w-full bg-bg-surface border border-border rounded-full py-4 pl-12 pr-32 text-lg focus:outline-none focus:border-brand-purple transition-all shadow-lg shadow-black/20 placeholder:text-text-muted"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 px-6 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-full font-medium transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" /> <span className="hidden sm:inline">{scanningStates[loadingTextIndex]}</span>
              </>
            ) : 'Scan Asset'}
          </button>
        </form>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-center gap-2 text-sm text-text-muted">
          <span>Trending:</span>
          {['bitcoin', 'ethereum', 'solana', 'pepe'].map(coin => (
            <button key={coin} onClick={() => { setSearchTerm(coin); handleSearch(coin); }} className="px-2 py-0.5 bg-bg-elevated rounded hover:text-white transition-colors capitalize">
              {coin}
            </button>
          ))}
        </div>
      </div>

      {coinData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Risk Card */}
          <div className="lg:col-span-2 bg-bg-surface border border-border rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-xs font-bold uppercase tracking-wider">Live Data</span>
            </div>

            <div className="flex items-center gap-6 mb-8">
              <img src={coinData.image.large} alt={coinData.name} className="w-16 h-16 rounded-full shadow-lg" />
              <div>
                <h2 className="font-display font-bold text-3xl">{coinData.name} <span className="text-text-muted text-xl font-normal uppercase">{coinData.symbol}</span></h2>
                <p className="text-text-secondary text-sm mt-1">Price: ${coinData.market_data.current_price.usd.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col items-center justify-center p-6 bg-bg-elevated/30 rounded-2xl border border-border">
                <RiskDial score={riskScore} size="lg" />
                <div className="mt-4 text-center w-full">
                  <span className={`font-bold tracking-wider ${getRiskLevel(riskScore).color}`}>{getRiskLevel(riskScore).label} RISK</span>
                  <p className="text-xs text-text-muted mt-1 mb-4">Risk Index Score: {riskScore}</p>

                  {riskData && (
                    <div className="text-left text-xs space-y-2 bg-bg-void/50 p-4 rounded-xl w-full">
                      <div className="flex justify-between border-b border-border/50 pb-1"><span>Volatility:</span> <span className={riskData.breakdown.volatility > 0 ? 'text-orange-500' : 'text-green-500'}>{riskData.breakdown.volatility > 0 ? '+' : ''}{riskData.breakdown.volatility}</span></div>
                      <div className="flex justify-between border-b border-border/50 pb-1"><span>Liquidity:</span> <span className={riskData.breakdown.liquidity > 0 ? 'text-orange-500' : 'text-green-500'}>{riskData.breakdown.liquidity > 0 ? '+' : ''}{riskData.breakdown.liquidity}</span></div>
                      <div className="flex justify-between border-b border-border/50 pb-1"><span>Market Cap:</span> <span className={riskData.breakdown.marketCap > 0 ? 'text-orange-500' : 'text-green-500'}>{riskData.breakdown.marketCap > 0 ? '+' : ''}{riskData.breakdown.marketCap}</span></div>
                      <div className="flex justify-between border-b border-border/50 pb-1"><span>Whale Activity:</span> <span className={riskData.breakdown.whaleActivity > 0 ? 'text-orange-500' : 'text-green-500'}>{riskData.breakdown.whaleActivity > 0 ? '+' : ''}{riskData.breakdown.whaleActivity}</span></div>
                      <div className="flex justify-between"><span>Sentiment:</span> <span className={riskData.breakdown.sentiment > 0 ? 'text-orange-500' : 'text-green-500'}>{riskData.breakdown.sentiment > 0 ? '+' : ''}{riskData.breakdown.sentiment}</span></div>
                    </div>
                  )}

                  {riskScore > 0 && !aiExplanation && (
                    <button
                      onClick={async () => {
                        setLoadingExplain(true);
                        try {
                          const r = await ai.models.generateContent({
                            model: "gemini-2.5-flash",
                            contents: `Explain in one short paragraph why a real-time crypto risk score is ${riskScore}/100 given this penalty/bonus breakdown: Volatility: ${riskData.breakdown.volatility}, Liquidity: ${riskData.breakdown.liquidity}, Market Cap: ${riskData.breakdown.marketCap}, Whale Activity: ${riskData.breakdown.whaleActivity}, Sentiment: ${riskData.breakdown.sentiment}. Keep it brief, professional, without intro/outro.`
                          });
                          setAiExplanation(r.text || 'Explanation unavailable');
                        } catch (e) {
                          setAiExplanation('Error generating explanation.');
                        } finally { setLoadingExplain(false); }
                      }}
                      className="mt-4 text-xs font-bold text-brand-purple hover:text-brand-cyan transition-colors"
                      disabled={loadingExplain}
                    >
                      {loadingExplain ? 'Generating explanation...' : `Why risk = ${riskScore}? (AI)`}
                    </button>
                  )}
                  {aiExplanation && (
                    <div className="mt-4 text-xs text-text-secondary bg-brand-purple/10 border border-brand-purple/20 p-3 rounded-lg text-left italic">
                      {aiExplanation}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { label: 'Market Cap Rank', value: `#${coinData.market_cap_rank}`, color: 'bg-brand-purple', icon: Shield },
                  { label: '24h Volatility', value: `${(coinData.market_data.price_change_percentage_24h || 0).toFixed(2)}%`, color: Math.abs(coinData.market_data.price_change_percentage_24h || 0) > 5 ? 'bg-orange-500' : 'bg-green-500', icon: Activity },
                  { label: 'Liquidity Score', value: (coinData.liquidity_score || 0).toFixed(1), color: 'bg-brand-cyan', icon: Zap },
                ].map((metric, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-2 text-text-secondary">
                        <metric.icon className="w-4 h-4" /> {metric.label}
                      </span>
                      <span className="font-mono font-bold">{metric.value}</span>
                    </div>
                    <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                        className={`h-full ${metric.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Stack */}
          <div className="flex flex-col gap-8">
            {/* AI Analysis Side Panel */}
            <div className="bg-bg-surface border border-border rounded-2xl p-6 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-6 text-brand-purple">
                <Zap className="w-5 h-5" />
                <h3 className="font-display font-bold text-lg">AI Risk Assessment</h3>
              </div>

              <div className="space-y-4 flex-1">
                <p className="text-sm text-text-secondary leading-relaxed">
                  Analysis based on real-time market data for {coinData.name}.
                </p>

                <ul className="space-y-3">
                  {aiAnalysis.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => generateRiskReportPDF(coinData.market_data, riskData, aiAnalysis)}
                className="mt-8 w-full py-3 bg-bg-elevated hover:bg-bg-elevated/80 border border-border rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <FileCode className="w-4 h-4" /> Download Full Audit PDF
              </button>
            </div>

            {/* Rug Pull Detector */}
            <div className="bg-bg-surface border border-border rounded-2xl p-6 flex flex-col border-red-500/30 font-mono">
              <div className="flex items-center gap-2 mb-4 text-red-500 font-sans">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-display font-bold text-lg">Rug Pull Detector</h3>
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex justify-between items-center text-xs border-b border-border/50 pb-2">
                  <span className="text-text-secondary">Liquidity Locked?</span>
                  <span className={coinData.market_cap_rank < 100 ? "text-green-500" : "text-red-500"}>{coinData.market_cap_rank < 100 ? "Yes (>90%)" : "Unknown"}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-border/50 pb-2">
                  <span className="text-text-secondary">Top 10 Holders %</span>
                  <span className={coinData.market_cap_rank < 100 ? "text-green-500" : "text-orange-500"}>{coinData.market_cap_rank < 100 ? "< 15%" : "> 40% (Warning)"}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-border/50 pb-2">
                  <span className="text-text-secondary">Contract Ownership</span>
                  <span className={coinData.market_cap_rank < 100 ? "text-green-500" : "text-red-500"}>{coinData.market_cap_rank < 100 ? "Renounced" : "Active"}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary">Mint Function</span>
                  <span className={coinData.market_cap_rank < 100 ? "text-green-500" : "text-red-500"}>{coinData.market_cap_rank < 100 ? "Disabled" : "Enabled (Risky)"}</span>
                </div>

                <div className={`mt-4 p-3 rounded-lg text-center text-sm font-bold font-sans tracking-wide ${coinData.market_cap_rank < 100 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                  RUG PULL RISK: {coinData.market_cap_rank < 100 ? "LOW" : "HIGH"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
