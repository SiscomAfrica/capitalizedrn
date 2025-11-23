import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { RegistrationScreen } from '../screens/auth/RegistrationScreen';
import { VerifyCodeScreen } from '../screens/auth/VerifyCodeScreen';
import { KYCScreen } from '../screens/kyc/KYCScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
      <Stack.Screen name="KYC" component={KYCScreen} />
    </Stack.Navigator>
  );
};

