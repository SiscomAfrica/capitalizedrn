import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { AuthNavigator } from './AuthNavigator';
import { SubscriptionScreen } from '../screens/subscription/SubscriptionScreen';
import { TabNavigator } from './TabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
    </Stack.Navigator>
  );
};

