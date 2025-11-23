import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { Button } from '../components/Button';
import { Colors } from '../constants/Colors';
import { useLanguage } from '../context/LanguageContext';
import { API_URL, ENDPOINTS } from '../config';
import * as FileSystem from 'expo-file-system';
import { breedsData } from '../constants/BreedsData';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';

const ResultScreen = ({ route, navigation }: any) => {
  const { imageUri } = route.params;
  const { isOfflineMode, theme } = useLanguage();
  
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [usedSource, setUsedSource] = useState<string>('');

  const modelRef = useRef<tf.LayersModel | null>(null);

  // --- CORRECTED LABELS FROM YOUR MODEL ---
  // 0: Gir, 1: Ayrshire, 2: Brown_Swiss, 3: Holstein_Friesian, 4: Sahilwal, 5: Tharparker
  const CLASSES = [
    "Gir", 
    "Ayrshire", 
    "Brown Swiss", 
    "Holstein Friesian", 
    "Sahiwal", 
    "Tharparkar"
  ];

  useEffect(() => {
    identifyCattle();
    return () => {
      if (modelRef.current) {
        modelRef.current.dispose(); // Cleanup memory
      }
    };
  }, []);

  const getOrLoadModel = async () => {
    if (modelRef.current) return modelRef.current;

    console.log("🧠 Loading Neural Engine...");
    try {
      await tf.ready();
      const modelJson = require('../../assets/ml_tfjs/model.json');
      const modelWeights = require('../../assets/ml_tfjs/group1-shard1of1.bin');
      
      const loadedModel = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
      
      if (loadedModel) {
         modelRef.current = loadedModel;
         console.log("✅ Neural Engine Ready");
         return loadedModel;
      }
      return null;
    } catch (err) {
      console.error("❌ Model Load Failed:", err);
      return null;
    }
  };

  const identifyCattle = async () => {
    // Automatic Switch Logic:
    // If user selected Offline -> Go Offline
    // If user selected Online -> Try Online, catch error, then Auto-Switch to Offline
    if (isOfflineMode) {
      await predictOffline();
    } else {
      await predictOnline();
    }
  };

  const predictOnline = async () => {
    try {
      console.log("🌐 Sending to Server:", API_URL);
      setUsedSource('Server (Python Model)');
      
      const uploadResult = await FileSystem.uploadAsync(
        `${API_URL}${ENDPOINTS.PREDICT}`,
        imageUri,
        {
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'file',
        }
      );

      if (uploadResult.status !== 200) {
        throw new Error('Server Error: ' + uploadResult.status);
      }

      const data = JSON.parse(uploadResult.body);
      setResult({
        breed: data.class || "Unknown",
        confidence: data.confidence || 0,
        details: "Identified via Cloud Server."
      });
      
    } catch (error) {
      console.log("❌ Online Failed. Switching to Offline...", error);
      // AUTOMATIC FALLBACK HAPPENS HERE
      await predictOffline();
    } finally {
      setLoading(false);
    }
  };

  const predictOffline = async () => {
    try {
      setUsedSource('Offline (Mobile Model)');
      setLoading(true);

      const model = await getOrLoadModel();

      if (!model) {
        throw new Error("Neural Engine failed to initialize.");
      }

      console.log("📱 Processing Image locally...");
      const imgB64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
      const raw = new Uint8Array(imgBuffer);
      const imageTensor = decodeJpeg(raw);
      
      // Resize to 224x224 & Normalize 0-1
      const resized = tf.image.resizeBilinear(imageTensor, [224, 224]); 
      const normalized = resized.div(255.0).expandDims(0);

      const prediction = await model.predict(normalized) as tf.Tensor;
      const values = await prediction.data();
      
      // Find highest probability
      const maxProb = Math.max(...values);
      const classIndex = values.indexOf(maxProb);
      
      const breedName = CLASSES[classIndex] || "Unknown";

      setResult({
        breed: breedName,
        confidence: maxProb,
        details: "Identified using on-device Neural Engine."
      });

      tf.dispose([imageTensor, resized, normalized, prediction]);

    } catch (error) {
      console.error("Offline Pred Error:", error);
      Alert.alert("Analysis Failed", "Could not process image.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    if (!result) return;
    // Fuzzy match name to handle casing differences
    const breedData = breedsData.find(b => b.name.toLowerCase() === result.breed.toLowerCase());
    
    if (breedData) {
      navigation.navigate('BreedDetail', { breed: breedData });
    } else {
      Alert.alert("Info", `Detailed stats for ${result.breed} are coming soon.`);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={[styles.loadingText, {color: theme.text}]}>
              Analyzing Image...
            </Text>
          </View>
        ) : result ? (
          <View style={[styles.card, {backgroundColor: theme.card}]}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{usedSource}</Text>
            </View>

            <Text style={[styles.breedTitle, {color: theme.text}]}>{result.breed}</Text>
            <Text style={[styles.confidence, {color: theme.textSecondary}]}>
              Confidence: {(result.confidence * 100).toFixed(1)}%
            </Text>
            <Text style={[styles.desc, {color: theme.textSecondary}]}>
              {result.details}
            </Text>

            <Button 
              title="View Breed Details" 
              iconName="book-open-page-variant"
              onPress={handleViewDetails}
              variant="secondary"
            />
            <Button 
              title="Scan Another" 
              iconName="camera"
              onPress={() => navigation.navigate('Home')}
              variant="primary"
            />
          </View>
        ) : null}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  image: { width: '100%', height: 300, borderRadius: 20, marginBottom: 20 },
  center: { alignItems: 'center', marginTop: 20 },
  loadingText: { marginTop: 10, fontSize: 16 },
  card: { borderRadius: 20, padding: 20, elevation: 4 },
  badge: { backgroundColor: '#EFF6FF', alignSelf: 'flex-start', padding: 6, borderRadius: 8, marginBottom: 10 },
  badgeText: { color: Colors.primary, fontSize: 12, fontWeight: 'bold' },
  breedTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 5 },
  confidence: { fontSize: 16, marginBottom: 15 },
  desc: { fontSize: 16, lineHeight: 24, marginBottom: 20 },
});

export default ResultScreen;
