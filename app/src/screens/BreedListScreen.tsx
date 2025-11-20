import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Breed, RootStackParamList } from '../types';
import { breedRepository } from '../db/repository';
import ScreenWrapper from '../components/ScreenWrapper';
import Header from '../components/Header';
import BreedCard from '../components/BreedCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../constants/Colors';

type BreedListNavigationProp = StackNavigationProp<RootStackParamList, 'BreedList'>;

export default function BreedListScreen() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<BreedListNavigationProp>();
  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      const fetchBreeds = async () => {
        try {
          setLoading(true);
          setError(null);
          console.log('📡 Fetching breeds...');
          
          const data = await breedRepository.getBreeds();
          console.log('✅ Got breeds:', data.length);
          
          setBreeds(data);
        } catch (err) {
          console.error('❌ Failed to fetch breeds:', err);
          setError(t('common.error'));
        } finally {
          setLoading(false);
        }
      };
      
      fetchBreeds();
    }, [t])
  );

  const handleSelectBreed = (breed: Breed) => {
    console.log('🐄 Selected breed:', breed.name);
    navigation.navigate('BreedDetail', { breed });
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <Header title={t('breeds.listTitle')} showBackButton />
        <View style={styles.center}>
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <Header title={t('breeds.listTitle')} showBackButton />
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (breeds.length === 0) {
    return (
      <ScreenWrapper>
        <Header title={t('breeds.listTitle')} showBackButton />
        <View style={styles.center}>
          <Text style={styles.emptyText}>No breeds available</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header title={t('breeds.listTitle')} showBackButton />
      <FlatList
        data={breeds}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BreedCard breed={item} onPress={() => handleSelectBreed(item)} />
        )}
        contentContainerStyle={styles.list}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: Colors.primary,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
});
