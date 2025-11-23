import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useLanguage } from '../context/LanguageContext';
import { useIsFocused } from '@react-navigation/native';

export default function CameraScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const isFocused = useIsFocused();
  const { theme, language } = useLanguage();

  // Labels based on language
  const text = language === 'en' ? {
    permRequired: "We need your permission to show the camera",
    grant: "Grant Permission",
    snap: "Snap",
    flip: "Flip",
    processing: "Processing..."
  } : {
    permRequired: "कैमरा दिखाने के लिए हमें आपकी अनुमति की आवश्यकता है",
    grant: "अनुमति दें",
    snap: "फोटो लें",
    flip: "पलटें",
    processing: "प्रोसेसिंग..."
  };

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    // Camera permissions are still loading
    return <View style={[styles.container, {backgroundColor: theme.background}]} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={[styles.container, {backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center', padding: 20}]}>
        <MaterialCommunityIcons name="camera-off" size={60} color={Colors.textSecondary} />
        <Text style={[styles.message, {color: theme.text}]}>{text.permRequired}</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permButton}>
          <Text style={styles.permButtonText}>{text.grant}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          skipProcessing: true, // Faster capture
        });
        
        if (photo) {
          navigation.navigate('Result', { imageUri: photo.uri });
        }
      } catch (error) {
        Alert.alert("Error", "Failed to take photo");
      }
    }
  };

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView 
          style={styles.camera} 
          facing="back"
          ref={cameraRef}
          onCameraReady={() => setIsCameraReady(true)}
        >
          <View style={styles.overlay}>
            {/* Top Bar: Back Button */}
            <View style={styles.topBar}>
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={() => navigation.goBack()}
              >
                <MaterialCommunityIcons name="close" size={28} color="white" />
              </TouchableOpacity>
            </View>

            {/* Bottom Bar: Controls */}
            <View style={styles.bottomBar}>
              <View style={styles.spacer} />
              
              {/* Shutter Button */}
              <TouchableOpacity 
                style={[styles.shutterButton, { opacity: isCameraReady ? 1 : 0.5 }]}
                onPress={takePicture}
                disabled={!isCameraReady}
              >
                <View style={styles.shutterInner} />
              </TouchableOpacity>

              {/* Spacer to center the shutter */}
              <View style={styles.spacer} />
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  message: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    fontSize: 16,
  },
  permButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingLeft: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 50,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingTop: 30,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  shutterInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'black',
  },
  spacer: {
    flex: 1,
  }
});
