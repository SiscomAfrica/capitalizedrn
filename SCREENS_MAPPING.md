# Screen Mapping - UI Mockups to Implementation

This document maps the UI mockup images to the implemented screens in the application.

## Authentication Screens

### 1. Login Screen (`login.jpeg`)
**Implemented in**: `src/screens/auth/LoginScreen.tsx`

**Features**:
- Email input field
- "Send Code" button
- "Create account" link
- Decorative green squares in top-right
- Back button
- SISCOM CAPITALIZED branding

**Navigation**: Entry point → VerifyCode screen

---

### 2. Verify Code Screen (`verify.jpeg`)
**Implemented in**: `src/screens/auth/VerifyCodeScreen.tsx`

**Features**:
- 6 input boxes for verification code
- Auto-focus between inputs
- "Change email or resend code" link
- "Verify & Log In" button
- "Create account" link
- Decorative green squares in top-right

**Navigation**: After Login → Onboarding screen

---

### 3. Onboarding/KYC Screen (`kyc.jpeg`)
**Implemented in**: `src/screens/onboarding/OnboardingScreen.tsx`

**Features**:
- Progress bar at top (showing ~65% completion)
- "Tell us more about you!" heading
- About field (multiline text input)
- Job Title field
- Company field
- "Done" button
- "Skip" option
- Decorative green squares

**Navigation**: After VerifyCode → Main App (Home)

---

## Main Application Screens

### 4. Home Screen (`home.jpeg`)
**Implemented in**: `src/screens/main/HomeScreen.tsx`

**Features**:
- Dark purple header with "HOME" title
- Notification bell icon with badge (9)
- Profile picture placeholder
- **Featured Investments Section**:
  - Horizontal carousel with cards
  - Investment card showing:
    - "Featured" badge
    - Category badge (Technology)
    - Risk level badge (HIGH - red)
    - Title: "AI-POWERED HEALTHCARE STARTUP"
    - Description text
    - Min. Investment: $25,000
    - Expected Return: 300.00%
    - "0 interested" count
    - "View Details" button
  - Carousel dots below
- Search icon and filter icon
- **INVESTMENTS Section**:
  - Horizontal scrolling image cards
  - "View All" link

**Navigation**: 
- Investment cards → InvestmentDetailsScreen
- Bottom tabs for navigation

---

### 5. Event Details Screen (`eventdetails.jpeg`)
**Implemented in**: `src/screens/main/EventDetailsScreen.tsx`

**Features**:
- Dark purple header with "EVENT DETAILS"
- Back button
- Share and favorite icons
- **Three Tabs**: Overview, Schedule, Speakers
- **Overview Tab Content**:
  - Event description with "Read More"
  - **FEATURED SESSIONS**:
    - Purple gradient session cards
    - Tags: AI, All Access, Executive, Premier
    - Session title (truncated with ...)
    - Speaker name: Elizabeth Gore
    - Date and time
  - **FEATURED SPEAKERS**:
    - Horizontal scrolling speaker cards
    - Circular profile image placeholder
    - Name: Elizabeth Gore
    - Title: Co-Founder & President
    - Company name (truncated)
- Yellow "GET TICKET" button at bottom

**Navigation**:
- Back → Previous screen
- Schedule/Speakers tabs show different content

---

## Additional Implemented Screens

### 6. Events Screen
**Implemented in**: `src/screens/main/EventsScreen.tsx`

**Features**:
- List of events with cards
- Event metadata (location, date)
- "Upcoming" badge
- Click to view details

---

### 7. Community Screen
**Implemented in**: `src/screens/main/CommunityScreen.tsx`

**Features**:
- Placeholder for community features
- Feature cards for:
  - Discussion Forums
  - Networking Events
  - Investment Insights

---

### 8. Messages Screen
**Implemented in**: `src/screens/main/MessagesScreen.tsx`

**Features**:
- Message list with avatars
- Sender name
- Message preview
- Timestamp
- Unread indicators

---

### 9. Transactions Screen
**Implemented in**: `src/screens/main/TransactionsScreen.tsx`

**Features**:
- Portfolio value card
- Invested amount
- Returns (with positive indicator)
- Transaction history cards:
  - Type icons (💰, 📤, 📥, 💵)
  - Transaction description
  - Date
  - Amount
  - Status badges (completed, pending, failed)

---

### 10. Investment Details Screen
**Implemented in**: `src/screens/main/InvestmentDetailsScreen.tsx`

**Features**:
- Full-screen investment image
- Back button overlay
- Badges (Featured, Category, Risk)
- Title and description
- Stats cards (Min. Investment, Expected Return)
- Investment details section
- "Express Interest" button

---

## Bottom Tab Navigation

**Five Tabs** (as shown in mockups):
1. **Home** - Grid icon
2. **Events** - Document icon
3. **Community** - People icon
4. **Messages** - Chat bubble icon
5. **Transactions** - Dollar/wallet icon

**Current Implementation**: All tabs functional with placeholder icons (will need icon library for exact match)

---

## Design Consistency

All screens maintain:
- **Colors**: Deep purple (#2D1B69) for headers, bright green (#9FE870) for accents
- **Typography**: Bold headings, clear hierarchy
- **Spacing**: Consistent padding and margins
- **Shadows**: Subtle elevation on cards
- **Border Radius**: Rounded corners on all cards and buttons
- **Status Bar**: Light content on dark backgrounds

---

## Navigation Flow

```
Login → Verify Code → Onboarding → Main App
                                      ↓
                          ┌───────────┴───────────┐
                          │                       │
                     Home Tab                Events Tab
                          │                       │
                    Investment/             Event Details
                    Event Details
```

---

## Mock Data Integration

All screens use mock data from:
- `src/services/mockData.ts` - Static data
- `src/services/authService.ts` - Authentication flows
- `src/services/investmentService.ts` - Investment operations
- `src/services/eventService.ts` - Event operations

Ready for backend integration by replacing mock services with API calls.

