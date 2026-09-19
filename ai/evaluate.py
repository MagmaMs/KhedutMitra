"""
Baseline Model Evaluation Script.
Loads the saved model, evaluates on the held-out test set,
saves confusion matrix, classification report, and metrics.json.
"""

import os
import sys
import json
from pathlib import Path

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import tensorflow as tf

CURRENT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(CURRENT_DIR))

from src.classes import CLASS_NAMES, NUM_CLASSES
from src.dataset import load_tomato_dataset, DEFAULT_DATA_DIR

try:
    from sklearn.metrics import (
        classification_report,
        confusion_matrix,
        ConfusionMatrixDisplay,
    )
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    print("[Warning] scikit-learn not available — skipping classification report.")


def evaluate(model_path: str | None = None):
    models_dir = CURRENT_DIR / "models"
    results_dir = CURRENT_DIR / "results"
    results_dir.mkdir(parents=True, exist_ok=True)

    if model_path is None:
        model_path = models_dir / "tomato_disease_model.keras"

    model_path = Path(model_path)
    if not model_path.exists():
        raise FileNotFoundError(f"Model not found: {model_path}")

    print("=" * 60)
    print("TOMATO DISEASE MODEL — EVALUATION")
    print("=" * 60)
    print(f"Model: {model_path}")
    print(f"Results will be saved to: {results_dir}")

    # ── 1. Load Data ────────────────────────────────────────────
    print("\n[1/4] Loading test dataset...")
    _, _, test_ds, _ = load_tomato_dataset(
        data_dir=DEFAULT_DATA_DIR,
        batch_size=32,
        img_size=(224, 224),
        use_cache=False,
        normalize_for_mobilenet=True,
    )

    # ── 2. Load Model ────────────────────────────────────────────
    print("\n[2/4] Loading model...")
    model = tf.keras.models.load_model(str(model_path))
    print("  Model loaded successfully.")

    # ── 3. Evaluate ──────────────────────────────────────────────
    print("\n[3/4] Evaluating on test set...")
    test_loss, test_acc = model.evaluate(test_ds, verbose=1)
    print(f"\n  Test Loss:     {test_loss:.4f}")
    print(f"  Test Accuracy: {test_acc * 100:.2f}%")

    # ── 4. Per-class predictions ─────────────────────────────────
    print("\n[4/4] Generating per-class metrics...")
    all_labels = []
    all_preds = []

    for images, labels in test_ds:
        preds = model.predict(images, verbose=0)
        pred_classes = np.argmax(preds, axis=1)
        all_labels.extend(labels.numpy().tolist())
        all_preds.extend(pred_classes.tolist())

    all_labels = np.array(all_labels)
    all_preds = np.array(all_preds)

    # ── Save metrics.json ────────────────────────────────────────
    per_class_correct = {}
    for cls_id, cls_name in enumerate(CLASS_NAMES):
        mask = all_labels == cls_id
        count = int(mask.sum())
        correct = int((all_preds[mask] == cls_id).sum()) if count > 0 else 0
        per_class_correct[cls_name] = {
            "total": count,
            "correct": correct,
            "accuracy": round(correct / count, 4) if count > 0 else None,
        }

    metrics = {
        "model_path": str(model_path),
        "test_loss": round(float(test_loss), 4),
        "test_accuracy": round(float(test_acc), 4),
        "per_class": per_class_correct,
    }

    metrics_path = results_dir / "metrics.json"
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)
    print(f"  Metrics saved: {metrics_path}")

    # ── Classification Report ───────────────────────────────────
    if SKLEARN_AVAILABLE:
        # Build list of classes that actually appear in test set
        present_ids = sorted(set(all_labels.tolist()))
        present_names = [CLASS_NAMES[i] for i in present_ids]

        report_str = classification_report(
            all_labels,
            all_preds,
            labels=present_ids,
            target_names=present_names,
            zero_division=0,
        )
        report_path = results_dir / "classification_report.txt"
        with open(report_path, "w", encoding="utf-8") as f:
            f.write(f"Model: {model_path}\n")
            f.write(f"Test Loss: {test_loss:.4f}  |  Test Accuracy: {test_acc*100:.2f}%\n")
            f.write("=" * 70 + "\n")
            f.write(report_str)
        print(f"  Classification report saved: {report_path}")
        print("\n" + report_str)

        # ── Confusion Matrix ─────────────────────────────────────
        cm = confusion_matrix(all_labels, all_preds, labels=list(range(NUM_CLASSES)))

        fig, ax = plt.subplots(figsize=(12, 10))
        disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=CLASS_NAMES)
        disp.plot(ax=ax, cmap="Blues", xticks_rotation=45, colorbar=True)
        ax.set_title("Tomato Disease — Confusion Matrix (Test Set)", fontsize=14, pad=15)
        plt.tight_layout()
        cm_path = results_dir / "confusion_matrix.png"
        plt.savefig(cm_path, dpi=150)
        plt.close()
        print(f"  Confusion matrix saved: {cm_path}")

    print("\n" + "=" * 60)
    print("EVALUATION COMPLETE")
    print(f"  Test Accuracy : {test_acc * 100:.2f}%")
    print(f"  Test Loss     : {test_loss:.4f}")
    print(f"  Results Dir   : {results_dir}")
    print("=" * 60)

    return metrics


if __name__ == "__main__":
    evaluate()
