"""
Tomato Leaf Disease Inference Module.
Loads the trained model once and exposes a `predict()` function
that accepts an image file path or raw bytes and returns a structured
prediction dict (class_id, disease_name, confidence, all_probabilities).

This module is PURELY about inference — it does not contain
treatment recommendations or advisory content.
"""

from __future__ import annotations

import io
from pathlib import Path
from typing import Union

import numpy as np
from PIL import Image
import tensorflow as tf

from .classes import CLASS_NAMES, CLASS_LABELS_MAP, NUM_CLASSES

# ── Constants ────────────────────────────────────────────────────────────────
_IMG_SIZE = (224, 224)
_DEFAULT_MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "tomato_disease_model.keras"

# ── Lazy-loaded model singleton ──────────────────────────────────────────────
_model: tf.keras.Model | None = None


def _get_model(model_path: str | Path | None = None) -> tf.keras.Model:
    """Load and cache the model. Thread-safe for single-process Flask usage."""
    global _model
    if _model is None:
        path = Path(model_path) if model_path else _DEFAULT_MODEL_PATH
        if not path.exists():
            raise FileNotFoundError(
                f"Model file not found: {path}\n"
                "Run 'python train.py' first to generate the model."
            )
        _model = tf.keras.models.load_model(str(path))
    return _model


def _preprocess_image(image_data: Union[bytes, str, Path]) -> np.ndarray:
    """
    Load, resize, and preprocess an image for MobileNetV2.

    Args:
        image_data: Raw bytes (from file upload) or path to an image file.

    Returns:
        float32 numpy array of shape (1, 224, 224, 3) in [-1, 1] range.
    """
    if isinstance(image_data, (str, Path)):
        img = Image.open(str(image_data)).convert("RGB")
    elif isinstance(image_data, bytes):
        img = Image.open(io.BytesIO(image_data)).convert("RGB")
    else:
        raise TypeError(f"Unsupported image_data type: {type(image_data)}")

    img = img.resize(_IMG_SIZE, Image.BILINEAR)
    img_array = np.array(img, dtype=np.float32)          # (224, 224, 3), [0, 255]
    img_array = np.expand_dims(img_array, axis=0)         # (1, 224, 224, 3)
    # MobileNetV2 normalization: [0, 255] → [-1, 1]
    img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
    return img_array


def predict(
    image_data: Union[bytes, str, Path],
    model_path: str | Path | None = None,
    top_k: int = 3,
) -> dict:
    """
    Predict the tomato leaf disease from an image.

    Args:
        image_data: Image bytes or a path to an image file.
        model_path: Optional override for the model file path.
        top_k: Number of top predictions to include in the response.

    Returns:
        A dict with keys:
          - class_id (int): Predicted class index.
          - disease_name (str): Human-readable class name.
          - confidence (float): Probability of the top prediction (0–1).
          - confidence_pct (float): Same, as a percentage (0–100).
          - top_predictions (list[dict]): Top-k predictions with class_id,
              disease_name, and confidence each.
          - all_probabilities (dict[str, float]): Full softmax distribution,
              keyed by class name.
    """
    model = _get_model(model_path)
    img_array = _preprocess_image(image_data)

    probabilities = model.predict(img_array, verbose=0)[0]  # shape (NUM_CLASSES,)

    class_id = int(np.argmax(probabilities))
    confidence = float(probabilities[class_id])
    disease_name = CLASS_LABELS_MAP[class_id]

    # Top-k predictions
    top_indices = np.argsort(probabilities)[::-1][:top_k]
    top_predictions = [
        {
            "class_id": int(i),
            "disease_name": CLASS_LABELS_MAP[int(i)],
            "confidence": round(float(probabilities[i]), 4),
            "confidence_pct": round(float(probabilities[i]) * 100, 2),
        }
        for i in top_indices
    ]

    all_probs = {
        CLASS_LABELS_MAP[i]: round(float(probabilities[i]), 4)
        for i in range(NUM_CLASSES)
    }

    return {
        "class_id": class_id,
        "disease_name": disease_name,
        "confidence": round(confidence, 4),
        "confidence_pct": round(confidence * 100, 2),
        "top_predictions": top_predictions,
        "all_probabilities": all_probs,
    }


def preload_model(model_path: str | Path | None = None) -> None:
    """Eagerly load the model at startup (call from Flask app factory)."""
    _get_model(model_path)
