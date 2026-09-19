"""
Baseline Model Training Script (Frozen Base MobileNetV2)
"""

import os
import sys
import time
from pathlib import Path
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt

CURRENT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(CURRENT_DIR))

from src.classes import NUM_CLASSES, CLASS_NAMES
from src.dataset import load_tomato_dataset, DEFAULT_DATA_DIR
from src.model import build_mobilenet_v2_model


def train():
    # Set seeds for reproducibility
    tf.keras.utils.set_random_seed(42)
    np.random.seed(42)

    print("=" * 60)
    print("TRAINING MOBILENETV2 (FROZEN BASE) ON TOMATO DATASET")
    print("=" * 60)

    models_dir = CURRENT_DIR / "models"
    models_dir.mkdir(parents=True, exist_ok=True)
    checkpoint_path = models_dir / "tomato_disease_model.keras"

    # 1. Load Data
    print("\n[1/4] Loading Tomato Datasets...")
    batch_size = 32
    train_ds, val_ds, test_ds, classes = load_tomato_dataset(
        data_dir=DEFAULT_DATA_DIR,
        batch_size=batch_size,
        img_size=(224, 224),
        use_cache=True,
        normalize_for_mobilenet=True,
    )

    # 2. Build Model
    print("\n[2/4] Building MobileNetV2 Architecture...")
    model = build_mobilenet_v2_model(
        input_shape=(224, 224, 3),
        num_classes=NUM_CLASSES,
        freeze_base=True,
        dropout_rate=0.3,
    )

    initial_learning_rate = 1e-3
    optimizer = tf.keras.optimizers.Adam(learning_rate=initial_learning_rate)
    loss = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=False)

    model.compile(
        optimizer=optimizer,
        loss=loss,
        metrics=["accuracy"],
    )

    print("\nModel Summary:")
    model.summary()

    # 3. Callbacks
    callbacks = [
        tf.keras.callbacks.ModelCheckpoint(
            filepath=str(checkpoint_path),
            monitor="val_accuracy",
            mode="max",
            save_best_only=True,
            verbose=1,
        ),
        tf.keras.callbacks.EarlyStopping(
            monitor="val_loss",
            patience=4,
            restore_best_weights=True,
            verbose=1,
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.5,
            patience=2,
            min_lr=1e-6,
            verbose=1,
        ),
    ]

    # 4. Train Model
    epochs = 10
    print(f"\n[3/4] Starting Baseline Training for {epochs} epochs...")
    start_time = time.time()

    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=epochs,
        callbacks=callbacks,
    )

    total_time = time.time() - start_time
    print(f"\n[4/4] Training finished in {total_time/60:.2f} minutes ({total_time:.1f}s)")

    val_acc_list = history.history["val_accuracy"]
    best_epoch = int(np.argmax(val_acc_list)) + 1
    best_val_acc = max(val_acc_list)
    best_val_loss = history.history["val_loss"][best_epoch - 1]
    best_train_acc = history.history["accuracy"][best_epoch - 1]
    best_train_loss = history.history["loss"][best_epoch - 1]

    print("\n" + "=" * 60)
    print("BASELINE TRAINING SUMMARY")
    print("=" * 60)
    print(f"Total Epochs Run:       {len(val_acc_list)}")
    print(f"Best Epoch:             {best_epoch}")
    print(f"Best Training Acc:      {best_train_acc * 100:.2f}% (Loss: {best_train_loss:.4f})")
    print(f"Best Validation Acc:    {best_val_acc * 100:.2f}% (Loss: {best_val_loss:.4f})")
    print(f"Final Model Saved to:   {checkpoint_path}")
    print(f"Model File Size:        {checkpoint_path.stat().st_size / (1024*1024):.2f} MB")
    print("=" * 60)

    # Plot training curves and save figure
    plt.figure(figsize=(12, 5))
    plt.subplot(1, 2, 1)
    plt.plot(history.history["accuracy"], label="Train Accuracy", color="#22c55e", lw=2)
    plt.plot(history.history["val_accuracy"], label="Val Accuracy", color="#3b82f6", lw=2)
    plt.title("Model Accuracy across Epochs")
    plt.xlabel("Epoch")
    plt.ylabel("Accuracy")
    plt.legend()
    plt.grid(True, alpha=0.3)

    plt.subplot(1, 2, 2)
    plt.plot(history.history["loss"], label="Train Loss", color="#ef4444", lw=2)
    plt.plot(history.history["val_loss"], label="Val Loss", color="#f59e0b", lw=2)
    plt.title("Model Loss across Epochs")
    plt.xlabel("Epoch")
    plt.ylabel("Loss")
    plt.legend()
    plt.grid(True, alpha=0.3)

    plt.tight_layout()
    plot_path = CURRENT_DIR / "training_history.png"
    plt.savefig(plot_path, dpi=150)
    plt.close()
    print(f"Training history curves saved to: {plot_path}")


if __name__ == "__main__":
    train()
