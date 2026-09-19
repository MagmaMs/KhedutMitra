"""
Fine-tuning Script for MobileNetV2 — Unfreeze top layers with very small LR.
Loads the baseline model, unfreezes upper layers of MobileNetV2, and continues training.
"""

import os
import sys
import time
from pathlib import Path

import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf

CURRENT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(CURRENT_DIR))

from src.classes import NUM_CLASSES, CLASS_NAMES
from src.dataset import load_tomato_dataset, DEFAULT_DATA_DIR


FINE_TUNE_LR = 1e-5
FINE_TUNE_EPOCHS = 3
UNFREEZE_FROM_LAYER = -30  # Unfreeze the top 30 layers of MobileNetV2 base


def finetune(
    baseline_model_path: str | None = None,
    output_model_path: str | None = None,
):
    models_dir = CURRENT_DIR / "models"
    models_dir.mkdir(parents=True, exist_ok=True)

    if baseline_model_path is None:
        baseline_model_path = models_dir / "tomato_disease_model.keras"
    if output_model_path is None:
        output_model_path = models_dir / "tomato_disease_finetuned.keras"

    baseline_model_path = Path(baseline_model_path)
    output_model_path = Path(output_model_path)

    if not baseline_model_path.exists():
        raise FileNotFoundError(f"Baseline model not found: {baseline_model_path}")

    print("=" * 60)
    print("MOBILENETV2 FINE-TUNING (UNFREEZE TOP LAYERS)")
    print("=" * 60)
    print(f"Baseline model : {baseline_model_path}")
    print(f"Output model   : {output_model_path}")
    print(f"Fine-tune LR   : {FINE_TUNE_LR}")
    print(f"Unfreeze from  : layer {UNFREEZE_FROM_LAYER} (top 30 MobileNetV2 layers)")

    # ── 1. Load Data ────────────────────────────────────────────
    print("\n[1/4] Loading datasets...")
    train_ds, val_ds, _, _ = load_tomato_dataset(
        data_dir=DEFAULT_DATA_DIR,
        batch_size=32,
        img_size=(224, 224),
        use_cache=True,
        normalize_for_mobilenet=True,
    )

    # ── 2. Load Baseline Model ────────────────────────────────────
    print("\n[2/4] Loading baseline model...")
    model = tf.keras.models.load_model(str(baseline_model_path))
    print("  Baseline model loaded.")

    # ── 3. Unfreeze Top Layers ────────────────────────────────────
    print("\n[3/4] Unfreezing top layers...")

    # Find the MobileNetV2 base sub-layer
    base_model = None
    for layer in model.layers:
        if isinstance(layer, tf.keras.Model) and "mobilenetv2" in layer.name.lower():
            base_model = layer
            break

    if base_model is None:
        raise RuntimeError("Could not find MobileNetV2 base layer in loaded model.")

    # Freeze all first, then selectively unfreeze top N layers
    base_model.trainable = True

    total_layers = len(base_model.layers)
    freeze_until = total_layers + UNFREEZE_FROM_LAYER  # e.g., 154 - 30 = 124

    for i, layer in enumerate(base_model.layers):
        # Always keep BatchNormalization layers frozen (training=False) to avoid
        # corrupting pretrained BN statistics with small batch sizes
        if isinstance(layer, tf.keras.layers.BatchNormalization):
            layer.trainable = False
        elif i < freeze_until:
            layer.trainable = False
        else:
            layer.trainable = True

    trainable_params = sum(
        np.prod(w.shape) for w in model.trainable_weights
    )
    print(f"  Total MobileNetV2 layers : {total_layers}")
    print(f"  Layers unfrozen          : {total_layers - freeze_until} (top {abs(UNFREEZE_FROM_LAYER)})")
    print(f"  Trainable parameters     : {trainable_params:,}")

    # ── 4. Recompile with very small LR ──────────────────────────
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=FINE_TUNE_LR),
        loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=False),
        metrics=["accuracy"],
    )

    callbacks = [
        tf.keras.callbacks.ModelCheckpoint(
            filepath=str(output_model_path),
            monitor="val_accuracy",
            mode="max",
            save_best_only=True,
            verbose=1,
        ),
        tf.keras.callbacks.EarlyStopping(
            monitor="val_loss",
            patience=5,
            restore_best_weights=True,
            verbose=1,
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.5,
            patience=3,
            min_lr=1e-7,
            verbose=1,
        ),
    ]

    # ── 5. Fine-tune ────────────────────────────────────────────
    print(f"\n[4/4] Starting fine-tuning for up to {FINE_TUNE_EPOCHS} epochs...")
    start_time = time.time()

    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=FINE_TUNE_EPOCHS,
        callbacks=callbacks,
    )

    total_time = time.time() - start_time
    print(f"\n  Fine-tuning finished in {total_time/60:.2f} minutes ({total_time:.1f}s)")

    val_acc_list = history.history["val_accuracy"]
    best_epoch = int(np.argmax(val_acc_list)) + 1
    best_val_acc = max(val_acc_list)
    best_val_loss = history.history["val_loss"][best_epoch - 1]
    best_train_acc = history.history["accuracy"][best_epoch - 1]
    best_train_loss = history.history["loss"][best_epoch - 1]

    print("\n" + "=" * 60)
    print("FINE-TUNING SUMMARY")
    print("=" * 60)
    print(f"Total Epochs Run    : {len(val_acc_list)}")
    print(f"Best Epoch          : {best_epoch}")
    print(f"Best Train Acc      : {best_train_acc * 100:.2f}% (Loss: {best_train_loss:.4f})")
    print(f"Best Val Acc        : {best_val_acc * 100:.2f}% (Loss: {best_val_loss:.4f})")
    print(f"Fine-tuned Model    : {output_model_path}")
    print(f"Model File Size     : {output_model_path.stat().st_size / (1024*1024):.2f} MB")
    print("=" * 60)

    # Plot
    plt.figure(figsize=(12, 5))
    plt.subplot(1, 2, 1)
    plt.plot(history.history["accuracy"], label="Train Acc", color="#22c55e", lw=2)
    plt.plot(history.history["val_accuracy"], label="Val Acc", color="#3b82f6", lw=2)
    plt.title("Fine-tune — Accuracy")
    plt.xlabel("Epoch")
    plt.ylabel("Accuracy")
    plt.legend()
    plt.grid(True, alpha=0.3)

    plt.subplot(1, 2, 2)
    plt.plot(history.history["loss"], label="Train Loss", color="#ef4444", lw=2)
    plt.plot(history.history["val_loss"], label="Val Loss", color="#f59e0b", lw=2)
    plt.title("Fine-tune — Loss")
    plt.xlabel("Epoch")
    plt.ylabel("Loss")
    plt.legend()
    plt.grid(True, alpha=0.3)

    plt.tight_layout()
    plot_path = CURRENT_DIR / "finetune_history.png"
    plt.savefig(plot_path, dpi=150)
    plt.close()
    print(f"Fine-tune history plot saved: {plot_path}")

    return {
        "best_val_accuracy": round(float(best_val_acc), 4),
        "best_val_loss": round(float(best_val_loss), 4),
        "output_model_path": str(output_model_path),
    }


if __name__ == "__main__":
    finetune()
