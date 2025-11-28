import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Button, Input } from '../../components/common';
import { colors, spacing, typography } from '../../theme';
import { userApi, kycApi, subscriptionApi } from '../../services/api';
import { useUserStore, useAuthStore, useKYCStore } from '../../store';
import { AxiosError } from 'axios';
import { APIErrorResponse } from '../../types/api';
import Icon from 'react-native-vector-icons/Ionicons';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, setUser, updateUser } = useUserStore();
  const { clearAuth } = useAuthStore();
  const { kycStatus, setKYCStatus } = useKYCStore();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setRefreshing(true);
      const userProfile = await userApi.getCurrentUser();
      await setUser(userProfile);
      
      // Load KYC status
      const kycStatusData = await kycApi.getKYCStatus();
      setKYCStatus(kycStatusData);

      // Load subscription info if user has subscription
      if (userProfile.has_subscription) {
        try {
          const subData = await subscriptionApi.getMySubscription();
          setSubscriptionInfo(subData.subscription);
        } catch (subError) {
          console.log('Could not load subscription info:', subError);
        }
      }

      // Populate form fields
      setAddress(userProfile.address || '');
      setCity(userProfile.city || '');
      setCountry(userProfile.country || '');
      setDateOfBirth(userProfile.date_of_birth || '');
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await userApi.updateProfile({
        address: address.trim(),
        city: city.trim(),
        country: country.trim(),
        date_of_birth: dateOfBirth.trim(),
      });

      // Update user store
      updateUser({
        address: response.address,
        city: response.city,
        country: response.country,
        date_of_birth: response.date_of_birth,
        profile_completed: response.profile_completed,
      });

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      const axiosError = error as AxiosError<APIErrorResponse>;
      const errorMessage = 
        axiosError.response?.data?.message || 
        axiosError.response?.data?.error ||
        'Failed to update profile. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await clearAuth();
            // Navigation will be handled by RootNavigator
          },
        },
      ]
    );
  };

  const getKYCStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'rejected':
        return colors.error;
      default:
        return colors.gray500;
    }
  };

  const getKYCStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Not Submitted';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <View />
        }>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* User Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{user?.full_name || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{user?.phone || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>KYC Status:</Text>
            <View style={[styles.statusBadge, { backgroundColor: getKYCStatusColor(user?.kyc_status || 'not_submitted') }]}>
              <Text style={styles.statusText}>{getKYCStatusText(user?.kyc_status || 'not_submitted')}</Text>
            </View>
          </View>
          {user?.can_invest && (
            <View style={styles.investBadge}>
              <Text style={styles.investBadgeText}>✓ Approved to Invest</Text>
            </View>
          )}
        </View>

        {/* Subscription Card */}
        {user?.has_subscription && subscriptionInfo ? (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Subscription</Text>
              <TouchableOpacity onPress={() => navigation.navigate('MySubscription')}>
                <Text style={styles.manageLink}>Manage</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.subscriptionContent}>
              <View style={styles.subscriptionIconContainer}>
                <Icon name="shield-checkmark" size={32} color={colors.primary} />
              </View>
              
              <View style={styles.subscriptionDetails}>
                <Text style={styles.subscriptionPlanName}>{subscriptionInfo.plan.name}</Text>
                <View style={styles.subscriptionStatusRow}>
                  <View style={[styles.statusDot, { backgroundColor: subscriptionInfo.status === 'active' ? colors.success : colors.error }]} />
                  <Text style={styles.subscriptionStatus}>{subscriptionInfo.status}</Text>
                  {subscriptionInfo.is_trial && (
                    <View style={styles.trialPill}>
                      <Text style={styles.trialPillText}>FREE TRIAL</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.subscriptionDaysRow}>
                  <Icon name="time-outline" size={16} color={colors.gray600} />
                  <Text style={styles.subscriptionDaysText}>
                    {subscriptionInfo.days_remaining} days remaining
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.viewDetailsButton}
              onPress={() => navigation.navigate('MySubscription')}>
              <Text style={styles.viewDetailsButtonText}>View Details</Text>
              <Icon name="arrow-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ) : user?.has_subscription === false && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Subscription</Text>
            <View style={styles.noSubscriptionContainer}>
              <Icon name="alert-circle-outline" size={48} color={colors.gray400} />
              <Text style={styles.noSubscriptionText}>No active subscription</Text>
              <Button
                title="Browse Plans"
                onPress={() => navigation.navigate('Subscription')}
                variant="primary"
                size="medium"
                style={styles.browsePlansButton}
              />
            </View>
          </View>
        )}

        {/* Profile Update Form */}
        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Update Profile</Text>
          
          <Input
            label="Address"
            value={address}
            onChangeText={setAddress}
            placeholder="123 Main Street, Westlands"
            multiline
          />

          <Input
            label="City"
            value={city}
            onChangeText={setCity}
            placeholder="Nairobi"
          />

          <Input
            label="Country"
            value={country}
            onChangeText={setCountry}
            placeholder="Kenya"
          />

          <Input
            label="Date of Birth (YYYY-MM-DD)"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="1990-01-01"
            keyboardType="numbers-and-punctuation"
          />

          <Button
            title="Update Profile"
            onPress={handleUpdateProfile}
            variant="primary"
            size="large"
            loading={loading}
            style={styles.updateButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  logoutButton: {
    padding: spacing.sm,
  },
  logoutText: {
    fontSize: typography.fontSize.base,
    color: colors.error,
    fontWeight: typography.fontWeight.semibold,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  infoLabel: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
    fontWeight: typography.fontWeight.medium,
  },
  infoValue: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
  },
  investBadge: {
    marginTop: spacing.md,
    backgroundColor: colors.success,
    padding: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  investBadgeText: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: spacing.md,
  },
  updateButton: {
    marginTop: spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  manageLink: {
    fontSize: typography.fontSize.base,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  subscriptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  subscriptionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscriptionDetails: {
    flex: 1,
  },
  subscriptionPlanName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subscriptionStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  subscriptionStatus: {
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
    textTransform: 'capitalize',
  },
  trialPill: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trialPillText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  subscriptionDaysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
  },
  subscriptionDaysText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingTop: spacing.md,
  },
  viewDetailsButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
  noSubscriptionContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  noSubscriptionText: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
  },
  browsePlansButton: {
    marginTop: spacing.sm,
  },
});

