import Constants from 'expo-constants';

// Automatically find your Mac's IP address from Expo
const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost?.split(':')[0] || 'localhost';

// TARGET PORT 8001
export const API_URL = `http://${localhost}:8001`;

export const ENDPOINTS = {
  PREDICT: '/predict',
  HEALTH: '/health',
};
