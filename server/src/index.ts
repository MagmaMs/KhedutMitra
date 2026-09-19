// Express server for KhedutMitra
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import { WeatherService } from './services/weatherService';
import { PriceService } from './services/priceService';
import { AiService } from './services/aiService';
import { requireAuth } from './middleware/auth';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const port = process.env.PORT || 3001;

// Multer configuration: memory storage, 10 MB limit, image MIME filter
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

app.use(cors({ origin: process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN : '*' }));
app.use(express.json());

// ── Health check ──────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Apply authentication middleware to protected routes
app.use('/api', requireAuth);

// ── Weather endpoint ──────────────────────────────────
app.get('/api/weather', async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);
    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ error: 'Missing or invalid lat/lon parameters' });
    }
    const data = await WeatherService.getForecast(lat, lon);
    res.json(data);
  } catch (err: any) {
    console.error('Weather API Error:', err);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// ── Prices endpoint ───────────────────────────────────
app.get('/api/prices', async (req, res) => {
  try {
    const cropId = String(req.query.crop);
    const stateId = String(req.query.state);
    const districtId = String(req.query.district);
    if (!cropId || !stateId || !districtId) {
      return res.status(400).json({ error: 'Missing required parameters: crop, state, district' });
    }
    const data = await PriceService.getPrices(cropId, stateId, districtId);
    res.json(data);
  } catch (err: any) {
    console.error('Prices API Error:', err);
    res.status(500).json({ error: 'Failed to fetch market prices' });
  }
});

// ── AI disease detection ─────────────────────────────────
app.post('/api/ai/disease', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    const result = await AiService.analyzeDisease(req.file.buffer, req.file.mimetype);
    res.json(result);
  } catch (err: any) {
    console.error('AI Disease Error:', err?.message ?? err);
    if (err?.code === 'ECONNREFUSED' || err?.code === 'ENOTFOUND') {
      return res.status(503).json({ error: 'AI service is currently unavailable. Please ensure the disease detection service is running.' });
    }
    res.status(500).json({ error: 'Failed to analyze disease image' });
  }
});

// ── AI advice endpoint (existing) ───────────────────────
app.post('/api/ai/advice', async (req, res) => {
  try {
    const { query, context } = req.body;
    if (!query) return res.status(400).json({ error: 'Missing query parameter' });
    const data = await AiService.getCropAdvice(query, context);
    res.json(data);
  } catch (err: any) {
    console.error('AI Advice Error:', err);
    res.status(500).json({ error: 'Failed to process AI advice request' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`KhedutMitra server running on port ${port}`);
});
