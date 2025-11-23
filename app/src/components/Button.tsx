import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  variant?: 'primary' | 'secondary' | 'dark' | 'gray';
}

export const Button: React.FC<ButtonProps> = ({ 
  title, subtitle, onPress, iconName, variant = 'primary' 
}) => {
  
  let colors = ['#3B82F6', '#2563EB']; // Default Blue
  let iconColor = '#FFF';
  let textColor = '#FFF';
  let subTextColor = 'rgba(255,255,255,0.8)';

  if (variant === 'secondary') { // Light Blue
    colors = ['#DBEAFE', '#BFDBFE'];
    iconColor = '#1E40AF';
    textColor = '#1E3A8A';
    subTextColor = '#3B82F6';
  } else if (variant === 'dark') { // Dark Navy
    colors = ['#1E293B', '#0F172A'];
  } else if (variant === 'gray') { // Settings Gray
    colors = ['#64748B', '#475569'];
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.container}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        <View style={[styles.iconBox, variant === 'secondary' ? styles.iconBoxLight : styles.iconBoxDark]}>
          <MaterialCommunityIcons name={iconName} size={26} color={variant === 'secondary' ? iconColor : '#FFF'} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          {subtitle && <Text style={[styles.subtitle, { color: subTextColor }]}>{subtitle}</Text>}
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={textColor} style={{opacity: 0.7}} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16, borderRadius: 18, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: {width: 0, height: 4} },
  gradient: { flexDirection: 'row', alignItems: 'center', padding: 18, minHeight: 85 },
  iconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  iconBoxDark: { backgroundColor: 'rgba(255,255,255,0.2)' },
  iconBoxLight: { backgroundColor: '#FFFFFF' },
  textContainer: { flex: 1 },
  title: { fontSize: 17, fontWeight: '700', marginBottom: 2 },
  subtitle: { fontSize: 12, fontWeight: '500' },
});
