import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { CommunityMember } from '../../types';
import { colors, spacing, typography } from '../../theme';

// Mock data
const mockMembers: CommunityMember[] = [
  {
    id: '1',
    name: 'Elizabeth Gore',
    title: 'Co-Founder & President',
    company: 'Tech Ventures Ltd',
    email: 'elizabeth@techventures.com',
    phone: '+254712345678',
  },
  {
    id: '2',
    name: 'James Mwangi',
    title: 'Investment Manager',
    company: 'Capital Growth Partners',
    email: 'james.m@capitalgrowth.co.ke',
    phone: '+254723456789',
  },
  {
    id: '3',
    name: 'Sarah Kamau',
    title: 'Portfolio Director',
    company: 'East Africa Investments',
    email: 'sarah.kamau@eainvest.com',
    phone: '+254734567890',
  },
  {
    id: '4',
    name: 'David Ochieng',
    title: 'Angel Investor',
    company: 'Independent',
    email: 'david.ochieng@gmail.com',
    phone: '+254745678901',
  },
];

export const CommunityScreen: React.FC = () => {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      // TODO: Call API GET /api/users/list
      await new Promise<void>(resolve => setTimeout(resolve, 800));
      setMembers(mockMembers);
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('Error', 'Unable to open email app');
    });
  };

  const renderMember = ({ item }: { item: CommunityMember }) => (
    <View style={styles.memberCard}>
      {/* Profile placeholder */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()}
        </Text>
      </View>

      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberTitle}>{item.title}</Text>
        <Text style={styles.memberCompany}>{item.company}</Text>

        {/* Contact Buttons */}
        <View style={styles.contactButtons}>
          {item.phone && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleCall(item.phone!)}>
              <Text style={styles.contactIcon}>📞</Text>
              <Text style={styles.contactText}>Call</Text>
            </TouchableOpacity>
          )}
          {item.email && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleEmail(item.email!)}>
              <Text style={styles.contactIcon}>✉️</Text>
              <Text style={styles.contactText}>Email</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>COMMUNITY</Text>
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
        <Text style={styles.headerTitle}>COMMUNITY</Text>
        <Text style={styles.headerSubtitle}>Connect with fellow investors</Text>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          Contact members via phone or email. In-app messaging coming soon!
        </Text>
      </View>

      <FlatList
        data={members}
        renderItem={renderMember}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: colors.warning + '20',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.warning + '40',
  },
  infoIcon: {
    fontSize: typography.fontSize.base,
    marginRight: spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
    lineHeight: 18,
  },
  listContent: {
    padding: spacing.lg,
  },
  memberCard: {
    flexDirection: 'row',
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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray900,
    marginBottom: 4,
  },
  memberTitle: {
    fontSize: typography.fontSize.base,
    color: colors.gray700,
    marginBottom: 2,
  },
  memberCompany: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
    marginBottom: spacing.md,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  contactIcon: {
    fontSize: typography.fontSize.base,
    marginRight: 4,
  },
  contactText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
  },
});
