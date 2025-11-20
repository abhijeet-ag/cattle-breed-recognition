export const AppConfig = {
  API_BASE_URL: 'http://10.12.87.30:8000',
  // Use 'tflite' for local model, 'server' for API
  INFERENCE_MODE: 'tflite' as 'server' | 'tflite',
};
