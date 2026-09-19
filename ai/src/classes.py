"""
Tomato Leaf Disease Class Definitions and Mappings.
Maps integer labels [0..9] to human-readable names and standard PlantVillage category names.
"""

CLASS_NAMES = [
    "Healthy",
    "Leaf Mold",
    "Target Spot",
    "Late Blight",
    "Early Blight",
    "Bacterial Spot",
    "Septoria Leaf Spot",
    "Tomato Mosaic Virus",
    "Tomato Yellow Leaf Curl Virus",
    "Spider Mites",
]

CLASS_LABELS_MAP = {
    0: "Healthy",
    1: "Leaf Mold",
    2: "Target Spot",
    3: "Late Blight",
    4: "Early Blight",
    5: "Bacterial Spot",
    6: "Septoria Leaf Spot",
    7: "Tomato Mosaic Virus",
    8: "Tomato Yellow Leaf Curl Virus",
    9: "Spider Mites",
}

PLANTVILLAGE_TO_ID = {
    "Tomato___healthy": 0,
    "Tomato___Leaf_Mold": 1,
    "Tomato___Target_Spot": 2,
    "Tomato___Late_blight": 3,
    "Tomato___Early_blight": 4,
    "Tomato___Bacterial_spot": 5,
    "Tomato___Septoria_leaf_spot": 6,
    "Tomato___Tomato_mosaic_virus": 7,
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": 8,
    "Tomato___Spider_mites Two-spotted_spider_mite": 9,
}

NUM_CLASSES = len(CLASS_NAMES)
