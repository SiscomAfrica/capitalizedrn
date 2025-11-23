import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { UserInvestment } from '../../types';
import { colors, spacing, typography } from '../../theme';

// Mock data
const mockPortfolio: UserInvestment[] = [
  {
    id: '1',
    investmentId: '1',
    investment: {
      id: '1',
      title: 'Siscom Infrastructure Bond',
      description: 'Infrastructure development',
      category: 'Infrastructure',
      riskLevel: 'LOW',
      minInvestment: 50000,
      targetAmount: 10000000,
      raisedAmount: 8500000,
      expectedReturn: 12.5,
      risks: [],
      image: '',
      status: 'active',
    },
    amount: 150000,
    date: new Date('2024-10-15'),
    status: 'confirmed',
    returns: 18750,
  },
  {
    id: '2',
    investmentId: '2',
    investment: {
      id: '2',
      title: 'Tech Startup Equity Fund',
      description: 'Tech startups',
      category: 'Technology',
      riskLevel: 'HIGH',
      minInvestment: 100000,
      targetAmount: 5000000,
      raisedAmount: 2300000,
      expectedReturn: 250,
      risks: [],
      image: '',
      status: 'active',
    },
    amount: 200000,
    date: new Date('2024-11-01'),
    status: 'confirmed',
    returns: 500000,
  },
];

export const PortfolioScreen: React.FC = () => {
  const [portfolio, setPortfolio] = useState<UserInvestment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      // TODO: Call API GET /api/investments/portfolio
      await new Promise<void>(resolve => setTimeout(resolve, 800));
      setPortfolio(mockPortfolio);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalInvested = () => {
    return portfolio.reduce((sum, inv) => sum + inv.amount, 0);
  };

  const getTotalReturns = () => {
    return portfolio.reduce((sum, inv) => sum + inv.returns, 0);
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

  const renderInvestment = ({ item }: { item: UserInvestment }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.investment.title}</Text>
        <View
          style={[
            styles.riskBadge,
            { backgroundColor: getRiskColor(item.investment.riskLevel) + '20' },
          ]}>
          <Text
            style={[
              styles.riskText,
              { color: getRiskColor(item.investment.riskLevel) },
            ]}>
            {item.investment.riskLevel}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Invested</Text>
          <Text style={styles.statValue}>
            KES {item.amount.toLocaleString()}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Returns</Text>
          <Text style={[styles.statValue, styles.returnsValue]}>
            +KES {item.returns.toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>
          Invested on {item.date.toLocaleDateString()}
        </Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'confirmed' ? colors.success + '20' : colors.warning + '20',
            },
          ]}>
          <Text
            style={[
              styles.statusText,
              {
                color: item.status === 'confirmed' ? colors.success : colors.warning,
              },
            ]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>MY PORTFOLIO</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MY PORTFOLIO</Text>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Invested</Text>
          <Text style={styles.summaryValue}>
            KES {getTotalInvested().toLocaleString()}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Returns</Text>
          <Text style={[styles.summaryValue, styles.returnsValue]}>
            +KES {getTotalReturns().toLocaleString()}
          </Text>
        </View>
      </View>

      <FlatList
        data={portfolio}
        renderItem={renderInvestment}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No investments yet</Text>
            <Text style={styles.emptySubtext}>
              Start investing to build your portfolio
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    margin: spacing.lg,
    padding: spacing.xl,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  returnsValue: {
    color: colors.success,
  },
  divider: {
    width: 1,
    backgroundColor: colors.gray200,
    marginHorizontal: spacing.lg,
  },
  listContent: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  cardTitle: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray900,
    marginRight: spacing.md,
  },
  riskBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  riskText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginBottom: 4,
  },
  statValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray900,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
  },
  dateText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl * 2,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: typography.fontSize.base,
    color: colors.gray500,
  },
});
