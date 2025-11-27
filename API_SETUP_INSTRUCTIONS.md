# API Integration Setup Instructions

This guide will help you set up and run the SISCOM Capitalized mobile application with full API integration.

## Prerequisites

- Node.js >= 20
- npm or yarn
- React Native development environment set up
- Android Studio (for Android) or Xcode (for iOS)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- `zustand` - State management
- `axios` - HTTP client
- `@react-native-async-storage/async-storage` - Token storage
- `react-native-image-picker` - Document uploads

### 2. iOS Setup (Mac only)

```bash
cd ios
pod install
cd ..
```

### 3. Android Setup

The Android configuration is already set up. Make sure you have Android SDK installed.

#### Configure Permissions

The following permissions are already added to `android/app/src/main/AndroidManifest.xml`:
- Internet access
- Camera access (for KYC selfies)
- Photo library access (for document uploads)

### 4. Link Native Modules

For React Native 0.60+, auto-linking should handle most native dependencies. However, for image picker, you may need to configure permissions:

#### iOS (ios/Podfile)
Already configured with:
```ruby
permissions_path = '../node_modules/react-native-permissions/ios'
pod 'Permission-Camera', :path => "#{permissions_path}/Camera"
pod 'Permission-PhotoLibrary', :path => "#{permissions_path}/PhotoLibrary"
```

#### Android (android/app/src/main/AndroidManifest.xml)
Add these permissions if not already present:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## Configuration

### API Base URL

The API base URL is configured in `src/config/api.ts`:

```typescript
export const API_BASE_URL = 'https://siscom.africa/api/v1';
```

To change this for different environments (development, staging, production), update this value.

### Environment-Specific Configuration (Optional)

For managing multiple environments, you can use `react-native-config`:

1. Install the package:
```bash
npm install react-native-config
```

2. Create `.env` files:
```
# .env.development
API_BASE_URL=http://localhost:8000/api/v1

# .env.production
API_BASE_URL=https://siscom.africa/api/v1
```

3. Update `src/config/api.ts`:
```typescript
import Config from 'react-native-config';

export const API_BASE_URL = Config.API_BASE_URL || 'https://siscom.africa/api/v1';
```

## Running the Application

### Start Metro Bundler

```bash
npm start
```

### Run on Android

```bash
npm run android
```

### Run on iOS

```bash
npm run ios
```

## Testing the Integration

### 1. Registration Flow

1. Open the app
2. Click "Sign Up" on the login screen
3. Fill in the registration form:
   - Full Name: Your Name
   - Email: your@email.com
   - Phone: +254712345678
   - Password: At least 8 characters
4. Click "Sign Up"
5. You should receive an OTP to your phone
6. Enter the 6-digit OTP
7. Click "Verify & Log In"

### 2. Login Flow

1. Open the app
2. Enter your email/phone and password
3. Click "Log In"
4. You should be logged in and redirected based on your profile status

### 3. Profile Management

1. Navigate to the Profile tab
2. View your account information and KYC status
3. Update your profile details:
   - Address
   - City
   - Country
   - Date of Birth
4. Click "Update Profile"

### 4. KYC Submission

1. After registration/login, navigate to the KYC screen
2. Enter your ID Number
3. Upload ID Front Photo (take photo or choose from gallery)
4. Upload ID Back Photo
5. Take a Selfie
6. Click "Submit KYC"
7. Wait for the documents to upload
8. You should see a success message

### 5. Checking KYC Status

1. Go to the Profile tab
2. Your KYC status will be displayed:
   - Not Submitted (gray)
   - Under Review (yellow)
   - Approved (green)
   - Rejected (red)

## API Endpoints Being Used

### Authentication
- `POST /register` - User registration
- `POST /verify-phone` - OTP verification
- `POST /resend-otp` - Resend OTP
- `POST /login` - User login

### User Profile
- `GET /me` - Get current user
- `PUT /profile` - Update profile

