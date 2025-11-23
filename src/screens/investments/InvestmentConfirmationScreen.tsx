import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { InvestmentsStackParamList } from '../../types';
import { Button } from '../../components/common';
import { colors, spacing, typography } from '../../theme';

type InvestmentConfirmationNavigationProp = NativeStackNavigationProp<
  InvestmentsStackParamList,
  'InvestmentConfirmation'
>;

type InvestmentConfirmationRouteProp = RouteProp<
  InvestmentsStackParamList,
  'InvestmentConfirmation'
>;

export const InvestmentConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<InvestmentConfirmationNavigationProp>();
  const route = useRoute<InvestmentConfirmationRouteProp>();
  const { investmentId, amount } = route.params;
  const [loading, setLoading] = useState(false);

  const handleConfirmInvestment = async () => {
    Alert.alert(
      'Confirm Investment',
      `You will be charged KES ${amount.toLocaleString()} via M-Pesa`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            setLoading(true);
            try {
              // TODO: Call API POST /api/investments
              // This triggers STK Push for payment
              await new Promise<void>(resolve => setTimeout(resolve, 2000));

              Alert.alert(
                'Investment Successful!',
                'Your investment has been confirmed. You will receive an SMS receipt shortly.',
                [
                  {
                    text: 'View Portfolio',
                    onPress: () => {
                      // Navigate to Portfolio tab
                      navigation.getParent()?.getParent()?.navigate('Portfolio' as never);
                    },
                  },
                ]
              );
            } catch (error) {
              console.error('Investment failed:', error);
              Alert.alert('Error', 'Failed to process investment. Please try again.');
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
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Investment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Investment Summary Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Investment Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Investment ID</Text>
              <Text style={styles.value}>#{investmentId}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.label}>Amount</Text>
              <Text style={[styles.value, styles.amountValue]}>
                KES {amount.toLocaleString()}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.label}>Processing Fee</Text>
              <Text style={styles.value}>KES 0</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={[styles.label, styles.totalLabel]}>Total Amount</Text>
              <Text style={[styles.value, styles.totalValue]}>
                KES {amount.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Payment Method</Text>
            <View style={styles.paymentMethod}>
              <Text style={styles.mpesaIcon}>📱</Text>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>M-Pesa</Text>
                <Text style={styles.paymentDescription}>
                  You will receive an STK push notification
                </Text>
              </View>
            </View>
          </View>

          {/* Terms */}
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              By confirming, you agree to the investment terms and conditions.
              Your investment is subject to market risks.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title={`Confirm & Pay KES ${amount.toLocaleString()}`}
          onPress={handleConfirmInvestment}
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
    backgroundColor: colors.gray100,
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
    padding: spacing.sm,
  },
  backIcon: {
    fontSize: typography.fontSize.xxl,
    color: colors.primary,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray900,
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  label: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
  },
  value: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
  },
  amountValue: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
  },
  totalValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mpesaIcon: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray900,
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.info + '15',
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.info,
  },
  infoIcon: {
    fontSize: typography.fontSize.lg,
    marginRight: spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
    lineHeight: 20,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
});
