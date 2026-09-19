import os
import time
from pathlib import Path
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import pyarrow.parquet as pq
from PIL import Image
import tensorflow as tf
from .classes import CLASS_NAMES, CLASS_LABELS_MAP

BASE_AI_DIR = Path(__file__).resolve().parent.parent
DEFAULT_DATA_DIR = BASE_AI_DIR / "datasets" / "tomato_leaf_disease"

HF_PARQUET_URLS = {
    "train": "https://huggingface.co/datasets/Rouaaaa/tomato-leaf-disease-image/resolve/main/data/train-00000-of-00001.parquet",
    "validation": "https://huggingface.co/datasets/Rouaaaa/tomato-leaf-disease-image/resolve/main/data/validation-00000-of-00001.parquet",
    "test": "https://huggingface.co/datasets/Rouaaaa/tomato-leaf-disease-image/resolve/main/data/test-00000-of-00001.parquet",
}


def get_requests_session():
    session = requests.Session()
    retries = Retry(
        total=5,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
        raise_on_status=False
    )
    adapter = HTTPAdapter(max_retries=retries)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    session.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    return session


def download_file(url: str, dest_path: Path, chunk_size: int = 1024 * 1024):
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    temp_path = dest_path.with_suffix(dest_path.suffix + ".part")

    session = get_requests_session()
    
    # Get total remote size
    head_resp = session.head(url, allow_redirects=True, timeout=30)
    head_resp.raise_for_status()
    total_size = int(head_resp.headers.get("content-length", 0))

    if dest_path.exists() and dest_path.stat().st_size == total_size and total_size > 0:
        print(f"[Dataset] File already exists and verified: {dest_path.name} ({round(total_size / (1024*1024), 2)} MB)")
        return dest_path

    print(f"[Dataset] Downloading {dest_path.name} ({round(total_size / (1024*1024), 2)} MB) from {url}...")

    max_attempts = 10
    for attempt in range(1, max_attempts + 1):
        existing_size = temp_path.stat().st_size if temp_path.exists() else 0
        if total_size > 0 and existing_size == total_size:
            temp_path.rename(dest_path)
            print(f"\n[Dataset] Download complete: {dest_path.name}")
            return dest_path

        headers = {}
        if existing_size > 0:
            headers["Range"] = f"bytes={existing_size}-"
            print(f"\n[Dataset] Resuming download from {existing_size / (1024*1024):.1f} MB...")

        try:
            with session.get(url, headers=headers, stream=True, timeout=90) as response:
                if response.status_code not in (200, 206):
                    response.raise_for_status()

                mode = "ab" if existing_size > 0 and response.status_code == 206 else "wb"
                downloaded = existing_size if mode == "ab" else 0

                with open(temp_path, mode) as f:
                    for chunk in response.iter_content(chunk_size=chunk_size):
                        if chunk:
                            f.write(chunk)
                            downloaded += len(chunk)
                            if total_size > 0:
                                pct = (downloaded / total_size) * 100
                                print(f"\r[Dataset] Progress: {downloaded / (1024*1024):.1f}/{total_size / (1024*1024):.1f} MB ({pct:.1f}%)", end="", flush=True)

            if temp_path.stat().st_size == total_size or total_size == 0:
                if dest_path.exists():
                    dest_path.unlink()
                temp_path.rename(dest_path)
                print(f"\n[Dataset] Download complete: {dest_path.name}")
                return dest_path

        except Exception as e:
            print(f"\n[Dataset] Attempt {attempt}/{max_attempts} interrupted: {e}")
            if attempt < max_attempts:
                time.sleep(2 * attempt)
            else:
                raise e


