import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { Badge } from '../common/Badge';
import { Investment } from '../../types';

interface InvestmentCardProps {
  investment: Investment;
  onPress: () => void;
  featured?: boolean;
}

export const InvestmentCard: React.FC<InvestmentCardProps> = ({
  investment,
  onPress,
  featured = false,
}) => {
  const getRiskColor = () => {
    switch (investment.riskLevel) {
      case 'HIGH':
        return colors.highRisk;
      case 'MEDIUM':
        return colors.mediumRisk;
      case 'LOW':
        return colors.lowRisk;
      default:
        return colors.gray400;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, featured && styles.featuredContainer]}
      onPress={onPress}
      activeOpacity={0.8}>
      <Image
        source={{ uri: investment.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.badges}>
          {investment.isFeatured && (
            <Badge label="⭐ Featured" variant="featured" size="small" />
          )}
          <Badge label={investment.category} variant="default" size="small" />
          <Badge
            label={investment.riskLevel}
            variant="risk"
            size="small"
            style={{ backgroundColor: getRiskColor() }}
          />
        </View>

        <Text style={styles.title}>{investment.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {investment.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Min. Investment</Text>
            <Text style={styles.statValue}>
              ${investment.minInvestment.toLocaleString()}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Expected Return</Text>
            <Text style={styles.statValue}>{investment.expectedReturn}%</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Text style={styles.interested}>
            👥 {investment.interested} interested
          </Text>
          <Text style={styles.viewDetails}>View Details →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
    backgroundColor: colors.white,
  },
  featuredContainer: {
    ...shadows.lg,
  },
  image: {
    width: '100%',
    height: 400,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  stat: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    flex: 0.48,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.white,
    opacity: 0.8,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  interested: {
    fontSize: typography.fontSize.sm,
    color: colors.white,
  },
  viewDetails: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
});

