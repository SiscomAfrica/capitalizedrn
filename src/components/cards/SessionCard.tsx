import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { Badge } from '../common/Badge';
import { Session } from '../../types';

interface SessionCardProps {
  session: Session;
  onPress?: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.badges}>
        {session.tags.map((tag: string, index: number) => (
          <Badge
            key={index}
            label={tag}
            variant="default"
            size="small"
            style={styles.badge}
          />
        ))}
      </View>
      <Text style={styles.title}>{session.title}</Text>
      <Text style={styles.speaker}>{session.speaker}</Text>
      <Text style={styles.time}>
        {session.date} - {session.time}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.purpleBadge,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  badge: {
    backgroundColor: colors.white,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  speaker: {
    fontSize: typography.fontSize.base,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.xs,
  },
  time: {
    fontSize: typography.fontSize.sm,
    color: colors.white,
    opacity: 0.8,
  },
});

