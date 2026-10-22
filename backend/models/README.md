# Model Weights Directory

Place your trained EfficientNet-B0 model weights file in this directory:

### Expected File:
`backend/models/plant_disease_effnet_b0.pth`

### How the Backend Loads It:
1. The backend automatically looks for `plant_disease_effnet_b0.pth` (or `.pt`).
2. If the file is not yet present, the backend starts in **Simulated Fallback Mode** so you can test frontend-backend connectivity immediately without breaking anything.
3. Once you copy your `.pth` file here and restart the backend, it will automatically load the real weights into PyTorch EfficientNet-B0 and run actual neural network inference!
