import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { InvestmentsStackParamList } from '../types';
import { BrowseOpportunitiesScreen } from '../screens/investments/BrowseOpportunitiesScreen';
import { ProductDetailsScreen } from '../screens/investments/ProductDetailsScreen';
import { InvestmentConfirmationScreen } from '../screens/investments/InvestmentConfirmationScreen';

const Stack = createNativeStackNavigator<InvestmentsStackParamList>();

export const InvestmentsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="InvestmentList" component={BrowseOpportunitiesScreen} />
      <Stack.Screen name="InvestmentDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="InvestmentConfirmation" component={InvestmentConfirmationScreen} />
    </Stack.Navigator>
  );
};
