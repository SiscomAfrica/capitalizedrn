import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { Button, Input } from '../../components/common';
import { colors, spacing, typography } from '../../theme';
import { userApi } from '../../services/api';
import { useUserStore } from '../../store';
import { AxiosError } from 'axios';
import { APIErrorResponse } from '../../types/api';

type ProfileCompletionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProfileCompletion'
>;

export const ProfileCompletionScreen: React.FC = () => {
  const navigation = useNavigation<ProfileCompletionScreenNavigationProp>();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Kenya');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    address?: string;
    city?: string;
    country?: string;
    dateOfBirth?: string;
  }>({});

  const { updateUser } = useUserStore();

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Date of birth is required (YYYY-MM-DD)';
    } else {
      // Basic date validation
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dateOfBirth)) {
        newErrors.dateOfBirth = 'Invalid date format. Use YYYY-MM-DD';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      console.log('📝 Updating user profile...');
      
      const response = await userApi.updateProfile({
        address: address.trim(),
        city: city.trim(),
        country: country.trim(),
        date_of_birth: `${dateOfBirth}T00:00:00Z`, 
      });

      console.log('✅ Profile updated successfully:', response);

      await updateUser({
        profile_completed: response.profile_completed,
        address: response.address,
        city: response.city,
        country: response.country,
        date_of_birth: response.date_of_birth,
      });

      // Show success and navigate to KYC
      Alert.alert(
        '✅ Profile Complete!',
        'Your profile has been updated successfully. Let\'s proceed with KYC verification.',
        [
          {
            text: 'Continue to KYC',
            onPress: () => {
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ Profile update failed:', error);
      const axiosError = error as AxiosError<APIErrorResponse>;
      const errorMessage = 
        axiosError.response?.data?.message || 
        axiosError.response?.data?.error ||
        axiosError.response?.data?.detail ||
        'Failed to update profile. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            We need a few more details before you can proceed with KYC verification
          </Text>

          <View style={styles.form}>
            <Input
              label="Address"
              value={address}
              onChangeText={setAddress}
              placeholder="123 Main Street, Westlands"
              error={errors.address}
              autoCapitalize="words"
            />

            <Input
              label="City"
              value={city}
              onChangeText={setCity}
              placeholder="Nairobi"
              error={errors.city}
              autoCapitalize="words"
            />

            <Input
              label="Country"
              value={country}
              onChangeText={setCountry}
              placeholder="Kenya"
              error={errors.country}
              autoCapitalize="words"
            />

            <Input
              label="Date of Birth (YYYY-MM-DD)"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="1990-01-15"
              error={errors.dateOfBirth}
              keyboardType="numbers-and-punctuation"
            />

            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <Text style={styles.infoText}>
                This information is required to comply with regulatory requirements
                and will be used for identity verification.
              </Text>
            </View>

            <Button
              title="Continue to KYC"
              onPress={handleSubmit}
              variant="primary"
              size="large"
              loading={loading}
              style={styles.submitButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
    marginTop: spacing.xl,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
    marginBottom: spacing.xl * 2,
    lineHeight: 22,
  },
  form: {
    gap: spacing.lg,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.info + '15',
    padding: spacing.lg,
    borderRadius: 12,
    marginTop: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  infoIcon: {
    fontSize: typography.fontSize.xl,
    marginRight: spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
    lineHeight: 20,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
});

