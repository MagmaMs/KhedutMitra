"""
End-to-End Test Script for the Tomato Disease Detection Pipeline.

Tests:
  1. Dataset exists and loads correctly.
  2. Model loads and produces valid predictions on one batch.
  3. predict.py inference from raw image bytes across multiple classes.
  4. Advisory module completeness across all 10 classes.
  5. Flask API (GET /health, POST /predict real image, corrupt image, unsupported format).
  6. Express proxy integration (if Express server is running).

Run:
  python test_e2e.py                  # unit & inference tests
  python test_e2e.py --flask          # with Flask running on localhost:5001
"""

from __future__ import annotations

import sys
import argparse
import random
from pathlib import Path

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import numpy as np
import tensorflow as tf

CURRENT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(CURRENT_DIR))

from src.classes import CLASS_NAMES, NUM_CLASSES
from src.dataset import DEFAULT_DATA_DIR
from src.predict import predict
from src.advisory import get_advisory

# ── Helpers ───────────────────────────────────────────────────────────────────
PASS = "[PASS]"
FAIL = "[FAIL]"
INFO = "[INFO]"


def check(description: str, condition: bool, detail: str = ""):
    if condition:
        print(f"  {PASS} {description}")
        if detail:
            print(f"         {detail}")
    else:
        print(f"  {FAIL} {description}")
        if detail:
            print(f"         {detail}")
    return condition


def separator(title: str):
    print(f"\n{'-' * 60}")
    print(f"  {title}")
    print("-" * 60)


# ── Test 1: Dataset Structure ─────────────────────────────────────────────────
def test_dataset():
    separator("Test 1: Dataset Structure")
    results = []

    for split in ["train", "validation", "test"]:
        split_dir = DEFAULT_DATA_DIR / split
        ok = split_dir.exists() and any(split_dir.iterdir())
        results.append(check(f"Split '{split}' directory exists and is non-empty", ok, str(split_dir) if ok else ""))

    test_dir = DEFAULT_DATA_DIR / "test"
    sample_classes = [d for d in test_dir.iterdir() if d.is_dir() and any(d.iterdir())]
    results.append(check(
        "At least 1 class directory has test images",
        len(sample_classes) > 0,
        f"Classes with test images: {[d.name for d in sample_classes]}"
    ))
    return all(results)


# ── Test 2: Model Load + Batch Inference ──────────────────────────────────────
def test_model():
    separator("Test 2: Model Load & Batch Inference")
    results = []

    model_path = CURRENT_DIR / "models" / "tomato_disease_model.keras"
    results.append(check("Model file exists", model_path.exists(), str(model_path)))
    if not model_path.exists():
        return False

    try:
        model = tf.keras.models.load_model(str(model_path))
        results.append(check("Model loaded without error", True))
    except Exception as e:
        results.append(check("Model loaded without error", False, str(e)))
        return False

    fake_batch = np.random.uniform(-1, 1, (4, 224, 224, 3)).astype(np.float32)
    try:
        preds = model.predict(fake_batch, verbose=0)
        results.append(check("Forward pass on random batch succeeded", True))
        results.append(check(
            f"Output shape is (4, {NUM_CLASSES})",
            preds.shape == (4, NUM_CLASSES),
            f"Actual shape: {preds.shape}"
        ))
        results.append(check(
            "Output probabilities sum to ~1.0 per sample",
            all(abs(row.sum() - 1.0) < 1e-3 for row in preds),
            f"Row sums: {[round(r.sum(), 4) for r in preds]}"
        ))
    except Exception as e:
        results.append(check("Forward pass succeeded", False, str(e)))

    return all(results)


