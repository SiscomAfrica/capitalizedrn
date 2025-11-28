# Subscription Flow - Testing Guide

## Prerequisites
1. User must be registered and logged in
2. User profile must be completed
3. KYC must be submitted and **APPROVED** by admin
4. Backend API must be running at `https://siscom.africa/api/v1`

## Test Scenarios

### Scenario 1: Free Trial (First Time User)

**Setup:**
- User has approved KYC
- User has NOT used free trial before
- `can_invest = false`

**Steps:**
1. Open app (should automatically show Subscription screen)
2. Verify Free Trial card is displayed at the top with green accent
3. Tap "Start Free Trial" button
4. Confirm in the alert dialog
5. Wait for API call to complete

**Expected Result:**
- Success alert: "🎉 Free Trial Started!"
- Message: "Your 7-day free trial is now active..."
- Navigation to MainTabs
- User can now access investment features
- Backend sets: `can_invest = true`, `is_trial = true`

**API Call:**
```bash
POST https://siscom.africa/api/v1/subscriptions/start-trial
Headers: Authorization: Bearer {token}
```

---

### Scenario 2: Free Trial (Already Used)

**Setup:**
- User has approved KYC
- User has ALREADY used free trial before
- `can_invest = false`

**Steps:**
1. Open app (should automatically show Subscription screen)
2. Tap "Start Free Trial" button
3. Confirm in the alert dialog

**Expected Result:**
- Error alert displayed
- Message: "Failed to start free trial. You may have already used your trial."
- User remains on Subscription screen
- Must choose a paid plan instead

---

### Scenario 3: Paid Subscription

**Setup:**
- User has approved KYC
- `can_invest = false`

**Steps:**
1. Open app (should automatically show Subscription screen)
2. Verify subscription plan cards are displayed below the OR divider
3. Tap on a plan card to select it
4. Verify:
   - Selected card has thicker border (accent color)
   - "✓ Selected" badge appears on the card
   - "Subscribe Now" button appears at the bottom
5. Tap "Subscribe Now" button
6. Confirm payment amount in the alert dialog
7. Tap "Continue"
8. Check phone for M-Pesa STK Push notification
9. Enter M-Pesa PIN to complete payment

**Expected Result:**
- M-Pesa STK Push received on phone
- Payment processed successfully
- Success alert: "🎉 Subscription Activated!"
- Navigation to MainTabs
- User can now access investment features
- Backend sets: `can_invest = true`, `subscription_active = true`

**API Calls:**
```bash
# Get available plans
GET https://siscom.africa/api/v1/subscriptions/plans
Headers: Authorization: Bearer {token}

# Subscribe to selected plan
POST https://siscom.africa/api/v1/subscriptions/subscribe
Headers: Authorization: Bearer {token}
Body: { "plan_id": "8b3494d3-b63a-4540-b36a-46547956a592" }
```

---

### Scenario 4: KYC Not Yet Approved

**Setup:**
- User has submitted KYC
- `kyc_status = 'pending'`
- `can_invest = false`

**Steps:**
1. Open app

**Expected Result:**
- MainTabs displayed (NOT Subscription screen)
- User can browse the app
- Investment features are disabled/hidden
- No way to access Subscription screen yet

**Note:** User will only see Subscription screen after admin approves KYC.

---

### Scenario 5: Already Subscribed User

**Setup:**
- User has approved KYC
- User already has active subscription
- `can_invest = true`

**Steps:**
1. Open app

**Expected Result:**
- MainTabs displayed directly (bypasses Subscription screen)
- User has full access to investment features
- Can view portfolio, make investments, etc.

---

## UI Verification Checklist

### Free Trial Card
- [ ] Green border and background tint
- [ ] "🎁 FREE TRIAL" badge displayed
- [ ] "7 Days Free" text is prominent
- [ ] Description: "Try all features for free..."
- [ ] "Start Free Trial" button is functional

### Subscription Plan Cards
- [ ] Multiple plans load from API
- [ ] Each card shows:
  - [ ] Plan name (e.g., "Basic")
  - [ ] Plan description
  - [ ] Price and currency (e.g., "KES 1,000")
  - [ ] Duration (e.g., "/30 days")
  - [ ] Feature list with checkmarks
- [ ] Cards are selectable (tap to select)
- [ ] Selected card shows visual feedback:
  - [ ] Thicker border (accent color)
  - [ ] "✓ Selected" badge

### Features Display
Verify features show correctly based on plan:
- [ ] Portfolio tracking
- [ ] Max investments (e.g., "Up to 3 active investments")
- [ ] Email notifications
- [ ] Investment calculator
- [ ] Withdrawal requests
- [ ] Advanced analytics (if available)
- [ ] Priority support (if available)
- [ ] API access (if available)

