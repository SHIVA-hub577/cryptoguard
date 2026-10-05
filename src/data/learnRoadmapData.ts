export interface LearningTopic {
  id: string;
  title: string;
  description: string;
  category: 'Core Concepts' | 'Technical Analysis' | 'Fundamental Analysis' | 'Risk & Mindset' | 'Hands-on Execution';
  keyTakeaways: string[];
}

export interface LearningVideo {
  id: string;
  title: string;
  channel: string;
  duration: string;
  youtubeId: string;
  description: string;
}

export interface LearningArticle {
  id: string;
  title: string;
  source: string;
  readTime: string;
  url: string;
  summary: string;
  keyPoints: string[];
}

export interface WeekRoadmap {
  id: number;
  weekNumber: number;
  title: string;
  subtitle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  focus: string;
  description: string;
  topics: LearningTopic[];
  videos: LearningVideo[];
  articles: LearningArticle[];
}

export const roadmapData: WeekRoadmap[] = [
  {
    id: 1,
    weekNumber: 1,
    title: 'Basics of Stock Market & Crypto',
    subtitle: 'Market Foundations, Order Books & Blockchain Mechanics',
    difficulty: 'Beginner',
    focus: 'Stocks vs Crypto, Order Types, Wallets & Market Cap',
    description:
      'Master the foundational architecture of financial markets. Understand how trading exchanges function, how order books match buyers and sellers, how cryptocurrency transactions settle on decentralized networks, and the vital differences between stocks and digital assets.',
    topics: [
      {
        id: 'w1-t1',
        title: 'Stock Market vs Crypto Market Architecture',
        description:
          'Compare traditional equity markets (NYSE, NASDAQ, market hours, clearing houses) with 24/7 global cryptocurrency networks, decentralized liquidity, and settlement speeds.',
        category: 'Core Concepts',
        keyTakeaways: [
          'Crypto trades 24/7/365 across global order books without market close or circuit breakers.',
          'Stock trading involves centralized custodians and settlement cycles (T+1), while crypto settles peer-to-peer on-chain.',
          'Volatility and liquidity profiles in crypto are substantially higher than typical blue-chip equities.',
        ],
      },
      {
        id: 'w1-t2',
        title: 'Mastering the Order Book & Execution Types',
        description:
          'Learn how limit orders, market orders, stop-loss orders, and trailing stops are queued and matched on order books, and how slippage affects fills.',
        category: 'Core Concepts',
        keyTakeaways: [
          'Market orders guarantee execution speed but risk slippage in volatile or low-liquidity conditions.',
          'Limit orders provide price control by resting on the order book until matched.',
          'The spread is the difference between the highest bid and lowest ask price.',
        ],
      },
      {
        id: 'w1-t3',
        title: 'Wallets & Custody: Self-Custody vs Centralized Exchanges',
        description:
          'Understand private keys, seed phrases, hardware wallets (Ledger/Trezor), and why exchange deposits represent counterparty risk ("Not your keys, not your coins").',
        category: 'Core Concepts',
        keyTakeaways: [
          'Centralized Exchanges (CEX) hold private keys on your behalf; if the exchange pauses withdrawals, you cannot access your assets.',
          'Non-custodial software/hardware wallets give you direct control of cryptographic key pairs.',
          'Never share your 12-to-24 word recovery seed phrase under any circumstances.',
        ],
      },
      {
        id: 'w1-t4',
        title: 'Navigating Market Data: Market Cap, Volume & Supply Dynamics',
        description:
          'Analyze Circulating Supply, Total Supply, Fully Diluted Valuation (FDV), and 24-hour volume to avoid unit bias when evaluating coins.',
        category: 'Core Concepts',
        keyTakeaways: [
          'Unit bias is the misconception that a $0.001 token is "cheaper" than a $60,000 Bitcoin without checking supply.',
          'Market Cap = Circulating Supply × Current Price.',
          'High Fully Diluted Valuation (FDV) relative to market cap signals massive future token unlocks and inflation risk.',
        ],
      },
    ],
    videos: [
      {
        id: 'w1-v1',
        title: 'Crypto Trading For Beginners (Complete Starter Course)',
        channel: 'ClearValue Tax',
        duration: '22:15',
        youtubeId: '1YyAzVmP9xQ',
        description:
          'A comprehensive, jargon-free overview of cryptocurrency trading, how blockchain wallets work, and how to safely navigate your first exchange.',
      },
      {
        id: 'w1-v2',
        title: 'How The Stock Market Works for Beginners',
        channel: 'Nate O\'Brien',
        duration: '18:40',
        youtubeId: 'p7HKvqRI_Bo',
        description:
          'Learn the core mechanics of shares, market makers, order books, and price discovery in traditional financial markets.',
      },
    ],
    articles: [
      {
        id: 'w1-a1',
        title: 'Crypto 101: What Is Cryptocurrency & How Does It Work?',
        source: 'Binance Academy',
        readTime: '6 min read',
        url: 'https://academy.binance.com/en/articles/what-is-cryptocurrency',
        summary:
          'An authoritative introductory guide covering cryptographic keys, decentralized ledgers, peer-to-peer validation, and digital scarcity.',
        keyPoints: [
          'Cryptocurrency is decentralized digital money secured by cryptography.',
          'Consensus algorithms like Proof of Work (PoW) and Proof of Stake (PoS) prevent double-spending.',
          'Public addresses allow receiving funds; private keys allow authorizing outbound transfers.',
        ],
      },
      {
        id: 'w1-a2',
        title: 'Order Types Explained: Market, Limit, and Stop Orders',
        source: 'Investopedia',
        readTime: '8 min read',
        url: 'https://www.investopedia.com/investing/basics-trading-stock-know-your-orders/',
        summary:
          'Detailed breakdown of how brokerages and exchanges fill different order types and how to optimize fill pricing.',
        keyPoints: [
          'Use limit orders to prevent slippage when trading during volatile market announcements.',
          'Stop-loss orders act as safety valves to automatically liquidate losing trades at predetermined prices.',
          'Maker fees are lower because limit orders provide liquidity to the book.',
        ],
      },
    ],
  },
  {
    id: 2,
    weekNumber: 2,
    title: 'Technical Analysis (Charts & Indicators)',
    subtitle: 'Price Action, Candlestick Patterns & Momentum Indicators',
    difficulty: 'Intermediate',
    focus: 'Candlesticks, Support/Resistance, RSI, MACD & Moving Averages',
    description:
      'Learn how to read and interpret market psychology through charts. Identify high-probability support and resistance zones, utilize trend-following moving averages, and time momentum shifts using RSI and MACD.',
    topics: [
      {
        id: 'w2-t1',
        title: 'Candlestick Anatomy & Reversal Patterns',
        description:
          'Deconstruct open, high, low, and close prices on candlestick bars. Recognize key reversal signals including Hammers, Shooting Stars, Bullish/Bearish Engulfing, and Dojis.',
        category: 'Technical Analysis',
        keyTakeaways: [
          'Long wicks indicate strong price rejection by buyers or sellers at key extremes.',
          'An Engulfing pattern at an established support/resistance level has higher predictive accuracy than in the middle of a consolidation range.',
          'Candlesticks reflect the ongoing battle between buyers (bulls) and sellers (bears).',
        ],
      },
      {
        id: 'w2-t2',
        title: 'Support, Resistance & Trendline Breakouts',
        description:
          'Identify horizontal key levels where institutional buyers step in. Draw accurate trendlines and trade retests of broken resistance turned support.',
        category: 'Technical Analysis',
        keyTakeaways: [
          'Support becomes resistance once broken; resistance becomes support upon a confirmed breakout.',
          'The more times a level is tested without breaking, the more significant that level becomes (until exhaustion occurs).',
          'Wait for a candle close above/below a level before declaring a breakout to avoid "fakeouts".',
        ],
      },
      {
        id: 'w2-t3',
        title: 'Momentum & Divergence with Relative Strength Index (RSI)',
        description:
          'Apply the 14-period RSI to measure velocity of price moves. Spot overbought (>70) and oversold (<30) conditions and detect bullish/bearish divergences.',
        category: 'Technical Analysis',
        keyTakeaways: [
          'In strong uptrends, RSI can remain "overbought" (>70) for weeks without initiating a pullback.',
          'Regular Bearish Divergence occurs when price makes a higher high but RSI prints a lower high, signaling weakening buyer momentum.',
          'Combine RSI with horizontal support/resistance rather than trading RSI overbought/oversold in isolation.',
        ],
      },
      {
        id: 'w2-t4',
        title: 'Moving Averages: Golden Cross & Trend Confirmation',
        description:
          'Use 20 EMA, 50 SMA, and 200 SMA to distinguish bullish trends from bear markets. Understand the historic significance of Golden Crosses and Death Crosses.',
        category: 'Technical Analysis',
        keyTakeaways: [
          'The 200-day Simple Moving Average (SMA) serves as the institutional benchmark between macro bull and bear regimes.',
          'A Golden Cross (50 SMA crossing above 200 SMA) signals long-term bullish trend acceleration.',
          'Exponential Moving Averages (EMA) assign higher weight to recent candles and respond faster to trend changes.',
        ],
      },
    ],
    videos: [
      {
        id: 'w2-v1',
        title: 'The Ultimate Candlestick Patterns Trading Course',
        channel: 'Rayner Teo',
        duration: '34:10',
        youtubeId: 'g6vG2p3Xj40',
        description:
          'A complete masterclass on identifying high-probability candlestick patterns and trading them with context rather than in isolation.',
      },
      {
        id: 'w2-v2',
        title: 'Technical Analysis: How to Read Any Crypto Chart',
        channel: 'Coin Bureau',
        duration: '21:05',
        youtubeId: 'L_T0yP2jR84',
        description:
          'Step-by-step tutorial on drawing key levels, reading volume profiles, and setting up RSI and MACD on TradingView.',
      },
    ],
    articles: [
      {
        id: 'w2-a1',
        title: 'The 7 Most Important Technical Indicators for Crypto Trading',
        source: 'Investopedia',
        readTime: '9 min read',
        url: 'https://www.investopedia.com/top-7-technical-analysis-tools-4773277',
        summary:
          'In-depth review of trend, momentum, volatility, and volume indicators used by institutional traders worldwide.',
        keyPoints: [
          'Never clutter charts with more than 2-3 complimentary indicators to prevent analysis paralysis.',
          'Volume confirms trend: breakouts with declining volume frequently fail.',
          'Use higher timeframes (Daily / 4-Hour) for direction, and lower timeframes (15-min / 1-Hour) for entry timing.',
        ],
      },
      {
        id: 'w2-a2',
        title: 'Classical Chart Patterns & How to Trade Them',
        source: 'Binance Academy',
        readTime: '10 min read',
        url: 'https://academy.binance.com/en/articles/classical-chart-patterns-a-quick-guide',
        summary:
          'Visual manual on Double Bottoms, Head & Shoulders, Bull Flags, and Ascending Triangles with measured targets.',
        keyPoints: [
          'Bull Flags and Pennants are continuation patterns that form during brief consolidation phases.',
          'Measured move targets are calculated by projecting the flagpole height from the breakout point.',
          'Place stop-losses inside the pattern consolidation zone to minimize downside.',
        ],
      },
    ],
  },
  {
    id: 3,
    weekNumber: 3,
    title: 'Fundamental Analysis & Tokenomics',
    subtitle: 'On-Chain Intelligence, Token Utility & Protocol Health',
    difficulty: 'Intermediate',
    focus: 'Tokenomics, TVL, On-chain Metrics & Scam Identification',
    description:
      'Evaluate what gives a crypto asset fundamental value. Unpack tokenomics models, evaluate token unlock schedules, read on-chain whale activity, and learn how to audit smart contracts for honeypots and rug pulls.',
    topics: [
      {
        id: 'w3-t1',
        title: 'Deconstructing Tokenomics: Supply, Inflation & Vesting',
        description:
          'Analyze token distribution models, insider allocations, lockup cliffs, and emissions schedules to prevent buying ahead of venture capital unlocks.',
        category: 'Fundamental Analysis',
        keyTakeaways: [
          'Check token unlock calendars (TokenUnlocks, CoinMarketCap) before entering swing positions.',
          'Tokens with >80% circulating supply are less vulnerable to aggressive future supply dilution.',
          'Burn mechanisms (like Ethereum EIP-1559) create deflationary pressure only when protocol demand exceeds emissions.',
        ],
      },
      {
        id: 'w3-t2',
        title: 'On-Chain Metrics: Active Addresses, Hashrate & Gas Metrics',
        description:
          'Use blockchain explorers to measure authentic network adoption, transaction counts, active wallet growth, and miner/validator participation.',
        category: 'Fundamental Analysis',
        keyTakeaways: [
          'Price often follows network activity: sustained growth in daily active addresses precedes price rallies.',
          'Bitcoin network hashrate reflects miner security investment and long-term infrastructure commitment.',
          'High gas consumption highlights which smart contracts are capturing the majority of user transaction fees.',
        ],
      },
      {
        id: 'w3-t3',
        title: 'Decentralized Finance Metrics: Total Value Locked (TVL) & Revenue',
        description:
          'Evaluate protocol health using DeFiLlama: TVL, Price-to-Fees (P/F) ratio, Price-to-Sales (P/S), and treasury runway.',
        category: 'Fundamental Analysis',
        keyTakeaways: [
          'TVL measures the total capital deposited inside a protocol’s smart contracts.',
          'Protocols generating genuine cash flow from transaction fees are more sustainable than those subsidizing yields with inflationary tokens.',
          'Compare a protocol’s Market Cap to its TVL: a Mcap/TVL ratio < 1.0 can indicate undervaluation.',
        ],
      },
      {
        id: 'w3-t4',
        title: 'Red Flag Detection: Rug Pulls, Honeypots & Contract Risks',
        description:
          'Inspect smart contracts for malicious mint functions, liquidity unlock timers, hidden transfer taxes, and blacklisting capabilities.',
        category: 'Fundamental Analysis',
        keyTakeaways: [
          'Honeypots allow you to buy tokens but prevent selling by manipulating transfer functions or gas limits.',
          'Verify whether developer liquidity pool (LP) tokens are locked for at least 6–12 months in verified lockers.',
          'Use contract scanners like CryptoGuard Coin Scanner or Token Sniffer prior to interacting with unverified tokens.',
        ],
      },
    ],
    videos: [
      {
        id: 'w3-v1',
        title: 'Crypto Fundamental Analysis: How to Pick Winning Coins',
        channel: 'Coin Bureau',
        duration: '24:18',
        youtubeId: 'ZE2HxTmxfrI',
        description:
          'Learn the framework professional crypto analysts use to evaluate project roadmaps, github commits, teams, and tokenomics.',
      },
      {
        id: 'w3-v2',
        title: 'Tokenomics Explained: Supply, Demand & Inflationary Cycles',
        channel: 'Finematics',
        duration: '14:52',
        youtubeId: 'uKkYg4pZt7U',
        description:
          'Clear animated breakdown of token distribution, bonding curves, staking rewards, and deflationary economics.',
      },
    ],
    articles: [
      {
        id: 'w3-a1',
        title: 'How to Read Tokenomics Before Investing in Any Project',
        source: 'CoinGecko Research',
        readTime: '7 min read',
        url: 'https://www.coingecko.com/learn/what-is-tokenomics',
        summary:
          'A comprehensive checklist covering initial distribution, private sale discounts, vesting cliffs, and utility sinks.',
        keyPoints: [
          'Excessive team and advisor allocation (>25%) poses high dump risk on retail traders.',
          'Utility without value capture leads to tokens that languish even as underlying protocols gain users.',
          'Vesting cliffs create volatility windows as early investors de-risk positions.',
        ],
      },
      {
        id: 'w3-a2',
        title: 'What Is Total Value Locked (TVL) in DeFi & Why Does It Matter?',
        source: 'DeFiLlama Learning',
        readTime: '6 min read',
        url: 'https://defillama.com/docs/api',
        summary:
          'Understand how capital commitments indicate user trust, collateralization ratios, and systemic liquidity.',
        keyPoints: [
          'TVL reflects capital efficiency and real sticky liquidity inside staking and lending pools.',
          'Watch out for double-counted TVL in protocols that wrap other protocol receipt tokens.',
          'Rapid TVL outflows often foreshadow liquidity crunches or smart contract vulnerabilities.',
        ],
      },
    ],
  },
  {
    id: 4,
    weekNumber: 4,
    title: 'Risk Management & Trading Strategies',
    subtitle: 'Capital Preservation, Position Sizing & Emotional Discipline',
    difficulty: 'Advanced',
    focus: '1% Rule, Risk-to-Reward, Stop Loss Discipline & Psychology',
    description:
      'Risk management is the single most critical differentiator between profitable traders and those who blow up their accounts. Learn exact mathematical position sizing formulas, enforce strict stop-losses, and conquer emotional biases like FOMO and revenge trading.',
    topics: [
      {
        id: 'w4-t1',
        title: 'The 1% Risk Rule & Dynamic Position Sizing Formula',
        description:
          'Never risk more than 1% to 2% of total portfolio equity on any single trade. Calculate exact position size based on stop loss distance rather than arbitrary dollar amounts.',
        category: 'Risk & Mindset',
        keyTakeaways: [
          'Position Size = (Account Equity × Risk %) ÷ |Entry Price − Stop Loss Price|.',
          'If your stop loss is wide, reduce position size; if tight, position size can be larger while keeping dollar risk constant.',
          'Losing 50% of your account requires a 100% gain just to break even; preserving capital is job #1.',
        ],
      },
      {
        id: 'w4-t2',
        title: 'Risk-to-Reward Ratio (R:R) & Expectancy Math',
        description:
          'Understand why taking trades with minimum 1:2 or 1:3 R:R allows you to be profitable even with a 40% win rate.',
        category: 'Risk & Mindset',
        keyTakeaways: [
          'With a 1:2 Risk/Reward ratio, you only need a 34% win rate to achieve profitability.',
          'Never widen a stop loss after entering a trade; accept the predetermined invalidation point.',
          'Scale out of winning trades at 1R and 2R to de-risk positions and lock in realized profits.',
        ],
      },
      {
        id: 'w4-t3',
        title: 'Trading Psychology: Defeating FOMO, Revenge Trading & Greed',
        description:
          'Master psychological discipline. Overcome Fear of Missing Out (FOMO) when green candles surge, and avoid revenge trading after taking a loss.',
        category: 'Risk & Mindset',
        keyTakeaways: [
          'Chasing vertical green candles is the quickest way to buy the exact top of an impulse wave.',
          'Implement a daily max loss rule: after 2 consecutive losing trades, close the terminal for the day.',
          'Trade the market in front of you, not the market you wish existed.',
        ],
      },
      {
        id: 'w4-t4',
        title: 'Cold Storage, 2FA & Exchange Operational Security (OpSec)',
        description:
          'Harden your trading setup with hardware security keys (YubiKey), app-based 2FA, anti-phishing codes, and multi-signature cold storage.',
        category: 'Risk & Mindset',
        keyTakeaways: [
          'Never use SMS 2FA due to SIM-swapping vulnerabilities; always utilize authenticator apps or hardware security keys.',
          'Store core long-term portfolio reserves in cold storage; only keep active trading margin on exchanges.',
          'Verify URL bookmarks and check contract addresses against official developer repos before signing transactions.',
        ],
      },
    ],
    videos: [
      {
        id: 'w4-v1',
        title: 'Risk Management: How to Never Blow Up a Trading Account',
        channel: 'Rayner Teo',
        duration: '28:30',
        youtubeId: 'q8VnE_aT798',
        description:
          'The exact risk management blueprint used by proprietary trading desks to safeguard capital and systematically scale size.',
      },
      {
        id: 'w4-v2',
        title: 'Trading Psychology: The Mindset of the Top 1% of Traders',
        channel: 'Trading 212',
        duration: '16:45',
        youtubeId: '_x1bA2U7Z8s',
        description:
          'How professional market participants control fear, manage probability distribution, and eliminate cognitive bias.',
      },
    ],
    articles: [
      {
        id: 'w4-a1',
        title: 'The 1% Rule in Trading: Why It Protects Your Capital',
        source: 'Investopedia',
        readTime: '6 min read',
        url: 'https://www.investopedia.com/terms/o/one-percent-rule.asp',
        summary:
          'Detailed explanation of mathematical drawdown curves and how restricting risk per trade ensures longevity.',
        keyPoints: [
          'A series of 10 consecutive losses at 1% risk per trade reduces your account by under 10%.',
          'At 10% risk per trade, 10 losses wipes out over 65% of your capital.',
          'Longevity and surviving bad market regimes is the primary prerequisite for compound growth.',
        ],
      },
      {
        id: 'w4-a2',
        title: 'The Psychology of Market Cycles: From Euphoria to Capitulation',
        source: 'Binance Academy',
        readTime: '8 min read',
        url: 'https://academy.binance.com/en/articles/the-psychology-of-market-cycles',
        summary:
          'Explore the emotional continuum of hope, optimism, thrill, euphoria, anxiety, denial, panic, and depression in financial markets.',
        keyPoints: [
          'Maximum financial opportunity occurs at the point of maximum pessimism and panic.',
          'Maximum financial risk occurs when social media and mainstream sentiment reach peak euphoria.',
          'Having a written trading plan prevents emotional decision making during market extremes.',
        ],
      },
    ],
  },
  {
    id: 5,
    weekNumber: 5,
    title: 'Advanced Trading & Real-World Practice',
    subtitle: 'Derivatives, Order Flow, Paper Trading & Trade Journaling',
    difficulty: 'Advanced',
    focus: 'Paper Trading Sandbox, Funding Rates, Liquidation Heatmaps & Journaling',
    description:
      'Bridge the gap between theoretical knowledge and real-world execution. Practice risk-free in simulated paper trading environments, understand perpetual futures and funding rates, analyze liquidation cascades, and build an institutional-grade trade journal.',
    topics: [
      {
        id: 'w5-t1',
        title: 'Simulated Paper Trading Sandbox & Strategy Backtesting',
        description:
          'Execute at least 20 simulated trades without real money to test your system, verify edge, and refine entry/exit timing without financial consequence.',
        category: 'Hands-on Execution',
        keyTakeaways: [
          'Paper trade until your win rate and risk-to-reward metrics generate positive expected value over a minimum sample of 30 trades.',
          'Treat paper trading dollars with the exact emotional discipline and position sizing as real capital.',
          'Identify common execution errors (chasing, premature exits, missing stop-losses) before risking cash.',
        ],
      },
      {
        id: 'w5-t2',
        title: 'Perpetual Futures, Funding Rates & Open Interest',
        description:
          'Learn how crypto perpetual swaps maintain price parity with spot markets through periodic funding payments between longs and shorts.',
        category: 'Hands-on Execution',
        keyTakeaways: [
          'Excessively positive funding rates indicate heavy leverage long bias, creating conditions ripe for a "long squeeze".',
          'Open Interest (OI) measures total outstanding derivative contracts; rising OI with rising price confirms institutional participation.',
          'High leverage (>5x-10x) leaves virtually zero room for normal market noise and leads to liquidation cascades.',
        ],
      },
      {
        id: 'w5-t3',
        title: 'Reading Liquidation Heatmaps & Whale Order Flow',
        description:
          'Identify clusters of trader liquidation levels where market makers and algorithms sweep liquidity before reversing price direction.',
        category: 'Hands-on Execution',
        keyTakeaways: [
          'Liquidity sits above previous swing highs (short stop losses) and below swing lows (long stop losses).',
          'Market makers frequently hunt these liquidity pools to fill large institutional orders.',
          'Observe whale wallet inflows into exchanges as a leading indicator of impending sell pressure.',
        ],
      },
      {
        id: 'w5-t4',
        title: 'Building an Institutional Trade Journal & Personal Trading Plan',
        description:
          'Document every trade: date, asset, setup rationale, screenshot, entry, stop loss, take profit, outcome, and post-trade emotional notes.',
        category: 'Hands-on Execution',
        keyTakeaways: [
          'You cannot improve what you do not measure; journaling reveals your most and least profitable setups.',
          'Categorize trades by mistake type (e.g., entered too early, moved stop loss, FOMO trade) to eliminate recurring errors.',
          'Review your trade journal weekly to calibrate risk parameters and strategy rules.',
        ],
      },
    ],
    videos: [
      {
        id: 'w5-v1',
        title: 'Crypto Perpetual Futures & Funding Rates Masterclass',
        channel: 'Coin Bureau',
        duration: '26:40',
        youtubeId: 'G9p0a8m5z24',
        description:
          'Deep dive into perpetual contracts, leverage mechanics, margin modes (cross vs isolated), and funding fee calculations.',
      },
      {
        id: 'w5-v2',
        title: 'How to Build a Professional Trading Journal That Improves Your PnL',
        channel: 'Tradeciety',
        duration: '19:15',
        youtubeId: 's0N_ZfP8a9s',
        description:
          'Step-by-step workflow for tracking edge, measuring expectancy, calculating Sharpe ratios, and fixing common trader pitfalls.',
      },
    ],
    articles: [
      {
        id: 'w5-a1',
        title: 'Open Interest & Funding Rates: A Complete Market Indicator Guide',
        source: 'Coinglass Academy',
        readTime: '8 min read',
        url: 'https://www.coinglass.com/learn',
        summary:
          'Learn how derivative data provides direct insight into trader positioning, leverage imbalances, and potential volatility cascades.',
        keyPoints: [
          'Funding rates reset every 8 hours on major derivatives exchanges.',
          'When retail is excessively bullish with high positive funding, smart money often seeks contrarian opportunities.',
          'Liquidation heatmaps visualize where clusters of forced liquidations will occur during price movements.',
        ],
      },
      {
        id: 'w5-a2',
        title: 'Paper Trading: The Ultimate Risk-Free Proving Ground',
        source: 'Investopedia',
        readTime: '7 min read',
        url: 'https://www.investopedia.com/terms/p/papertrade.asp',
        summary:
          'How forward-testing with paper trading bridges the gap between study and consistent profitable live execution.',
        keyPoints: [
          'Eliminates monetary risk while training pattern recognition and order execution speed.',
          'Validates whether a trading strategy has an edge in current market conditions before allocating capital.',
          'Combine with CryptoGuard AI assistant simulations to test theoretical market scenarios.',
        ],
      },
    ],
  },
];
