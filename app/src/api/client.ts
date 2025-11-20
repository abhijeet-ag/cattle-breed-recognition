import axios from 'axios';

// Your computer's IP - change this to your actual IP!
const COMPUTER_IP = '10.12.87.30';

export const apiClient = axios.create({
  baseURL: `http://${COMPUTER_IP}:8000`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add comprehensive error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.message.includes('Network Error')) {
      console.error('🚨 NETWORK ERROR DETAILS:');
      console.error('• Computer IP:', COMPUTER_IP);
      console.error('• Server URL:', error.config?.baseURL);
      console.error('• Endpoint:', error.config?.url);
      console.error('• Make sure phone & computer are on same WiFi');
      console.error('• Test server: http://10.12.87.30:8000 in phone browser');
    }
    return Promise.reject(error);
  }
);
