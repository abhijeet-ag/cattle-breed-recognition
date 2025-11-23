# 🐮 PashuDhan AI (Cattle Recognizer)

> **3rd Place Winner - AI/ML Track** | Project Showcase 2.0, Bennett University (Global AI Summit 2025)

PashuDhan AI is a **Hybrid Edge-Cloud mobile application** designed to empower farmers in rural India with instant cattle breed identification. It solves the critical challenge of low internet connectivity by utilizing an intelligent fallback mechanism that switches between a high-accuracy Cloud Server and an on-device Neural Engine.

---

## 🚀 Key Features

* **Hybrid AI Architecture:** Seamlessly switches between Online (Server-side) and Offline (On-device) inference based on network availability.
* **Zero Downtime:** Fully functional **Offline Mode** powered by TensorFlow.js, ensuring farmers can use the app in remote fields without internet.
* **Dual-Brain System:**
    * **Cloud Brain:** High-precision Keras (.h5) model running on a Dockerized Python server.
    * **Edge Brain:** Compressed TensorFlow.js (.json/.bin) model running locally on the mobile CPU/GPU.
* **Localized Experience:** Full support for **English** and **Hindi** languages.
* **Rich Breed Library:** Offline-accessible database of 10 native Indian cattle breeds with detailed statistics (Milk yield, disease resistance, etc.).
* **Modern UI:** Professional "PashuDhan" theme with dark mode support and adaptive layouts.

---

## 🏗 System Architecture

The project follows a client-server architecture with an edge-computing layer.

### 1. The Frontend (Client)
* **Tech Stack:** React Native (Expo), TypeScript.
* **Role:** Handles user interaction, camera access, and the "Hybrid Logic" decision-making.
* **Key Libraries:**
    * `@tensorflow/tfjs-react-native`: For running the AI model directly on the phone.
    * `expo-camera`: For capturing real-time cattle images.
    * `expo-file-system`: For managing offline assets and image uploads.

### 2. The Backend (Server)
* **Tech Stack:** Python 3.12, FastAPI, Uvicorn.
* **Role:** Processes complex inference requests when connectivity is available.
* **Key Libraries:**
    * `tensorflow`: For loading the heavy Keras model.
    * `pillow` & `numpy`: For image preprocessing (Resizing/Normalization).
    * `tf_keras`: Legacy bridge to ensure compatibility between modern TensorFlow and older model formats.

### 3. DevOps & Deployment
* **Docker:** The backend is containerized to ensure consistent behavior across different development and deployment environments.

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Mobile Framework** | React Native (Expo) | Cross-platform app development (iOS/Android) |
| **Language** | TypeScript | Type-safe logic and robust code structure |
| **Backend API** | FastAPI (Python) | High-performance asynchronous REST API |
| **ML Engine (Cloud)** | TensorFlow (Keras) | High-accuracy model execution |
| **ML Engine (Edge)** | TensorFlow.js | Low-latency, offline inference on mobile |
| **Containerization** | Docker | Environment isolation and deployment |
| **State Management** | React Context API | Managing App Theme, Language, and Network State |

---

## 📂 Project Structure

```bash
cattle-breed-recognizer/
├── app/                        # Frontend (React Native)
│   ├── assets/                 # Static Assets
│   │   ├── images/breeds/      # Offline cattle images
│   │   └── ml_tfjs/            # Compressed AI Model (.json + .bin)
│   ├── src/
│   │   ├── components/         # Reusable UI (Buttons, Cards)
│   │   ├── config/             # API Endpoints & Constants
│   │   ├── context/            # Language & Theme Logic
│   │   ├── screens/            # App Screens (Home, Result, Camera)
│   │   └── i18n/               # Translation dictionaries
│   └── App.tsx                 # Entry Point
│
├── server/                     # Backend (Python API)
│   ├── app/
│   │   └── main.py             # FastAPI Server Logic
│   ├── model/                  # Heavy Keras Model (.h5)
│   └── Dockerfile              # Container Config
│
└── my_project_setup/           # Training Resources & Scripts
```

---

## ⚡ Getting Started (How to Run)

Follow these instructions to set up the project locally.

### Prerequisites
* Node.js & npm
* Python 3.12
* Expo Go App (on your phone)

### 1. Backend Setup (The Brain)
Navigate to the server directory and install dependencies:

```bash
cd server
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install fastapi uvicorn tensorflow tf_keras pillow numpy python-multipart

# Run the Server (Exposed to Network)
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### 2. Frontend Setup (The App)
Open a new terminal and navigate to the app directory:

```bash
cd app
# Install dependencies (Use legacy-peer-deps for TFJS compatibility)
npm install --legacy-peer-deps

# Start the App (Clear cache to ensure assets load)
npx expo start -c
```

### 3. Connecting the Device
1.  Ensure your phone and computer are on the **same Wi-Fi network**.
2.  Scan the QR code generated in the terminal using the **Expo Go** app.
3.  **Troubleshooting:** If the app cannot connect to the server, update `app/src/config/index.ts` with your computer's local IP address.

---

## 🧪 Testing the Hybrid Logic

### Scenario A: Online Mode (High Accuracy)
1.  Ensure Server is running.
2.  Turn **OFF** "Offline Mode" in App Settings.
3.  Capture an image.
4.  **Result:** The app sends the image to the Python server. You will see *"Source: Server (Python Model)"*.

### Scenario B: Offline Mode (No Internet)
1.  Turn **ON** "Offline Mode" in App Settings (or turn off Wi-Fi).
2.  Capture an image.
3.  **Result:** The app loads the neural engine locally. You will see *"Source: Offline (Mobile Model)"*.

---

## 🏆 Acknowledgements

* **Global AI Summit 2025:** For providing the platform to showcase this innovation.
* **Bennett University:** For the mentorship and resources.
* **Team Troubleshooters:** For the tireless effort in building a robust Edge-AI solution.

