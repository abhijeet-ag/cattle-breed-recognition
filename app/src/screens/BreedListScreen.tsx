import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { breedsData } from '../constants/BreedsData'; // Import the new Offline Data

const BreedListScreen = () => {
  const navigation = useNavigation();
  const { theme } = useLanguage();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.card }]}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('BreedDetail', { breed: item })} 
    >
      {/* DIRECT IMAGE SOURCE - NO URI OBJECT NEEDED */}
      <Image 
        source={item.image} 
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <View style={styles.row}>
          <Text style={[styles.breedName, { color: theme.text }]}>{item.name}</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color={theme.primary} />
        </View>
        <Text style={[styles.origin, { color: theme.textSecondary }]}>{item.origin}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <View style={styles.header}>
         <Text style={[styles.headerTitle, { color: theme.text }]}>Cattle Library</Text>
      </View>
      <FlatList
        data={breedsData} // Use the Offline Data
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  listContainer: { padding: 20, paddingTop: 0 },
  card: { borderRadius: 16, marginBottom: 16, elevation: 3, overflow: 'hidden' },
  cardImage: { width: '100%', height: 200, backgroundColor: '#E2E8F0' },
  cardContent: { padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  breedName: { fontSize: 20, fontWeight: '700' },
  origin: { fontSize: 14, marginTop: 4 },
});

export default BreedListScreen;
