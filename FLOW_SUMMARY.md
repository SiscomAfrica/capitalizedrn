# 🔄 Complete Application Flow - Quick Reference

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER REGISTRATION FLOW                       │
└─────────────────────────────────────────────────────────────────┘

Step 1: AUTHENTICATION
┌──────────────┐
│   Register   │ → Enter email, phone, password
│   Account    │ → Receive OTP
└──────┬───────┘
       │
       ↓ Verify OTP
┌──────────────┐
│  Phone       │ ✅ Account Created
│  Verified    │ ✅ User logged in
└──────┬───────┘
       │
       ↓
┌──────────────────────────────────────────────────────────────────┐
│ Navigation Check: profile_completed?                              │
│ ❌ No → Show ProfileCompletion Screen                            │
└──────────────────────────────────────────────────────────────────┘

Step 2: PROFILE COMPLETION
┌──────────────┐
│   Complete   │ → Date of Birth
│   Profile    │ → Country, City, Address
└──────┬───────┘
       │
       ↓ Submit Profile
       ✅ profile_completed = true
       │
       ↓
┌──────────────────────────────────────────────────────────────────┐
│ Navigation Check: kyc_status?                                     │
│ ❌ 'not_submitted' → Show KYC Screen                             │
└──────────────────────────────────────────────────────────────────┘

Step 3: KYC SUBMISSION
┌──────────────┐
│   Submit     │ → Upload ID Front
│     KYC      │ → Upload ID Back
│  Documents   │ → Take Selfie
└──────┬───────┘
       │
       ↓ Submit KYC
       ✅ kyc_status = 'pending'
       │
       ↓ AUTOMATIC NAVIGATION TO...
┌──────────────────────────────────────────────────────────────────┐
│ Navigation Check: has_subscription?                               │
│ ❌ No → Show Subscription Screen (REQUIRED!) ⭐                  │
└──────────────────────────────────────────────────────────────────┘

Step 4: SUBSCRIPTION SELECTION (MANDATORY!)
┌─────────────────────────────────────────────────────────────┐
│              SUBSCRIPTION SCREEN (MUST CHOOSE!)             │
│                                                             │
│  ┌─────────────────────────────────────────────┐          │
│  │  🎁 FREE TRIAL                              │          │
│  │  • 7 days free access                       │          │
│  │  • Full features                            │          │
│  │  • No payment needed                        │          │
│  │  [Start Free Trial]                         │          │
│  └─────────────────────────────────────────────┘          │
│                                                             │
│                     OR                                      │
│                                                             │
│  ┌─────────────────────────────────────────────┐          │
│  │  💳 BASIC PLAN - KES 1,000/month           │          │
│  │  • Portfolio tracking                       │          │
│  │  • Up to 3 investments                      │          │
│  │  • Email notifications                      │          │
│  │  [Subscribe Now]                            │          │
│  └─────────────────────────────────────────────┘          │
│                                                             │
│  🚫 CANNOT PROCEED WITHOUT CHOOSING A PLAN!               │
└─────────────────────────────────────────────────────────────┘
       │
       ↓ User chooses Free Trial OR Paid Plan
       ✅ has_subscription = true
       ✅ subscription_active = true
       ✅ can_invest = (kyc_status === 'approved')
       │
       ↓ NAVIGATION ALLOWED TO...
┌──────────────────────────────────────────────────────────────────┐
│ Navigation Check: has_subscription?                               │
│ ✅ Yes → Show MainTabs                                           │
└──────────────────────────────────────────────────────────────────┘

Step 5: MAIN APP ACCESS
┌──────────────────────────────────────────────────────────────────┐
│                         MAIN TABS                                 │
│  ┌─────────┬──────────┬───────────┬──────────┬─────────┐        │
│  │  Home   │Portfolio │Investments│Community │ Profile │        │
│  └─────────┴──────────┴───────────┴──────────┴─────────┘        │
│                                                                   │
│  Status depends on KYC:                                          │
│                                                                   │
│  ⏳ KYC Pending (kyc_status = 'pending'):                       │
│     ✅ Can browse opportunities                                 │
│     ✅ Can view portfolio (empty)                               │
│     ❌ Cannot make investments (can_invest = false)             │
│     📱 Message: "KYC under review. Investment access pending."  │
│                                                                   │
│  ✅ KYC Approved (kyc_status = 'approved'):                     │
│     ✅ Can browse opportunities                                 │
│     ✅ Can make investments (can_invest = true)                 │
│     ✅ Can track portfolio                                       │
│     ✅ Full app access                                           │
└──────────────────────────────────────────────────────────────────┘

BACKGROUND PROCESS (24-48 hours):
┌──────────────┐
│   Admin      │ → Reviews KYC documents
│   Reviews    │ → Approves or Rejects
│     KYC      │
└──────┬───────┘
       │
       ↓ If Approved
       ✅ kyc_status = 'approved'
       ✅ can_invest = true (if subscription active)
       📱 SMS: "KYC approved! You can now invest."
       │
       ↓ Next app open
       User has full investment access!
