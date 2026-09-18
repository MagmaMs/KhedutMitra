# Disease Tracker Module

## 1. Problem Statement
Crop diseases can destroy entire harvests if not identified and treated early. Farmers often lack access to timely expert diagnosis.

## 2. Implementation Pipeline

### Client Side
- User uploads an image of the affected plant leaf.
- Client compresses the image (using canvas/browser APIs) to < 1MB to save bandwidth.

### Backend Side
- Express server receives the image.
- Uses an ML Adapter. For the hackathon, we utilize a pre-trained Plant Disease API (like Plant.id) or a Hugging Face inference endpoint running a ResNet model trained on the PlantVillage dataset.
- The model returns predictions (e.g., "Tomato Early Blight", Confidence: 92%).

### Presentation
- The UI displays the diagnosis.
- Crucially, it links to immediate actionable treatments (e.g., "Apply Copper Fungicide") and nearby organic alternatives.
