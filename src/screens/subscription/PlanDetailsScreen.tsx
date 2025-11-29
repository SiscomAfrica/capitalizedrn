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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { Button } from '../../components/common';
import { colors, spacing, typography } from '../../theme';
import { useUserStore, useAuthStore } from '../../store';
import { subscriptionApi, SubscriptionPlan } from '../../services/api';
import { tokenManager } from '../../config/api';
import { AxiosError } from 'axios';
import { APIErrorResponse } from '../../types/api';
import Icon from 'react-native-vector-icons/Ionicons';

type PlanDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PlanDetails'
>;
type PlanDetailsScreenRouteProp = RouteProp<RootStackParamList, 'PlanDetails'>;

export const PlanDetailsScreen: React.FC = () => {
  const navigation = useNavigation<PlanDetailsScreenNavigationProp>();
  const route = useRoute<PlanDetailsScreenRouteProp>();
  const { planId } = route.params;

  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const { updateUser, user } = useUserStore();
  const { clearAuth } = useAuthStore();

  useEffect(() => {
    fetchPlanDetails();
  }, [planId]);

  const fetchPlanDetails = async () => {
    try {
      setLoading(true);
      const response = await subscriptionApi.getPlanDetails(planId);
      setPlan(response);
    } catch (error) {
      console.error('Failed to fetch plan details:', error);
      const axiosError = error as AxiosError<APIErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        'Failed to load plan details. Please try again.';
      Alert.alert('Error', errorMessage, [
        { text: 'Go Back', onPress: () => navigation.goBack() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!plan) return;

    Alert.alert(
      'Subscribe Now',
      `You will be redirected to M-Pesa to complete payment of ${plan.currency} ${parseFloat(plan.price).toLocaleString()}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          onPress: async () => {
            setSubscribing(true);
            try {
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('💳 SUBSCRIPTION REQUEST INITIATED');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              
              console.log('🔐 STEP 1: Verifying authentication token...');
              const hasToken = await tokenManager.verifyToken();
              
              if (!hasToken) {
                console.log('❌ TOKEN MISSING - Cannot proceed with subscription');
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
              
              console.log('✅ Token verified - proceeding with subscription');
              
              console.log('📋 Plan Details:');
              console.log('  - Plan ID:', plan.id);
              console.log('  - Plan Name:', plan.name);
              console.log('  - Price:', plan.currency, plan.price);
              console.log('  - Duration:', plan.duration_days, 'days');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('📤 REQUEST PAYLOAD:');
              console.log(JSON.stringify({ plan_id: plan.id }, null, 2));
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              
              const response = await subscriptionApi.subscribe(plan.id);
              
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('✅ SUBSCRIPTION RESPONSE RECEIVED');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('📥 Full Response:');
              console.log(JSON.stringify(response, null, 2));
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('📊 Response Details:');
              console.log('  - Success:', response.success);
              console.log('  - Message:', response.message);
              console.log('  - Subscription Object:', response.subscription);
              console.log('  - Payment Info:', response.payment_info);
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

              if (response.success) {
                console.log('✅ Subscription successful! Updating user state...');
                
                updateUser({
                  has_subscription: true,
                  subscription_active: true,
                  can_invest: user?.kyc_status === 'approved',
                });

                const message =
                  user?.kyc_status === 'approved'
                    ? 'Your subscription is now active. You can now start investing!'
                    : 'Your subscription is active! You can explore the app. Investment features will be available once your KYC is approved.';

                Alert.alert(
                  '🎉 Subscription Activated!',
                  response.message || message,
                  [
                    {
                      text: 'Continue',
                      onPress: () => {
                        console.log('💳 Phase 3 complete: Subscription active, navigating to Phase 4...');
                        navigation.reset({
                          index: 0,
                          routes: [{ name: 'MainTabs' }],
                        });
                      },
                    },
                  ]
                );
              } else {
                console.log('⚠️ Subscription response success=false');
              }
            } catch (error) {
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('❌ SUBSCRIPTION ERROR');
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
                'Failed to process subscription. Please try again.';
              Alert.alert('Error', errorMessage);
            } finally {
              setSubscribing(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading plan details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!plan) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Plan not found</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plan Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Plan Header */}
        <View style={styles.planHeader}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planDescription}>{plan.description}</Text>
        </View>

        {/* Price Card */}
        <View style={styles.priceCard}>
          <View style={styles.priceContainer}>
            <Text style={styles.currency}>{plan.currency}</Text>
            <Text style={styles.price}>{parseFloat(plan.price).toLocaleString()}</Text>
            <Text style={styles.period}>/{plan.duration_days} days</Text>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          
          <View style={styles.featuresList}>
            <FeatureItem
              icon="checkmark-circle"
              text={`Up to ${plan.features.max_investments} active investments`}
              enabled={true}
            />
            <FeatureItem
              icon="checkmark-circle"
              text="Portfolio tracking"
              enabled={plan.features.portfolio_tracking}
            />
            <FeatureItem
              icon="checkmark-circle"
              text="Email notifications"
              enabled={plan.features.email_notifications}
            />
            <FeatureItem
              icon="checkmark-circle"
              text="Investment calculator"
              enabled={plan.features.investment_calculator}
            />
            <FeatureItem
              icon="checkmark-circle"
              text={`Withdrawals: ${plan.features.withdrawal_requests.replace('_', ' ')}`}
              enabled={true}
            />
            <FeatureItem
              icon="checkmark-circle"
              text="Advanced analytics"
              enabled={plan.features.advanced_analytics}
            />
            <FeatureItem
              icon="checkmark-circle"
              text="Priority support"
              enabled={plan.features.priority_support}
            />
            <FeatureItem
              icon="checkmark-circle"
              text="API access"
              enabled={plan.features.api_access}
            />
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.infoBox}>
          <Icon name="information-circle" size={24} color={colors.info} />
          <Text style={styles.infoText}>
            Payment is processed securely via M-Pesa. You will receive an STK
            push notification on your phone to complete the transaction.
          </Text>
        </View>
      </ScrollView>

      {/* Footer with Subscribe Button */}
      <View style={styles.footer}>
        <Button
          title={`Subscribe for ${plan.currency} ${parseFloat(plan.price).toLocaleString()}`}
          onPress={handleSubscribe}
          variant="primary"
          size="large"
          loading={subscribing}
        />
      </View>
    </SafeAreaView>
  );
};

interface FeatureItemProps {
  icon: string;
  text: string;
  enabled: boolean;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text, enabled }) => (
  <View style={[styles.featureItem, !enabled && styles.featureItemDisabled]}>
    <Icon
      name={enabled ? icon : 'close-circle'}
      size={24}
      color={enabled ? colors.success : colors.gray400}
    />
    <Text style={[styles.featureText, !enabled && styles.featureTextDisabled]}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: colors.gray600,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  planHeader: {
    marginBottom: spacing.xl,
  },
  planName: {
    fontSize: typography.fontSize.massive,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  planDescription: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
    lineHeight: 24,
  },
  priceCard: {
    backgroundColor: colors.primary + '10',
    borderRadius: 16,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 2,
    borderColor: colors.primary + '30',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  currency: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
    marginRight: spacing.xs,
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: 48,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    lineHeight: 48,
  },
  period: {
    fontSize: typography.fontSize.lg,
    color: colors.gray600,
    marginLeft: spacing.xs,
    marginBottom: spacing.sm,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  featuresList: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  featureItemDisabled: {
    opacity: 0.5,
  },
  featureText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  featureTextDisabled: {
    textDecorationLine: 'line-through',
    color: colors.gray500,
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
  footer: {
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
});

