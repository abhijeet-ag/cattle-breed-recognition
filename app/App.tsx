import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';
import AppNavigator from './src/navigation/AppNavigator';
import { loadModel } from './src/ml/inference';

export default function App() {
  useEffect(() => {
    // Load TensorFlow.js model on app start
    const initializeModel = async () => {
      try {
        await loadModel();
        console.log('✅ TensorFlow.js model loaded successfully');
      } catch (error) {
        console.error('❌ Failed to load model:', error);
      }
    };
    
    initializeModel();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <StatusBar style="auto" />
      <AppNavigator />
    </I18nextProvider>
  );
}
