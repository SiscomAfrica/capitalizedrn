# Subscription Logging Guide

## Enhanced Logging Added

I've added comprehensive logging throughout the subscription flow to help you track exactly what's being sent and received. The logs are organized with visual separators for easy reading.

## Where to View Logs

### React Native Debugger
```bash
# Open React Native debugger
npx react-native log-android    # For Android
npx react-native log-ios         # For iOS
```

### Metro Bundler Console
The logs will also appear in your Metro bundler terminal window.

### Chrome DevTools
1. Open app in development mode
2. Shake device or press `Cmd+M` (iOS) / `Cmd+M` (Android)
3. Select "Debug"
4. Open Chrome DevTools console

## Log Formats

### 1. Paid Subscription Flow

When you click **"Subscribe"** on a paid plan, you'll see:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 SUBSCRIPTION REQUEST INITIATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Plan Details:
  - Plan ID: 8b3494d3-b63a-4540-b36a-46547956a592
  - Plan Name: Basic
  - Price: KES 1000.00
  - Duration: 30 days
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 REQUEST PAYLOAD:
{
  "plan_id": "8b3494d3-b63a-4540-b36a-46547956a592"
}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 subscriptionApi.subscribe() called
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 API Request Details:
  - Endpoint: POST /subscriptions/subscribe
  - Plan ID: 8b3494d3-b63a-4540-b36a-46547956a592
  - Request Body: {
      "plan_id": "8b3494d3-b63a-4540-b36a-46547956a592"
    }
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 API Request:
  - method: POST
  - url: /subscriptions/subscribe
  - baseURL: https://siscom.africa/api/v1
  - fullURL: https://siscom.africa/api/v1/subscriptions/subscribe
  - hasToken: true
  - tokenPreview: eyJhbGciOiJIUzI1NiIs...
  - headers: {
      Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
      Content-Type: application/json
      Accept: application/json
    }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ subscriptionApi.subscribe() successful
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📥 API Response:
{
  "success": true,
  "message": "Subscription initiated. Complete payment on your phone.",
  "subscription": {
    "id": "uuid-here",
    "status": "pending",
    "plan_id": "8b3494d3-b63a-4540-b36a-46547956a592"
  },
  "payment_info": {
    "provider": "mpesa",
    "amount": "1000.00",
    "currency": "KES"
  }
}
  - HTTP Status: 201
  - Status Text: Created
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SUBSCRIPTION RESPONSE RECEIVED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📥 Full Response:
{
  "success": true,
  "message": "Subscription initiated. Complete payment on your phone.",
  "subscription": {...},
  "payment_info": {...}
}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Response Details:
  - Success: true
  - Message: Subscription initiated. Complete payment on your phone.
  - Subscription Object: {...}
  - Payment Info: {...}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Subscription successful! Updating user state...
```

### 2. Free Trial Flow

When you click **"Start Free Trial"**, you'll see:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎁 FREE TRIAL REQUEST INITIATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Trial Details:
  - Duration: 7 days
  - Cost: FREE
  - Limitation: One per user
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 REQUEST: POST /subscriptions/start-trial
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎁 subscriptionApi.startTrial() called
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 API Request Details:
  - Endpoint: POST /subscriptions/start-trial
  - Request Body: (empty - no payload required)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔑 Token found and added to request
🔑 Authorization header: Bearer eyJhbGciOiJIUzI1NiIs...

🚀 API Request:
  - method: POST
  - url: /subscriptions/start-trial
  - baseURL: https://siscom.africa/api/v1
  - fullURL: https://siscom.africa/api/v1/subscriptions/start-trial
  - hasToken: true
  - tokenPreview: eyJhbGciOiJIUzI1NiIs...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ subscriptionApi.startTrial() successful
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📥 API Response:
{
  "success": true,
  "message": "Free trial started successfully",
  "subscription": {
    "id": "uuid-here",
    "status": "active",
    "is_trial": true,
    "days_remaining": 7
  }
}
  - HTTP Status: 201
  - Status Text: Created
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ FREE TRIAL RESPONSE RECEIVED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📥 Full Response:
{
  "success": true,
  "message": "Free trial started successfully",
  "subscription": {...}
}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Response Details:
  - Success: true
  - Message: Free trial started successfully
  - Subscription Object: {...}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Free trial started successfully! Updating user state...
```

### 3. Error Scenarios

If something goes wrong, you'll see detailed error logs:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ SUBSCRIPTION ERROR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Full Error Object: {...}
📥 Error Response Data:
{
  "error": "Subscription already exists",
  "message": "You already have an active subscription"
}
  - Status Code: 400
  - Status Text: Bad Request
  - Headers: {...}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Key Information in Logs

