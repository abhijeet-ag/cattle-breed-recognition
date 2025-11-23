import React from 'react';
import { View, StyleSheet, StatusBar as RNStatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: any;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style }) => {
  const insets = useSafeAreaInsets();
  const { theme, isDarkMode } = useLanguage(); // Get the active theme
  
  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <RNStatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.background} 
      />
      <View style={[styles.content, style]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default ScreenWrapper;
