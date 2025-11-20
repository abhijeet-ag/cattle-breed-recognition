import AsyncStorage from '@react-native-async-storage/async-storage';
import { Breed } from '../types';
import { apiClient } from '../api/client';

const BREEDS_KEY = 'cattle_breeds';
const REGISTRATIONS_KEY = 'cattle_registrations';

export const breedRepository = {
  getBreeds: async (): Promise<Breed[]> => {
    try {
      // Try to get from local storage first
      const stored = await AsyncStorage.getItem(BREEDS_KEY);
      if (stored) {
        console.log('✅ Loaded breeds from local storage');
        return JSON.parse(stored);
      }
      
      // If not in storage, fetch from your server
      console.log('📡 Fetching breeds from server...');
      const response = await apiClient.get('/breeds');
      console.log('✅ Got breeds from server:', response.data.length, 'breeds');
      
      // Store for offline use
      await AsyncStorage.setItem(BREEDS_KEY, JSON.stringify(response.data));
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to get breeds:', error);
      
      // Return fallback data if both fail
      return [
        {
          id: '1',
          name: 'Gir',
          localName: 'Gyr',
          description: 'Gir cattle are famous for milk production',
          imageUrl: 'https://example.com/gir.jpg',
          managementTips: 'Provide good quality feed and clean water'
        }
      ];
    }
  },

  saveBreeds: async (breeds: Breed[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(BREEDS_KEY, JSON.stringify(breeds));
      console.log('✅ Saved breeds to local storage');
    } catch (error) {
      console.error('❌ Failed to save breeds:', error);
    }
  }
};

export interface RegistrationData {
  timestamp: string;
  latitude: number | null;
  longitude: number | null;
  imageUri: string;
  confirmedBreedId: string;
  inferenceData: any[];
}

export const registrationRepository = {
  addRegistration: async (data: RegistrationData): Promise<void> => {
    try {
      const existing = await AsyncStorage.getItem(REGISTRATIONS_KEY) || '[]';
      const registrations = JSON.parse(existing);
      registrations.push({ ...data, id: Date.now().toString(), synced: false });
      await AsyncStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
      console.log('✅ Registration saved locally');
      
      // Try to sync with server (optional)
      try {
        await apiClient.post('/registrations', data);
        console.log('✅ Registration synced with server');
      } catch (syncError) {
        console.log('⚠️ Registration saved locally (sync failed)');
      }
    } catch (error) {
      console.error('❌ Failed to save registration:', error);
      throw error;
    }
  },

  getRegistrations: async (): Promise<RegistrationData[]> => {
    try {
      const registrationsJson = await AsyncStorage.getItem(REGISTRATIONS_KEY);
      return registrationsJson ? JSON.parse(registrationsJson) : [];
    } catch (error) {
      console.error('❌ Failed to load registrations:', error);
      return [];
    }
  }
};