# ── Test 3: predict.py Inference ──────────────────────────────────────────────
def test_predict():
    separator("Test 3: predict.py inference from image bytes across multiple classes")
    results = []

    test_dir = DEFAULT_DATA_DIR / "test"
    if not test_dir.exists():
        results.append(check("Test directory exists", False))
        return False

    tested_classes = []
    for cls_dir in sorted(test_dir.iterdir()):
        if not cls_dir.is_dir():
            continue
        images = list(cls_dir.glob("*.jpg"))
        if not images:
            continue
        img_path = random.choice(images)
        try:
            with open(img_path, "rb") as f:
                img_bytes = f.read()
            result = predict(img_bytes)

            ok = (
                isinstance(result["class_id"], int)
                and isinstance(result["disease_name"], str)
                and 0.0 <= result["confidence"] <= 1.0
                and len(result["top_predictions"]) > 0
            )
            results.append(check(
                f"predict() on '{cls_dir.name}' image",
                ok,
                f"-> predicted: '{result['disease_name']}' (conf: {result['confidence_pct']}%)"
            ))
            tested_classes.append(cls_dir.name)
        except Exception as e:
            results.append(check(f"predict() on {cls_dir.name}", False, str(e)))

    print(f"\n  {INFO} Tested {len(tested_classes)} distinct disease classes from test set.")
    return all(results)


# ── Test 4: Advisory Module ───────────────────────────────────────────────────
def test_advisory():
    separator("Test 4: Advisory Module")
    results = []

    for cls_id in range(NUM_CLASSES):
        try:
            advisory = get_advisory(cls_id)
            ok = (
                "severity" in advisory
                and "recommendations" in advisory
                and "prevention" in advisory
                and isinstance(advisory["recommendations"], list)
            )
            results.append(check(
                f"Advisory for class_id={cls_id} ({CLASS_NAMES[cls_id]})",
                ok,
                f"severity={advisory.get('severity', '?')}, "
                f"{len(advisory.get('recommendations', []))} recommendations"
            ))
        except Exception as e:
            results.append(check(f"Advisory for class_id={cls_id}", False, str(e)))

    return all(results)


# ── Test 5: Flask API ─────────────────────────────────────────────────────────
def test_flask(base_url: str = "http://localhost:5001"):
    separator(f"Test 5: Flask API ({base_url})")
    results = []

    try:
        import requests as req_lib
    except ImportError:
        print(f"  {INFO} requests library not available, skipping Flask tests.")
        return True

    # 1. Health check
    try:
        r = req_lib.get(f"{base_url}/health", timeout=5)
        results.append(check(
            "GET /health -> 200 with status: ok",
            r.status_code == 200 and r.json().get("status") == "ok",
            f"Response: {r.json()}"
        ))
    except Exception as e:
        results.append(check("GET /health -> 200", False, str(e)))
        print(f"\n  {INFO} Flask service not reachable on {base_url}.")
        return False

    # 2. POST /predict with real image
    test_dir = DEFAULT_DATA_DIR / "test"
    sample_image = None
    for cls_dir in test_dir.iterdir():
        if cls_dir.is_dir():
            imgs = list(cls_dir.glob("*.jpg"))
            if imgs:
                sample_image = imgs[0]
                break

    if sample_image:
        try:
            with open(sample_image, "rb") as f:
                r = req_lib.post(
                    f"{base_url}/predict",
                    files={"image": (sample_image.name, f, "image/jpeg")},
                    timeout=30,
                )
            ok = r.status_code == 200 and r.json().get("success") is True and "prediction" in r.json()
            results.append(check(
                "POST /predict with real image -> 200 with success: true",
                ok,
                f"Disease: '{r.json().get('disease_name')}', conf: {r.json().get('confidence_pct')}%"
            ))
        except Exception as e:
            results.append(check("POST /predict with real image", False, str(e)))

    # 3. POST /predict with corrupt image data
    try:
        r_invalid = req_lib.post(
            f"{base_url}/predict",
            files={"image": ("corrupt.jpg", b"INVALID_CORRUPT_BYTES_XYZ", "image/jpeg")},
            timeout=10,
        )
        ok_inv = r_invalid.status_code in (400, 500) and r_invalid.json().get("success") is False
        results.append(check(
            "POST /predict with corrupt bytes -> clean error response (success: false)",
            ok_inv,
            f"Status {r_invalid.status_code}, error: {r_invalid.json().get('error')}"
        ))
    except Exception as e:
        results.append(check("POST /predict with corrupt bytes", False, str(e)))

    # 4. POST /predict with unsupported file type (.pdf)
    try:
        r_unsupp = req_lib.post(
            f"{base_url}/predict",
            files={"image": ("doc.pdf", b"%PDF-1.4...", "application/pdf")},
            timeout=10,
        )
        ok_unsupp = r_unsupp.status_code == 415 and r_unsupp.json().get("success") is False
        results.append(check(
            "POST /predict with unsupported file extension (.pdf) -> HTTP 415",
            ok_unsupp,
            f"Status {r_unsupp.status_code}, error: {r_unsupp.json().get('error')}"
        ))
    except Exception as e:
        results.append(check("POST /predict with unsupported file extension", False, str(e)))

    return all(results)


