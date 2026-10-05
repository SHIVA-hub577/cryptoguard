<!-- # 🛡️ CryptoGuard - AI-Powered Risk Intelligence Platform

CryptoGuard is a next-generation crypto analytics dashboard built for the Hackathon. It leverages **Generative AI** and **Real-time Market Data** to help investors detect risks, spot rug pulls, and optimize their portfolios.

## 🌟 Standout Features (Hackathon Highlights)

These are the key differentiators that make CryptoGuard unique:

1.  **🧠 AI Risk Engine**: We don't just show charts. We use **Google Gemini AI** to analyze market data and generate human-readable risk assessments (e.g., "High volatility detected due to low liquidity").
2.  **🕵️ Rug Pull Detector**: Instantly scans smart contracts for red flags:
    - Is liquidity locked?
    - Is the contract renounced?
    - Do whales hold >20% of supply?
3.  **🐋 Live Whale Tracker**: A real-time feed of massive crypto movements between wallets and exchanges, helping users spot dumps before they happen.
4.  **📊 Portfolio Health Audit**: Assigns a "Health Grade" (A-F) to user portfolios based on diversification and asset quality, with AI-suggested rebalancing actions.
5.  **🔐 Passwordless Auth**: Integrated **Phone.Email** for secure, one-tap login via phone number verification.

---

## 🛠️ How It Works

CryptoGuard combines traditional market data with LLM-powered insights:

1.  **Data Ingestion**: The app fetches live price, volume, and market cap data via the **CoinGecko API**.
2.  **Algorithmic Scoring**: A proprietary algorithm calculates a base "Risk Score" (0-100) locally in the browser based on volatility (24h change), liquidity depth, and market cap rank.
3.  **AI Synthesis**: When a user scans a coin or asks the Assistant, we construct a prompt with this live data and send it to **Google Gemini**. The AI acts as a financial analyst, interpreting the numbers into actionable advice.
4.  **Real-Time Updates**: The dashboard simulates live WebSocket connections for whale alerts and price tickers to demonstrate reactivity.

---

## 🔑 APIs & Technologies Used

We utilized a modern stack to build a fast, responsive, and intelligent application:

### **APIs**

- **Google Gemini API**: The brain behind our "AI Assistant" and "Risk Analysis" features. It processes raw data into natural language insights.
- **CoinGecko API**: Provides the fundamental market data (prices, images, market cap ranks) for over 10,000 cryptocurrencies.
- **Phone.Email API**: Enables the "Sign in with Phone" widget on our Auth page for seamless onboarding.

### **Frontend Stack**

- **React + TypeScript**: For type-safe, component-based UI architecture.
- **Tailwind CSS**: For rapid, responsive styling and dark mode implementation.
- **Framer Motion**: For smooth page transitions and micro-interactions (like the scanning animation).
- **Recharts**: For rendering complex data visualizations (Risk Radar, Portfolio Pie Charts).
- **Lucide React**: For consistent, beautiful iconography.

---

## 🚀 Getting Started

To run CryptoGuard locally:

