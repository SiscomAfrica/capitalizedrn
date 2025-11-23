import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { InvestmentsStackParamList } from '../types';
import { InvestmentListScreen } from '../screens/investments/InvestmentListScreen';
import { InvestmentDetailsScreen } from '../screens/investments/InvestmentDetailsScreen';
import { InvestmentConfirmationScreen } from '../screens/investments/InvestmentConfirmationScreen';

const Stack = createNativeStackNavigator<InvestmentsStackParamList>();

export const InvestmentsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="InvestmentList" component={InvestmentListScreen} />
      <Stack.Screen name="InvestmentDetails" component={InvestmentDetailsScreen} />
      <Stack.Screen name="InvestmentConfirmation" component={InvestmentConfirmationScreen} />
    </Stack.Navigator>
  );
};
