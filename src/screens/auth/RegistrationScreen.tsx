import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../types';
import { Button, Input } from '../../components/common';
import { colors, spacing, typography } from '../../theme';
import { authApi } from '../../services/api';
import { AxiosError } from 'axios';
import { APIErrorResponse } from '../../types/api';

type RegistrationScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Registration'
>;

export const RegistrationScreen: React.FC = () => {
  const navigation = useNavigation<RegistrationScreenNavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+254|0)[17]\d{8}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid Kenyan phone number';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const normalizedPhone = phone.startsWith('+') 
        ? phone.replace(/\s/g, '') 
        : phone.replace(/^0/, '+254').replace(/\s/g, '');

      const response = await authApi.register({
        email: email.trim(),
        full_name: name.trim(),
        password,
        phone: normalizedPhone,
      });

      // Show success message
      Alert.alert(
        'Success',
        response.message || 'Registration successful! Please verify your phone number.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('VerifyCode', { email, phone: normalizedPhone }),
          },
        ]
      );
    } catch (error) {
      console.error('Registration failed:', error);
      const axiosError = error as AxiosError<APIErrorResponse>;
      
      // Log detailed error information
      console.log('Error details:', {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        message: axiosError.message,
        config: {
          url: axiosError.config?.url,
          method: axiosError.config?.method,
          data: axiosError.config?.data,
        }
      });
      
      const errorMessage = 
        axiosError.response?.data?.message || 
        axiosError.response?.data?.error ||
        axiosError.response?.data?.detail ||
        'Registration failed. Please try again.';
      Alert.alert('Registration Failed', errorMessage);
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
        {/* Decorative squares */}
        <View style={styles.decorativeContainer}>
          <View style={[styles.square, styles.square1]} />
          <View style={[styles.square, styles.square2]} />
          <View style={[styles.square, styles.square3]} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join SISCOM Capitalized to start investing in exciting opportunities
          </Text>

          <View style={styles.form}>
            <Input
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              error={errors.name}
              autoCapitalize="words"
            />

            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="+254 7XX XXX XXX"
              keyboardType="phone-pad"
              error={errors.phone}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              secureTextEntry
              error={errors.password}
            />

            <Button
              title="Sign Up"
              onPress={handleSignUp}
              variant="primary"
              size="large"
              loading={loading}
              style={styles.signUpButton}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>
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
  decorativeContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 80,
    height: 80,
  },
  square: {
    position: 'absolute',
    backgroundColor: colors.accent,
    borderRadius: 8,
  },
  square1: {
    width: 30,
    height: 30,
    top: 0,
    right: 0,
  },
  square2: {
    width: 20,
    height: 20,
    top: 35,
    right: 35,
  },
  square3: {
    width: 25,
    height: 25,
    top: 55,
    right: 10,
  },
  content: {
    flex: 1,
    marginTop: spacing.xxxl * 2,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
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
  signUpButton: {
    marginTop: spacing.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  loginText: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
  },
  loginLink: {
    fontSize: typography.fontSize.base,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
});
