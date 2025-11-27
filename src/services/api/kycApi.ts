import apiClient from '../../config/api';
import axios from 'axios';
import RNFS from 'react-native-fs';
import {
  KYCUploadURLsResponse,
  SubmitKYCRequest,
  KYCSubmitResponse,
  KYCStatusResponse,
} from '../../types/api';

export const kycApi = {
  /**
   * Get presigned URLs for document upload
   * POST /auth/kyc/upload-urls
   */
  getUploadUrls: async (): Promise<KYCUploadURLsResponse> => {
    const response = await apiClient.post<KYCUploadURLsResponse>('/auth/kyc/upload-urls');
    return response.data;
  },

  /**
   * Upload file to S3 using presigned URL
   * @param uploadUrl - Presigned S3 upload URL
   * @param fileUri - File URI (React Native compatible)
   * @param contentType - MIME type of the file
   */
  uploadFileToS3: async (
    uploadUrl: string,
    fileUri: string,
    contentType: string = 'image/jpeg'
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        console.log('📤 Reading file from:', fileUri);
        
        // Convert file:// URI to file path for react-native-fs
        const filePath = fileUri.startsWith('file://') ? fileUri.replace('file://', '') : fileUri;
        
        // Read file as base64 using react-native-fs
        RNFS.readFile(filePath, 'base64')
          .then((base64Data) => {
            console.log('✅ File read successfully, size:', base64Data.length, 'chars');
            
            // Parse presigned URL to extract required headers
            const urlMatch = uploadUrl.match(/X-Amz-SignedHeaders=([^&]+)/);
            const signedHeaders = urlMatch ? decodeURIComponent(urlMatch[1]).split(';') : [];
            
            console.log('📋 Signed headers from URL:', signedHeaders);
            console.log('📤 Uploading to S3:', uploadUrl.substring(0, 120) + '...');
            
            // Convert base64 to binary for upload
            const binaryString = base64ToBinaryString(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            
            // Build headers object - ONLY include headers that are in the signature
            const headers: Record<string, string> = {};
            
            // Content-Type is in the signed headers
            if (signedHeaders.includes('content-type')) {
              headers['Content-Type'] = contentType;
            }
            
            // Check if x-amz-server-side-encryption is in signed headers
            // If it is, we need to determine its value from the backend
            // For now, try without it to see if that's the issue
            if (signedHeaders.includes('x-amz-server-side-encryption')) {
              // The presigned URL expects this header but we don't know the value
              // Common values: 'AES256' or 'aws:kms'
              // Try AES256 as it's the most common
              headers['x-amz-server-side-encryption'] = 'AES256';
              console.log('🔐 Added x-amz-server-side-encryption header: AES256');
            }
            
            console.log('📋 Request headers:', headers);
            
            // Use axios for S3 upload - better header control
            axios.put(uploadUrl, bytes, {
              headers,
              timeout: 60000,
              maxContentLength: Infinity,
              maxBodyLength: Infinity,
              // Don't transform the request - send raw binary
              transformRequest: [],
            })
            .then((response) => {
              console.log('✅ S3 upload successful:', response.status);
              resolve();
            })
            .catch((error) => {
              console.error('❌ S3 upload failed:', error.response?.status || error.message);
              if (error.response?.data) {
                console.error('❌ Error details:', String(error.response.data).substring(0, 500));
              }
              reject(new Error(`S3 upload failed: ${error.response?.status || error.message}`));
            });
          })
          .catch((error) => {
            console.error('❌ Error reading file:', error);
            reject(new Error(`Failed to read file: ${error.message}`));
          });
      } catch (error: any) {
        console.error('❌ S3 upload error:', error);
        reject(new Error(`Failed to upload to S3: ${error.message}`));
      }
    });
  },

  /**
   * Submit KYC documents for review
   * POST /auth/kyc/submit
   */
  submitKYC: async (data: SubmitKYCRequest): Promise<KYCSubmitResponse> => {
    const response = await apiClient.post<KYCSubmitResponse>('/auth/kyc/submit', data);
    return response.data;
  },

  /**
   * Get KYC status
   * GET /auth/kyc-status
   */
  getKYCStatus: async (): Promise<KYCStatusResponse> => {
    const response = await apiClient.get<KYCStatusResponse>('/auth/kyc-status');
    return response.data;
  },
};

// Helper function to convert base64 to binary string (React Native compatible)
function base64ToBinaryString(base64: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  
  base64 = base64.replace(/[^A-Za-z0-9\+\/\=]/g, '');
  
  for (let i = 0; i < base64.length; i += 4) {
    const enc1 = chars.indexOf(base64.charAt(i));
    const enc2 = chars.indexOf(base64.charAt(i + 1));
    const enc3 = chars.indexOf(base64.charAt(i + 2));
    const enc4 = chars.indexOf(base64.charAt(i + 3));
    
    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;
    
    output += String.fromCharCode(chr1);
    
    if (enc3 !== 64) {
      output += String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      output += String.fromCharCode(chr3);
    }
  }
  
  return output;
}

