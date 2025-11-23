# SISCOM Capitalized - Project Structure

## Overview
A React Native mobile investment platform application built with TypeScript, featuring authentication, onboarding, investment browsing, event management, and transaction tracking.

## Project Structure

```
/src
├── components/          # Reusable UI components
│   ├── common/         # Common components (Button, Input, Badge, Header)
│   └── cards/          # Card components (InvestmentCard, SessionCard, SpeakerCard)
│
├── navigation/         # Navigation configuration
│   ├── RootNavigator.tsx       # Main app navigator
│   ├── AuthNavigator.tsx       # Authentication flow
│   ├── TabNavigator.tsx        # Bottom tab navigation
│   └── HomeNavigator.tsx       # Home stack navigation
│
├── screens/           # Screen components
│   ├── auth/         # Authentication screens
│   │   ├── LoginScreen.tsx
│   │   └── VerifyCodeScreen.tsx
│   ├── onboarding/   # Onboarding/KYC screens
│   │   └── OnboardingScreen.tsx
│   └── main/         # Main app screens
│       ├── HomeScreen.tsx
│       ├── EventsScreen.tsx
│       ├── EventDetailsScreen.tsx
│       ├── InvestmentDetailsScreen.tsx
│       ├── CommunityScreen.tsx
│       ├── MessagesScreen.tsx
│       └── TransactionsScreen.tsx
│
├── services/          # API services and mock data
│   ├── mockData.ts
│   ├── authService.ts
│   ├── investmentService.ts
│   └── eventService.ts
│
├── theme/            # Design system
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── borderRadius.ts
│   ├── shadows.ts
│   └── index.ts
│
├── types/            # TypeScript type definitions
│   └── index.ts
│
└── utils/            # Utility functions (future use)
```

## Key Features

### Authentication Flow
- **Login Screen**: Email-based login with verification code
- **Verify Code Screen**: 6-digit code verification with auto-focus
- **Onboarding Screen**: KYC form for user profile completion

### Main App Features
- **Home Screen**: 
  - Featured investments carousel
  - Investment listings
  - Search and filter functionality
  
- **Event Details Screen**:
  - Multiple tabs (Overview, Schedule, Speakers)
  - Session cards
  - Speaker profiles
  - Ticket booking

- **Events Screen**: List of upcoming events

- **Community Screen**: Social features placeholder

- **Messages Screen**: Message inbox with unread indicators

- **Transactions Screen**: 
  - Portfolio overview
  - Transaction history
  - Status tracking

### UI Components

#### Common Components
- **Button**: Multiple variants (primary, secondary, outline, ghost)
- **Input**: Text input with label, error states, and focus styling
- **Badge**: Status badges with multiple variants
- **Header**: Navigation header with back button and actions

#### Card Components
- **InvestmentCard**: Rich investment display with images, stats, and badges
- **SessionCard**: Event session information
- **SpeakerCard**: Speaker profile display

### Theme System
- Consistent color palette matching the UI mockups
- Typography scale
- Spacing system
- Border radius values
- Platform-specific shadows

## Navigation Structure

```
Root
├── Auth Stack (Unauthenticated)
│   ├── Login
│   ├── VerifyCode
│   └── Onboarding
│
└── Main Tabs (Authenticated)
    ├── Home Stack
    │   ├── HomeScreen
    │   ├── InvestmentDetails
    │   └── EventDetails
    ├── Events
    ├── Community
    ├── Messages
    └── Transactions
```

## Design System

### Colors
- **Primary**: #2D1B69 (Deep purple)
- **Accent**: #9FE870 (Bright green)
- **Risk Levels**: High (red), Medium (orange), Low (green)
- Full grayscale palette

### Typography
- Font sizes from xs (10px) to massive (48px)
- Font weights: regular, medium, semibold, bold, black

### Spacing
- Consistent spacing scale: xs (4px) to xxxl (64px)

## Mock Data
All screens use mock data services that simulate API calls with delays. This allows for:
- Testing loading states
- Demonstrating UI/UX flows
- Easy replacement with real API calls

## Next Steps for Production

1. **Backend Integration**
   - Replace mock services with real API calls
   - Implement authentication context
   - Add token management
   - Error handling

2. **State Management**
   - Consider Redux, Zustand, or Context API
   - Implement global state for user, investments, etc.

3. **Form Validation**
   - Add validation library (Formik, React Hook Form)
   - Enhanced error handling

4. **Image Optimization**
   - Add image caching
   - Implement progressive loading
   - Optimize bundle size

5. **Testing**
   - Unit tests for components
   - Integration tests for flows
   - E2E testing

6. **Performance**
   - Code splitting
   - Lazy loading
   - Performance monitoring

7. **Accessibility**
   - Screen reader support
   - Color contrast improvements
   - Keyboard navigation

8. **Push Notifications**
   - Investment updates
   - Event reminders
   - Message notifications

9. **Analytics**
   - User behavior tracking
   - Conversion metrics
   - Error tracking

10. **Security**
    - Secure storage for tokens
    - API encryption
    - Biometric authentication

## Running the Application

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Development Server
```bash
npm start
```

## Dependencies
- React Native 0.82
- React Navigation (native, stack, bottom tabs)
- React Native Safe Area Context
- TypeScript

## Design Philosophy
The application follows the design mockups closely, with:
- Clean, modern UI
- Consistent spacing and typography
- Smooth navigation transitions
- Accessible color contrast
- Intuitive user flows

