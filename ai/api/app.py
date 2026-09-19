"""
Flask REST API for Tomato Leaf Disease Detection.

Endpoints:
  GET  /health      → Service liveness check.
  POST /predict     → Multipart image upload → JSON prediction.

Environment variables:
  FLASK_PORT        Port to listen on (default: 5001).
  MODEL_PATH        Override path to .keras model file.
  MAX_CONTENT_MB    Max upload size in MB (default: 10).
"""

from __future__ import annotations

import os
import sys
import traceback
from pathlib import Path

# Ensure src/ is importable when running directly: `python api/app.py`
_AI_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_AI_DIR))

from flask import Flask, request, jsonify
from flask_cors import CORS

from src.predict import predict, preload_model
from src.advisory import get_advisory


# ── App factory ──────────────────────────────────────────────────────────────
def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)

    max_content_mb = int(os.environ.get("MAX_CONTENT_MB", "10"))
    app.config["MAX_CONTENT_LENGTH"] = max_content_mb * 1024 * 1024

    model_path = os.environ.get("MODEL_PATH", None)

    # Pre-load model at startup so the first request is not slow
    print("[Flask] Loading ML model...", flush=True)
    preload_model(model_path)
    print("[Flask] Model ready.", flush=True)

    # ── Routes ───────────────────────────────────────────────────
    @app.get("/health")
    def health():
        return jsonify({"status": "ok", "service": "tomato-disease-ai"})

    @app.post("/predict")
    def predict_route():
        if "image" not in request.files:
            return jsonify({"success": False, "error": "No image file provided. Send a multipart/form-data request with field 'image'."}), 400

        file = request.files["image"]
        if file.filename == "":
            return jsonify({"success": False, "error": "Empty filename."}), 400

        allowed = {"jpg", "jpeg", "png", "webp", "bmp"}
        ext = (file.filename.rsplit(".", 1)[-1] if "." in file.filename else "").lower()
        if ext not in allowed:
            return jsonify({"success": False, "error": f"Unsupported file type '{ext}'. Allowed: {', '.join(sorted(allowed))}."}), 415

        try:
            image_bytes = file.read()
            pred = predict(image_bytes, model_path=model_path)

            # Enrich with advisory metadata (severity, recommendations, prevention)
            try:
                advisory = get_advisory(pred["class_id"])
            except KeyError:
                advisory = {}

            result = {
                "success": True,
                "prediction": {
                    "class_id": pred["class_id"],
                    "disease": pred["disease_name"],
                    "confidence": pred["confidence"],
                    "confidence_pct": pred["confidence_pct"],
                    "top_predictions": pred["top_predictions"],
                },
                # Direct fields for Express proxy and frontend DiseaseResult mapping
                "class_id": pred["class_id"],
                "disease_name": pred["disease_name"],
                "confidence": pred["confidence"],
                "confidence_pct": pred["confidence_pct"],
                "top_predictions": pred["top_predictions"],
                "diagnosis": pred["disease_name"],
                "severity": advisory.get("severity", "unknown"),
                "explanation": advisory.get("description", ""),
                "recommendations": advisory.get("recommendations", []),
                "prevention": advisory.get("prevention", []),
                "crop": advisory.get("crop", "Tomato"),
            }
            return jsonify(result)
        except Exception:
            # Log full traceback server-side; return opaque message to client
            traceback.print_exc()
            return jsonify({"success": False, "error": "Failed to process image. Ensure the file is a valid image."}), 500

    @app.errorhandler(413)
    def too_large(e):
        return jsonify({"error": f"File too large. Maximum allowed size is {max_content_mb} MB."}), 413

    return app


# ── Entry point ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.environ.get("FLASK_PORT", "5001"))
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    app = create_app()
    print(f"[Flask] Starting Tomato Disease API on port {port}", flush=True)
    app.run(host="0.0.0.0", port=port, debug=debug)
