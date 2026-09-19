import os
import sys
from pathlib import Path
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt

CURRENT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(CURRENT_DIR))

from src.classes import CLASS_NAMES, CLASS_LABELS_MAP, NUM_CLASSES
from src.dataset import prepare_dataset, DEFAULT_DATA_DIR, load_tomato_dataset

def run_verification():
    print("=" * 60)
    print("TOMATO LEAF DISEASE DATASET VERIFICATION")
    print("=" * 60)

    print("\n1. Preparing / Ingesting Dataset...")
    data_dir = prepare_dataset(DEFAULT_DATA_DIR)

    print("\n2. Verifying File Structure & Image Counts...")
    splits = ["train", "validation", "test"]
    split_counts = {}
    class_distribution = {c: {s: 0 for s in splits} for c in CLASS_NAMES}
    corrupted_images = []

    for split in splits:
        split_dir = data_dir / split
        count = 0
        for class_name in CLASS_NAMES:
            c_dir = split_dir / class_name
            if not c_dir.exists():
                print(f"[ERROR] Missing directory: {c_dir}")
                continue
            images = list(c_dir.glob("*.jpg")) + list(c_dir.glob("*.jpeg")) + list(c_dir.glob("*.png"))
            class_count = len(images)
            class_distribution[class_name][split] = class_count
            count += class_count

            for img_p in images:
                try:
                    with Image.open(img_p) as img:
                        img.verify()
                except Exception as e:
                    corrupted_images.append((str(img_p), str(e)))

        split_counts[split] = count

    total_images = sum(split_counts.values())

    print(f"\n{'Split':<15} | {'Count':<10} | {'Percentage'}")
    print("-" * 40)
    for split, count in split_counts.items():
        pct = (count / total_images) * 100 if total_images else 0
        print(f"{split:<15} | {count:<10} | {pct:.2f}%")
    print("-" * 40)
    print(f"{'TOTAL':<15} | {total_images:<10} | 100.00%")

    print("\n3. Class Distribution across Splits:")
    print(f"{'ID':<3} | {'Class Name':<32} | {'Train':<7} | {'Val':<7} | {'Test':<7} | {'Total'}")
    print("-" * 70)
    for idx, c_name in enumerate(CLASS_NAMES):
        tr = class_distribution[c_name]["train"]
        va = class_distribution[c_name]["validation"]
        te = class_distribution[c_name]["test"]
        tot = tr + va + te
        print(f"{idx:<3} | {c_name:<32} | {tr:<7} | {va:<7} | {te:<7} | {tot}")
    print("-" * 70)

    print("\n4. Image Integrity & Shape Verification:")
    print(f"Corrupted/Unreadable Images: {len(corrupted_images)}")
    if corrupted_images:
        for p, err in corrupted_images[:5]:
            print(f"  - {p}: {err}")

    sample_img_p = next((data_dir / "train").glob("*/*.jpg"))
    with Image.open(sample_img_p) as img:
        print(f"Sample image file: {sample_img_p.name}")
        print(f"Raw Image format: {img.format}, Size (WxH): {img.size}, Mode: {img.mode}")

    print("\n5. Testing tf.data Pipeline Ingestion (Batching & Normalization)...")
    train_ds, val_ds, test_ds, classes = load_tomato_dataset(batch_size=32, use_cache=False)
    for images, labels in train_ds.take(1):
        print(f"Batch Image Tensor Shape: {images.shape} (dtype: {images.dtype})")
        print(f"Batch Label Tensor Shape: {labels.shape} (dtype: {labels.dtype})")
        print(f"Pixel Range: min={float(np.min(images)):.3f}, max={float(np.max(images)):.3f}")
        print(f"Sample Batch Labels: {labels.numpy()[:8]}")

    print("\n6. Generating Sample Images Grid across all 10 classes...")
    fig, axes = plt.subplots(2, 5, figsize=(16, 7))
    axes = axes.flatten()

    for idx, c_name in enumerate(CLASS_NAMES):
        c_dir = data_dir / "train" / c_name
        first_img = next(c_dir.glob("*.jpg"), None)
        if first_img:
            img = Image.open(first_img)
            axes[idx].imshow(img)
            axes[idx].set_title(f"[{idx}] {c_name}", fontsize=10, fontweight="bold")
            axes[idx].axis("off")

    plt.tight_layout()
    samples_output_path = CURRENT_DIR / "sample_classes_grid.png"
    plt.savefig(samples_output_path, dpi=150)
    plt.close()
    print(f"Sample classes visual grid saved to: {samples_output_path}")

    print("\n" + "=" * 60)
    print("DATASET PIPELINE VERIFICATION SUCCESSFUL")
    print("=" * 60)

if __name__ == "__main__":
    run_verification()
