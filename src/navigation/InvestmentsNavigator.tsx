import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { InvestmentsStackParamList } from '../types';
import { ProductDetailsScreen } from '../screens/investments/ProductDetailsScreen';

const Stack = createNativeStackNavigator<InvestmentsStackParamList>();

export const InvestmentsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="InvestmentDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
};
