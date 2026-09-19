# KhedutMitra — Tomato Leaf Disease Detection Module

This module provides deep-learning-based diagnosis of tomato leaf diseases using transfer learning with **MobileNetV2** pretrained on ImageNet, served via a lightweight Flask REST API and integrated into the KhedutMitra Express + React platform.

---

## Architecture Overview

```
[User / Frontend (React)]
           │  (multipart/form-data)
           ▼
[Express Server (Port 3001)] ─── server/src/index.ts (multer)
           │
           │  (POST /predict via axios)
           ▼
[Flask AI Service (Port 5001)] ── ai/api/app.py
           │
           ├─► ai/src/predict.py   (ML Inference: MobileNetV2 .keras)
           └─► ai/src/advisory.py  (Agronomic recommendations & severity)
```

---

## 10-Class Classification Target

| Class ID | Disease / Health Status | PlantVillage Mapping | Notes |
|:---:|---|---|---|
| 0 | Healthy | `Tomato___healthy` | Healthy reference leaves |
| 1 | Leaf Mold | `Tomato___Leaf_Mold` | *Passalora fulva* |
| 2 | Target Spot | `Tomato___Target_Spot` | *Corynespora cassiicola* |
| 3 | Late Blight | `Tomato___Late_blight` | *Phytophthora infestans* |
| 4 | Early Blight | `Tomato___Early_blight` | *Alternaria solani* |
| 5 | Bacterial Spot | `Tomato___Bacterial_spot` | *Xanthomonas* spp. |
| 6 | Septoria Leaf Spot | `Tomato___Septoria_leaf_spot` | *Septoria lycopersici* |
| 7 | Tomato Mosaic Virus | `Tomato___Tomato_mosaic_virus` | *0 images in current HF shard* |
| 8 | Tomato Yellow Leaf Curl Virus | `Tomato___Tomato_Yellow_Leaf_Curl_Virus` | *TYLCV* (whitefly vector) |
| 9 | Spider Mites | `Tomato___Spider_mites Two-spotted_spider_mite` | *Tetranychus urticae* |

> **Note on Class 7 (Tomato Mosaic Virus)**: The `Rouaaaa/tomato-leaf-disease-image` Hugging Face parquet shard contains 0 images for Class 7. The 10-class output topology is preserved for API stability and future dataset updates.

---

## Project Structure

```
ai/
├── .venv/                      # Python 3.12 virtual environment (ignored)
├── datasets/                   # Extracted images (train/val/test) (ignored)
├── models/                     # Saved Keras model files (ignored)
│   ├── tomato_disease_model.keras       # Baseline frozen-base model
│   └── tomato_disease_finetuned.keras   # Fine-tuned model (top 30 layers)
├── results/                    # Evaluation artifacts
│   ├── classification_report.txt
│   ├── confusion_matrix.png
│   └── metrics.json
├── src/
│   ├── classes.py              # Class lists, mappings, ID dictionaries
│   ├── dataset.py              # tf.data pipeline, download with HTTP resume
│   ├── model.py                # MobileNetV2 architecture builder
│   ├── predict.py              # Pure inference module (singleton loader)
│   └── advisory.py             # Structured agronomic treatment advice
├── api/
│   ├── __init__.py
│   └── app.py                  # Flask REST service (POST /predict, GET /health)
├── train.py                    # Baseline training script (frozen base)
├── finetune.py                 # Fine-tuning script (unfreezes top 30 layers)
├── evaluate.py                 # Evaluation script (test set metrics & reports)
├── test_e2e.py                 # End-to-end verification test suite
└── verify_dataset.py           # Dataset integrity & class distribution checker
```

---

## Setup & Running

### 1. Environment
Use the dedicated Python virtual environment:
```powershell
# Windows PowerShell
.\ai\.venv\Scripts\Activate.ps1
```

### 2. Training
```bash
# Baseline training (MobileNetV2 frozen base)
python ai/train.py

# Fine-tuning (unfreezes top 30 layers with LR=1e-5)
python ai/finetune.py
```

### 3. Evaluation
```bash
python ai/evaluate.py
```
Output artifacts are saved to `ai/results/`:
- `classification_report.txt` — precision, recall, F1 per class
- `confusion_matrix.png` — visual confusion matrix
- `metrics.json` — machine-readable evaluation results

### 4. Running the Flask AI Service
```bash
python ai/api/app.py
```
Default port: `5001`. Configurable via environment variables:
- `FLASK_PORT`: Port to listen on (default `5001`)
- `MODEL_PATH`: Custom path to `.keras` weights file
- `MAX_CONTENT_MB`: Upload limit in MB (default `10`)

### 5. Running E2E Tests
```bash
# Test dataset, model loading, predict.py, and advisory
python ai/test_e2e.py

# Also test live Flask API
python ai/test_e2e.py --flask
```

---

## API Reference

### `GET /health`
Liveness check.
```json
{
  "status": "ok",
  "service": "tomato-disease-ai"
}
```

### `POST /predict`
Upload leaf image via `multipart/form-data` with field name `image`.

**Response (JSON)**:
```json
{
  "class_id": 3,
  "disease_name": "Late Blight",
  "confidence": 0.8921,
  "confidence_pct": 89.21,
  "top_predictions": [
    { "class_id": 3, "disease_name": "Late Blight", "confidence": 0.8921, "confidence_pct": 89.21 },
    { "class_id": 4, "disease_name": "Early Blight", "confidence": 0.0632, "confidence_pct": 6.32 },
    { "class_id": 2, "disease_name": "Target Spot", "confidence": 0.0211, "confidence_pct": 2.11 }
  ],
  "diagnosis": "Late Blight",
  "severity": "high",
  "explanation": "Caused by the oomycete Phytophthora infestans...",
  "recommendations": [
    "Apply Metalaxyl-M + Mancozeb (Ridomil Gold) @ 2.5g/L preventively.",
    "Remove and destroy heavily infected plants immediately."
  ],
  "prevention": [
    "Plant only certified disease-free seeds/transplants.",
    "Improve drainage and avoid overhead irrigation."
  ],
  "crop": "Tomato"
}
```

---

## Express Server Integration

The Express backend (`server/src/services/aiService.ts` and `server/src/index.ts`) proxies `/api/ai/disease` uploads directly to `http://localhost:5001/predict`:
- Configure via `.env`: `DISEASE_API_URL=http://localhost:5001`
- Handles file validation via `multer` (memory storage, max 10MB)
- Distinguishes network connection errors (503) from processing errors (500)
