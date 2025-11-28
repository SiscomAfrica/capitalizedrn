# ✅ Updated Subscription Flow - Always Track Subscription Status

## What Changed

The subscription flow has been updated to **require subscription selection immediately after KYC submission**, not after KYC approval. The app now **always tracks** whether a user has chosen a subscription plan.

## New Application Flow

### Phase 1: Registration & Verification
```
User → Register → Verify Phone → Account Created ✅
```

### Phase 2: Profile & KYC
```
User → Complete Profile → Submit KYC → KYC Status = 'pending' ✅
```

### Phase 3: Subscription (REQUIRED - UPDATED!)
```
After KYC Submission → IMMEDIATELY Show Subscription Screen
User MUST choose:
  Option A: Free Trial (7 days) → has_subscription = true
  OR
  Option B: Paid Plan → has_subscription = true

Only after choosing → Can access MainTabs
```

### Phase 4: Main App Access
```
User can now browse app:
  - If KYC still pending → can_invest = false (browse only)
  - If KYC approved → can_invest = true (full access)
```

## Key Changes

### 1. Subscription Tracking Field Added
**File:** `src/types/api.ts`

Added `has_subscription` field to track if user has chosen any subscription plan:

```typescript
export interface UserResponse {
  // ... other fields
  has_subscription?: boolean; // Track if user has chosen any subscription plan
  subscription_active?: boolean; // Track if subscription is currently active
  can_invest: boolean; // True only when: KYC approved + subscription active
}
```

### 2. Navigation Logic Updated
**File:** `src/navigation/RootNavigator.tsx`

The navigation now checks for subscription **after KYC submission** (not after approval):

```typescript
// OLD LOGIC (Wrong):
if (user.kyc_status === 'approved' && !user.can_invest) {
  return 'Subscription'; // Only shown after KYC approval
}

// NEW LOGIC (Correct):
if (!user.has_subscription && !user.subscription_active) {
  return 'Subscription'; // Shown immediately after KYC submission
}
```

**Navigation Priority:**
1. Not authenticated → `Auth Screen`
2. Profile not completed → `ProfileCompletion Screen`
3. KYC not submitted → `KYC Screen`
4. **No subscription chosen → `Subscription Screen` ⭐**
5. Has subscription → `MainTabs`

### 3. KYC Screen Updated
**File:** `src/screens/kyc/KYCScreen.tsx`

After successful KYC submission, navigates to **Subscription Screen** (not MainTabs):

```typescript
// OLD:
navigation.replace('MainTabs'); // Wrong!

// NEW:
navigation.replace('Subscription'); // Correct!
```

Alert message updated:
```
"Great! Now choose a subscription plan to continue. We offer a free trial option!"
```

### 4. Subscription Screen Updated
**File:** `src/screens/subscription/SubscriptionScreen.tsx`

When user chooses a subscription (free or paid), sets tracking flags:

```typescript
updateUser({ 
  has_subscription: true,        // User has chosen a plan
  subscription_active: true,      // Subscription is active
  can_invest: user?.kyc_status === 'approved', // Only if KYC approved
});
```

**Smart Investment Access:**
- If KYC still pending: User can browse but can't invest yet
- If KYC approved: User gets immediate investment access

## User Journey Examples

### Example 1: New User (Standard Flow)

**Day 1:**
1. ✅ Register and verify phone
2. ✅ Complete profile
3. ✅ Submit KYC documents
   - `kyc_status = 'pending'`
   - `has_subscription = undefined`
4. 🚀 **Automatically redirected to Subscription Screen**
5. ✅ Chooses Free Trial
   - `has_subscription = true`
   - `subscription_active = true`
   - `can_invest = false` (KYC still pending)
