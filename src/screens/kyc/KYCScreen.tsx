import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../types';
import { Button, Input } from '../../components/common';
import { colors, spacing, typography } from '../../theme';

type KYCScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'KYC'
>;

export const KYCScreen: React.FC = () => {
  const navigation = useNavigation<KYCScreenNavigationProp>();
  const [idNumber, setIdNumber] = useState('');
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUploadIDPhoto = () => {
    // TODO: Implement image picker for ID photo
    Alert.alert('Upload ID Photo', 'Image picker will be implemented');
    setIdPhoto('mock-id-photo-uri');
  };

  const handleTakeSelfie = () => {
    // TODO: Implement camera for selfie
    Alert.alert('Take Selfie', 'Camera will be implemented');
    setSelfiePhoto('mock-selfie-uri');
  };

  const handleSubmitKYC = async () => {
    if (!idNumber.trim()) {
      Alert.alert('Error', 'Please enter your ID number');
      return;
    }

    if (!idPhoto) {
      Alert.alert('Error', 'Please upload your ID photo');
      return;
    }

    if (!selfiePhoto) {
      Alert.alert('Error', 'Please take a selfie');
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API POST /api/users/kyc
      // Mock delay for KYC submission
      await new Promise<void>(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      Alert.alert(
        'KYC Submitted',
        'Your documents are under review. This may take up to 24 hours.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to subscription screen
              navigation.getParent()?.navigate('Subscription' as never);
            },
          },
        ]
      );
    } catch (error) {
      console.error('KYC submission failed:', error);
      Alert.alert('Error', 'Failed to submit KYC. Please try again.');
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
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Complete Your KYC</Text>
          <Text style={styles.subtitle}>
            We need to verify your identity to comply with regulations
          </Text>

          <View style={styles.form}>
            <Input
              label="ID Number"
              value={idNumber}
              onChangeText={setIdNumber}
              placeholder="Enter your National ID number"
              keyboardType="number-pad"
            />

            {/* ID Photo Upload */}
            <View style={styles.uploadSection}>
              <Text style={styles.uploadLabel}>ID Photo</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleUploadIDPhoto}>
                {idPhoto ? (
                  <View style={styles.uploadedContainer}>
                    <View style={styles.mockImage}>
                      <Text style={styles.mockImageText}>✓ ID Uploaded</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Text style={styles.uploadIcon}>📷</Text>
                    <Text style={styles.uploadText}>Upload ID Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Selfie */}
            <View style={styles.uploadSection}>
              <Text style={styles.uploadLabel}>Selfie</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleTakeSelfie}>
                {selfiePhoto ? (
                  <View style={styles.uploadedContainer}>
                    <View style={styles.mockImage}>
                      <Text style={styles.mockImageText}>✓ Selfie Taken</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Text style={styles.uploadIcon}>🤳</Text>
                    <Text style={styles.uploadText}>Take Selfie</Text>
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.uploadHint}>
                Make sure your face is clearly visible
              </Text>
            </View>

            <Button
              title="Submit KYC"
              onPress={handleSubmitKYC}
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
  progressContainer: {
    marginBottom: spacing.xl,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.gray200,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    width: '33%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  content: {
    flex: 1,
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
    gap: spacing.xl,
  },
  uploadSection: {
    gap: spacing.sm,
  },
  uploadLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray900,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: colors.gray300,
    borderRadius: 12,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    padding: spacing.xl * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  uploadText: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
    fontWeight: typography.fontWeight.medium,
  },
  uploadedContainer: {
    padding: spacing.lg,
  },
  mockImage: {
    height: 120,
    backgroundColor: colors.accent,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockImageText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  uploadHint: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
    fontStyle: 'italic',
  },
  submitButton: {
    marginTop: spacing.lg,
  },
});

