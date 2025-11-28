import React, { useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { AuthNavigator } from './AuthNavigator';
import { ProfileCompletionScreen } from '../screens/profile';
import { SubscriptionScreen, PlanDetailsScreen, MySubscriptionScreen } from '../screens/subscription';
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
      has_subscription: user.has_subscription,
      subscription_active: user.subscription_active,
      can_invest: user.can_invest,
    });

    // Phase 1: Check Profile Completion FIRST (required before KYC)
    if (user.profile_completed === false) {
      console.log('📝 Phase 1: Profile not completed - showing ProfileCompletion screen');
      return 'ProfileCompletion';
    }

    // Phase 2: KYC Check - Must submit KYC before subscription
    if (user.kyc_status === 'not_submitted' || user.kyc_status === 'rejected') {
      console.log('📋 Phase 2: Showing KYC screen');
      return 'KYC';
    }

    // Phase 3: Subscription Check - REQUIRED after KYC submission
    // User must choose a subscription plan (free or paid) before proceeding
    // Check if user has NOT chosen any subscription plan yet
    if (!user.has_subscription && !user.subscription_active) {
      console.log('💳 Phase 3: No subscription chosen yet - showing Subscription screen');
      return 'Subscription';
    }

    // Check if subscription has expired
    if (user.subscription_expires_at) {
      const expiryDate = new Date(user.subscription_expires_at);
      const now = new Date();
      
      if (expiryDate < now) {
        console.log('⏰ Subscription expired - showing Subscription screen');
        return 'Subscription';
      }
    }

    // Phase 4: Everything complete - user can access app
    // Note: can_invest will be true only after KYC approval + active subscription
    // But user can browse app after choosing subscription, even if KYC still pending
    console.log('🎉 Phase 4: User has subscription - showing MainTabs');
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
        <>
          <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen name="PlanDetails" component={PlanDetailsScreen} />
        </>
      )}
      {getCurrentScreen === 'MainTabs' && (
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="MySubscription" component={MySubscriptionScreen} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} />
          <Stack.Screen name="PlanDetails" component={PlanDetailsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

