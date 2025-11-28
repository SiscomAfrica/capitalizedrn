import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
export const API_BASE_URL = 'https://siscom.africa/api/v1';

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@capitalized_access_token',
  REFRESH_TOKEN: '@capitalized_refresh_token',
  USER_DATA: '@capitalized_user_data',
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      console.log('🔍 Checking for access token...');
      console.log('🔍 Storage key:', STORAGE_KEYS.ACCESS_TOKEN);
      
      // Try to get all keys to verify storage is working
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('📦 All AsyncStorage keys:', allKeys);
      
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      
      console.log('🔍 Token retrieval result:', token ? 'FOUND' : 'NOT FOUND');
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Token found and added to request');
        console.log('🔑 Full token:', token);
        console.log('🔑 Token length:', token.length);
        console.log('🔑 Authorization header:', config.headers.Authorization);
      } else if (!token) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️ NO TOKEN FOUND IN STORAGE!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔍 Storage key checked:', STORAGE_KEYS.ACCESS_TOKEN);
        console.log('🔍 All available keys:', allKeys);
        console.log('⚠️ This request will be UNAUTHENTICATED');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      } else if (!config.headers) {
        console.log('⚠️ Config headers are undefined!');
      }
      
      // Debug logging
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
        authHeader: config.headers?.Authorization ? 'Present' : 'Missing',
      });
      
      return config;
    } catch (error) {
      console.error('❌ Error in request interceptor:', error);
      return config;
    }
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Debug logging for successful responses
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  async (error: AxiosError) => {
    // Enhanced error logging
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    
    if (error.response?.status === 401) {
      // Token expired, try to refresh or logout
      await handleTokenExpiration();
    }
    return Promise.reject(error);
  }
);

// Handle token expiration
const handleTokenExpiration = async () => {
  try {
    // Clear tokens and user data
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
    // Navigate to login screen (handled by auth store)
  } catch (error) {
    console.error('Error handling token expiration:', error);
  }
};

// Token management functions
export const tokenManager = {
  getAccessToken: async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      console.log('📥 tokenManager.getAccessToken called');
      console.log('   Result:', token ? `Token found (${token.length} chars)` : 'No token');
      return token;
    } catch (error) {
      console.error('❌ Error getting access token:', error);
      return null;
    }
  },

  setAccessToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      console.log('✅ Access token stored successfully');
    } catch (error) {
      console.error('❌ Error setting access token:', error);
      throw error;
    }
  },

  getRefreshToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setRefreshToken: async (token: string): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  setTokens: async (accessToken: string, refreshToken: string): Promise<void> => {
    try {
      console.log('💾 tokenManager.setTokens called');
      console.log('   Access token length:', accessToken.length);
      console.log('   Refresh token length:', refreshToken.length);
      
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
      ]);
      
      console.log('✅ Tokens stored successfully');
      
      // Verify tokens were stored
      const verifyAccess = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const verifyRefresh = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      console.log('✅ Verification - Access token:', verifyAccess ? 'PRESENT' : 'MISSING');
      console.log('✅ Verification - Refresh token:', verifyRefresh ? 'PRESENT' : 'MISSING');
    } catch (error) {
      console.error('❌ Error setting tokens:', error);
      throw error;
    }
  },

  clearTokens: async (): Promise<void> => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
    ]);
  },

  clearAll: async (): Promise<void> => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
  },

  // Helper to verify token exists
  verifyToken: async (): Promise<boolean> => {
    try {
      console.log('🔍 Verifying token presence...');
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const exists = !!token;
      console.log('🔍 Token verification result:', exists ? '✅ EXISTS' : '❌ MISSING');
      return exists;
    } catch (error) {
      console.error('❌ Error verifying token:', error);
      return false;
    }
  },
};

export default apiClient;

