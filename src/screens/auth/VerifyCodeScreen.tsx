import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../types';
import { Button } from '../../components/common';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { authApi, userApi } from '../../services/api';
import { useAuthStore, useUserStore } from '../../store';
import { AxiosError } from 'axios';
import { APIErrorResponse } from '../../types/api';

type VerifyCodeScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'VerifyCode'
>;

type VerifyCodeScreenRouteProp = RouteProp<AuthStackParamList, 'VerifyCode'>;

export const VerifyCodeScreen: React.FC = () => {
  const navigation = useNavigation<VerifyCodeScreenNavigationProp>();
  const route = useRoute<VerifyCodeScreenRouteProp>();
  const { email, phone } = route.params;

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const { setTokensOnly, setAuthenticated } = useAuthStore();
  const { setUser } = useUserStore();

  // Auto-send OTP when screen loads (for login flow)
  React.useEffect(() => {
    const sendInitialOTP = async () => {
      if (!otpSent) {
        try {
          console.log('📱 Auto-sending OTP to:', phone);
          const response = await authApi.resendOtp({ phone });
          setOtpSent(true);
          console.log('✅ OTP sent successfully:', response.message);
        } catch (err) {
          console.error('❌ Failed to send OTP:', err);
          // Don't show error - user can still click resend manually
        }
      }
    };
    
    sendInitialOTP();
  }, [phone, otpSent]);

  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) {
      // Handle paste
      const pastedCode = text.slice(0, 6).split('');
      const newCode = [...code];
      pastedCode.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char;
        }
      });
      setCode(newCode);
      
      // Focus the last filled input or the next empty one
      const nextIndex = Math.min(index + pastedCode.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    setError('');
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');

    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    try {
      console.log('📱 Verifying phone with OTP:', verificationCode);
      console.log('📱 Phone number:', phone);
      
      // Step 1: Verify phone with OTP - gets NEW tokens
      const response = await authApi.verifyPhone({
        otp: verificationCode,
        phone,
      });

      console.log('✅ Phone verified successfully! Token received:', 
        response.access_token ? 'YES' : 'NO'
      );

      // Step 2: Store NEW tokens from verification response
      console.log('💾 Saving tokens to storage...');
      await setTokensOnly(response.access_token, response.refresh_token);
      
      // Wait a moment to ensure tokens are saved to AsyncStorage
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('✅ Tokens saved successfully');

      // Step 3: Fetch updated user profile with the new tokens
      console.log('👤 Fetching user profile with new tokens...');
      const userProfile = await userApi.getCurrentUser();
      await setUser(userProfile);

      console.log('📱 Phone verification complete. User profile updated:', {
        phone_verified: userProfile.phone_verified,
        profile_completed: userProfile.profile_completed,
        kyc_status: userProfile.kyc_status,
      });

      // Step 4: Set authenticated - phone is now verified
      // RootNavigator will handle routing to ProfileCompletion/KYC/etc based on user state
      setAuthenticated(true);

      console.log('🔐 User authenticated. RootNavigator will handle routing...');
      
      // Show success message
      Alert.alert(
        '✅ Phone Verified!',
        'Your phone has been verified successfully.',
        [{ text: 'Continue' }]
      );
    } catch (err) {
      console.error('❌ Verification failed:', err);
      
      // Clear any tokens that might have been set
      const { clearAuth } = useAuthStore.getState();
      await clearAuth();
      
      const axiosError = err as AxiosError<APIErrorResponse>;
      const errorMessage = 
        axiosError.response?.data?.message || 
        axiosError.response?.data?.error ||
        axiosError.response?.data?.detail ||
        'Invalid verification code. Please try again.';
      setError(errorMessage);
      Alert.alert('Verification Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      console.log('📱 Manually resending OTP to:', phone);
      const response = await authApi.resendOtp({ phone });
      setOtpSent(true);
      Alert.alert('Success', response.message || 'OTP resent successfully! Check your phone.');
      console.log('✅ OTP resent successfully');
    } catch (err) {
      console.error('❌ Resend OTP failed:', err);
      const axiosError = err as AxiosError<APIErrorResponse>;
      const errorMessage = 
        axiosError.response?.data?.message || 
        'Failed to resend code. Please try again.';
      Alert.alert('Error', errorMessage);
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
          <View style={[styles.square, styles.square4]} />
          <View style={[styles.square, styles.square5]} />
        </View>

        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>Verify Code</Text>
          <Text style={styles.brandName}>SISCOM CAPITALIZED</Text>

          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to {phone}
          </Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[styles.codeInput, error && styles.codeInputError]}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={({ nativeEvent: { key } }) =>
                  handleKeyPress(key, index)
                }
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={styles.resendContainer}
            onPress={handleResendCode}>
            <Text style={styles.resendText}>
              Change email or resend code
            </Text>
          </TouchableOpacity>

          <Button
            title={loading ? 'VERIFYING...' : 'VERIFY & LOG IN'}
            onPress={handleVerify}
            loading={loading}
            fullWidth
            style={styles.button}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.createAccountText}>Create account</Text>
            </TouchableOpacity>
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
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 200,
    height: 300,
  },
  square: {
    position: 'absolute',
    backgroundColor: colors.accent,
    opacity: 0.6,
  },
  square1: {
    width: 40,
    height: 40,
    top: 10,
    right: 20,
  },
  square2: {
    width: 30,
    height: 30,
    top: 60,
    right: 70,
  },
  square3: {
    width: 35,
    height: 35,
    top: 100,
    right: 120,
  },
  square4: {
    width: 25,
    height: 25,
    top: 150,
    right: 40,
  },
  square5: {
    width: 45,
    height: 45,
    top: 200,
    right: 90,
  },
  backButton: {
    padding: spacing.lg,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: typography.fontSize.xxxl,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  brandName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.black,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  codeInput: {
    width: 50,
    height: 60,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray300,
    backgroundColor: colors.gray100,
    textAlign: 'center',
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  codeInputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  resendContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  resendText: {
    fontSize: typography.fontSize.base,
    color: colors.accent,
    fontWeight: typography.fontWeight.semibold,
    textDecorationLine: 'underline',
  },
  button: {
    marginTop: spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  createAccountText: {
    fontSize: typography.fontSize.base,
    color: colors.accent,
    fontWeight: typography.fontWeight.semibold,
  },
});

