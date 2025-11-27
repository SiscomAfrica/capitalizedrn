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
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import { RootStackParamList } from '../../types';
import { Button, Input } from '../../components/common';
import { colors, spacing, typography } from '../../theme';
import { kycApi } from '../../services/api';
import { useKYCStore, useUserStore } from '../../store';
import { AxiosError } from 'axios';
import { APIErrorResponse } from '../../types/api';

type KYCScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'KYC'
>;

interface UploadedImage {
  uri: string;
  fileName: string;
  type: string;
  fileSize?: number;
}

export const KYCScreen: React.FC = () => {
  const navigation = useNavigation<KYCScreenNavigationProp>();
  const [idNumber, setIdNumber] = useState('');
  const [idType, setIdType] = useState<'national_id' | 'passport' | 'drivers_license'>('national_id');
  const [idFrontPhoto, setIdFrontPhoto] = useState<UploadedImage | null>(null);
  const [idBackPhoto, setIdBackPhoto] = useState<UploadedImage | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<UploadedImage | null>(null);
  const [loading, setLoading] = useState(false);

  const { setSubmitting, setError: setKYCError } = useKYCStore();
  const { updateUser } = useUserStore();

  const selectImage = (callback: (image: UploadedImage) => void, useCamera: boolean = false) => {
    const options = {
      mediaType: 'photo' as const,
      quality: 0.8 as const,
      maxWidth: 1920,
      maxHeight: 1920,
    };

    const handleResponse = (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to pick image');
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        callback({
          uri: asset.uri || '',
          fileName: asset.fileName || `image_${Date.now()}.jpg`,
          type: asset.type || 'image/jpeg',
          fileSize: asset.fileSize,
        });
      }
    };

    if (useCamera) {
      launchCamera(options, handleResponse);
    } else {
      launchImageLibrary(options, handleResponse);
    }
  };

  const handleUploadIDFront = () => {
    Alert.alert(
      'ID Front Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: () => selectImage(setIdFrontPhoto, true) },
        { text: 'Choose from Gallery', onPress: () => selectImage(setIdFrontPhoto, false) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleUploadIDBack = () => {
    Alert.alert(
      'ID Back Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: () => selectImage(setIdBackPhoto, true) },
        { text: 'Choose from Gallery', onPress: () => selectImage(setIdBackPhoto, false) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleTakeSelfie = () => {
    Alert.alert(
      'Selfie',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: () => selectImage(setSelfiePhoto, true) },
        { text: 'Choose from Gallery', onPress: () => selectImage(setSelfiePhoto, false) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const uploadImageToS3 = async (imageData: UploadedImage, uploadUrl: string): Promise<void> => {
    try {
      console.log('📤 Uploading image to S3:', imageData.fileName);
      console.log('📤 Image URI:', imageData.uri);
      
      // Use kycApi.uploadFileToS3 which handles React Native file reading
      await kycApi.uploadFileToS3(uploadUrl, imageData.uri, imageData.type);
      
      console.log('✅ Image uploaded to S3 successfully');
    } catch (error) {
      console.error('❌ Error uploading to S3:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmitKYC = async () => {
    // Validation
    if (!idNumber.trim()) {
      Alert.alert('Error', 'Please enter your ID number');
      return;
    }

    if (!idFrontPhoto) {
      Alert.alert('Error', 'Please upload the front of your ID');
      return;
    }

    if (!idBackPhoto) {
      Alert.alert('Error', 'Please upload the back of your ID');
      return;
    }

    if (!selfiePhoto) {
      Alert.alert('Error', 'Please take a selfie');
      return;
    }

    setLoading(true);
    setSubmitting(true);
    
    try {
      // Step 1: Get presigned upload URLs
      const uploadUrls = await kycApi.getUploadUrls();

      // Step 2: Upload images to S3
      await Promise.all([
        uploadImageToS3(idFrontPhoto, uploadUrls.id_front.upload_url),
        uploadImageToS3(idBackPhoto, uploadUrls.id_back.upload_url),
        uploadImageToS3(selfiePhoto, uploadUrls.selfie.upload_url),
      ]);

      // Step 3: Submit KYC with S3 URLs
      const submitResponse = await kycApi.submitKYC({
        id_front_url: uploadUrls.id_front.s3_url,
        id_back_url: uploadUrls.id_back.s3_url,
        selfie_url: uploadUrls.selfie.s3_url,
        id_number: idNumber.trim(),
        id_type: idType,
      });

      // Update user KYC status (should be "pending" after submission)
      updateUser({ kyc_status: submitResponse.kyc_status });

      // Show success message and navigate to Main Tabs
      // According to Sequence Diagram: Phase 2 complete, KYC is pending review
      Alert.alert(
        '✅ KYC Submitted Successfully!',
        submitResponse.message || 'Your documents are under review. This may take up to 24 hours. You can explore the app while waiting.',
        [
          {
            text: 'Continue',
            onPress: () => {
              // Navigate to MainTabs - user can browse but can't invest until KYC approved
              console.log('📋 Phase 2 complete: KYC submitted, navigating to app...');
              navigation.replace('MainTabs');
            },
          },
        ]
      );
    } catch (error) {
      console.error('KYC submission failed:', error);
      const axiosError = error as AxiosError<APIErrorResponse>;
      const errorMessage = 
        axiosError.response?.data?.message || 
        axiosError.response?.data?.error ||
        'Failed to submit KYC. Please try again.';
      Alert.alert('Error', errorMessage);
      setKYCError(errorMessage);
    } finally {
      setLoading(false);
      setSubmitting(false);
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

            {/* ID Front Photo Upload */}
            <View style={styles.uploadSection}>
              <Text style={styles.uploadLabel}>ID Front Photo</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleUploadIDFront}>
                {idFrontPhoto ? (
                  <View style={styles.uploadedContainer}>
                    <View style={styles.mockImage}>
                      <Text style={styles.mockImageText}>✓ ID Front Uploaded</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Text style={styles.uploadIcon}>📷</Text>
                    <Text style={styles.uploadText}>Upload ID Front Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.uploadHint}>
                Clear photo of the front of your ID
              </Text>
            </View>

            {/* ID Back Photo Upload */}
            <View style={styles.uploadSection}>
              <Text style={styles.uploadLabel}>ID Back Photo</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleUploadIDBack}>
                {idBackPhoto ? (
                  <View style={styles.uploadedContainer}>
                    <View style={styles.mockImage}>
                      <Text style={styles.mockImageText}>✓ ID Back Uploaded</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Text style={styles.uploadIcon}>📷</Text>
                    <Text style={styles.uploadText}>Upload ID Back Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.uploadHint}>
                Clear photo of the back of your ID
              </Text>
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

