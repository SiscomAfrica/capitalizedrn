import React, { useEffect, useState } from 'react';
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
import { InvestmentsStackParamList, Investment } from '../../types';
import { Button, Input, Badge } from '../../components/common';
import { colors, spacing, typography } from '../../theme';

type InvestmentDetailsNavigationProp = NativeStackNavigationProp<
  InvestmentsStackParamList,
  'InvestmentDetails'
>;

type InvestmentDetailsRouteProp = RouteProp<
  InvestmentsStackParamList,
  'InvestmentDetails'
>;

// Mock investment data - will be replaced with API call
const mockInvestment: Investment = {
  id: '1',
  title: 'Siscom Infrastructure Bond',
  description:
    'Invest in critical infrastructure development across Kenya including roads, bridges, and public utilities. This government-backed bond offers stable returns with minimal risk, backed by state guarantees and revenue from infrastructure projects.',
  category: 'Infrastructure',
  riskLevel: 'LOW',
  minInvestment: 50000,
  targetAmount: 10000000,
  raisedAmount: 8500000,
  expectedReturn: 12.5,
  risks: [
    'Interest rate fluctuation',
    'Economic downturn impact',
    'Regulatory changes',
    'Project completion delays',
  ],
  image: 'https://via.placeholder.com/400x250',
  status: 'active',
};

export const InvestmentDetailsScreen: React.FC = () => {
  const navigation = useNavigation<InvestmentDetailsNavigationProp>();
  const route = useRoute<InvestmentDetailsRouteProp>();
  const { investmentId } = route.params;

  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    loadInvestment();
  }, [investmentId]);

  const loadInvestment = async () => {
    try {
      // TODO: Call API GET /api/opportunities/:id
      await new Promise<void>(resolve => setTimeout(resolve, 500));
      setInvestment(mockInvestment);
    } catch (error) {
      console.error('Failed to load investment:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateAmount = (value: string): boolean => {
    const numValue = parseFloat(value);
    
    if (!value || isNaN(numValue)) {
      setAmountError('Please enter a valid amount');
      return false;
    }

    if (numValue < (investment?.minInvestment || 0)) {
      setAmountError(`Minimum investment is KES ${investment?.minInvestment.toLocaleString()}`);
      return false;
    }

    setAmountError('');
    return true;
  };

  const handleConfirmInvestment = () => {
    if (!validateAmount(amount)) {
      return;
    }

    const numAmount = parseFloat(amount);
    navigation.navigate('InvestmentConfirmation', {
      investmentId: investment!.id,
      amount: numAmount,
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return colors.highRisk;
      case 'MEDIUM':
        return colors.mediumRisk;
      case 'LOW':
        return colors.lowRisk;
      default:
        return colors.gray500;
    }
  };

  const getProgressPercentage = () => {
    if (!investment) return 0;
    return (investment.raisedAmount / investment.targetAmount) * 100;
  };

  if (loading || !investment) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Investment Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Title and Badges */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{investment.title}</Text>
            <View style={styles.badges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{investment.category}</Text>
              </View>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: getRiskColor(investment.riskLevel) + '20' },
                ]}>
                <Text
                  style={[
                    styles.badgeText,
                    { color: getRiskColor(investment.riskLevel) },
                  ]}>
                  {investment.riskLevel} RISK
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.description}>{investment.description}</Text>
          </View>

          {/* Target & Raised */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Funding Progress</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${getProgressPercentage()}%` },
                  ]}
                />
              </View>
              <View style={styles.progressStats}>
                <View style={styles.progressStat}>
                  <Text style={styles.progressLabel}>Target</Text>
                  <Text style={styles.progressValue}>
                    KES {investment.targetAmount.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.progressStat}>
                  <Text style={styles.progressLabel}>Raised</Text>
                  <Text style={[styles.progressValue, styles.raisedValue]}>
                    KES {investment.raisedAmount.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Returns */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expected Returns</Text>
            <View style={styles.returnsCard}>
              <Text style={styles.returnsPercentage}>
                {investment.expectedReturn}%
              </Text>
              <Text style={styles.returnsLabel}>Annual Return</Text>
            </View>
          </View>

          {/* Risks */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risk Factors</Text>
            {investment.risks.map((risk, index) => (
              <View key={index} style={styles.riskItem}>
                <Text style={styles.riskBullet}>•</Text>
                <Text style={styles.riskText}>{risk}</Text>
              </View>
            ))}
          </View>

          {/* Investment Amount Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enter Investment Amount</Text>
            <Input
              label={`Minimum: KES ${investment.minInvestment.toLocaleString()}`}
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
                setAmountError('');
              }}
              placeholder="150,000"
              keyboardType="numeric"
              error={amountError}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title="Confirm Investment"
          onPress={handleConfirmInvestment}
          variant="primary"
          size="large"
          disabled={!amount}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
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
  titleSection: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: colors.gray200,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray700,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.gray700,
    lineHeight: 24,
  },
  progressContainer: {
    gap: spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStat: {
    gap: 4,
  },
  progressLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  progressValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray900,
  },
  raisedValue: {
    color: colors.accent,
  },
  returnsCard: {
    backgroundColor: colors.primary,
    padding: spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
  },
  returnsPercentage: {
    fontSize: typography.fontSize.massive,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  returnsLabel: {
    fontSize: typography.fontSize.base,
    color: colors.white,
    opacity: 0.9,
  },
  riskItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  riskBullet: {
    fontSize: typography.fontSize.lg,
    color: colors.highRisk,
    marginRight: spacing.sm,
    lineHeight: 24,
  },
  riskText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.gray700,
    lineHeight: 24,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
});
