import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";

async function startServer() {
  const app = express();
  const PORT = 3001;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Proxy for CoinGecko to avoid CORS and hide logic if needed
  app.get("/api/market-data", async (req, res) => {
    try {
      const { vs_currency = "usd", order = "market_cap_desc", per_page = 100, page = 1, sparkline = false } = req.query;
      const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
        params: {
          vs_currency,
          order,
          per_page,
          page,
          sparkline
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching market data:", error);
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  app.get("/api/coin/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: true,
          developer_data: true,
          sparkline: true
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error(`Error fetching coin data for ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch coin data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
