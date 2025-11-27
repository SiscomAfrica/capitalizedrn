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
import { useAuthStore, useUserStore } from '../../store';
import { AxiosError } from 'axios';
import { APIErrorResponse } from '../../types/api';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  const { setTokensOnly, setAuthenticated } = useAuthStore();
  const { setUser } = useUserStore();

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!identifier.trim()) {
      newErrors.identifier = 'Email or phone number is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Step 1: Login and get tokens + user data (all in one response)
      const response = await authApi.login({
        identifier: identifier.trim(),
        password,
      });

      console.log('✅ Login successful, user data:', response.user);

      // Step 2: Check if phone is verified FIRST
      if (!response.user.phone_verified) {
        console.log('📱 Phone not verified - navigating to verification screen');
        
        // Store tokens temporarily (but don't set isAuthenticated yet)
        await setTokensOnly(response.access_token, response.refresh_token);
        
        // Store user data
        await setUser(response.user);
        
        // Navigate to VerifyCode screen - user must verify phone before proceeding
        navigation.navigate('VerifyCode', {
          email: response.user.email,
          phone: response.user.phone,
        });
        
        return; // Stop here - don't set authenticated until phone is verified
      }

      // Step 3: Phone is verified - proceed with normal flow
      // Store tokens
      await setTokensOnly(response.access_token, response.refresh_token);

      // Step 4: Store user data from login response (no extra API call needed)
      await setUser(response.user);

      // Step 5: Set authenticated - RootNavigator will handle routing based on user state
      // Follows Sequence Diagram: Profile → KYC → Subscription → Investment
      setAuthenticated(true);

      console.log('🔐 Authentication successful. RootNavigator will handle routing...');
    } catch (error) {
      console.error('❌ Login failed:', error);
      
      // Clear any tokens that might have been set
      const { clearAuth } = useAuthStore.getState();
      await clearAuth();
      
      const axiosError = error as AxiosError<APIErrorResponse>;
      const errorMessage = 
        axiosError.response?.data?.message || 
        axiosError.response?.data?.error ||
        axiosError.response?.data?.detail ||
        'Login failed. Please check your credentials.';
      Alert.alert('Login Failed', errorMessage);
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Log in to continue investing with SISCOM Capitalized
          </Text>

          <View style={styles.form}>
            <Input
              label="Email or Phone Number"
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="your@email.com or +254..."
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.identifier}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              error={errors.password}
            />

            <Button
              title="Log In"
              onPress={handleLogin}
              variant="primary"
              size="large"
              loading={loading}
              style={styles.loginButton}
            />

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                <Text style={styles.signUpLink}>Sign Up</Text>
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
  loginButton: {
    marginTop: spacing.lg,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  signUpText: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
  },
  signUpLink: {
    fontSize: typography.fontSize.base,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
});

