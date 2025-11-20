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