### Request Information
- ✅ **Endpoint URL**: Full API endpoint being called
- ✅ **HTTP Method**: POST, GET, etc.
- ✅ **Request Payload**: Exact JSON being sent
- ✅ **Bearer Token**: Confirmation that token is attached
- ✅ **Token Preview**: First 20 chars of token
- ✅ **Headers**: All request headers including Authorization

### Response Information
- ✅ **Status Code**: HTTP status (200, 201, 400, 401, etc.)
- ✅ **Status Text**: HTTP status text
- ✅ **Response Body**: Complete JSON response
- ✅ **Success Flag**: Boolean success indicator
- ✅ **Message**: Server message
- ✅ **Data Objects**: subscription, payment_info, etc.

### Error Information
- ✅ **Error Type**: Network, server, validation, etc.
- ✅ **Error Message**: User-friendly error message
- ✅ **Status Code**: HTTP error code
- ✅ **Server Response**: Full error response from server
- ✅ **Request Details**: What was sent when error occurred

## Testing Scenarios

### Scenario 1: Successful Subscription
**Steps:**
1. Navigate to Subscription screen
2. Click on a plan card
3. View plan details
4. Click "Subscribe"
5. Confirm in dialog

**Expected Logs:**
- Request initiated with plan details
- Bearer token attached
- POST request to `/subscriptions/subscribe`
- 201 response with subscription and payment info
- User state updated
- Navigation to MainTabs

### Scenario 2: Free Trial Activation
**Steps:**
1. Navigate to Subscription screen
2. Click "Start Free Trial" button
3. Confirm in dialog

**Expected Logs:**
- Trial request initiated
- Bearer token attached
- POST request to `/subscriptions/start-trial`
- 201 response with trial subscription
- User state updated
- Navigation to MainTabs

### Scenario 3: Already Subscribed Error
**Steps:**
1. Try to subscribe when already having active subscription

**Expected Logs:**
- Request initiated
- 400 Bad Request error
- Error message: "Already subscribed" or similar
- Alert shown to user

### Scenario 4: Trial Already Used
**Steps:**
1. Try to start trial when already used once

**Expected Logs:**
- Trial request initiated
- 400 Bad Request error
- Error message: "Trial already used"
- Alert shown to user

### Scenario 5: Unauthorized (No Token)
**Steps:**
1. Try to subscribe without being logged in

**Expected Logs:**
- ⚠️ No token found in storage!
- 401 Unauthorized error
- Automatic logout and redirect to login

## Bearer Token Verification

The logs explicitly show:

1. **Token Storage Check**:
   ```
   🔑 Token found and added to request
   🔑 Full token: eyJhbGciOiJIUzI1NiIs...
   🔑 Authorization header: Bearer eyJhbGciOiJIUzI1NiIs...
   ```

2. **Token Preview**:
   ```
   hasToken: true
   tokenPreview: eyJhbGciOiJIUzI1NiIs...
   ```

3. **Authorization Header**:
   ```
   headers: {
     Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
     Content-Type: application/json
     Accept: application/json
   }
   ```

## Debugging Tips

### Check Token Presence
Look for these log lines:
- ✅ `🔑 Token found and added to request` - Token is present
- ❌ `⚠️ No token found in storage!` - Token missing (user not logged in)

### Check Request Format
Verify:
- Request payload matches API specification
- `plan_id` is a valid UUID
- Content-Type is application/json

### Check Response Structure
Verify:
- `success` field is present
- `message` field contains server message
- `subscription` object has required fields
- HTTP status code matches expectation (201 for success)

### Common Issues

1. **401 Unauthorized**:
   - Token expired or invalid
   - User not logged in
   - Check token storage

2. **400 Bad Request**:
   - Invalid plan_id
   - Already subscribed
   - Trial already used
   - Missing required fields

3. **Network Error**:
   - No internet connection
   - API server down
   - Request timeout

4. **500 Server Error**:
   - Backend server issue
   - Contact backend team

## Filter Logs

To filter only subscription-related logs in terminal:

```bash
# Android
adb logcat | grep -E "💳|🎁|subscriptionApi"

# iOS  
react-native log-ios | grep -E "💳|🎁|subscriptionApi"
```

## Production Logs

⚠️ **Important**: These detailed logs are for development only. 

For production, you should:
1. Remove sensitive token logging
2. Reduce log verbosity
3. Use proper error tracking (Sentry, etc.)
4. Keep only essential user-facing logs

## Next Steps

1. **Run the app** in development mode
2. **Navigate** to subscription screen
3. **Click** on a plan or free trial
4. **Watch the console** for detailed logs
5. **Share logs** with the team for debugging

All the logging is now in place - just subscribe to a plan and you'll see everything that's being sent and received! 🚀

