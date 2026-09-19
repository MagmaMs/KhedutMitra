"""
Disease Advisory Module.
Provides structured, human-readable disease metadata (severity, recommendations,
prevention tips) keyed by class ID. Entirely separate from the ML inference pipeline.

Usage:
    from src.advisory import get_advisory
    advice = get_advisory(class_id=3)
"""

from __future__ import annotations

# Advisory data: keyed by class ID (0–9), matching CLASS_NAMES in classes.py
_ADVISORY: dict[int, dict] = {
    0: {
        "disease_name": "Healthy",
        "severity": "none",
        "description": "The tomato plant leaf appears healthy with no signs of disease.",
        "recommendations": [
            "Continue regular monitoring of leaves for early disease signs.",
            "Maintain consistent irrigation and fertilisation schedule.",
        ],
        "prevention": [
            "Practice crop rotation to prevent soil-borne pathogens.",
            "Ensure adequate plant spacing for good air circulation.",
            "Remove weeds that may harbour pests or disease vectors.",
        ],
        "crop": "Tomato",
    },
    1: {
        "disease_name": "Leaf Mold",
        "severity": "medium",
        "description": (
            "Caused by the fungus Passalora fulva. Appears as pale green or yellow "
            "spots on upper leaf surfaces with olive-green to grey mould on the underside. "
            "Thrives in high humidity (>85%) and temperatures of 22–25°C."
        ),
        "recommendations": [
            "Apply copper-based fungicides (e.g., Copper Oxychloride 50% WP @ 3g/L).",
            "Use Mancozeb 75% WP @ 2g/L as a protective spray every 7–10 days.",
            "Remove and destroy heavily infected leaves promptly.",
            "Improve greenhouse ventilation to reduce humidity.",
        ],
        "prevention": [
            "Use resistant tomato varieties where available.",
            "Avoid overhead irrigation; use drip irrigation instead.",
            "Maintain humidity below 85% in enclosed growing areas.",
            "Rotate crops — avoid planting Solanaceae family consecutively.",
        ],
        "crop": "Tomato",
    },
    2: {
        "disease_name": "Target Spot",
        "severity": "medium",
        "description": (
            "Caused by Corynespora cassiicola. Produces concentric ring lesions resembling "
            "a target on leaves, stems, and fruits. Favoured by warm, humid conditions."
        ),
        "recommendations": [
            "Apply Chlorothalonil 75% WP @ 2g/L or Azoxystrobin @ 1mL/L.",
            "Rotate fungicides to prevent resistance development.",
            "Remove and destroy affected plant debris after harvest.",
        ],
        "prevention": [
            "Use certified disease-free seeds or transplants.",
            "Avoid wetting foliage during irrigation.",
            "Maintain field sanitation and remove volunteer plants.",
        ],
        "crop": "Tomato",
    },
    3: {
        "disease_name": "Late Blight",
        "severity": "high",
        "description": (
            "Caused by the oomycete Phytophthora infestans. Presents as water-soaked, "
            "greasy-looking spots on leaves that rapidly enlarge and turn brown. "
            "Can cause total crop loss under favourable conditions (cool, wet weather)."
        ),
        "recommendations": [
            "Apply Metalaxyl-M + Mancozeb (Ridomil Gold) @ 2.5g/L preventively.",
            "Use Cymoxanil + Mancozeb @ 2g/L for curative action.",
            "Spray at 5–7 day intervals during high-risk periods.",
            "Remove and destroy heavily infected plants immediately.",
        ],
        "prevention": [
            "Plant only certified disease-free seeds/transplants.",
            "Avoid fields with a history of late blight.",
            "Apply preventive fungicide sprays when weather is cool and wet.",
            "Improve drainage and avoid overhead irrigation.",
        ],
        "crop": "Tomato",
    },
    4: {
        "disease_name": "Early Blight",
        "severity": "medium",
        "description": (
            "Caused by Alternaria solani. Produces dark brown lesions with concentric rings "
            "and a yellow halo on older leaves, progressing upward. Common under warm, "
            "humid conditions."
        ),
        "recommendations": [
            "Apply Mancozeb 75% WP @ 2g/L or Chlorothalonil @ 2g/L every 7–10 days.",
            "Remove and destroy infected lower leaves.",
            "Avoid working in the field when foliage is wet.",
        ],
        "prevention": [
            "Use disease-resistant tomato varieties.",
            "Practice 2–3 year crop rotation.",
            "Mulch around plants to prevent soil splash.",
            "Avoid excessive nitrogen fertilisation.",
        ],
        "crop": "Tomato",
    },
    5: {
        "disease_name": "Bacterial Spot",
        "severity": "medium",
        "description": (
            "Caused by Xanthomonas spp. Produces small, water-soaked spots on leaves, "
            "stems, and fruits that turn brown with yellow halos. Spread by rain, "
            "wind, and contaminated tools."
        ),
        "recommendations": [
            "Apply Copper-based bactericides (Copper Hydroxide @ 3g/L) at first symptoms.",
            "Use Streptomycin sulphate @ 200ppm for severe infections (where permitted).",
            "Avoid overhead irrigation to reduce leaf wetness duration.",
            "Sanitise tools and equipment regularly.",
        ],
        "prevention": [
            "Use certified pathogen-free seed and transplants.",
            "Rotate crops and avoid fields with a history of bacterial spot.",
            "Apply copper bactericides preventively during wet weather.",
        ],
        "crop": "Tomato",
    },
    6: {
        "disease_name": "Septoria Leaf Spot",
        "severity": "medium",
        "description": (
            "Caused by Septoria lycopersici. Small, circular spots with grey centres and "
            "dark borders appear on lower leaves first, progressing upward. Favoured "
            "by warm, wet weather."
        ),
        "recommendations": [
            "Apply Chlorothalonil 75% WP @ 2g/L or Mancozeb @ 2g/L every 7–10 days.",
            "Remove and destroy heavily infected leaves.",
        ],
        "prevention": [
            "Rotate tomatoes with non-Solanaceae crops for 2–3 years.",
            "Avoid overhead irrigation; use drip or furrow irrigation.",
            "Mulch soil surface to prevent spore splash.",
            "Remove all crop debris after harvest.",
        ],
        "crop": "Tomato",
    },
    7: {
        "disease_name": "Tomato Mosaic Virus",
        "severity": "high",
        "description": (
            "Caused by Tomato Mosaic Virus (ToMV). Causes mosaic patterns (light and dark "
            "green mottling), leaf distortion, and stunted growth. Mechanically transmitted "
            "via contaminated hands, tools, and infected plant debris."
        ),
        "recommendations": [
            "Remove and destroy infected plants to prevent spread.",
            "Control aphid vectors with appropriate insecticides (e.g., Imidacloprid).",
            "No direct chemical cure for viral infections; management is preventive.",
        ],
        "prevention": [
            "Use virus-resistant tomato varieties.",
            "Disinfect hands and tools with 10% bleach or soap solution before handling plants.",
            "Control aphid populations to reduce virus transmission.",
            "Avoid using tobacco products near plants (ToMV is related to TMV).",
        ],
        "crop": "Tomato",
    },
    8: {
        "disease_name": "Tomato Yellow Leaf Curl Virus",
        "severity": "high",
        "description": (
            "Caused by Tomato Yellow Leaf Curl Virus (TYLCV), transmitted by the "
            "whitefly Bemisia tabaci. Symptoms include upward curling and yellowing of "
            "young leaves, stunted growth, and severely reduced yield. One of the most "
            "economically damaging tomato diseases in tropical and subtropical regions."
        ),
        "recommendations": [
            "Control whitefly populations using Imidacloprid 17.8% SL @ 0.5mL/L or "
            "Thiamethoxam 25% WG @ 0.3g/L.",
            "Use yellow sticky traps to monitor and reduce whitefly populations.",
            "Remove and destroy infected plants promptly.",
            "Use reflective mulches to repel whiteflies.",
        ],
        "prevention": [
            "Plant TYLCV-resistant or tolerant tomato varieties.",
            "Use insect-proof nets (50 mesh) in nurseries.",
            "Apply systemic insecticides at transplanting to protect young plants.",
            "Avoid planting near other solanaceous crops or known infection sources.",
        ],
        "crop": "Tomato",
    },
    9: {
        "disease_name": "Spider Mites",
        "severity": "medium",
        "description": (
            "Infestation by Two-spotted Spider Mite (Tetranychus urticae). Causes "
            "stippling and bronzing of leaves, fine webbing on undersides, and leaf "
            "drop in severe cases. Populations explode in hot, dry conditions."
        ),
        "recommendations": [
            "Apply Abamectin 1.8% EC @ 0.5mL/L or Spiromesifen 22.9% SC @ 1mL/L.",
            "Use Wettable Sulphur @ 3g/L for mild infestations.",
            "Spray on leaf undersides for maximum efficacy.",
            "Rotate miticides to prevent resistance.",
        ],
        "prevention": [
            "Maintain adequate irrigation — spider mites thrive under drought stress.",
            "Introduce predatory mites (Phytoseiidae) as biological control.",
            "Avoid excessive nitrogen, which promotes susceptible lush growth.",
            "Monitor regularly, especially during hot, dry periods.",
        ],
        "crop": "Tomato",
    },
}


def get_advisory(class_id: int) -> dict:
    """
    Return structured advisory information for a given class ID.

    Args:
        class_id: Integer class ID (0–9) from the model prediction.

    Returns:
        Advisory dict with keys: disease_name, severity, description,
        recommendations, prevention, crop.

    Raises:
        KeyError: If class_id is not in the advisory database.
    """
    if class_id not in _ADVISORY:
        raise KeyError(
            f"No advisory available for class_id={class_id}. "
            f"Valid range: 0–{max(_ADVISORY.keys())}."
        )
    return _ADVISORY[class_id].copy()


def get_all_advisories() -> dict[int, dict]:
    """Return a copy of the full advisory dictionary."""
    return {k: v.copy() for k, v in _ADVISORY.items()}