def prepare_dataset(data_dir: Path = DEFAULT_DATA_DIR) -> Path:
    data_dir = Path(data_dir)
    raw_parquets_dir = data_dir / "_raw_parquet"
    raw_parquets_dir.mkdir(parents=True, exist_ok=True)

    splits_extracted = all((data_dir / split).exists() and any((data_dir / split).iterdir()) for split in ["train", "validation", "test"])
    if splits_extracted:
        print(f"[Dataset] Dataset already extracted at {data_dir}")
        return data_dir

    # Step 1: Download parquets with resume support
    parquet_paths = {}
    for split_name, url in HF_PARQUET_URLS.items():
        parquet_file = raw_parquets_dir / f"{split_name}.parquet"
        download_file(url, parquet_file)
        parquet_paths[split_name] = parquet_file

    # Step 2: Extract images into folder structure: datasets/tomato_leaf_disease/{split}/{class_name}/img_XXXXX.jpg
    print("[Dataset] Extracting and verifying images to directory structure...")
    for split_name, p_path in parquet_paths.items():
        split_dir = data_dir / split_name
        split_dir.mkdir(parents=True, exist_ok=True)

        for c_name in CLASS_NAMES:
            (split_dir / c_name).mkdir(parents=True, exist_ok=True)

        table = pq.read_table(p_path)
        pydict = table.to_pydict()
        num_rows = len(pydict["label"])
        print(f"[Dataset] Processing {split_name} split ({num_rows} images)...")

        for idx in range(num_rows):
            img_data = pydict["image"][idx]
            label_id = pydict["label"][idx]
            class_name = CLASS_LABELS_MAP[label_id]

            img_bytes = img_data["bytes"] if isinstance(img_data, dict) and "bytes" in img_data else img_data
            img_filename = f"img_{idx:05d}.jpg"
            img_out_path = split_dir / class_name / img_filename

            if not img_out_path.exists():
                with open(img_out_path, "wb") as img_f:
                    img_f.write(img_bytes)

            if (idx + 1) % 2500 == 0 or (idx + 1) == num_rows:
                print(f"\r  Extracted {idx + 1}/{num_rows} images for {split_name}", end="", flush=True)
        print()

    print(f"[Dataset] Successfully prepared dataset at {data_dir}")
    return data_dir


def preprocess_mobilenet_v2(image, label):
    image = tf.keras.applications.mobilenet_v2.preprocess_input(image)
    return image, label


def load_tomato_dataset(
    data_dir: Path = DEFAULT_DATA_DIR,
    batch_size: int = 32,
    img_size: tuple[int, int] = (224, 224),
    use_cache: bool = True,
    normalize_for_mobilenet: bool = True,
):
    data_path = prepare_dataset(data_dir)

    train_dir = data_path / "train"
    val_dir = data_path / "validation"
    test_dir = data_path / "test"

    train_ds = tf.keras.utils.image_dataset_from_directory(
        train_dir,
        labels="inferred",
        label_mode="int",
        class_names=CLASS_NAMES,
        image_size=img_size,
        batch_size=batch_size,
        shuffle=True,
        seed=42,
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        val_dir,
        labels="inferred",
        label_mode="int",
        class_names=CLASS_NAMES,
        image_size=img_size,
        batch_size=batch_size,
        shuffle=False,
    )

    test_ds = tf.keras.utils.image_dataset_from_directory(
        test_dir,
        labels="inferred",
        label_mode="int",
        class_names=CLASS_NAMES,
        image_size=img_size,
        batch_size=batch_size,
        shuffle=False,
    )

    if normalize_for_mobilenet:
        train_ds = train_ds.map(preprocess_mobilenet_v2, num_parallel_calls=tf.data.AUTOTUNE)
        val_ds = val_ds.map(preprocess_mobilenet_v2, num_parallel_calls=tf.data.AUTOTUNE)
        test_ds = test_ds.map(preprocess_mobilenet_v2, num_parallel_calls=tf.data.AUTOTUNE)

    if use_cache:
        train_ds = train_ds.cache()
        val_ds = val_ds.cache()
        test_ds = test_ds.cache()

    train_ds = train_ds.prefetch(buffer_size=tf.data.AUTOTUNE)
    val_ds = val_ds.prefetch(buffer_size=tf.data.AUTOTUNE)
    test_ds = test_ds.prefetch(buffer_size=tf.data.AUTOTUNE)

    return train_ds, val_ds, test_ds, CLASS_NAMES
