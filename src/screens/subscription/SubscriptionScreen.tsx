import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { Button } from '../../components/common';
import { colors, spacing, typography } from '../../theme';

type SubscriptionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Subscription'
>;

export const SubscriptionScreen: React.FC = () => {
  const navigation = useNavigation<SubscriptionScreenNavigationProp>();
  const [loading, setLoading] = useState(false);

  const benefits = [
    'Access to all investment opportunities',
    'Portfolio tracking and analytics',
    'Priority customer support',
    'Member community access',
    'Quarterly investment reports',
    'Early access to new opportunities',
  ];

  const handleSubscribe = async () => {
    Alert.alert(
      'Subscribe Now',
      'You will be redirected to M-Pesa to complete payment of KES 5,000',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          onPress: async () => {
            setLoading(true);
            try {
              // TODO: Call API POST /api/subscription/initiate
              // This should trigger STK Push to user's phone
              await new Promise<void>(resolve => setTimeout(resolve, 2000));
              
              // Mock successful payment
              Alert.alert(
                'Subscription Activated!',
                'Your subscription is now active. Welcome to SISCOM Capitalized!',
                [
                  {
                    text: 'Start Investing',
                    onPress: () => {
                      navigation.replace('MainTabs');
                    },
                  },
                ]
              );
            } catch (error) {
              console.error('Subscription failed:', error);
              Alert.alert('Error', 'Failed to process subscription. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

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
        {/* Subscription Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>SINGLE TIER</Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.currency}>KES</Text>
            <Text style={styles.price}>5,000</Text>
            <Text style={styles.period}>/month</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>What's Included:</Text>
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <View style={styles.checkIcon}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Payment is processed securely via M-Pesa. You will receive an STK
            push notification on your phone to complete the transaction.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Subscribe Now"
          onPress={handleSubscribe}
          variant="primary"
          size="large"
          loading={loading}
        />
      </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  badge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  currency: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
    marginRight: spacing.xs,
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: typography.fontSize.massive,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    lineHeight: typography.fontSize.massive,
  },
  period: {
    fontSize: typography.fontSize.lg,
    color: colors.gray600,
    marginLeft: spacing.xs,
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginBottom: spacing.xl,
  },
  benefitsContainer: {
    gap: spacing.md,
  },
  benefitsTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  benefitText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.gray700,
    lineHeight: 22,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.info + '15',
    padding: spacing.lg,
    borderRadius: 12,
    marginTop: spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  infoIcon: {
    fontSize: typography.fontSize.xl,
    marginRight: spacing.md,
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
