import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { motion } from 'framer-motion';
import { getMarketData } from '../services/api';

// Initialize Gemini API
// Note: In a real app, this should be handled securely, but for this demo/hackathon context
// and given the instructions, we use process.env.GEMINI_API_KEY.
// The key is injected by the platform.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your CryptoGuard Risk Assistant. I can analyze your portfolio exposure, check specific coin risks, or explain market trends. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Fetch real market data context for the AI
      let marketContext = "No real-time data available.";
      try {
        const data = await getMarketData({ per_page: 5 });
        if (data && data.length > 0) {
          marketContext = data.map((c: any) =>
            `${c.name} (${c.symbol.toUpperCase()}): Price $${c.current_price}, 24h Volatility: ${c.price_change_percentage_24h}%, Rank: #${c.market_cap_rank}`
          ).join('\n');
        }
      } catch (e) {
        console.error("Failed to fetch market data for AI context", e);
      }

      let extraContext = "";
      if (userMessage.toLowerCase().includes("portfolio")) {
        extraContext = `User's Current Portfolio Holdings:\n0.45 BTC, 6.2 ETH, 45 SOL, 120 LINK, 500,000,000 PEPE.\nPlease analyze the risk of this specific portfolio given current market conditions. Focus on diversification, correlation, and specific asset risks.`;
      }

      // Construct prompt with context
      const prompt = `
        You are CryptoGuard AI, a specialized cryptocurrency risk analyst.
        Your goal is to help users understand risks, analyze market trends, and make informed decisions.
        
        Real-Time Market Context (Top Coins):
        ${marketContext}
        
        ${extraContext}

        User Query: ${userMessage}
        
        Provide a concise, professional, and data-driven response. 
        Format your response exactly like this, using bullet points where appropriate. DO NOT output large paragraphs:
        
        **Trend**: [Neutral/Bullish/Bearish]
        
        **Reasons**:
        • [Reason 1]
        • [Reason 2]
        
        **Investor Advice**:
        [Concise action: Hold / Cautious Buy / etc.]
        
        Focus on risk factors: volatility, liquidity, whale activity, and sentiment.
        Keep the tone helpful but cautious.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const responseText = response.text;
      setMessages(prev => [...prev, { role: 'assistant', content: responseText || "I couldn't generate a response." }]);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I apologize, but I'm having trouble connecting to the risk analysis engine right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-bg-surface border border-border rounded-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-bg-elevated/30 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-purple/20 rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6 text-brand-purple" />
        </div>
        <div>
          <h2 className="font-display font-bold text-lg">CryptoGuard AI</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-text-secondary">Online • v2.4.0</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-brand-cyan/20' : 'bg-brand-purple/20'
              }`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-brand-cyan" /> : <Bot className="w-5 h-5 text-brand-purple" />}
            </div>

            <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
              ? 'bg-brand-cyan/10 border border-brand-cyan/20 text-white rounded-tr-none'
              : 'bg-bg-elevated border border-border text-text-secondary rounded-tl-none'
              }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-brand-purple/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-5 h-5 text-brand-purple animate-spin" />
            </div>
            <div className="bg-bg-elevated border border-border p-4 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-bg-elevated/10">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about market risk, whale alerts, or portfolio health..."
            className="w-full bg-bg-void border border-border rounded-xl py-4 pl-4 pr-14 text-sm focus:outline-none focus:border-brand-purple/50 transition-colors placeholder:text-text-muted"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 px-4 bg-brand-purple hover:bg-brand-purple/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            "Is Solana safe to buy now?",
            "Analyze my portfolio",
            "Explain rug pull risk",
            "Whale activity on PEPE"
          ].map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => setInput(suggestion)}
              className="px-3 py-1.5 bg-bg-elevated/50 hover:bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary whitespace-nowrap transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-brand-cyan" />
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
