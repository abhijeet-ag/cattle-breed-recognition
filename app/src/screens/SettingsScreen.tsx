import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

const SettingsScreen = () => {
  const { 
    language, setLanguage, t, 
    isDarkMode, toggleDarkMode, 
    isOfflineMode, toggleOfflineMode,
    theme 
  } = useLanguage();

  const Option = ({ label, active, onPress }: any) => (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.option, { borderBottomColor: theme.border }, active && { backgroundColor: theme.primary }]}
    >
      <Text style={[styles.optionText, { color: active ? '#FFF' : theme.text }]}>{label}</Text>
      {active && <MaterialCommunityIcons name="check-circle" size={20} color="#FFF" />}
    </TouchableOpacity>
  );

  const ToggleOption = ({ label, value, onToggle, icon }: any) => (
    <View style={[styles.toggleRow, { borderBottomColor: theme.border }]}>
      <View style={styles.toggleLeft}>
        <View style={[styles.iconBox, { backgroundColor: theme.iconBg }]}>
          <MaterialCommunityIcons name={icon} size={20} color={theme.primary} />
        </View>
        <Text style={[styles.optionText, { color: theme.text }]}>{label}</Text>
      </View>
      <Switch 
        value={value} 
        onValueChange={onToggle} 
        trackColor={{ false: "#767577", true: theme.primary }}
        thumbColor={value ? "#FFF" : "#f4f3f4"}
      />
    </View>
  );

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.header, { color: theme.text }]}>{t.settings}</Text>
        
        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Preferences</Text>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <ToggleOption 
              label={t.darkMode} 
              value={isDarkMode} 
              onToggle={toggleDarkMode} 
              icon="theme-light-dark" 
            />
            <ToggleOption 
              label={t.offlineMode} 
              value={isOfflineMode} 
              onToggle={toggleOfflineMode} 
              icon="wifi-off" 
            />
          </View>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t.language}</Text>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Option label="English" active={language === 'en'} onPress={() => setLanguage('en')} />
            <Option label="हिंदी (Hindi)" active={language === 'hi'} onPress={() => setLanguage('hi')} />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t.about}</Text>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.infoText, { color: theme.text }]}>{t.help}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textSecondary} />
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoText, { color: theme.text }]}>Version 1.0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  header: { fontSize: 32, fontWeight: 'bold', marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 12, textTransform: 'uppercase' },
  card: { borderRadius: 16, overflow: 'hidden', elevation: 2 },
  option: { flexDirection: 'row', justifyContent: 'space-between', padding: 18, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'transparent' },
  optionText: { fontSize: 16, fontWeight: '500' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center', borderBottomWidth: 1 },
  toggleLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 18, borderBottomWidth: 1, borderBottomColor: 'transparent' },
  infoText: { fontSize: 16 }
});

export default SettingsScreen;
