"""
MobileNetV2 Transfer Learning Architecture for Tomato Leaf Disease Classification.
"""

import tensorflow as tf
from tensorflow.keras import layers, models
from .classes import NUM_CLASSES


def build_mobilenet_v2_model(
    input_shape: tuple[int, int, int] = (224, 224, 3),
    num_classes: int = NUM_CLASSES,
    freeze_base: bool = True,
    dropout_rate: float = 0.3,
) -> tf.keras.Model:
    """
    Builds a Transfer Learning model using MobileNetV2 with custom classification head.
    """
    inputs = layers.Input(shape=input_shape, name="input_image")

    # Data Augmentation (active only during model training)
    data_augmentation = tf.keras.Sequential(
        [
            layers.RandomFlip("horizontal_and_vertical", name="random_flip"),
            layers.RandomRotation(0.1, name="random_rotation"),
            layers.RandomZoom(0.1, name="random_zoom"),
        ],
        name="data_augmentation",
    )
    x = data_augmentation(inputs)

    # Base Pretrained MobileNetV2 (ImageNet weights)
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights="imagenet",
    )
    base_model.trainable = not freeze_base

    # Forward pass through base feature extractor
    x = base_model(x, training=False)

    # Custom Classification Head
    x = layers.GlobalAveragePooling2D(name="global_avg_pool")(x)
    x = layers.BatchNormalization(name="batch_norm")(x)
    x = layers.Dropout(dropout_rate, name="dropout")(x)
    outputs = layers.Dense(num_classes, activation="softmax", name="predictions")(x)

    model = models.Model(inputs=inputs, outputs=outputs, name="tomato_mobilenet_v2")
    return model