1.  **Clone the repo**
    ```bash
    git clone https://github.com/your-team/cryptoguard.git
    ```
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Set up Environment Variables**
    Create a `.env` file in the root:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key
    GEMINI_API_KEY=your_gemini_api_key
    MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/cryptoguard
    GOOGLE_USER=your_email@gmail.com
    GMAIL_APP_PASSWORD=your_16_char_google_app_password
    ```
4.  **Run the app**
    ```bash
    npm run dev
    ```

---

## 📸 Project Structure

- `/src/pages/CoinScanner.tsx`: The core risk analysis tool.
- `/src/pages/AIAssistant.tsx`: The chat interface for AI inquiries.
- `/src/pages/Dashboard.tsx`: The main command center with widgets and whale alerts.
- `/src/pages/Portfolio.tsx`: Asset management and AI auditing.
- `/src/pages/AuthPage.tsx`: Login screen with Phone.Email integration. -->
________________________________
Below is a **professional README.md** tailored for your **CryptoGuard project** and optimized for **hackathon presentation**.
It highlights **the features judges care about**, explains the product clearly, and keeps it **clean and impressive**.

You can paste this directly into your GitHub repo.

---

# 🛡️ CryptoGuard

### AI-Powered Crypto Risk Intelligence Platform

CryptoGuard is an **AI-driven cryptocurrency risk analysis platform** designed to help investors **identify market risks, whale movements, and smart-contract vulnerabilities before investing**.

The platform combines **real-time blockchain data, market analytics, and AI insights** to provide **actionable intelligence for safer crypto investing**.

---

# 🚀 Problem Statement

Many crypto investors invest blindly without understanding risks such as:

* Whale manipulation
* Rug pulls
* High volatility
* Liquidity issues
* Poor portfolio diversification

This often leads to **significant financial losses**.

CryptoGuard solves this by providing **real-time AI-powered risk analysis and portfolio intelligence**.

---

# 💡 Solution

CryptoGuard provides a **comprehensive risk intelligence dashboard** that allows users to:

* Analyze token risk before investing
* Monitor whale wallet activity
* Evaluate portfolio diversification and risk
* Detect potential rug-pull scams
* Receive AI-powered market insights

---

# ⭐ Key Features

## 🔍 AI Risk Scanner

Analyze any cryptocurrency or token to determine investment risk.

Risk metrics include:

* Liquidity Depth
* Volatility Index
* Whale Concentration
* Contract Security
* Social Sentiment
* Market Stability

Users receive an **AI-generated risk assessment explaining the results**.

---

## 🐋 Whale Activity Tracker

Tracks large blockchain transactions in real time.

Example alerts:

```
1,420 BTC moved
Unknown Wallet → Binance
```

This helps detect **market manipulation and institutional activity**.

---

## 📊 Market Risk Heatmap

Visualizes the risk levels of major cryptocurrencies.

Displays:

* BTC
* ETH
* SOL
* LINK
* DOGE
* AVAX
* DOT
* MATIC
* SHIB
* NEAR

Each asset shows:

* current price
* risk score
* market movement

---

## 💼 Portfolio Analyzer

Allows users to track and analyze their crypto portfolio.

Features:

* Add holdings
* View asset allocations
* Portfolio health score
* Risk score per asset
* AI diversification analysis

Users can identify **overexposed assets and rebalance accordingly**.

---

## 🧠 AI Investment Assistant

An AI chatbot that helps users understand market conditions.

Example questions:

* *Is Bitcoin risky right now?*
* *Should I rebalance my portfolio?*
* *What caused the latest volatility spike?*

The AI responds using **market signals and blockchain activity analysis**.

---

## 📑 Risk Analytics Reports

Provides historical risk analysis and market insights.

Users can view analytics for:

* 1 Day
* 7 Days
* 30 Days
* 3 Months
* 6 Months

Reports include:

* risk exposure trends
* volatility analysis
* whale activity logs

Users can **export reports as PDF files**.

---

## 🛑 Rug Pull Detection

CryptoGuard analyzes smart contract risks to detect potential scams.

Checks include:

* liquidity lock status
* whale wallet distribution
* suspicious contract permissions
* minting authority

The system generates a **Rug Pull Risk Score**.

---

## 🔔 Smart Alerts

CryptoGuard notifies users about:

* whale transactions
* sudden market risk spikes
* high-risk tokens
* portfolio exposure risks

---

## 🎓 Learn Hub (Trading Masterclass)

A structured 5-week curriculum empowering users to learn stock market & crypto trading from beginner fundamentals to institutional execution.

Features:
* **5-Week Roadmap**:
  * **Week 1**: Basics of Stock Market & Crypto (Order books, blockchain, wallets, market caps)
  * **Week 2**: Technical Analysis (Candlesticks, support/resistance, RSI, MACD, moving averages)
  * **Week 3**: Fundamental Analysis (Tokenomics, vesting schedules, TVL, honeypot detection)
  * **Week 4**: Risk Management & Trading Strategies (1% rule, R:R math, trading psychology, OpSec)
  * **Week 5**: Advanced Trading & Real-World Practice (Paper trading, perpetuals, funding rates, journaling)
* **Embedded YouTube Video Lectures**: Play high-yield educational videos directly in-app without redirects.
* **Curated Article Library**: Deep-dive reading materials from Binance Academy, Investopedia, CoinGecko, and Coinglass with instant takeaways.
* **Persistent Progress Tracking**: Check off topics, videos, and articles with automatic `localStorage` persistence, progress bars, and dashboard sync.

---

# 🖥️ Platform Pages

CryptoGuard includes the following modules:

| Page               | Description                                            |
| ------------------ | ------------------------------------------------------ |
| Landing Page       | Explains product and features                          |
| Login Page         | Secure authentication                                  |
| Dashboard          | Overview of market risk, whale alerts & Learn Hub sync |
| Risk Scanner       | Analyze individual cryptocurrencies                    |
| Portfolio Analyzer | Manage and analyze holdings                            |
| Learn Hub          | 5-Week stock & crypto trading roadmap with videos      |
| Reports            | Historical risk analytics                              |
| AI Assistant       | AI-powered investment guidance                         |
| Settings           | User preferences and alerts                            |

---

# 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Recharts (Data Visualization)

### Backend & Database

* Node.js & Express.js
* MongoDB Atlas & Mongoose
* Database Session Management with auto-expiring TTL
* Nodemailer & Gmail SMTP for secure Email OTP Verification
* Bcrypt.js password hashing

### APIs

* CoinGecko API (market data proxy)
* Google Gemini API (AI risk analysis & portfolio assistant)
* Gmail SMTP Service (Email OTP delivery)

---

# 🎯 Features to Highlight During Hackathon Demo

Judges care about **impact + innovation**.

Focus on demonstrating these features:

### 1️⃣ AI Risk Scanner

Explain how CryptoGuard evaluates **multiple market risk signals simultaneously**.

---

### 2️⃣ Whale Activity Detection

Show live whale alerts and explain **how large transactions impact market movements**.

---

### 3️⃣ Portfolio Risk Intelligence

Demonstrate how CryptoGuard **evaluates diversification and portfolio health**.

---

### 4️⃣ Rug Pull Detection

Highlight the system’s ability to **detect potential crypto scams before investment**.

---

### 5️⃣ AI Investment Assistant

Show how users can **ask questions about risk and market behavior**.

This is a strong **AI integration feature**.

---

# 📊 Innovation Highlights

CryptoGuard stands out because it combines:

* **AI-powered market analysis**
* **Blockchain transaction monitoring**
* **Portfolio risk evaluation**
* **Smart contract security scanning**

All in a **single unified platform**.

---

# 🧪 Future Improvements

Planned enhancements include:

* DeFi protocol risk monitoring
* NFT project risk analysis
* Social sentiment analysis using Twitter
* Advanced portfolio rebalancing AI
* Multi-chain whale tracking

---

# 👨‍💻 Team

Built for the **Invenza '26 Hackathon**.

Mission:

> Helping investors make **safer crypto decisions using AI and blockchain analytics**.

---

# ⚠ Disclaimer

CryptoGuard provides **risk insights and analytics** but does not constitute financial advice.

Users should perform their own research before investing.

---

# 🏁 Conclusion

CryptoGuard transforms raw blockchain and market data into **clear, actionable risk intelligence**, helping investors **protect capital and avoid costly mistakes**.

---