### Other Elements
- [ ] Header with title and subtitle
- [ ] "OR" divider between trial and plans
- [ ] Info box about M-Pesa payment
- [ ] "Subscribe Now" button appears only when plan selected
- [ ] Loading states during API calls
- [ ] Error alerts display properly

---

## Developer Testing with cURL

### 1. Get All Plans
```bash
curl -X 'GET' \
  'https://siscom.africa/api/v1/subscriptions/plans' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

### 2. Get Plan Details
```bash
curl -X 'GET' \
  'https://siscom.africa/api/v1/subscriptions/plans/PLAN_ID' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

### 3. Subscribe to Plan
```bash
curl -X 'POST' \
  'https://siscom.africa/api/v1/subscriptions/subscribe' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
  "plan_id": "PLAN_ID"
}'
```

### 4. Start Free Trial
```bash
curl -X 'POST' \
  'https://siscom.africa/api/v1/subscriptions/start-trial' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -d ''
```

### 5. Get My Subscription
```bash
curl -X 'GET' \
  'https://siscom.africa/api/v1/subscriptions/my-subscription' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

### 6. Cancel Subscription
```bash
curl -X 'POST' \
  'https://siscom.africa/api/v1/subscriptions/cancel' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -d ''
```

---

## Common Issues & Troubleshooting

### Issue: Subscription screen not showing
**Possible Causes:**
1. KYC not approved yet (`kyc_status != 'approved'`)
2. User already has subscription (`can_invest = true`)
3. User store not updated

**Solution:**
- Check user state in logs: Look for "🔍 RootNavigator - Determining screen"
- Verify KYC status in backend
- Check AsyncStorage for cached user data

### Issue: Plans not loading
**Possible Causes:**
1. Network error
2. Invalid/expired auth token
3. Backend API down

**Solution:**
- Check network connectivity
- Verify token in request headers (check console logs)
- Test API endpoint with cURL
- Check API response in console: "✅ Plans fetched successfully"

### Issue: Free trial button does nothing
**Possible Causes:**
1. User already used trial
2. API error
3. Missing auth token

**Solution:**
- Check console for error logs
- Verify API response message
- Check user's trial history in backend

### Issue: M-Pesa STK Push not received
**Possible Causes:**
1. Phone number not registered with M-Pesa
2. M-Pesa service down
3. Wrong phone number format
4. Insufficient backend configuration

**Solution:**
- Verify phone number is M-Pesa registered
- Check backend M-Pesa integration logs
- Test with different phone number
- Contact M-Pesa support

---

## Console Log Messages

During successful flow, you should see these logs:

```
🔍 RootNavigator - Determining screen based on user state: 
  { profile_completed: true, kyc_status: 'approved', can_invest: false }
💳 Phase 3: Showing Subscription screen

📋 Fetching subscription plans...
✅ Plans fetched successfully: { plans: [...] }

💳 Phase 3: Initiating subscription payment...
✅ Subscription initiated successfully: { success: true, ... }
💳 Phase 3 complete: Subscription active, navigating to Phase 4...
```

or for free trial:

```
🎁 Phase 3: Starting free trial...
✅ Free trial started successfully: { success: true, ... }
🎁 Phase 3 complete: Free trial active, navigating to Phase 4...
```

---

## Manual User State Manipulation (Development Only)

For testing different scenarios, you can manually update the user state:

### Test KYC Approved State
```typescript
// In React Native Debugger or console
import { useUserStore } from './src/store';

useUserStore.getState().updateUser({
  kyc_status: 'approved',
  can_invest: false
});
```

### Test Already Subscribed State
```typescript
useUserStore.getState().updateUser({
  kyc_status: 'approved',
  can_invest: true,
  subscription_active: true
});
```

### Reset to KYC Pending
```typescript
useUserStore.getState().updateUser({
  kyc_status: 'pending',
  can_invest: false,
  subscription_active: false
});
```

---

## Next Steps After Testing

1. **Verify Payment Integration**
   - Test actual M-Pesa payments with small amounts
   - Verify payment callbacks update user subscription

2. **Add Subscription Management**
   - View current subscription details
   - Cancel/upgrade subscription
   - View payment history

3. **Handle Subscription Expiry**
   - Check subscription status on app launch
   - Show renewal prompt before expiry
   - Restrict access when expired

4. **Add Analytics**
   - Track subscription conversions
   - Monitor free trial to paid conversions
   - A/B test plan pricing

5. **User Communication**
   - Email confirmation after subscription
   - SMS reminder before expiry
   - Push notifications for subscription events

