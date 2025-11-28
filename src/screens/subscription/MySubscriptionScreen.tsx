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
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { Button } from '../../components/common';
import { colors, spacing, typography } from '../../theme';
import { useUserStore } from '../../store';
import { subscriptionApi, MySubscriptionResponse } from '../../services/api';
import { AxiosError } from 'axios';
import { APIErrorResponse } from '../../types/api';
import Icon from 'react-native-vector-icons/Ionicons';

type MySubscriptionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MySubscription'
>;

export const MySubscriptionScreen: React.FC = () => {
  const navigation = useNavigation<MySubscriptionScreenNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [subscription, setSubscription] = useState<MySubscriptionResponse['subscription'] | null>(null);
  const { updateUser, user } = useUserStore();

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const response = await subscriptionApi.getMySubscription();
      setSubscription(response.subscription);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      const axiosError = error as AxiosError<APIErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        'Failed to load subscription. Please try again.';
      
      if (!isRefresh) {
        Alert.alert('Error', errorMessage, [
          { text: 'Go Back', onPress: () => navigation.goBack() },
        ]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period.',
      [
        {
          text: 'No, Keep It',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              const response = await subscriptionApi.cancelSubscription();
              
              if (response.success) {
                // Update user state
                updateUser({
                  subscription_active: false,
                  can_invest: false,
                });

                Alert.alert(
                  'Subscription Cancelled',
                  response.message || 'Your subscription has been cancelled successfully.',
                  [
                    {
                      text: 'OK',
                      onPress: () => navigation.goBack(),
                    },
                  ]
                );
              }
            } catch (error) {
              console.error('Cancel subscription failed:', error);
              const axiosError = error as AxiosError<APIErrorResponse>;
              const errorMessage =
                axiosError.response?.data?.message ||
                axiosError.response?.data?.error ||
                'Failed to cancel subscription. Please try again.';
              Alert.alert('Error', errorMessage);
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return colors.success;
      case 'cancelled':
      case 'expired':
        return colors.error;
      case 'pending':
        return colors.warning;
      default:
        return colors.gray500;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading subscription...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!subscription) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Subscription</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={64} color={colors.gray400} />
          <Text style={styles.errorText}>No Active Subscription</Text>
          <Text style={styles.errorSubtext}>You don't have an active subscription.</Text>
          <Button
            title="Browse Plans"
            onPress={() => navigation.navigate('Subscription')}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  const isActive = subscription.status.toLowerCase() === 'active';
  const isTrial = subscription.is_trial;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Subscription</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchSubscription(true)}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}>
        
        {/* Status Card */}
        <View style={[styles.statusCard, isTrial && styles.trialCard]}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.statusLabel}>Status</Text>
              <View style={styles.statusBadgeContainer}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(subscription.status) }]}>
                  <Text style={styles.statusText}>{subscription.status.toUpperCase()}</Text>
                </View>
                {isTrial && (
                  <View style={styles.trialBadge}>
                    <Text style={styles.trialBadgeText}>FREE TRIAL</Text>
                  </View>
                )}
              </View>
            </View>
            <Icon
              name={isActive ? 'checkmark-circle' : 'close-circle'}
              size={48}
              color={isActive ? colors.success : colors.error}
            />
          </View>
        </View>

        {/* Plan Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plan Details</Text>
          <View style={styles.card}>
            <Text style={styles.planName}>{subscription.plan.name}</Text>
            <Text style={styles.planDescription}>{subscription.plan.description}</Text>
            
            <View style={styles.divider} />
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Price</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.currency}>{subscription.plan.currency}</Text>
                <Text style={styles.price}>{parseFloat(subscription.plan.price).toLocaleString()}</Text>
                <Text style={styles.period}>/{subscription.plan.duration_days} days</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Subscription Period */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription Period</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Icon name="calendar-outline" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Start Date</Text>
                <Text style={styles.infoValue}>{formatDate(subscription.start_date)}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="calendar-outline" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>End Date</Text>
                <Text style={styles.infoValue}>{formatDate(subscription.end_date)}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="time-outline" size={20} color={colors.accent} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Days Remaining</Text>
                <Text style={[styles.infoValue, styles.daysRemaining]}>
                  {subscription.days_remaining} days
                </Text>
              </View>
            </View>

            {subscription.auto_renew && (
              <View style={styles.autoRenewBadge}>
                <Icon name="refresh" size={16} color={colors.white} />
                <Text style={styles.autoRenewText}>Auto-renewal enabled</Text>
              </View>
            )}
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Features</Text>
          <View style={styles.card}>
            <FeatureRow
              icon="checkmark-circle"
              text={`Up to ${subscription.plan.features.max_investments} active investments`}
              enabled={true}
            />
            <FeatureRow
              icon="checkmark-circle"
              text="Portfolio tracking"
              enabled={subscription.plan.features.portfolio_tracking}
            />
            <FeatureRow
              icon="checkmark-circle"
              text="Email notifications"
              enabled={subscription.plan.features.email_notifications}
            />
            <FeatureRow
              icon="checkmark-circle"
              text="Investment calculator"
              enabled={subscription.plan.features.investment_calculator}
            />
            <FeatureRow
              icon="checkmark-circle"
              text={`Withdrawals: ${subscription.plan.features.withdrawal_requests.replace('_', ' ')}`}
              enabled={true}
            />
            <FeatureRow
              icon="checkmark-circle"
              text="Advanced analytics"
              enabled={subscription.plan.features.advanced_analytics}
            />
            <FeatureRow
              icon="checkmark-circle"
              text="Priority support"
              enabled={subscription.plan.features.priority_support}
            />
            <FeatureRow
              icon="checkmark-circle"
              text="API access"
              enabled={subscription.plan.features.api_access}
            />
          </View>
        </View>

        {/* Warning for expiring trial */}
        {isTrial && subscription.days_remaining <= 3 && (
          <View style={styles.warningBox}>
            <Icon name="warning" size={24} color={colors.warning} />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Trial Ending Soon</Text>
              <Text style={styles.warningText}>
                Your free trial will expire in {subscription.days_remaining} days. Subscribe to a plan to continue accessing premium features.
              </Text>
              <Button
                title="View Plans"
                onPress={() => navigation.navigate('Subscription')}
                variant="primary"
                size="medium"
                style={styles.warningButton}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer with Cancel Button */}
      {isActive && !isTrial && (
        <View style={styles.footer}>
          <Button
            title="Cancel Subscription"
            onPress={handleCancelSubscription}
            variant="secondary"
            size="large"
            loading={cancelling}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

interface FeatureRowProps {
  icon: string;
  text: string;
  enabled: boolean;
}

const FeatureRow: React.FC<FeatureRowProps> = ({ icon, text, enabled }) => (
  <View style={[styles.featureRow, !enabled && styles.featureRowDisabled]}>
    <Icon
      name={enabled ? icon : 'close-circle-outline'}
      size={20}
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
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
    gap: spacing.md,
  },
  errorText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray700,
  },
  errorSubtext: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  statusCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  trialCard: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  statusBadgeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  trialBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  trialBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  planName: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  planDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
    fontWeight: typography.fontWeight.medium,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currency: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
    marginRight: spacing.xs / 2,
    marginBottom: 2,
  },
  price: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  period: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginLeft: spacing.xs / 2,
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginBottom: spacing.xs / 2,
  },
  infoValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  daysRemaining: {
    color: colors.accent,
    fontSize: typography.fontSize.lg,
  },
  autoRenewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.info,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  autoRenewText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.white,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  featureRowDisabled: {
    opacity: 0.4,
  },
  featureText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  featureTextDisabled: {
    textDecorationLine: 'line-through',
    color: colors.gray500,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: colors.warning + '15',
    padding: spacing.lg,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    gap: spacing.md,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  warningText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  warningButton: {
    marginTop: spacing.xs,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
});