# ── Test 6: Express Integration Test ──────────────────────────────────────────
def test_express(express_url: str = "http://localhost:3001"):
    separator(f"Test 6: Express Backend Integration ({express_url})")
    results = []

    try:
        import requests as req_lib
    except ImportError:
        return True

    # Check Express health
    try:
        r = req_lib.get(f"{express_url}/api/health", timeout=5)
        results.append(check(
            "Express GET /api/health -> 200",
            r.status_code == 200 and r.json().get("status") == "ok",
            f"Response: {r.json()}"
        ))
    except Exception as e:
        print(f"  {INFO} Express server not reachable on {express_url} (optional live test). Error: {e}")
        return True

    # Test POST /api/ai/disease
    test_dir = DEFAULT_DATA_DIR / "test"
    sample_image = None
    for cls_dir in test_dir.iterdir():
        if cls_dir.is_dir():
            imgs = list(cls_dir.glob("*.jpg"))
            if imgs:
                sample_image = imgs[0]
                break

    if sample_image:
        try:
            with open(sample_image, "rb") as f:
                r = req_lib.post(
                    f"{express_url}/api/ai/disease",
                    files={"image": (sample_image.name, f, "image/jpeg")},
                    timeout=30,
                )
            ok = r.status_code == 200 and "diagnosis" in r.json() and "confidence" in r.json()
            results.append(check(
                "Express POST /api/ai/disease -> 200 matching DiseaseResult interface",
                ok,
                f"Diagnosis: {r.json().get('diagnosis')}, confidence: {r.json().get('confidence')}%"
            ))
        except Exception as e:
            results.append(check("Express POST /api/ai/disease", False, str(e)))

    return all(results)


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="KhedutMitra AI E2E Test")
    parser.add_argument("--flask", action="store_true", help="Also test the Flask API")
    parser.add_argument("--flask-url", default="http://localhost:5001", help="Flask base URL")
    parser.add_argument("--express", action="store_true", help="Also test the Express backend")
    parser.add_argument("--express-url", default="http://localhost:3001", help="Express base URL")
    args = parser.parse_args()

    print("=" * 60)
    print("  KHEDUTMITRA - TOMATO DISEASE DETECTION E2E TESTS")
    print("=" * 60)

    suite_results = []
    suite_results.append(("Dataset Structure", test_dataset()))
    suite_results.append(("Model Load & Forward Pass", test_model()))
    suite_results.append(("predict.py (Multi-Class)", test_predict()))
    suite_results.append(("Advisory Module (All Classes)", test_advisory()))

    if args.flask:
        suite_results.append(("Flask API", test_flask(args.flask_url)))

    if args.express:
        suite_results.append(("Express Backend Proxy", test_express(args.express_url)))

    print("\n" + "=" * 60)
    print("  TEST SUMMARY")
    print("=" * 60)
    passed = 0
    for name, result in suite_results:
        icon = PASS if result else FAIL
        print(f"  {icon} {name}")
        if result:
            passed += 1
    print(f"\n  {passed}/{len(suite_results)} test suites passed.")
    print("=" * 60)

    sys.exit(0 if passed == len(suite_results) else 1)


if __name__ == "__main__":
    main()
