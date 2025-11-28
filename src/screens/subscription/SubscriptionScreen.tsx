import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { Button } from '../../components/common';
import { colors, spacing, typography } from '../../theme';
import { useUserStore, useAuthStore } from '../../store';
import { subscriptionApi, SubscriptionPlan } from '../../services/api';
import { tokenManager } from '../../config/api';
import { AxiosError } from 'axios';
import { APIErrorResponse } from '../../types/api';
import Icon from 'react-native-vector-icons/Ionicons';

type SubscriptionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Subscription'
>;

export const SubscriptionScreen: React.FC = () => {
  const navigation = useNavigation<SubscriptionScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [fetchingPlans, setFetchingPlans] = useState(true);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const { updateUser, user } = useUserStore();
  const { clearAuth } = useAuthStore();

  // Fetch available subscription plans on mount
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setFetchingPlans(true);
      const response = await subscriptionApi.getPlans();
      setPlans(response.plans);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      const axiosError = error as AxiosError<APIErrorResponse>;
      const errorMessage = 
        axiosError.response?.data?.message || 
        axiosError.response?.data?.error ||
        'Failed to load subscription plans. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setFetchingPlans(false);
    }
  };

  const handleViewPlanDetails = (planId: string) => {
    navigation.navigate('PlanDetails', { planId });
  };

  const handleStartFreeTrial = async () => {
    Alert.alert(
      'Start Free Trial',
      'Get 7 days of free access to all features. No payment required.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Start Trial',
          onPress: async () => {
            setLoading(true);
            try {
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('🎁 FREE TRIAL REQUEST INITIATED');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              
              // STEP 1: Verify token exists BEFORE making the API call
              console.log('🔐 STEP 1: Verifying authentication token...');
              const hasToken = await tokenManager.verifyToken();
              
              if (!hasToken) {
                console.log('❌ TOKEN MISSING - Cannot proceed with free trial');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                
                Alert.alert(
                  'Authentication Required',
                  'Your session has expired. Please log in again.',
                  [
                    {
                      text: 'OK',
                      onPress: async () => {
                        await clearAuth();
                        // Navigation will be handled by RootNavigator
                      },
                    },
                  ]
                );
                return;
              }
              
              console.log('✅ Token verified - proceeding with free trial');
              
              console.log('📋 Trial Details:');
              console.log('  - Duration: 7 days');
              console.log('  - Cost: FREE');
              console.log('  - Limitation: One per user');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('📤 REQUEST: POST /subscriptions/start-trial');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              
              const response = await subscriptionApi.startTrial();
              
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('✅ FREE TRIAL RESPONSE RECEIVED');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('📥 Full Response:');
              console.log(JSON.stringify(response, null, 2));
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('📊 Response Details:');
              console.log('  - Success:', response.success);
              console.log('  - Message:', response.message);
              console.log('  - Subscription Object:', response.subscription);
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              
              if (response.success) {
                console.log('✅ Free trial started successfully! Updating user state...');
                
                // Update user subscription status
                // has_subscription: track that user has chosen a plan (free trial counts)
                // subscription_active: track if subscription is currently active
                // can_invest: will be true only when both subscription active AND KYC approved
                updateUser({ 
                  has_subscription: true,
                  subscription_active: true,
                  can_invest: user?.kyc_status === 'approved', // Only allow investing if KYC approved
                });
                
                // Show success and navigate to main app
                const message = user?.kyc_status === 'approved'
                  ? 'Your 7-day free trial is now active. Enjoy full access to all features!'
                  : 'Your free trial is active! You can explore the app. Investment features will be available once your KYC is approved.';
                
                Alert.alert(
                  '🎉 Free Trial Started!',
                  response.message || message,
                  [
                    {
                      text: 'Start Exploring',
                      onPress: () => {
                        console.log('🎁 Phase 3 complete: Free trial active, navigating to Phase 4...');
                        navigation.replace('MainTabs');
                      },
                    },
                  ]
                );
              } else {
                console.log('⚠️ Free trial response success=false');
              }
            } catch (error) {
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('❌ FREE TRIAL ERROR');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.error('Full Error Object:', error);
              
              const axiosError = error as AxiosError<APIErrorResponse>;
              
              if (axiosError.response) {
                console.log('📥 Error Response Data:');
                console.log(JSON.stringify(axiosError.response.data, null, 2));
                console.log('  - Status Code:', axiosError.response.status);
                console.log('  - Status Text:', axiosError.response.statusText);
                console.log('  - Headers:', axiosError.response.headers);
              } else if (axiosError.request) {
                console.log('📤 Request was made but no response received');
                console.log('Request:', axiosError.request);
              } else {
                console.log('⚠️ Error setting up request:', axiosError.message);
              }
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              
              const errorMessage = 
                axiosError.response?.data?.message || 
                axiosError.response?.data?.error ||
                'Failed to start free trial. You may have already used your trial.';
              Alert.alert('Error', errorMessage);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Render loading state
  if (fetchingPlans) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Subscription</Text>
          <Text style={styles.headerSubtitle}>
            Choose your plan to start investing
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading plans...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Subscription</Text>
        <Text style={styles.headerSubtitle}>
          Choose your plan to start investing
        </Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Free Trial Card */}
        <TouchableOpacity 
          style={[styles.card, styles.trialCard]}
          onPress={handleStartFreeTrial}
          disabled={loading}>
          <View style={styles.cardHeader}>
            <View style={[styles.badge, styles.trialBadge]}>
              <Text style={styles.badgeText}>🎁 FREE TRIAL</Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.trialPrice}>7 Days Free</Text>
          </View>

          <Text style={styles.trialDescription}>
            Try all features for free. No payment required.
          </Text>

          <Button
            title="Start Free Trial"
            onPress={handleStartFreeTrial}
            variant="primary"
            size="large"
            loading={loading}
            style={styles.trialButton}
          />
        </TouchableOpacity>

        <View style={styles.dividerSection}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR CHOOSE A PLAN</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Subscription Plans - Simplified Cards */}
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={styles.planCard}
            onPress={() => handleViewPlanDetails(plan.id)}
            activeOpacity={0.7}>
            <View style={styles.planCardHeader}>
              <View style={styles.planCardInfo}>
                <Text style={styles.planCardName}>{plan.name}</Text>
                <Text style={styles.planCardDescription} numberOfLines={2}>
                  {plan.description}
                </Text>
              </View>
              <Icon name="chevron-forward" size={24} color={colors.primary} />
            </View>

            <View style={styles.planCardFooter}>
              <View style={styles.planCardPrice}>
                <Text style={styles.planCardCurrency}>{plan.currency}</Text>
                <Text style={styles.planCardPriceValue}>
                  {parseFloat(plan.price).toLocaleString()}
                </Text>
                <Text style={styles.planCardPeriod}>/{plan.duration_days} days</Text>
              </View>
              
              <View style={styles.planCardFeatures}>
                <View style={styles.featureBadge}>
                  <Icon name="briefcase-outline" size={14} color={colors.accent} />
                  <Text style={styles.featureBadgeText}>
                    {plan.features.max_investments} investments
                  </Text>
                </View>
                {plan.features.advanced_analytics && (
                  <View style={styles.featureBadge}>
                    <Icon name="analytics-outline" size={14} color={colors.accent} />
                    <Text style={styles.featureBadgeText}>Analytics</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.viewDetailsButton}>
              <Text style={styles.viewDetailsText}>View Details & Subscribe</Text>
              <Icon name="arrow-forward" size={16} color={colors.white} />
            </View>
          </TouchableOpacity>
        ))}

        {/* Payment Info */}
        <View style={styles.infoBox}>
          <Icon name="information-circle" size={24} color={colors.info} />
          <Text style={styles.infoText}>
            Payment is processed securely via M-Pesa. You will receive an STK
            push notification on your phone to complete the transaction.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl * 1.5,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.white,
    opacity: 0.9,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
    borderColor: colors.gray300,
  },
  planCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  planCardInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  planCardName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  planCardDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    lineHeight: 18,
  },
  planCardFooter: {
    gap: spacing.md,
  },
  planCardPrice: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  planCardCurrency: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
    marginRight: spacing.xs / 2,
    marginBottom: 2,
  },
  planCardPriceValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  planCardPeriod: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginLeft: spacing.xs / 2,
    marginBottom: 4,
  },
  planCardFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
    backgroundColor: colors.accent + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 8,
  },
  featureBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.accent,
    fontWeight: typography.fontWeight.semibold,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 10,
    marginTop: spacing.md,
  },
  viewDetailsText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.white,
  },
  trialCard: {
    borderColor: colors.success,
    backgroundColor: colors.success + '10',
  },
  cardHeader: {
    marginBottom: spacing.lg,
  },
  badge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  trialBadge: {
    backgroundColor: colors.success,
  },
  badgeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  trialPrice: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
  },
  trialDescription: {
    fontSize: typography.fontSize.base,
    color: colors.gray700,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  trialButton: {
    marginTop: spacing.sm,
  },
  dividerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray300,
  },
  dividerText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray500,
    marginHorizontal: spacing.md,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.info + '15',
    padding: spacing.lg,
    borderRadius: 12,
    marginTop: spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
    gap: spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
    lineHeight: 20,
  },
});
