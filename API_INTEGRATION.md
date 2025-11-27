# API Integration Documentation

This document outlines the complete API integration for the SISCOM Capitalized mobile application.

## Overview

The application is integrated with the production API at `https://siscom.africa/api/v1` with full authentication, user management, and KYC functionality.

## Architecture

### State Management
- **Zustand** stores for global state management
  - `authStore`: Authentication state and token management
  - `userStore`: User profile data
  - `kycStore`: KYC submission status and documents

### API Client
- **Axios** instance with interceptors for:
  - Automatic token injection in request headers
  - Global error handling
  - Token expiration management

### Token Storage
- **AsyncStorage** for persistent token and user data storage
- Automatic token loading on app initialization

## API Endpoints

### Authentication

#### 1. Register User
**Endpoint:** `POST /register`

**Request:**
```json
{
  "email": "john.doe@example.com",
  "full_name": "John Doe",
  "password": "securepassword123",
  "phone": "+254712345678"
}
```

**Response (201):**
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "phone": "+254712345678",
  "message": "Registration successful. OTP sent to your phone.",
  "otp_sent": true
}
```

**Screen:** `RegistrationScreen.tsx`

#### 2. Verify Phone
**Endpoint:** `POST /verify-phone`

**Request:**
```json
{
  "otp": "123456",
  "phone": "+254712345678"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Phone verified successfully",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Screen:** `VerifyCodeScreen.tsx`

#### 3. Resend OTP
**Endpoint:** `POST /resend-otp`

**Request:**
```json
{
  "phone": "+254712345678"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

**Screen:** `VerifyCodeScreen.tsx`

#### 4. Login
**Endpoint:** `POST /login`

**Request:**
```json
{
  "identifier": "john.doe@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "phone": "+254712345678",
    "phone_verified": true,
    "can_invest": false
  }
}
```

**Screen:** `LoginScreen.tsx`

### User Profile

#### 5. Get Current User
**Endpoint:** `GET /me`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+254712345678",
  "phone_verified": true,
  "profile_completed": true,
  "kyc_status": "approved",
  "can_invest": true
}
```

**Screen:** `ProfileScreen.tsx`, used after login/verification

#### 6. Update Profile
**Endpoint:** `PUT /profile`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "address": "123 Main Street, Westlands",
  "city": "Nairobi",
  "country": "Kenya",
  "date_of_birth": "1990-01-01T00:00:00Z"
}
```

**Response (200):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "full_name": "John Doe",
  "date_of_birth": "1990-01-01T00:00:00Z",
  "country": "Kenya",
  "city": "Nairobi",
  "address": "123 Main Street",
  "profile_completed": true
}
```

**Screen:** `ProfileScreen.tsx`

### KYC (Know Your Customer)

#### 7. Get Upload URLs
**Endpoint:** `POST /kyc/upload-urls`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "id_front": {
    "upload_url": "https://siscombucket.s3.eu-north-1.amazonaws.com/kyc/user-id/id_front_1234567890.jpg?X-Amz-Algorithm=...",
    "s3_url": "https://siscombucket.s3.eu-north-1.amazonaws.com/kyc/user-id/id_front_1234567890.jpg"
  },
  "id_back": {
    "upload_url": "https://siscombucket.s3.eu-north-1.amazonaws.com/kyc/user-id/id_back_1234567890.jpg?X-Amz-Algorithm=...",
    "s3_url": "https://siscombucket.s3.eu-north-1.amazonaws.com/kyc/user-id/id_back_1234567890.jpg"
  },
  "selfie": {
    "upload_url": "https://siscombucket.s3.eu-north-1.amazonaws.com/kyc/user-id/selfie_1234567890.jpg?X-Amz-Algorithm=...",
    "s3_url": "https://siscombucket.s3.eu-north-1.amazonaws.com/kyc/user-id/selfie_1234567890.jpg"
  },
  "expires_in": 3600
}
```

**Screen:** `KYCScreen.tsx`

#### 8. Submit KYC
**Endpoint:** `POST /kyc/submit`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "id_back_url": "https://siscombucket.s3.eu-north-1.amazonaws.com/kyc/user-id/id_back_1234567890.jpg",
  "id_front_url": "https://siscombucket.s3.eu-north-1.amazonaws.com/kyc/user-id/id_front_1234567890.jpg",
  "id_number": "12345678",
  "id_type": "national_id",
  "selfie_url": "https://siscombucket.s3.eu-north-1.amazonaws.com/kyc/user-id/selfie_1234567890.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "KYC submitted successfully. Your documents are under review.",
  "kyc_status": "pending"
}
```

**Screen:** `KYCScreen.tsx`

