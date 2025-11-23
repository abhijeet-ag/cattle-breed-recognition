import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Button } from '../components/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../context/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }: any) => {
  const { t } = useLanguage();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      navigation.navigate('Result', { imageUri: result.assets[0].uri });
    }
  };

  return (
    <View style={styles.container}>
      {/* Dark Header Section */}
      <LinearGradient colors={['#172554', '#1e3a8a']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoCircle}>
             <MaterialCommunityIcons name="cow" size={44} color="#1e3a8a" />
          </View>
          <Text style={styles.appTitle}>{t.appTitle}</Text>
          <Text style={styles.tagline}>{t.tagline}</Text>
        </View>
      </LinearGradient>

      {/* Buttons Body */}
      <ScrollView contentContainerStyle={styles.body}>
        <Button title={t.capture} subtitle={t.captureSub} iconName="camera" onPress={() => navigation.navigate('Camera')} variant="primary" />
        <Button title={t.upload} subtitle={t.uploadSub} iconName="image" onPress={pickImage} variant="secondary" />
        <Button title={t.browse} subtitle={t.browseSub} iconName="cow" onPress={() => navigation.navigate('BreedList')} variant="dark" />
        <Button title={t.settings} subtitle={t.settingsSub} iconName="cog" onPress={() => navigation.navigate('Settings')} variant="gray" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { height: '35%', borderBottomLeftRadius: 40, borderBottomRightRadius: 40, justifyContent: 'center', alignItems: 'center', paddingBottom: 20 },
  headerContent: { alignItems: 'center', marginTop: 30 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 16, elevation: 5 },
  appTitle: { fontSize: 28, fontWeight: '800', color: '#FFF', letterSpacing: 0.5 },
  tagline: { fontSize: 14, color: '#93C5FD', fontWeight: '600', marginTop: 4 },
  body: { padding: 24, paddingTop: 30 },
});

export default HomeScreen;
