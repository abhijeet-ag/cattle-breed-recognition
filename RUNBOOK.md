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
