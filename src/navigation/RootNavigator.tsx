import React, { useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { AuthNavigator } from './AuthNavigator';
import { ProfileCompletionScreen } from '../screens/profile';
import { SubscriptionScreen } from '../screens/subscription/SubscriptionScreen';
import { TabNavigator } from './TabNavigator';
import { KYCScreen } from '../screens/kyc/KYCScreen';
import { useAuthStore, useUserStore } from '../store';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { user } = useUserStore();

  // Determine the correct screen based on Sequence Diagram Flow
  const getCurrentScreen = useMemo(() => {
    if (!isAuthenticated) return 'Auth';
    if (!user) return 'MainTabs'; // Fallback

    console.log('🔍 RootNavigator - Determining screen based on user state:', {
      profile_completed: user.profile_completed,
      kyc_status: user.kyc_status,
      can_invest: user.can_invest,
    });

    // Phase 2: Check Profile Completion FIRST (required before KYC)
    if (user.profile_completed === false) {
      console.log('📝 Phase 2: Profile not completed - showing ProfileCompletion screen');
      return 'ProfileCompletion';
    }

    // Phase 2: KYC Check - Must complete KYC before subscription
    if (user.kyc_status === 'not_submitted' || user.kyc_status === 'rejected') {
      console.log('📋 Phase 2: Showing KYC screen');
      return 'KYC';
    }

    // KYC pending - allow main app access but can't invest yet
    if (user.kyc_status === 'pending') {
      console.log('⏳ Phase 2: KYC pending, showing main app');
      return 'MainTabs';
    }

    // Phase 3: Subscription Check - KYC approved but no subscription
    // can_invest is false means no subscription even if KYC is approved
    if (user.kyc_status === 'approved' && !user.can_invest) {
      console.log('💳 Phase 3: Showing Subscription screen');
      return 'Subscription';
    }

    // Phase 4: Everything complete - user can invest
    console.log('🎉 Phase 4: User ready to invest!');
    return 'MainTabs';
  }, [isAuthenticated, user]);

  // Show loading screen while checking auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none', // Disable animation for smoother transitions
      }}>
      {getCurrentScreen === 'Auth' && (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
      {getCurrentScreen === 'ProfileCompletion' && (
        <Stack.Screen name="ProfileCompletion" component={ProfileCompletionScreen} options={{ gestureEnabled: false }} />
      )}
      {getCurrentScreen === 'KYC' && (
        <Stack.Screen name="KYC" component={KYCScreen} options={{ gestureEnabled: false }} />
      )}
      {getCurrentScreen === 'Subscription' && (
        <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ gestureEnabled: false }} />
      )}
      {getCurrentScreen === 'MainTabs' && (
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
};

