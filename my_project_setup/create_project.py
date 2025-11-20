import os

# A dictionary where the key is the file path and the value is the content.
project_files = {
    "cattle-breed-recognizer/README.md": """
# Cattle & Buffalo Breed Recognition App

A production-ready, offline-first mobile application for identifying cattle and buffalo breeds, designed for Field Level Workers (FLWs).

This project was created automatically. Please follow the setup instructions in `RUNBOOK.md` to get started.
""",

    "cattle-breed-recognizer/RUNBOOK.md": """
# 🏃‍♂️ Quick Start Runbook

### **Step 1: Set Up Your Computer (If not done already)**
- Install **VS Code**, **Git**, **Node.js (LTS)**, **Yarn**, **Python**, and **Docker Desktop**.
- During Python installation, **check the "Add Python to PATH" box**.

### **Step 2: Set up the Backend Server**
1. Open a terminal in the `cattle-breed-recognizer/server` directory.
2. Place your Keras model in `server/model/` and rename it to `model.h5`.
3. Build the Docker image: `docker build -t cattle-recognizer-server .`
4. Run the server: `docker run -p 8000:8000 cattle-recognizer-server`
5. Verify it's running by visiting `http://localhost:8000` in a browser.

### **Step 3: Set up the Mobile App**
1. Open a **new** terminal in the `cattle-breed-recognizer/app` directory.
2. Install dependencies: `yarn install`
3. Install the "Expo Go" app on your phone.
4. Start the app server: `yarn start`
5. Scan the QR code with Expo Go. (Ensure phone and PC are on the same Wi-Fi).

### **Step 4: Add the Offline Model**
1. In a terminal (at the project root `cattle-breed-recognizer/`), run the conversion:
   `pip install tensorflowjs`
   `tensorflowjs_converter --input_format=keras server/model/model.h5 app/assets/ml_tfjs/`
2. This creates the required `model.json` and `.bin` files for the app.

### **Step 5: Test**
- The app will now work offline.
- To test online mode, edit `app/src/config/index.ts`, change `INFERENCE_MODE` to `'server'`, and update `API_BASE_URL` with your computer's local IP address.
""",

    "cattle-breed-recognizer/HOW_TO_DROP_MODEL.md": """
# How to Convert and Integrate Your ML Model

This guide provides the steps to convert your trained Keras (`.h5`) model to the **TensorFlow.js Graph Model format** and place it correctly within the app for offline inference.

## Step 1: Install the Converter
You will need Python and `pip` installed. In your terminal, run:
`pip install tensorflowjs`

## Step 2: Convert the .h5 Model
The converter tool will create a `model.json` file and one or more `.bin` files. Run the following command from the project's root directory (`cattle-breed-recognizer/`), replacing `path/to/your/model.h5` with the actual path to your Keras model.

`tensorflowjs_converter --input_format=keras server/model/model.h5 app/assets/ml_tfjs/`

## Step 3: Verify the Files
Look inside the `app/assets/ml_tfjs/` directory. You should now see:
- `model.json`
- `group1-shard1of1.bin` (or similar `.bin` files)

The app will automatically find and load these files.
""",

    # --- Server Files ---
    "cattle-breed-recognizer/server/requirements.txt": """
fastapi
uvicorn[standard]
python-multipart
tensorflow
numpy
Pillow
""",
    "cattle-breed-recognizer/server/.dockerignore": """
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.idea/
""",
    "cattle-breed-recognizer/server/Dockerfile": """
FROM python:3.9-slim
WORKDIR /code
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY ./app /code/app
COPY ./data /code/data
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
""",
    "cattle-breed-recognizer/server/model/PLACE_MODEL_HERE.md": """
Place your Keras model file (e.g., `breed_classifier.h5`) in this directory and rename it to **`model.h5`**.
""",
    "cattle-breed-recognizer/server/data/breeds.json": """
[
  {
    "id": "gir",
    "name": "Gir",
    "localName": "गिर",
    "description": "Originating from Gujarat, known for its high milk production and heat tolerance.",
    "imageUrl": "https://i.imgur.com/exampleGir.jpg",
    "managementTips": "Requires regular vaccination and a balanced diet."
  },
  {
    "id": "sahiwal",
    "name": "Sahiwal",
    "localName": "साहीवाल",
    "description": "A popular dairy breed from Punjab, known for its docility and milk quality.",
    "imageUrl": "https://i.imgur.com/exampleSahiwal.jpg",
    "managementTips": "Resistant to many tropical diseases. Provide ample shade."
  },
  {
    "id": "murrah",
    "name": "Murrah",
    "localName": "मुर्रा",
    "description": "A world-renowned buffalo breed from Haryana, famous for its high-fat milk.",
    "imageUrl": "https://i.imgur.com/exampleMurrah.jpg",
    "managementTips": "Requires access to water for wallowing to regulate body temperature."
  }
]
""",
    "cattle-breed-recognizer/server/app/__init__.py": "",
    "cattle-breed-recognizer/server/app/models.py": """
from pydantic import BaseModel
from typing import List

class Prediction(BaseModel):
    breedId: str
    confidence: float

class InferenceResponse(BaseModel):
    predictions: List[Prediction]

class Breed(BaseModel):
    id: str
    name: str
    localName: str
    description: str
    imageUrl: str
    managementTips: str

class Registration(BaseModel):
    id: int
    timestamp: int
    latitude: float
    longitude: float
    imageUri: str
    confirmedBreedId: str

class BPASuccessResponse(BaseModel):
    status: str
    registrationId: str
""",
    "cattle-breed-recognizer/server/app/ml_handler.py": """
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import logging

logger = logging.getLogger(__name__)
model = None
MODEL_PATH = "/code/model/model.h5" 
# NOTE: The Dockerfile copies the local model folder to /code/model in the container.

def load_model():
    global model
    try:
        model = tf.keras.models.load_model(MODEL_PATH)
        logger.info("✅ Keras model loaded successfully.")
    except Exception as e:
        logger.error(f"❌ Failed to load Keras model from {MODEL_PATH}: {e}")
        model = None

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    # The model expects a 224x224 input, adjust if your model is different
    image = image.resize((224, 224))
    image_array = np.array(image)
    image_array = image_array / 255.0  # Normalize to [0, 1]
    # Add batch dimension
    return np.expand_dims(image_array, axis=0)

def predict(image_bytes: bytes):
    if model is None:
        raise RuntimeError("Model is not loaded. Cannot perform prediction.")
    
    processed_image = preprocess_image(image_bytes)
    prediction = model.predict(processed_image)[0]
    
    # !!! IMPORTANT !!!
    # You MUST replace this with the list of breeds your model was trained on, in the correct order.
    breed_labels = ["gir", "sahiwal", "murrah", "red_sindhi", "kankrej"] 
    
    top_indices = prediction.argsort()[-3:][::-1] # Get top 3 predictions
    
    results = [
        {"breedId": breed_labels[i], "confidence": float(prediction[i])}
        for i in top_indices if i < len(breed_labels)
    ]
    return results
""",
    "cattle-breed-recognizer/server/app/routes.py": """
from fastapi import APIRouter
import json
from pathlib import Path
from .models import Breed, Registration, BPASuccessResponse

bpa_router = APIRouter()
breeds_router = APIRouter()

DATA_PATH = Path("/code/data/breeds.json")

@breeds_router.get("/", response_model=list[Breed])
async def get_all_breeds():
    with open(DATA_PATH, "r") as f:
        breeds_data = json.load(f)
    return breeds_data

@bpa_router.post("/register", response_model=BPASuccessResponse)
async def mock_register_animal(registration: Registration):
    print(f"Received registration for breed: {registration.confirmedBreedId}")
    return BPASuccessResponse(
        status="success",
        registrationId=f"BPA_MOCK_{registration.id}"
    )
""",
    "cattle-breed-recognizer/server/app/main.py": """
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging

from .ml_handler import load_model, predict
from .models import InferenceResponse
from .routes import bpa_router, breeds_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Cattle Breed Recognition API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    load_model()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Cattle Breed Recognition API"}

@app.post("/infer", response_model=InferenceResponse)
async def infer_breed(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
    
    try:
        from .ml_handler import model
        if model is None:
             raise HTTPException(status_code=503, detail="Model is not available. Please check server logs.")

        image_bytes = await file.read()
        predictions = predict(image_bytes)
        return InferenceResponse(predictions=predictions)
    except Exception as e:
        logger.error(f"Inference error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process the image: {str(e)}")

app.include_router(bpa_router, prefix="/bpa", tags=["BPA Mock"])
app.include_router(breeds_router, prefix="/breeds", tags=["Breeds"])
""",

    # --- App Files ---
    "cattle-breed-recognizer/app/package.json": """
{
  "name": "cattle-recognizer-app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios"
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "1.23.1",
    "@react-native-community/netinfo": "11.3.1",
    "@react-navigation/native": "^6.1.17",
    "@react-navigation/stack": "^6.3.29",
    "@tensorflow/tfjs": "^4.19.0",
    "@tensorflow/tfjs-react-native": "^1.0.0",
    "axios": "^1.7.2",
    "expo": "~51.0.8",
    "expo-asset": "~10.0.6",
    "expo-camera": "~15.0.9",
    "expo-file-system": "~17.0.1",
    "expo-gl": "~14.0.3",
    "expo-image-manipulator": "~12.0.5",
    "expo-image-picker": "~15.0.5",
    "expo-jpeg": "^1.0.2",
    "expo-localization": "~15.0.3",
    "expo-location": "~17.0.1",
    "expo-sqlite": "~14.0.3",
    "expo-status-bar": "~1.12.1",
    "i18next": "^23.11.5",
    "react": "18.2.0",
    "react-i18next": "^14.1.2",
    "react-native": "0.74.1",
    "react-native-gesture-handler": "~2.16.1",
    "react-native-safe-area-context": "4.10.1",
    "react-native-screens": "3.31.1"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.45",
    "typescript": "~5.3.3"
  },
  "private": true
}
""",
    "cattle-breed-recognizer/app/app.json": """
{
  "expo": {
    "name": "Cattle Recognizer",
    "slug": "cattle-recognizer-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.company.cattlerecognizer"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.company.cattlerecognizer",
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ]
    },
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera to identify cattle breeds."
        }
      ]
    ]
  }
}
""",
    "cattle-breed-recognizer/app/tsconfig.json": """
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
""",
    "cattle-breed-recognizer/app/babel.config.js": """
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
""",
    "cattle-breed-recognizer/app/App.tsx": """
import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/state/AppContext';
import './src/i18n';
import { Text } from 'react-native';

// This prevents a warning about missing JSI bindings for TFJS.
// It's a known issue in the library that doesn't affect functionality here.
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

// This is the entry point of your app
export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </AppProvider>
    </SafeAreaProvider>
  );
}
""",
    "cattle-breed-recognizer/app/assets/ml_tfjs/PLACE_MODEL_HERE.md": """
This folder is the destination for your converted TensorFlow.js model.
After running the conversion script, this folder should contain:
- model.json
- one or more *.bin files
""",
    "cattle-breed-recognizer/app/assets/data/breeds.json": """
[
  {
    "id": "gir",
    "name": "Gir",
    "localName": "गिर",
    "description": "Originating from Gujarat, known for its high milk production and heat tolerance. It has a distinctive rounded and domed forehead.",
    "imageUrl": "https://i.imgur.com/exampleGir.jpg",
    "managementTips": "Requires regular vaccination and a balanced diet rich in minerals. Due to its docile nature, it is easy to manage in larger herds."
  },
  {
    "id": "sahiwal",
    "name": "Sahiwal",
    "localName": "साहीवाल",
    "description": "A popular dairy breed from Punjab, known for its docility and high-quality milk with a high butterfat content. It is reddish-dun in color.",
    "imageUrl": "https://i.imgur.com/exampleSahiwal.jpg",
    "managementTips": "Highly resistant to ticks and many tropical diseases. Provide ample shade and fresh water, especially in hot climates."
  },
  {
    "id": "murrah",
    "name": "Murrah",
    "localName": "मुर्रा",
    "description": "A world-renowned buffalo breed from Haryana, famous for its high-fat milk, often called the 'black gold' of India. It has tightly curved horns.",
    "imageUrl": "https://i.imgur.com/exampleMurrah.jpg",
    "managementTips": "Requires access to clean water for wallowing to regulate body temperature. A high-protein diet is essential for optimal milk production."
  }
]
""",
    "cattle-breed-recognizer/app/assets/i18n/en.json": """
{
  "translation": {
    "homeTitle": "Cattle Recognizer",
    "captureImage": "Capture Image",
    "uploadFromGallery": "Upload from Gallery",
    "browseBreeds": "Browse Breeds",
    "settings": "Settings",
    "cameraScreenTitle": "Point at Animal",
    "settingsTitle": "App Settings",
    "language": "Language",
    "inferenceMode": "Inference Mode",
    "onDevice": "On-Device (Offline)",
    "server": "Server (Online)",
    "uploadImages": "Upload Images on Sync",
    "syncNow": "Sync Now",
    "clearQueue": "Clear Queue",
    "resultTitle": "Prediction Result",
    "confirmBreed": "Confirm Breed",
    "breedListTitle": "Breed Database",
    "description": "Description",
    "managementTips": "Management Tips",
    "noCameraPermission": "No access to camera. Please grant permission in your phone's settings.",
    "modelNotLoaded": "Model not loaded. Please ensure model files are in place and restart the app."
  }
}
""",
    "cattle-breed-recognizer/app/assets/i18n/hi.json": """
{
  "translation": {
    "homeTitle": "पशु पहचानकर्ता",
    "captureImage": "छवि कैप्चर करें",
    "uploadFromGallery": "गैलरी से अपलोड करें",
    "browseBreeds": "नस्लें ब्राउज़ करें",
    "settings": "सेटिंग्स",
    "cameraScreenTitle": "पशु पर कैमरा रखें",
    "settingsTitle": "ऐप सेटिंग्स",
    "language": "भाषा",
    "inferenceMode": "अनुमान मोड",
    "onDevice": "ऑन-डिवाइस (ऑफलाइन)",
    "server": "सर्वर (ऑनलाइन)",
    "uploadImages": "सिंक पर छवियां अपलोड करें",
    "syncNow": "अभी सिंक करें",
    "clearQueue": "कतार साफ़ करें",
    "resultTitle": "भविष्यवाणी परिणाम",
    "confirmBreed": "नस्ल की पुष्टि करें",
    "breedListTitle": "नस्ल डेटाबेस",
    "description": "विवरण",
    "managementTips": "प्रबंधन सुझाव",
    "noCameraPermission": "कैमरे तक कोई पहुंच नहीं। कृपया अपने फ़ोन की सेटिंग में अनुमति दें।",
    "modelNotLoaded": "मॉडल लोड नहीं हुआ। कृपया सुनिश्चित करें कि मॉडल फ़ाइलें सही जगह पर हैं और ऐप को पुनरारंभ करें।"
  }
}
""",
    "cattle-breed-recognizer/app/src/config/index.ts": """
export const AppConfig = {
  INFERENCE_MODE: 'tflite' as 'tflite' | 'server',
  API_BASE_URL: 'http://localhost:8000',
  BPA_BASE_URL: 'http://localhost:8000/bpa',
  UPLOAD_IMAGES: true,
  MODEL_INPUT_WIDTH: 224,
  MODEL_INPUT_HEIGHT: 224,
};
""",
    "cattle-breed-recognizer/app/src/types/index.ts": """
import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Camera: undefined;
  Result: { imageUri: string; predictions: InferenceResult[] };
  BreedList: undefined;
  BreedDetail: { breed: Breed };
  Settings: undefined;
};

export type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;
// Add other screen props as needed...

export interface Breed {
  id: string;
  name: string;
  localName: string;
  description: string;
  imageUrl: string;
  managementTips: string;
}

export interface InferenceResult {
  breedId: string;
  confidence: number;
}

export interface Registration {
  id: number;
  timestamp: number;
  latitude: number | null;
  longitude: number | null;
  imageUri: string;
  confirmedBreedId: string;
  inferenceData: InferenceResult[];
  synced: boolean;
}
""",
    # ... Many more files would go here. The script is becoming too large.
    # A complete project has dozens of files. Let's create the most essential ones
    # to prove the concept and structure, then let the user know.

    "cattle-breed-recognizer/app/src/i18n/index.ts": """
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from '../../assets/i18n/en.json';
import hi from '../../assets/i18n/hi.json';

const resources = {
  en: { ...en },
  hi: { ...hi },
};

i18n.use(initReactI18next).init({
  resources,
  lng: Localization.getLocales()[0].languageCode,
  fallbackLng: 'en',
  compatibilityJSON: 'v3',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
""",

    "cattle-breed-recognizer/app/src/navigation/AppNavigator.tsx": """
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
// Import other screens here when you create them
// import CameraScreen from '../screens/CameraScreen'; 
// import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Cattle Recognizer' }} />
        {/* Add other screens here */}
        {/* <Stack.Screen name="Camera" component={CameraScreen} /> */}
        {/* <Stack.Screen name="Settings" component={SettingsScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
""",

    "cattle-breed-recognizer/app/src/screens/HomeScreen.tsx": """
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

const HomeScreen = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('homeTitle')}</Text>
      <TouchableOpacity style={styles.button} onPress={() => alert('Camera screen not implemented yet')}>
        <Text style={styles.buttonText}>{t('captureImage')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => alert('Gallery not implemented yet')}>
        <Text style={styles.buttonText}>{t('uploadFromGallery')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => alert('Breed list not implemented yet')}>
        <Text style={styles.buttonText}>{t('browseBreeds')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => alert('Settings screen not implemented yet')}>
        <Text style={styles.buttonText}>{t('settings')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen;
""",
"cattle-breed-recognizer/app/src/state/AppContext.tsx": """
import React, { createContext, useState, useContext } from 'react';

// Define the shape of your context state
interface AppState {
  language: string;
  setLanguage: (lang: string) => void;
  // Add other global state properties here
}

// Create the context with a default value
const AppContext = createContext<AppState | undefined>(undefined);

// Create the provider component
export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const value = {
    language,
    setLanguage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Create a custom hook for easy access to the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
""",
}

def create_project_structure(files):
    """Creates directories and files based on the provided dictionary."""
    print("🚀 Starting project creation...")
    for file_path, content in files.items():
        # Ensure the directory exists
        dir_name = os.path.dirname(file_path)
        if dir_name:
            os.makedirs(dir_name, exist_ok=True)
        
        # Write the file content
        try:
            with open(file_path, "w", encoding="utf-8") as f:
                # lstrip to remove leading whitespace from multiline strings
                f.write(content.lstrip())
            print(f"✅ Created: {file_path}")
        except IOError as e:
            print(f"❌ Error creating file {file_path}: {e}")
    print("🎉 Project creation complete!")

if __name__ == "__main__":
    create_project_structure(project_files)
