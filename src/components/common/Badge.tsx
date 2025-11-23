import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'featured' | 'risk';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'medium',
  style,
  textStyle,
  icon,
}) => {
  const getBadgeStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.badge,
      ...styles[`badge_${size}`],
    };

    switch (variant) {
      case 'success':
        return { ...baseStyle, backgroundColor: colors.success };
      case 'warning':
        return { ...baseStyle, backgroundColor: colors.warning };
      case 'error':
        return { ...baseStyle, backgroundColor: colors.highRisk };
      case 'info':
        return { ...baseStyle, backgroundColor: colors.info };
      case 'featured':
        return { ...baseStyle, backgroundColor: colors.white };
      case 'risk':
        return { ...baseStyle, backgroundColor: colors.highRisk };
      default:
        return { ...baseStyle, backgroundColor: colors.gray200 };
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...styles.text,
      ...styles[`text_${size}`],
    };

    if (variant === 'featured') {
      return { ...baseStyle, color: colors.textPrimary };
    }

    if (['error', 'risk'].includes(variant)) {
      return { ...baseStyle, color: colors.white };
    }

    return { ...baseStyle, color: colors.textPrimary };
  };

  return (
    <View style={[getBadgeStyle(), style]}>
      {icon}
      <Text style={[getTextStyle(), textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: borderRadius.xl,
  },
  badge_small: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badge_medium: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  badge_large: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  text: {
    fontWeight: typography.fontWeight.semibold,
  },
  text_small: {
    fontSize: typography.fontSize.xs,
  },
  text_medium: {
    fontSize: typography.fontSize.sm,
  },
  text_large: {
    fontSize: typography.fontSize.base,
  },
});

