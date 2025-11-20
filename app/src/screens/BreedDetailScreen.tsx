import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AppStackParamList, Breed } from '../types';
import ScreenWrapper from '../components/ScreenWrapper';
import Header from '../components/Header';
import { Colors } from '../constants/Colors';

type BreedDetailRouteProp = RouteProp<AppStackParamList, 'BreedDetail'>;

export default function BreedDetailScreen() {
  const route = useRoute<BreedDetailRouteProp>();
  const { breed } = route.params;
  const [currentBreed, setCurrentBreed] = useState<Breed | null>(breed);
  const { t } = useTranslation();

  if (!currentBreed) {
    return (
      <ScreenWrapper>
        <Header title={t('breeds.detailTitle')} showBackButton />
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header title={currentBreed.name} showBackButton />
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: currentBreed.imageUrl }} style={styles.image} />
        <Text style={styles.title}>{currentBreed.name} ({currentBreed.localName})</Text>
        <Text style={styles.sectionTitle}>{t('breeds.description')}</Text>
        <Text style={styles.description}>{currentBreed.description}</Text>
        <Text style={styles.sectionTitle}>{t('breeds.managementTips')}</Text>
        <Text style={styles.description}>{currentBreed.managementTips}</Text>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
});
