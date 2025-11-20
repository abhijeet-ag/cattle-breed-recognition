import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenWrapper from '../components/ScreenWrapper';
import Header from '../components/Header';
import Button from '../components/Button';
import { useLanguageRefresh } from '../hooks/useLanguageRefresh';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const languageVersion = useLanguageRefresh(); // Force re-render on language change
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // Update current language when it changes
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [languageVersion]);

  const changeLanguage = async (lang: 'en' | 'hi') => {
    try {
      console.log('🔄 Changing language to:', lang);
      await i18n.changeLanguage(lang);
      
      // Force immediate UI update
      setTimeout(() => {
        Alert.alert(
          '✅ Success', 
          `Language changed to ${lang === 'en' ? 'English' : 'हिन्दी'}`
        );
      }, 100);
      
    } catch (error) {
      console.error('❌ Language change failed:', error);
      Alert.alert('❌ Error', 'Failed to change language');
    }
  };

  const handleAbout = () => {
    Alert.alert(
      '🐄 About Cattle Recognizer',
      `Version 1.0.0\n\nAn AI-powered app for cattle breed recognition using machine learning.\n\nCurrent Language: ${i18n.language === 'en' ? 'English' : 'हिन्दी'}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScreenWrapper>
      <Header title={t('settings.title')} showBackButton />
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
        <View style={styles.languageContainer}>
          <Button
            title="🇺🇸 English"
            onPress={() => changeLanguage('en')}
            style={[styles.languageButton, i18n.language === 'en' && styles.activeButton]}
          />
          <Button
            title="🇮🇳 हिन्दी"
            onPress={() => changeLanguage('hi')}
            style={[styles.languageButton, i18n.language === 'hi' && styles.activeButton]}
          />
        </View>

        <Text style={styles.sectionTitle}>{t('settings.dataSync')}</Text>
        <Button
          title={t('settings.languageSettings')}
          onPress={() => changeLanguage(i18n.language === 'en' ? 'hi' : 'en')}
          style={styles.button}
        />
        
        <Button
          title={t('settings.about')}
          onPress={handleAbout}
          style={styles.button}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  languageButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#004d99',
  },
  button: {
    marginVertical: 10,
  },
});
