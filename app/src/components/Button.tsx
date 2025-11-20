import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  small?: boolean;
}

export default function Button({ title, onPress, style, small = false }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, small && styles.smallButton, style]} 
      onPress={onPress}
    >
      <Text style={[styles.text, small && styles.smallText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  smallText: {
    fontSize: 14,
  },
});
