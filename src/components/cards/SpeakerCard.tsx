import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { Speaker } from '../../types';

interface SpeakerCardProps {
  speaker: Speaker;
  onPress?: () => void;
}

export const SpeakerCard: React.FC<SpeakerCardProps> = ({
  speaker,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {speaker.image ? (
          <Image source={{ uri: speaker.image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      <Text style={styles.name}>{speaker.name}</Text>
      <Text style={styles.title}>{speaker.title}</Text>
      <Text style={styles.company}>{speaker.company}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginRight: spacing.md,
    width: 200,
    alignItems: 'center',
    ...shadows.md,
  },
  imageContainer: {
    marginBottom: spacing.md,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gray200,
  },
  name: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  company: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

