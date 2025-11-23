/**
 * SISCOM Capitalized - Investment Platform
 * React Native Mobile Application
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { RootNavigator } from './src/navigation';
import { colors } from './src/theme';

function App() {
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
