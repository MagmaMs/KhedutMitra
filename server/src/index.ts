import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import { WeatherService } from './services/weatherService';
import { PriceService } from './services/priceService';
import { AiService } from './services/aiService';
import { requireAuth } from './middleware/auth';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const port = process.env.PORT || 3001;

const upload = multer({ 
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.use(cors({ origin: process.env.NODE_ENV === "production" ? process.env.CORS_ORIGIN : "*" }));
app.use(express.json());

// ── Health ──────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Apply auth middleware to all API routes below health
app.use('/api', requireAuth);

// ── Weather ─────────────────────────────────────────────────────
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

// ── Prices ──────────────────────────────────────────────────────
app.get('/api/prices', async (req, res) => {
  try {
    const cropId = String(req.query.crop);
    const stateId = String(req.query.state);
    const districtId = String(req.query.district);
    
    if (!req.query.crop || !req.query.state || !req.query.district) {
      return res.status(400).json({ error: 'Missing required parameters: crop, state, district' });
    }
    
    const data = await PriceService.getPrices(cropId, stateId, districtId);
    res.json(data);
  } catch (err: any) {
    console.error('Prices API Error:', err);
    res.status(500).json({ error: 'Failed to fetch market prices' });
  }
});

// ── AI & ML ─────────────────────────────────────────────────────
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

app.post('/api/ai/disease', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large. Maximum size is 10MB.' });
      }
      return res.status(400).json({ error: 'File upload error' });
    } else if (err) {
      return res.status(500).json({ error: 'Unknown upload error' });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    const data = await AiService.analyzeDisease(req.file.buffer, req.file.mimetype);
    res.json(data);
  } catch (err: any) {
    console.error('AI Disease Error:', err);
    res.status(500).json({ error: 'Failed to analyze disease image' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`KhedutMitra server running on port ${port}`);
});
