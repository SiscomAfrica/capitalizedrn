# SISCOM Capitalized - Setup Guide

## Prerequisites
- Node.js >= 20
- npm or yarn
- React Native development environment set up
  - For iOS: Xcode, CocoaPods
  - For Android: Android Studio, Java JDK

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. iOS Setup (macOS only)
```bash
cd ios
pod install
cd ..
```

### 3. Run the Application

#### iOS
```bash
npm run ios
```

#### Android
```bash
npm run android
```

#### Start Metro Bundler
```bash
npm start
```

## Project Overview

This is a fully functional React Native investment platform with the following features:

### Authentication Flow
1. **Login Screen** - Email-based authentication
2. **Verify Code Screen** - 6-digit verification code entry
3. **Onboarding Screen** - User profile setup (KYC)

### Main Application
After authentication, users can access:

1. **Home Tab**
   - Featured investments carousel
   - Investment listings
   - Search and filter
   - Navigate to investment details

2. **Events Tab**
   - Upcoming events
   - Event details with sessions and speakers
   - Ticket booking

3. **Community Tab**
   - Networking features (placeholder)
   - Discussion forums
   - Investment insights

4. **Messages Tab**
   - Message inbox
   - Unread message indicators

5. **Transactions Tab**
   - Portfolio overview
   - Transaction history
   - Investment tracking

## Application Flow

```
┌─────────────┐
│   Launch    │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Login     │─────▶│ Verify Code  │─────▶│ Onboarding  │
└─────────────┘      └──────────────┘      └──────┬──────┘
                                                   │
                                                   ▼
                                          ┌─────────────────┐
                                          │   Main Tabs     │
                                          └─────────────────┘
                                                   │
                          ┌────────────────────────┼────────────────────────┐
                          ▼                        ▼                        ▼
                    ┌──────────┐           ┌──────────┐           ┌──────────┐
                    │   Home   │           │  Events  │           │ Messages │
                    └────┬─────┘           └────┬─────┘           └──────────┘
                         │                      │
                         ▼                      ▼
                  ┌────────────┐        ┌────────────┐
                  │ Investment │        │   Event    │
                  │  Details   │        │  Details   │
                  └────────────┘        └────────────┘
```

## Mock Data

The application uses mock services to simulate API calls:
- Authentication service
- Investment service  
- Event service

All data is hardcoded in `/src/services/mockData.ts` for demonstration purposes.

### Sample Credentials
Since this is a mock, any email will work. The verification code accepts any 6-digit code.

## UI Components

### Reusable Components
All components are located in `/src/components/`:
- **Button** - Multiple variants and sizes
- **Input** - Text input with labels and validation
- **Badge** - Status indicators
- **Header** - Navigation headers
- **InvestmentCard** - Rich investment display
- **SessionCard** - Event session information
- **SpeakerCard** - Speaker profiles

### Theme System
Located in `/src/theme/`:
- Colors matching the UI mockups
- Typography scale
- Spacing system
- Border radius values
- Platform-specific shadows

## Folder Structure

```
src/
├── components/        # Reusable UI components
├── navigation/        # Navigation setup
├── screens/          # Screen components
├── services/         # Mock API services
├── theme/           # Design system
├── types/           # TypeScript definitions
└── utils/           # Utility functions
```

## Development Tips

### Hot Reloading
- Press `r` in Metro to reload
- Press `d` to open developer menu
- Shake device (or Cmd+D/Ctrl+M) for dev menu

### Debugging
- Use React Native Debugger
- Enable Fast Refresh in dev menu
- Use Flipper for advanced debugging

### Common Issues

#### Metro bundler cache issues
```bash
npm start -- --reset-cache
```

#### iOS build issues
```bash
cd ios
pod deintegrate
pod install
cd ..
```

#### Android build issues
```bash
cd android
./gradlew clean
cd ..
```

## Design System

### Colors
- **Primary**: Deep purple (#2D1B69)
- **Accent**: Bright green (#9FE870)
- **Background**: White (#FFFFFF)

### Typography
- System fonts with multiple weights
- Responsive font sizes

### Spacing
- Consistent 8-point grid system

## Next Steps

### To connect to a real backend:
1. Update services in `/src/services/` to make API calls
2. Implement authentication context
3. Add error handling and loading states
4. Implement secure token storage

### To enhance features:
1. Add search functionality
2. Implement filters for investments
3. Add real-time messaging
4. Integrate push notifications
5. Add biometric authentication

## Testing

Run tests with:
```bash
npm test
```

## Linting

Check code quality:
```bash
npm run lint
```

## Building for Production

### iOS
1. Open project in Xcode
2. Select target device or simulator
3. Archive and upload to App Store Connect

### Android
1. Generate release APK:
```bash
cd android
./gradlew assembleRelease
```
2. APK will be in `android/app/build/outputs/apk/release/`

## Support

For issues or questions:
- Check React Native documentation
- Review the PROJECT_STRUCTURE.md file
- Check navigation setup in `/src/navigation/`

## License

This is a proprietary application for SISCOM Capitalized.

