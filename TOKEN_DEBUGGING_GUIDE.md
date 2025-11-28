# Token Authentication Debugging Guide

## Issue Identified
The Bearer token is not being found in AsyncStorage when attempting to subscribe, resulting in a **403 Not Authenticated** error.

## Changes Made

### 1. Enhanced Token Logging
Added comprehensive logging to track token storage and retrieval:
- `src/config/api.ts` - Enhanced request interceptor with detailed token checking
- `src/screens/subscription/PlanDetailsScreen.tsx` - Added pre-flight token verification
- `src/screens/subscription/SubscriptionScreen.tsx` - Added pre-flight token verification

### 2. Token Verification
Added `tokenManager.verifyToken()` function that checks if token exists before API calls.

### 3. Pre-Flight Checks
Both subscription flows now verify the token exists before attempting API calls.

## How to Debug

### Step 1: Check Login Flow
After logging in, check the logs for these messages:

```
✅ Access token stored successfully
✅ Tokens stored successfully
✅ Verification - Access token: PRESENT
✅ Verification - Refresh token: PRESENT
```

**If you see these**, tokens are being stored correctly during login.
**If you don't see these**, there's an issue with token storage during login.

### Step 2: Check All Storage Keys
When you try to subscribe, you'll now see:

```
🔍 Checking for access token...
🔍 Storage key: @capitalized_access_token
📦 All AsyncStorage keys: ['@capitalized_access_token', '@capitalized_refresh_token', '@capitalized_user_data']
```

**Check if `@capitalized_access_token` is in the list**
- ✅ If YES: Token is stored but retrieval might be failing
- ❌ If NO: Token was never stored or was cleared

### Step 3: Check Token Retrieval
Look for this log:

```
🔍 Token retrieval result: FOUND
```

or

```
🔍 Token retrieval result: NOT FOUND
```

### Step 4: Navigation Flow Check
The token might be cleared during navigation. Check logs for:

```
🔍 Verifying token presence...
🔍 Token verification result: ✅ EXISTS
```

or

```
🔍 Verifying token presence...
🔍 Token verification result: ❌ MISSING
```

## Common Issues and Solutions

### Issue 1: Token Never Stored
**Symptoms:**
- No "Tokens stored successfully" message after login
- AsyncStorage keys list is empty or missing token keys

**Solution:**
Check if login is completing successfully. Look for errors in the login flow.

### Issue 2: Token Stored But Not Retrieved
**Symptoms:**
- "Tokens stored successfully" appears
- "Token retrieval result: NOT FOUND" appears later

**Possible Causes:**
1. **AsyncStorage permission issues** - App doesn't have permission to read storage
2. **Storage cleared between login and subscription** - Something is clearing AsyncStorage
3. **Storage key mismatch** - Different keys being used for storage vs retrieval

**Debug Steps:**
1. Check all AsyncStorage operations between login and subscription
2. Look for `clearAuth()` or `clearAll()` calls in logs
3. Verify no logout is happening automatically

### Issue 3: Token Cleared During Navigation
**Symptoms:**
- Token present after login
- Token missing when reaching subscription screen

**Solution:**
Check the navigation flow:
- `LoginScreen` → Sets tokens
- `RootNavigator` → Check if `clearAuth()` is called
- `SubscriptionScreen` → Should still have tokens

Look for any `clearAuth()` calls in logs between screens.

### Issue 4: Verification Flow Issues
**Symptoms:**
- After phone verification, token is lost

**Check:**
In `VerifyCodeScreen.tsx`, ensure tokens are preserved:
```typescript
// After successful verification
await setTokens(response.access_token, response.refresh_token);
```

## Testing Steps

### Test 1: Fresh Login and Subscribe
1. **Logout** completely
2. **Login** with valid credentials
3. **Watch logs** for token storage confirmation
4. **Navigate** through Profile → KYC → Subscription
5. **Click Subscribe** on a plan
6. **Check logs** for token presence

### Test 2: Verify Token Persistence
1. Login
2. Navigate to Subscription screen
3. **Before clicking subscribe**, shake device → Debug → Console
4. Run:
   ```javascript
   AsyncStorage.getItem('@capitalized_access_token').then(token => 
     console.log('Token check:', token ? 'EXISTS' : 'MISSING')
   )
   ```

### Test 3: Compare with KYC
KYC submission works with the same token. Test:
1. Login
2. Complete profile
3. **Submit KYC** (should work ✅)
4. Try to **Subscribe** (currently failing ❌)
5. Compare logs from both operations

## What to Look For in Logs

### Successful Token Flow (Expected)
```
[Login]
💾 tokenManager.setTokens called
   Access token length: 150
   Refresh token length: 150
✅ Tokens stored successfully
✅ Verification - Access token: PRESENT

[Subscription]
🔐 STEP 1: Verifying authentication token...
🔍 Checking for access token...
📦 All AsyncStorage keys: ['@capitalized_access_token', ...]
🔍 Token retrieval result: FOUND
✅ Token verified - proceeding with subscription
🔑 Token found and added to request
🔑 Authorization header: Bearer eyJhbGci...
```

### Failed Token Flow (Current Issue)
```
[Login]
💾 tokenManager.setTokens called
✅ Tokens stored successfully

[Later - Subscription]
🔐 STEP 1: Verifying authentication token...
🔍 Checking for access token...
📦 All AsyncStorage keys: []  // ❌ EMPTY!
🔍 Token retrieval result: NOT FOUND
❌ TOKEN MISSING - Cannot proceed
```

## Immediate Actions

### 1. Run Fresh Test
```bash
# Clear app data first
adb shell pm clear com.capitalized  # Android
# Or: Uninstall and reinstall app

# Start fresh logs
npx react-native log-android | tee subscription-debug.log

# Then:
# 1. Login
# 2. Complete flow to subscription
# 3. Try to subscribe
# 4. Check subscription-debug.log
```

### 2. Check for Token Clears
Search your codebase for these:
```bash
grep -r "clearAuth" src/
grep -r "clearTokens" src/
grep -r "clearAll" src/
grep -r "removeItem.*ACCESS_TOKEN" src/
```

Check if any are being called between login and subscription.

### 3. Verify AsyncStorage Permission
In `android/app/src/main/AndroidManifest.xml`, ensure no restrictions on storage.

### 4. Check RootNavigator Logic
The navigation logic might be triggering a logout:
- Check `src/navigation/RootNavigator.tsx`
- Look for conditions that call `clearAuth()`
- Ensure authenticated users stay authenticated

## Expected Fix

Once we identify where/why the token is being lost, the fix will likely be one of:

1. **Preserve tokens during navigation** - Ensure tokens aren't cleared when navigating between screens
2. **Fix async storage issue** - Ensure AsyncStorage has proper permissions
3. **Fix token storage timing** - Ensure tokens are fully written before navigation
4. **Remove erroneous logout** - Remove any automatic logout triggers

## Next Steps

1. ✅ Enhanced logging is now in place
2. ⏳ Run the app and attempt to subscribe
3. ⏳ Share the complete log output from login → subscription attempt
4. ⏳ We'll identify exactly where the token is lost
5. ⏳ Apply the appropriate fix

The detailed logs will tell us exactly what's happening! 🔍