```

## Critical Checkpoints

### ✅ Checkpoint 1: Profile Required
```
IF profile_completed = false
  → BLOCK at ProfileCompletion Screen
  → CANNOT proceed to KYC
```

### ✅ Checkpoint 2: KYC Required
```
IF kyc_status = 'not_submitted' OR 'rejected'
  → BLOCK at KYC Screen
  → CANNOT proceed to Subscription
```

### ✅ Checkpoint 3: Subscription Required ⭐ (NEW!)
```
IF has_subscription = false/undefined
  → BLOCK at Subscription Screen
  → CANNOT proceed to MainTabs
  → MUST choose Free Trial OR Paid Plan
  → This check happens EVERY app launch!
```

### ✅ Checkpoint 4: Investment Access
```
IF can_invest = false
  → CAN access MainTabs (browse only)
  → CANNOT make investments
  → Shows: "Investment access pending KYC approval"

IF can_invest = true
  → CAN access MainTabs (full access)
  → CAN make investments
  → Shows: Investment buttons enabled
```

## State Tracking

### User Object Fields:
```javascript
{
  // Authentication
  isAuthenticated: true/false,
  
  // Profile
  profile_completed: true/false,
  
  // KYC
  kyc_status: 'not_submitted' | 'pending' | 'approved' | 'rejected',
  
  // Subscription (NEW TRACKING!)
  has_subscription: true/false/undefined,    // ⭐ Chosen any plan?
  subscription_active: true/false/undefined, // Currently valid?
  
  // Investment Access
  can_invest: true/false // = (KYC approved + subscription active)
}
```

## Navigation Decision Tree

```
START: User opens app
│
├─ isAuthenticated?
│  ├─ NO → Auth Screen (Login/Register)
│  └─ YES → Continue...
│
├─ profile_completed?
│  ├─ NO → ProfileCompletion Screen
│  └─ YES → Continue...
│
├─ kyc_status = 'not_submitted' or 'rejected'?
│  ├─ YES → KYC Screen
│  └─ NO → Continue...
│
├─ has_subscription = false/undefined? ⭐ CRITICAL CHECK!
│  ├─ YES → Subscription Screen (BLOCKED HERE!)
│  └─ NO → Continue...
│
└─ MainTabs (with can_invest check for features)
```

## User Experience Scenarios

### 🆕 Scenario 1: Brand New User
```
Day 1:
  8:00 AM → Register & verify → Takes 2 minutes
  8:02 AM → Complete profile → Takes 3 minutes
  8:05 AM → Submit KYC → Takes 5 minutes
  8:10 AM → 🛑 MUST choose subscription (sees screen immediately)
  8:11 AM → Chooses Free Trial → ✅ Can now browse app
  8:12 AM → Sees message: "KYC under review, investment access pending"
  
Day 2:
  9:00 AM → Admin approves KYC
  9:01 AM → 📱 Receives SMS notification
  2:00 PM → Opens app → ✅ Full investment access!
```

### 🔄 Scenario 2: User Who Exits Early
```
Day 1:
  10:00 AM → Registers, completes profile, submits KYC
  10:15 AM → Sees Subscription Screen
  10:15 AM → ❌ Closes app without choosing (phone call)
  
  3:00 PM → Reopens app
  3:00 PM → 🛑 Still on Subscription Screen (BLOCKED!)
  3:00 PM → Must choose to proceed
  3:01 PM → Chooses Free Trial → ✅ Can now access app
```

### ✅ Scenario 3: Returning User
```
Week 1:
  → Had chosen subscription previously
  → Logs out and back in multiple times
  → ✅ Always goes directly to MainTabs
  → ✅ Never sees Subscription Screen again
  
Week 5:
  → Free trial expires (7 days passed)
  → subscription_active = false
  → can_invest = false
  → ⚠️ Shows renewal prompt in app
  → Still can browse, just can't invest
```

## Key Takeaways

1. **Subscription is Mandatory** ⭐
   - User MUST choose before accessing app
   - Cannot skip or bypass
   - Enforced on every app launch

2. **Early Monetization**
   - Subscription required immediately after KYC
   - Don't wait for KYC approval
   - Free trial reduces friction

3. **Clear User Journey**
   - Step-by-step progression
   - No ambiguity about next steps
   - Always know where user is in flow

4. **Smart Access Control**
   - Subscription ≠ Investment Access
   - Browse with subscription + pending KYC
   - Invest with subscription + approved KYC

5. **Persistent Tracking**
   - State saved across sessions
   - Survives app restarts
   - Backend is source of truth

---

**Last Updated:** November 27, 2025
**Implementation Status:** ✅ COMPLETE
**Testing Status:** Ready for QA