#### 9. Get KYC Status
**Endpoint:** `GET /kyc-status`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "status": "approved",
  "submitted_at": "2024-01-02T12:00:00Z",
  "reviewed_at": "2024-01-03T12:00:00Z",
  "can_invest": true
}
```

**Screen:** `ProfileScreen.tsx`

## File Structure

```
src/
├── config/
│   └── api.ts              # Axios instance and token management
├── types/
│   └── api.ts              # TypeScript types for API requests/responses
├── store/
│   ├── authStore.ts        # Authentication state
│   ├── userStore.ts        # User profile state
│   ├── kycStore.ts         # KYC state
│   └── index.ts            # Store exports
├── services/
│   └── api/
│       ├── authApi.ts      # Authentication API calls
│       ├── userApi.ts      # User profile API calls
│       ├── kycApi.ts       # KYC API calls
│       └── index.ts        # API exports
└── screens/
    ├── auth/
    │   ├── LoginScreen.tsx
    │   ├── RegistrationScreen.tsx
    │   └── VerifyCodeScreen.tsx
    ├── kyc/
    │   └── KYCScreen.tsx
    └── profile/
        └── ProfileScreen.tsx
```

## Usage Examples

### Making an Authenticated Request

```typescript
import { userApi } from '../services/api';
import { useUserStore } from '../store';

const MyComponent = () => {
  const { setUser } = useUserStore();

  const loadProfile = async () => {
    try {
      const userProfile = await userApi.getCurrentUser();
      await setUser(userProfile);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };
};
```

### Handling Authentication Flow

```typescript
import { authApi } from '../services/api';
import { useAuthStore, useUserStore } from '../store';

const login = async (identifier: string, password: string) => {
  const { setTokens } = useAuthStore();
  const { setUser } = useUserStore();

  try {
    // Login
    const response = await authApi.login({ identifier, password });
    
    // Store tokens
    await setTokens(response.access_token, response.refresh_token);
    
    // Fetch user profile
    const userProfile = await userApi.getCurrentUser();
    await setUser(userProfile);
    
    // Navigate based on user state
    if (!userProfile.phone_verified) {
      // Go to verification
    } else if (userProfile.kyc_status === 'not_submitted') {
      // Go to KYC
    } else {
      // Go to main app
    }
  } catch (error) {
    // Handle error
  }
};
```

### KYC Document Upload Flow

```typescript
import { kycApi } from '../services/api';

const submitKYC = async (idFront: File, idBack: File, selfie: File) => {
  try {
    // Step 1: Get presigned URLs
    const uploadUrls = await kycApi.getUploadUrls();
    
    // Step 2: Upload files to S3
    await Promise.all([
      kycApi.uploadFileToS3(uploadUrls.id_front.upload_url, idFront, 'image/jpeg'),
      kycApi.uploadFileToS3(uploadUrls.id_back.upload_url, idBack, 'image/jpeg'),
      kycApi.uploadFileToS3(uploadUrls.selfie.upload_url, selfie, 'image/jpeg'),
    ]);
    
    // Step 3: Submit KYC
    const response = await kycApi.submitKYC({
      id_front_url: uploadUrls.id_front.s3_url,
      id_back_url: uploadUrls.id_back.s3_url,
      selfie_url: uploadUrls.selfie.s3_url,
      id_number: '12345678',
      id_type: 'national_id',
    });
    
    console.log('KYC submitted:', response);
  } catch (error) {
    console.error('KYC submission failed:', error);
  }
};
```

## Error Handling

All API calls include comprehensive error handling:

```typescript
try {
  const response = await authApi.login({ identifier, password });
  // Success handling
} catch (error) {
  const axiosError = error as AxiosError<APIErrorResponse>;
  const errorMessage = 
    axiosError.response?.data?.message || 
    axiosError.response?.data?.error ||
    axiosError.response?.data?.detail ||
    'An error occurred';
  Alert.alert('Error', errorMessage);
}
```

## Security Features

1. **Token Management**
   - Tokens stored securely in AsyncStorage
   - Automatic token injection in API requests
   - Token expiration handling

2. **Request Interceptors**
   - Automatic Authorization header addition
   - Error response handling
   - Retry logic for failed requests

3. **Data Validation**
   - Phone number validation
   - Email validation
   - Required field validation

## Testing

To test the API integration:

1. **Registration Flow**
   - Register a new user
   - Verify OTP code
   - Complete profile
   - Submit KYC

2. **Login Flow**
   - Login with email/phone and password
   - Auto-navigate based on user state

3. **Profile Management**
   - View profile information
   - Update profile details
   - Check KYC status

## Dependencies

- `axios`: HTTP client
- `zustand`: State management
- `@react-native-async-storage/async-storage`: Token persistence
- `react-native-image-picker`: Document upload

## Environment Variables

Update the API base URL in `src/config/api.ts`:

```typescript
export const API_BASE_URL = 'https://siscom.africa/api/v1';
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check if tokens are stored correctly
   - Verify token hasn't expired
   - Re-login if necessary

2. **Network Errors**
   - Check internet connection
   - Verify API base URL is correct
   - Check server status

3. **Image Upload Failures**
   - Verify file size is within limits
   - Check file format (JPEG, PNG)
   - Ensure upload URLs haven't expired

## Production Checklist

- ✅ API base URL configured
- ✅ Token management implemented
- ✅ Error handling on all API calls
- ✅ Loading states on all screens
- ✅ Form validation
- ✅ Secure token storage
- ✅ Auto-refresh on token expiration
- ✅ User state persistence
- ✅ Image upload with S3 presigned URLs
- ✅ Logout functionality

## Support

For API issues, contact the backend team or check the API documentation at `https://siscom.africa/api/v1/docs`.

