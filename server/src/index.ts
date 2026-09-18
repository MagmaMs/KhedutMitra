import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { WeatherService } from './services/weatherService';
import { PriceService } from './services/priceService';
import { AiService } from './services/aiService';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ── Health ──────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Weather ─────────────────────────────────────────────────────
app.get('/api/weather', async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);
    if (!lat || !lon) return res.status(400).json({ error: 'Missing lat/lon' });
    
    const data = await WeatherService.getForecast(lat, lon);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Prices ──────────────────────────────────────────────────────
app.get('/api/prices', async (req, res) => {
  try {
    const cropId = String(req.query.crop);
    const stateId = String(req.query.state);
    const districtId = String(req.query.district);
    
    const data = await PriceService.getPrices(cropId, stateId, districtId);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/prices/history', async (req, res) => {
  try {
    // Demo history
    const history = Array.from({ length: 7 }).map((_, i) => ({
      date: new Date(Date.now() - (6 - i) * 86400000).toISOString(),
      modalPrice: 7000 + Math.random() * 1000
    }));
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── AI & ML ─────────────────────────────────────────────────────
app.post('/api/ai/advice', async (req, res) => {
  try {
    const { query, context } = req.body;
    const data = await AiService.getCropAdvice(query, context);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/disease', async (req, res) => {
  try {
    // In a real app, use multer to parse multipart form data
    const data = await AiService.analyzeDisease(Buffer.from(''));
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`KhedutMitra server running on port ${port}`);
});
