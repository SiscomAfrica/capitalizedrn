import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { Badge } from '../common/Badge';
import { InvestmentProduct } from '../../types/api';

interface InvestmentProductCardProps {
  product: InvestmentProduct;
  onPress: () => void;
}

export const InvestmentProductCard: React.FC<InvestmentProductCardProps> = ({
  product,
  onPress,
}) => {
  const getStatusColor = () => {
    switch (product.status) {
      case 'active':
        return colors.success;
      case 'funding_complete':
        return colors.info;
      case 'draft':
        return colors.gray400;
      case 'cancelled':
        return colors.error;
      default:
        return colors.gray400;
    }
  };

  const getTypeColor = () => {
    switch (product.investment_type) {
      case 'micro-node':
        return colors.primary;
      case 'mega-node':
        return colors.info;
      case 'full-node':
        return colors.accent;
      case 'terranode':
        return colors.success;
      default:
        return colors.gray400;
    }
  };

  const formatType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.badges}>
          <Badge
            label={formatType(product.investment_type)}
            variant="default"
            size="small"
            style={{ backgroundColor: getTypeColor() }}
          />
          {product.category && (
            <Badge
              label={product.category.name}
              variant="default"
              size="small"
            />
          )}
        </View>
        <Badge
          label={product.status.toUpperCase()}
          variant="default"
          size="small"
          style={{ backgroundColor: getStatusColor() }}
        />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {product.name}
      </Text>
      
      {product.description && (
        <Text style={styles.description} numberOfLines={3}>
          {product.description}
        </Text>
      )}

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Price per Unit</Text>
          <Text style={styles.statValue}>
            ${product.price_per_unit.toLocaleString()}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Min. Investment</Text>
          <Text style={styles.statValue}>
            ${product.minimum_investment.toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.returnBadge}>
          <Text style={styles.returnLabel}>Expected Return</Text>
          <Text style={styles.returnValue}>
            {product.expected_annual_return}% p.a.
          </Text>
        </View>
        <Text style={styles.viewDetails}>View Details →</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  statsContainer: {
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
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  returnBadge: {
    backgroundColor: colors.success + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  returnLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.success,
    marginBottom: 2,
  },
  returnValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
  },
  viewDetails: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
});
