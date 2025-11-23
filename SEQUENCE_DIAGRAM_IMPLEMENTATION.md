# SISCOM Capitalized - Sequence Diagram Implementation

## Overview
This document outlines the implementation based on the sequence diagram analysis.

## Application Flow (from Sequence Diagram)

### PHASE 1: DISCOVERY & REGISTRATION ✅
1. **Welcome/Landing** (Web - redirects to app download)
2. **Registration Screen** ✅ CREATED
   - Name, Email, Phone, Password
   - API: POST /api/auth/register
3. **OTP Verification Screen** ✅ EXISTS (needs update for phone param)
   - 6-digit code
   - API: POST /api/auth/verify-phone
4. Account created → Navigate to KYC

### PHASE 2: KYC SUBMISSION & APPROVAL ✅
5. **KYC Screen** ✅ CREATED
   - ID Number input
   - Upload ID Photo
   - Take Selfie
   - API: POST /api/users/kyc
6. KYC submitted → Review (24 hours)
7. SMS confirmation sent
8. KYC approved → Navigate to Subscription

### PHASE 3: SUBSCRIPTION ✅
9. **Subscription Screen** ✅ CREATED
   - Single Tier: 5,000 KES/month
   - Benefits list
   - M-Pesa payment integration
   - API: POST /api/subscription/initiate (STK Push)
10. Payment successful → Subscription activated → Navigate to Main App

### PHASE 4: INVESTMENT ✅
11. **Investment List Screen** ✅ CREATED
    - Browse opportunities
    - API: GET /api/opportunities
12. **Investment Details Screen** ⏳ NEEDS UPDATE
    - Show target, raised, returns, risks
    - Amount input field
    - API: GET /api/opportunities/:id
13. **Investment Confirmation Screen** ❌ TO CREATE
    - Confirm investment details
    - M-Pesa payment
    - API: POST /api/investments
14. Investment successful → SMS receipt

### PHASE 5: PORTFOLIO VIEW ✅
15. **Portfolio Screen** ✅ CREATED
    - Show user investments
    - API: GET /api/investments/portfolio

### PHASE 6: COMMUNITY (BASIC) ⏳
16. **Community Screen** ⏳ NEEDS UPDATE
    - Member directory
    - Name, title, company, contact
    - API: GET /api/users/list
    - NO in-app messaging (contact via phone/email)

## Screens to DELETE ❌
- LoginScreen (replaced with RegistrationScreen)
- MessagesScreen (not in MVP)
- EventsScreen (not in MVP)
- EventDetailsScreen (not in MVP)
- TransactionsScreen (replaced with PortfolioScreen)
- HomeScreen (replaced with InvestmentListScreen)

## Navigation Structure (New)

```
Root Navigator
├── Auth Stack
│   ├── Registration
│   ├── VerifyCode
│   └── KYC
├── Subscription (standalone)
└── Main Tabs
    ├── Investments Stack
    │   ├── InvestmentList
    │   ├── InvestmentDetails
    │   └── InvestmentConfirmation
    ├── Portfolio
    └── Community
```

## API Endpoints (from Sequence Diagram)

### Authentication
- POST /api/auth/register - Create user account
- POST /api/auth/verify-phone - Verify OTP

### KYC
- POST /api/users/kyc - Submit KYC documents

### Subscription
- POST /api/subscription/initiate - Start M-Pesa STK Push

### Investment
- GET /api/opportunities - List investments
- GET /api/opportunities/:id - Get investment details
- POST /api/investments - Make investment

### Portfolio
- GET /api/investments/portfolio - User's investments

### Community
- GET /api/users/list - Member directory

## Next Steps
1. ✅ Create RegistrationScreen
2. ✅ Create KYCScreen
3. ✅ Create SubscriptionScreen
4. ✅ Create InvestmentListScreen
5. ✅ Create PortfolioScreen
6. ⏳ Update CommunityScreen
7. ⏳ Create InvestmentConfirmationScreen
8. ⏳ Update InvestmentDetailsScreen
9. ⏳ Update VerifyCodeScreen
10. ❌ Delete unnecessary screens
11. ❌ Update all navigators
12. ❌ Update exports and imports
13. ❌ Test complete flow

