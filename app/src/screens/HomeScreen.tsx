import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';

import Button from '../components/Button';
import ScreenWrapper from '../components/ScreenWrapper';
import { requestMediaLibraryPermissions } from '../utils/permissions';
import Header from '../components/Header';
import { AppStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

type HomeScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { t } = useTranslation();

  const handleUploadFromGallery = async () => {
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) {
      Alert.alert(
        t('permissions.gallery.title'),
        t('permissions.gallery.message')
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      navigation.navigate('Result', { imageUri: result.assets[0].uri });
    }
  };

  return (
    <ScreenWrapper>
      <Header title={t('home.title')} />
      <View style={styles.container}>
        <Button
          title={t('home.captureImage')}
          onPress={() => navigation.navigate('Camera')}
          style={styles.button}
        />
        <Button
          title={t('home.uploadFromGallery')}
          onPress={handleUploadFromGallery}
          style={styles.button}
        />
        <Button
          title={t('home.browseBreeds')}
          onPress={() => navigation.navigate('BreedList')}
          style={styles.button}
        />
        <Button
          title={t('home.settings')}
          onPress={() => navigation.navigate('Settings')}
          style={styles.button}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    marginVertical: 10,
  },
});