### KYC
- `POST /kyc/upload-urls` - Get presigned S3 URLs
- `POST /kyc/submit` - Submit KYC documents
- `GET /kyc-status` - Get KYC status

## Debugging

### Enable Debug Mode

1. In development, shake your device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
2. Enable "Debug JS Remotely"
3. Open Chrome DevTools to see console logs

### Check Network Requests

1. Install Reactotron (optional):
```bash
npm install --save-dev reactotron-react-native
```

2. Or use React Native Debugger for better network inspection

### Common Issues

#### 1. Network Request Failed

**Problem:** API calls failing with network error

**Solution:**
- Check your internet connection
- Verify the API base URL is correct
- For Android emulator, use `10.0.2.2` instead of `localhost`
- For iOS simulator, use your machine's IP address

#### 2. Token Expired / 401 Unauthorized

**Problem:** Getting 401 errors after some time

**Solution:**
- The app should automatically clear tokens and redirect to login
- If not, manually logout and login again

#### 3. Image Upload Failing

**Problem:** KYC document upload failing

**Solution:**
- Check camera and photo library permissions
- Verify file size is not too large (< 10MB)
- Ensure upload URLs haven't expired (1 hour expiry)

#### 4. AsyncStorage Errors

**Problem:** App crashing due to AsyncStorage

**Solution:**
- Clear app data
- For iOS: Reset simulator
- For Android: Clear app cache in Settings

## State Management

### Auth Store

Located in `src/store/authStore.ts`:
- Manages authentication tokens
- Handles login/logout state
- Persists tokens to AsyncStorage

### User Store

Located in `src/store/userStore.ts`:
- Manages user profile data
- Handles profile updates
- Persists user data to AsyncStorage

### KYC Store

Located in `src/store/kycStore.ts`:
- Manages KYC submission state
- Handles document upload URLs
- Tracks KYC status

## File Upload Flow

The KYC document upload follows this flow:

1. **Get Presigned URLs**
   - Call `POST /kyc/upload-urls`
   - Receive presigned S3 URLs for each document

2. **Upload to S3**
   - Use the presigned URLs to upload files directly to S3
   - No authentication needed (presigned URLs contain temporary credentials)

3. **Submit KYC**
   - Call `POST /kyc/submit` with the S3 URLs
   - Backend processes the documents

## Security Considerations

1. **Token Storage**
   - Tokens stored in AsyncStorage (secure on device)
   - Tokens cleared on logout
   - Auto-cleared on 401 errors

2. **API Communication**
   - All API calls use HTTPS
   - Tokens sent in Authorization header
   - No sensitive data in query parameters

3. **Image Upload**
   - Presigned URLs expire after 1 hour
   - Direct upload to S3 (no backend bottleneck)
   - Files stored in private S3 bucket

## Production Deployment

### Android

1. Generate a signed APK:
```bash
cd android
./gradlew assembleRelease
```

2. The APK will be in:
```
android/app/build/outputs/apk/release/app-release.apk
```

### iOS

1. Open Xcode:
```bash
open ios/capitalized.xcworkspace
```

2. Select your target device/simulator
3. Product > Archive
4. Follow App Store Connect upload process

## Monitoring and Analytics

Consider adding:
- Sentry for error tracking
- Firebase Analytics for usage metrics
- Crashlytics for crash reporting

## Support

For issues:
1. Check the logs in `src/config/api.ts` for API errors
2. Review `API_INTEGRATION.md` for API details
3. Contact the backend team for API-related issues

## Next Steps

1. ✅ Test all authentication flows
2. ✅ Test profile updates
3. ✅ Test KYC submission with real documents
4. ⏳ Add investments API integration
5. ⏳ Add portfolio API integration
6. ⏳ Add push notifications
7. ⏳ Add biometric authentication

## Version History

### Version 1.0.0 (Current)
- ✅ Complete authentication flow
- ✅ User profile management
- ✅ KYC submission with document upload
- ✅ Token management and persistence
- ✅ Error handling and validation
- ✅ Zustand state management

