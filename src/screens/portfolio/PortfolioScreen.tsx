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
  RefreshControl,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useInvestmentStore } from '../../store/investmentStore';
import { UserInvestmentResponse } from '../../types/api';

export const PortfolioScreen: React.FC = () => {
  const {
    portfolio,
    portfolioLoading,
    portfolioError,
    fetchPortfolio,
  } = useInvestmentStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      await fetchPortfolio();
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchPortfolio();
    } finally {
      setRefreshing(false);
    }
  };

  const getTotalInvested = () => {
    return portfolio.reduce((sum, inv) => sum + inv.amount, 0);
  };

  const getTotalCurrentValue = () => {
    return portfolio.reduce((sum, inv) => sum + inv.current_value, 0);
  };

  const getTotalReturn = () => {
    return getTotalCurrentValue() - getTotalInvested();
  };

  const getReturnPercentage = () => {
    const invested = getTotalInvested();
    if (invested === 0) return 0;
    return ((getTotalReturn() / invested) * 100).toFixed(2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'completed':
        return colors.info;
      case 'cancelled':
        return colors.error;
      default:
        return colors.gray500;
    }
  };

  const renderInvestmentCard = ({ item }: { item: UserInvestmentResponse }) => (
    <View style={styles.investmentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{item.product.name}</Text>
          <Text style={styles.cardType}>
            {item.product.investment_type.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.cardStats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Invested</Text>
          <Text style={styles.statValue}>${item.amount.toLocaleString()}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Units</Text>
          <Text style={styles.statValue}>{item.units}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Current Value</Text>
          <Text style={[styles.statValue, { color: colors.success }]}>
            ${item.current_value.toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.returnInfo}>
          <Text style={styles.returnLabel}>Expected Return</Text>
          <Text style={styles.returnValue}>
            ${item.expected_return.toLocaleString()} 
            ({item.product.expected_annual_return}% p.a.)
          </Text>
        </View>
        <Text style={styles.investmentDate}>
          {new Date(item.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </Text>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>Portfolio Summary</Text>
      
      <View style={styles.summaryCards}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Invested</Text>
          <Text style={styles.summaryValue}>
            ${getTotalInvested().toLocaleString()}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Current Value</Text>
          <Text style={[styles.summaryValue, { color: colors.success }]}>
            ${getTotalCurrentValue().toLocaleString()}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Returns</Text>
          <Text style={[styles.summaryValue, { color: getTotalReturn() >= 0 ? colors.success : colors.error }]}>
            ${getTotalReturn().toLocaleString()}
          </Text>
          <Text style={styles.summaryPercentage}>
            {getReturnPercentage()}%
          </Text>
        </View>
      </View>

      {portfolioError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{portfolioError}</Text>
        </View>
      )}

      <Text style={styles.investmentsTitle}>My Investments</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Investments Yet</Text>
      <Text style={styles.emptyText}>
        Start investing in Siscom infrastructure products to build your portfolio.
      </Text>
    </View>
  );

  if (portfolioLoading && portfolio.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>MY PORTFOLIO</Text>
          <Text style={styles.headerSubtitle}>Track your investments</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your portfolio...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MY PORTFOLIO</Text>
        <Text style={styles.headerSubtitle}>Track your investments</Text>
      </View>

      <FlatList
        data={portfolio}
        renderItem={renderInvestmentCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
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
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.white,
    opacity: 0.9,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  listContent: {
    flexGrow: 1,
  },
  summaryContainer: {
    padding: spacing.xl,
    backgroundColor: colors.white,
    marginBottom: spacing.md,
  },
  summaryTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.gray100,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    textAlign: 'center',
  },
  summaryPercentage: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.success,
    marginTop: spacing.xs,
  },
  errorContainer: {
    backgroundColor: colors.error + '15',
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
  investmentsTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  investmentCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cardType: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  cardStats: {
    flexDirection: 'row',
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: colors.gray200,
    marginHorizontal: spacing.sm,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  returnInfo: {
    flex: 1,
  },
  returnLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  returnValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.success,
  },
  investmentDate: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
