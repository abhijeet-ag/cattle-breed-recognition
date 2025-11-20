import torch
import torch.onnx
import torch.nn as nn
from torchvision.models import efficientnet_b0
import subprocess

# --- CONFIG ---
PTH_FILE = "best_model.pth"
ONNX_FILE = "model.onnx"
TFJS_DIR = "tfjs_model"
INPUT_SHAPE = (1, 3, 224, 224)
NUM_CLASSES = 6
# --------------

# Build 6-class EfficientNet-B0
model = efficientnet_b0(weights=None)
in_features = model.classifier[1].in_features
model.classifier[1] = nn.Linear(in_features, NUM_CLASSES)

# Load weights
state_dict = torch.load(PTH_FILE, map_location="cpu")
model.load_state_dict(state_dict)
model.eval()

# Export to ONNX
dummy_input = torch.randn(*INPUT_SHAPE)
torch.onnx.export(
    model,
    dummy_input,
    ONNX_FILE,
    input_names=["input"],
    output_names=["output"],
    dynamic_axes={"input": {0: "batch"}, "output": {0: "batch"}},
    opset_version=15,
)
print("✅ EfficientNet-B0 (6 classes) → ONNX done:", ONNX_FILE)

# Convert ONNX → TensorFlow.js via shell
subprocess.run([
    "tensorflowjs_converter",
    "--input_format", "onnx",
    ONNX_FILE,
    TFJS_DIR
], check=True)
print("✅ ONNX → TensorFlow.js done:", TFJS_DIR)
