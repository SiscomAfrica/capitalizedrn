import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  variant?: 'dark' | 'light';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  rightAction,
  variant = 'dark',
}) => {
  const isDark = variant === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.leftContainer}>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Text style={[styles.backText, isDark && styles.textDark]}>
              ← Back
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={[styles.title, isDark && styles.textDark]}>{title}</Text>
      <View style={styles.rightContainer}>{rightAction}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  containerDark: {
    backgroundColor: colors.primary,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: spacing.sm,
  },
  backText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  textDark: {
    color: colors.white,
  },
});