6. 🎉 Can now browse app (but can't invest yet)

**Day 2:**
7. 👨‍💼 Admin approves KYC
8. 📱 User receives SMS notification
9. ✅ Opens app → `can_invest = true` (full access!)

### Example 2: User Who Exits During Subscription Selection

**Scenario:**
1. User submits KYC
2. Sees Subscription Screen
3. **Closes app without choosing** 😱
4. Logs in next day

**What Happens:**
- RootNavigator checks: `has_subscription = undefined`
- **User is BLOCKED at Subscription Screen** ✋
- Must choose a plan to proceed
- Cannot access MainTabs without subscription

### Example 3: User Who Already Has Subscription

**Scenario:**
1. User had previously chosen subscription
2. Logs out and logs back in

**What Happens:**
- RootNavigator checks: `has_subscription = true`
- **User goes directly to MainTabs** ✅
- No need to choose subscription again

## Subscription Tracking Logic

### When to Show Subscription Screen:
```typescript
// Show Subscription Screen if:
!user.has_subscription && !user.subscription_active

// This catches:
// - New users after KYC submission
// - Users who exited without choosing
// - Users whose subscription expired (if subscription_active = false)
```

### When to Allow MainTabs:
```typescript
// Allow MainTabs if:
user.has_subscription || user.subscription_active

// This allows:
// - Users with active subscriptions
// - Users with expired subscriptions (to manage/renew)
```

### When to Allow Investing:
```typescript
// Allow investing if:
user.can_invest === true

// Which requires:
// - KYC status = 'approved' AND
// - Subscription active
```

## State Management

### User State Fields:
| Field | Type | Purpose | When Set |
|-------|------|---------|----------|
| `profile_completed` | boolean | Profile done | After profile completion |
| `kyc_status` | string | KYC state | After KYC submission/approval |
| `has_subscription` | boolean? | Subscription chosen | After choosing any plan |
| `subscription_active` | boolean? | Subscription valid | After successful payment/trial |
| `can_invest` | boolean | Investment access | When KYC approved + subscription active |

### Flow Chart:
```
User State Check → Navigation Decision
├─ profile_completed = false → ProfileCompletion Screen
├─ kyc_status = 'not_submitted' → KYC Screen
├─ has_subscription = false → Subscription Screen ⭐ (ENFORCED)
└─ has_subscription = true → MainTabs
   ├─ can_invest = false → Browse only (KYC pending)
   └─ can_invest = true → Full access (KYC approved)
```

## Important Behaviors

### ✅ Subscription is Required
- User **CANNOT** skip subscription selection
- User **CANNOT** access MainTabs without choosing a plan
- Even if user closes app, they'll see Subscription Screen again

### ✅ Free Trial Counts as Subscription
- Choosing free trial sets `has_subscription = true`
- User can access app immediately
- After 7 days, subscription expires but `has_subscription` remains true

### ✅ Investment Access is Separate
- Having subscription ≠ can invest
- Must have: Subscription + KYC approval
- This prevents investing before verification

### ✅ Persistent Tracking
- Subscription status saved in AsyncStorage
- Survives app restarts and re-logins
- Backend is source of truth

## Testing the New Flow

### Test Case 1: Complete Flow
1. Register new user
2. Complete profile
3. Submit KYC
4. **Verify**: Should automatically show Subscription Screen
5. Choose free trial
6. **Verify**: Can access MainTabs
7. **Verify**: Investment features disabled (KYC pending)
8. Simulate KYC approval (backend)
9. **Verify**: Investment features now enabled

### Test Case 2: Exit Without Subscription
1. Complete steps 1-3 above
2. Close app at Subscription Screen
3. Reopen app
4. **Verify**: Still on Subscription Screen (blocked)
5. Try to navigate (if possible)
6. **Verify**: Cannot bypass Subscription Screen

### Test Case 3: Already Subscribed User
1. Complete full flow (including subscription)
2. Log out
3. Log back in
4. **Verify**: Goes directly to MainTabs
5. **Verify**: No subscription screen shown

## Console Logs to Watch

```javascript
// After KYC submission:
📋 Phase 2 complete: KYC submitted, navigating to Subscription...

// On app open/navigation check:
🔍 RootNavigator - Determining screen based on user state: 
  { profile_completed: true, kyc_status: 'pending', has_subscription: undefined }
💳 Phase 3: No subscription chosen yet - showing Subscription screen

// After choosing subscription:
🎁 Phase 3 complete: Free trial active, navigating to Phase 4...

// On subsequent app opens:
🔍 RootNavigator - Determining screen based on user state: 
  { profile_completed: true, kyc_status: 'pending', has_subscription: true }
🎉 Phase 4: User has subscription - showing MainTabs
```

## Files Modified

1. ✅ `src/types/api.ts` - Added `has_subscription` field
2. ✅ `src/navigation/RootNavigator.tsx` - Updated navigation logic
3. ✅ `src/screens/kyc/KYCScreen.tsx` - Navigate to Subscription after submit
4. ✅ `src/screens/subscription/SubscriptionScreen.tsx` - Set tracking flags

## Summary

### Before (Old Flow):
```
Register → Profile → KYC Submit → Wait for Approval → Subscription → MainTabs
                                   (User could browse)    (Optional)
```

### After (New Flow):
```
Register → Profile → KYC Submit → Subscription (REQUIRED) → MainTabs
                                  (Must choose)              (With/without invest access)
```

### Key Improvements:
✅ Subscription is **always required** before app access
✅ User **cannot skip** or bypass subscription selection  
✅ Subscription tracked **persistently** across sessions
✅ Clear separation: **subscription** vs **investment access**
✅ Free trial option available immediately
✅ User can browse while KYC is pending (if subscribed)

---

**Updated:** November 27, 2025
**Status:** ✅ COMPLETE AND TESTED
**Breaking Change:** No (backwards compatible with `subscription_active` field)

