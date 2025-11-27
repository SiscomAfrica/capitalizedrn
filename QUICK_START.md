# Quick Start Guide - SISCOM Capitalized API Integration

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. iOS Setup (Mac only)
```bash
cd ios && pod install && cd ..
```

### 3. Run the App
```bash
# Android
npm run android

# iOS
npm run ios
```

## 📱 Test the App

### Quick Test Flow

1. **Start App** → Opens to Login Screen
2. **Click "Sign Up"** → Registration Screen
3. **Fill Form:**
   - Name: Test User
   - Email: test@example.com
   - Phone: +254712345678
   - Password: test1234
4. **Submit** → OTP Verification Screen
5. **Enter OTP:** 123456 (any 6-digit code)
6. **Verify** → Redirects to KYC Screen
7. **Upload Documents:**
   - ID Front
   - ID Back
   - Selfie
8. **Submit KYC** → Main App

### API Endpoints in Use

```
Production API: https://siscom.africa/api/v1

✅ POST   /register          - User registration
✅ POST   /verify-phone      - OTP verification
✅ POST   /resend-otp        - Resend OTP
✅ POST   /login             - User login
✅ GET    /me                - Get user profile
✅ PUT    /profile           - Update profile
✅ POST   /kyc/upload-urls   - Get upload URLs
✅ POST   /kyc/submit        - Submit KYC
✅ GET    /kyc-status        - Get KYC status
```

## 🗂️ Key Files

### Configuration
- `src/config/api.ts` - API client setup

### Stores (State Management)
- `src/store/authStore.ts` - Auth state
- `src/store/userStore.ts` - User data
- `src/store/kycStore.ts` - KYC state

### API Services
- `src/services/api/authApi.ts` - Auth APIs
- `src/services/api/userApi.ts` - User APIs
- `src/services/api/kycApi.ts` - KYC APIs

### Screens
- `src/screens/auth/LoginScreen.tsx`
- `src/screens/auth/RegistrationScreen.tsx`
- `src/screens/auth/VerifyCodeScreen.tsx`
- `src/screens/kyc/KYCScreen.tsx`
- `src/screens/profile/ProfileScreen.tsx`

## 🔍 Quick Debugging

### Check Auth State
```typescript
import { useAuthStore } from './src/store';

const { isAuthenticated, accessToken } = useAuthStore();
console.log('Authenticated:', isAuthenticated);
console.log('Token:', accessToken);
```

### Check User Data
```typescript
import { useUserStore } from './src/store';

const { user } = useUserStore();
console.log('User:', user);
```

### View API Logs
All API requests/responses are logged to console:
- Enable React Native debugger
- Or use `npx react-native log-android` / `npx react-native log-ios`

## ⚡ Common Commands

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run Android
npm run android

# Run iOS
npm run ios

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Clean build (if issues)
cd android && ./gradlew clean && cd ..
```

## 🐛 Quick Fixes

### "Network Error"
- Check internet connection
- Verify API URL: `https://siscom.africa/api/v1`

### "401 Unauthorized"
- Tokens expired → Logout and login again
- Check token in AsyncStorage

### "Image Upload Failed"
- Check camera/gallery permissions
- File size < 10MB
- Upload URLs expire in 1 hour

### App Won't Build
```bash
# Clear cache
npx react-native start --reset-cache

# Clean Android
cd android && ./gradlew clean && cd ..

# Clean iOS
cd ios && rm -rf Pods && pod install && cd ..
```

## 📚 Documentation

- **API Details:** `API_INTEGRATION.md`
- **Setup Guide:** `API_SETUP_INSTRUCTIONS.md`
- **Summary:** `INTEGRATION_SUMMARY.md`

## ✅ Production Checklist

- [x] API integrated and tested
- [x] Token management working
- [x] Error handling implemented
- [x] Loading states added
- [x] Form validation active
- [x] Navigation flows correct
- [x] State persistence working
- [x] Image uploads functional

## 🎯 Key Features Working

- ✅ User Registration
- ✅ Phone Verification (OTP)
- ✅ User Login
- ✅ Profile Management
- ✅ KYC Document Upload
- ✅ Token Persistence
- ✅ Auto-Login
- ✅ Logout

## 📞 Need Help?

1. Check console logs
2. Review API documentation
3. Test with Postman/curl
4. Contact backend team

---

**Ready to deploy! 🚀**

