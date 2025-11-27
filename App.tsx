/**
 * SISCOM Capitalized - Investment Platform
 * React Native Mobile Application
 *
 * @format
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { RootNavigator } from './src/navigation';
import { colors } from './src/theme';
import { useAuthStore, useUserStore } from './src/store';

function App() {
  const { initialize } = useAuthStore();
  const { loadUser } = useUserStore();

  useEffect(() => {
    // Initialize authentication state on app start
    const initializeApp = async () => {
      await initialize();
      await loadUser();
    };
    
    initializeApp();
  }, [initialize, loadUser]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.primary}
        />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
