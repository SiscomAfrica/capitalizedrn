# Sequence Diagram Flow Implementation

This document describes the implementation of the user journey flow based on the sequence diagrams.

## Flow Overview

The app follows a 4-phase journey as shown in the sequence diagrams:

### Phase 1: Discovery & Registration
- User registers with email, phone, password
- Receives OTP via SMS
- Verifies phone number
- Account created ✅

### Phase 2: KYC Submission & Approval
- User prompted to "Complete KYC to Invest"
- Submits ID number, ID photos (front/back), and selfie
- Documents uploaded to S3
- KYC submitted with status "pending"
- Review takes up to 24 hours
- User can browse app but cannot invest yet
- When approved: KYC status → "approved"

### Phase 3: Subscription
- After KYC approval, user must subscribe
- Single tier: KES 5,000/month
- Payment via M-Pesa STK Push
- On successful payment: `can_invest` → `true`
- Subscription active

### Phase 4: Investment
- User can now browse investment opportunities
- Select infrastructure bonds
- Invest with M-Pesa payment
- Portfolio tracking

## Implementation Details

### Login Flow
**File:** `src/screens/auth/LoginScreen.tsx`

When user logs in:
1. Call `/auth/login` endpoint
2. Store tokens and user data
3. Set `isAuthenticated = true`
4. RootNavigator determines which screen to show based on user state

### Navigation Logic
**File:** `src/navigation/RootNavigator.tsx`

The RootNavigator checks user state and routes accordingly:

```typescript
// Phase 2: KYC Check
if (kyc_status === 'not_submitted' || kyc_status === 'rejected') 
  → Navigate to KYC Screen

// KYC Pending
if (kyc_status === 'pending') 
  → Navigate to MainTabs (can browse, but can't invest)

// Phase 3: Subscription Check  
if (kyc_status === 'approved' && !can_invest) 
  → Navigate to Subscription Screen

// Phase 4: Ready to Invest
if (kyc_status === 'approved' && can_invest) 
  → Navigate to MainTabs (full access)
```

### KYC Screen
**File:** `src/screens/kyc/KYCScreen.tsx`

After successful KYC submission:
1. Update user: `kyc_status = 'pending'`
2. Show success message
3. Navigate to `MainTabs`
4. User can browse but investments are disabled until KYC approved

### Subscription Screen
**File:** `src/screens/subscription/SubscriptionScreen.tsx`

After successful subscription payment:
1. Update user: `can_invest = true`, `subscription_active = true`
2. Show success message
3. Navigate to `MainTabs`
4. User can now invest (Phase 4)

## API Endpoints

All authenticated endpoints use `/auth/` prefix:

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/verify-phone` - Verify OTP
- `POST /auth/login` - User login
- `POST /auth/resend-otp` - Resend OTP

### User Profile
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile

### KYC
- `POST /auth/kyc/upload-urls` - Get S3 presigned URLs
- `POST /auth/kyc/submit` - Submit KYC documents
- `GET /auth/kyc-status` - Get KYC status

### Subscription (TODO)
- `POST /auth/subscriptions/subscribe` - Initiate subscription
- `GET /auth/subscriptions/status` - Get subscription status

### Investments (TODO)
- `GET /auth/opportunities` - List investment opportunities
- `GET /auth/opportunities/:id` - Get opportunity details
- `POST /auth/investments` - Create investment

## User State Fields

The `UserResponse` type includes:

```typescript
{
  kyc_status: 'not_submitted' | 'pending' | 'approved' | 'rejected'
  can_invest: boolean  // true only when KYC approved AND subscription active
  subscription_active?: boolean
  profile_completed: boolean
  phone_verified: boolean
  ...
}
```

## Testing the Flow

### Test Case 1: New User Registration
1. Register new account → Phase 1
2. Verify phone with OTP
3. Should land on KYC Screen → Phase 2
4. Submit KYC documents
5. Should land on MainTabs with KYC pending
6. (After admin approves KYC)
7. Should land on Subscription Screen → Phase 3
8. Complete subscription payment
9. Should land on MainTabs with full access → Phase 4

### Test Case 2: Existing User Login
1. Login with credentials
2. App checks user state:
   - No KYC? → KYC Screen
   - KYC pending/approved but no subscription? → Subscription Screen
   - Everything complete? → MainTabs

### Test Case 3: User with Pending KYC
1. Login
2. Should land on MainTabs
3. Can browse opportunities
4. Cannot invest (button disabled with message)

## Navigation Prevention

Screens use `gestureEnabled: false` to prevent users from going back:
- KYC Screen: Cannot go back to login
- Subscription Screen: Cannot go back to skip subscription

## Logging

Console logs help track the flow:
- 🔍 Checking user state
- 📋 Phase 2: KYC flow
- 💳 Phase 3: Subscription flow
- 🎉 Phase 4: Ready to invest
- ✅ Success messages
- ❌ Error messages

## Future Enhancements

1. **Real M-Pesa Integration**
   - Implement STK Push
   - Handle payment callbacks
   - Update subscription status automatically

2. **Admin KYC Review Dashboard**
   - Review submitted documents
   - Approve/Reject with reasons
   - Send notifications to users

3. **Subscription Management**
   - Recurring payments
   - Subscription expiry notifications
   - Grace period handling

4. **Investment API Integration**
   - Real opportunities from backend
   - Investment transaction history
   - Portfolio analytics

## File Structure

```
src/
├── navigation/
│   ├── RootNavigator.tsx       # Main navigation logic
│   ├── AuthNavigator.tsx       # Login/Register/Verify screens
│   └── TabNavigator.tsx        # Main app tabs
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx     # Phase 1: Login
│   │   └── RegistrationScreen.tsx
│   ├── kyc/
│   │   └── KYCScreen.tsx       # Phase 2: KYC submission
│   ├── subscription/
│   │   └── SubscriptionScreen.tsx  # Phase 3: Subscription
│   └── investments/
│       └── InvestmentListScreen.tsx  # Phase 4: Investments
├── services/api/
│   ├── authApi.ts              # Auth endpoints
│   ├── userApi.ts              # User profile endpoints
│   └── kycApi.ts               # KYC endpoints
├── store/
│   ├── authStore.ts            # Authentication state
│   └── userStore.ts            # User profile state
└── types/
    ├── index.ts                # Navigation types
    └── api.ts                  # API request/response types
```

## Status

- ✅ Phase 1: Registration & Login
- ✅ Phase 2: KYC Flow
- ✅ Phase 3: Subscription Flow (UI only, needs M-Pesa integration)
- ⏳ Phase 4: Investment Flow (needs backend API integration)

