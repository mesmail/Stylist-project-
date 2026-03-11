
import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Simple in-memory history store (for demo purposes)
  // In a real app, this would be a database
  let analysisHistory: any[] = [];

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/history", (req, res) => {
    res.json(analysisHistory);
  });

  app.post("/api/history", (req, res) => {
    const { analysis, outfits } = req.body;
    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      analysis,
      outfits
    };
    analysisHistory.unshift(newEntry);
    // Keep only last 10 entries
    analysisHistory = analysisHistory.slice(0, 10);
    res.status(201).json(newEntry);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
