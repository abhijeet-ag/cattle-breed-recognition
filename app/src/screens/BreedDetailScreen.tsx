import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

const StatRow = ({ icon, label, value, theme }: any) => (
  <View style={styles.statRow}>
    <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
      <MaterialCommunityIcons name={icon} size={24} color={theme.primary} />
    </View>
    <View style={styles.statTextContainer}>
      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
    </View>
  </View>
);

const BreedDetailScreen = ({ route }: any) => {
  const { breed } = route.params;
  const { theme } = useLanguage();

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Updated Image Handling */}
        <Image source={breed.image} style={styles.heroImage} resizeMode="cover" />
        
        <View style={[styles.contentContainer, { backgroundColor: theme.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>{breed.name}</Text>
            <View style={[styles.badge, { backgroundColor: theme.iconBg }]}>
              <Text style={[styles.badgeText, { color: theme.primary }]}>{breed.origin}</Text>
            </View>
          </View>

          <Text style={[styles.description, { color: theme.textSecondary }]}>{breed.description}</Text>

          <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionHeader, { color: theme.text }]}>Breed Statistics</Text>
            
            <StatRow icon="water" label="Milk Yield" value={breed.stats?.milk_yield || 'N/A'} theme={theme} />
            <StatRow icon="food-drumstick" label="Weight" value={breed.stats?.weight || 'N/A'} theme={theme} />
            <StatRow icon="ruler" label="Height" value={breed.stats?.height || 'N/A'} theme={theme} />
            <StatRow icon="palette" label="Coat Color" value={breed.stats?.coat || 'N/A'} theme={theme} />
            <StatRow icon="flask" label="Protein Content" value={breed.stats?.protein || 'N/A'} theme={theme} />
            <StatRow icon="medical-bag" label="Diseases" value={breed.stats?.diseases || 'N/A'} theme={theme} />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  heroImage: { width: '100%', height: 300, backgroundColor: '#ddd' },
  contentContainer: { padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 28, fontWeight: 'bold' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontWeight: '600', fontSize: 12 },
  description: { fontSize: 16, lineHeight: 24, marginBottom: 24 },
  statsCard: { borderRadius: 16, padding: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  statTextContainer: { flex: 1 },
  statLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: 16, fontWeight: '600' },
});

export default BreedDetailScreen;
