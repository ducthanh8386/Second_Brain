# App Layout Architecture — Second Brain

## Overview

The AI Second Brain app uses a modern, responsive layout architecture built on Next.js 14 App Router with Tailwind CSS.

---

## File Structure

```
second-brain/
├── app/
│   ├── layout.tsx                    # Root layout (fonts, metadata, AuthProvider)
│   ├── page.tsx                      # Landing page
│   ├── (dashboard)/                  # Dashboard group layout
│   │   ├── layout.tsx                # Sidebar + Header assembly
│   │   ├── page.tsx                  # Dashboard home
│   │   ├── notes/
│   │   │   └── page.tsx              # Notes list page
│   │   ├── review/
│   │   │   └── page.tsx              # Review queue page
│   │   └── settings/
│   │       └── page.tsx              # User settings page
│   └── auth/
│       ├── sign-in/
│       │   └── page.tsx              # Login page
│       └── register/
│           └── page.tsx              # Signup page
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx               # Navigation sidebar
│   │   └── Header.tsx                # Top header with user menu
│   ├── auth/
│   │   ├── AuthForm.tsx              # Email/Google login form
│   │   ├── AuthProvider.tsx          # Auth state provider
│   │   └── ProtectedRoute.tsx        # Route protection wrapper
│   └── ui/                           # Reusable UI components (future)
│
├── lib/
│   ├── firebase/
│   │   ├── config.ts                 # Firebase initialization
│   │   └── auth.ts                   # Auth helpers (logout, etc.)
│   └── utils.ts                      # Utility functions (cn, etc.)
│
├── store/
│   └── useAuthStore.ts               # Zustand auth store
│
├── hooks/
│   └── useAuthListener.ts            # Firebase auth listener
│
└── types/
    └── (future type definitions)
```

---

## Component Hierarchy

### Root Layout (`app/layout.tsx`)

- Configures Next.js metadata and fonts
- Wraps entire app with `<AuthProvider />`
- Sets up HTML structure with Google Fonts (Inter, JetBrains Mono)

### Landing Page (`app/page.tsx`)

- Public page shown to unauthenticated users
- Hero section with feature highlights
- CTA buttons to sign in / register

### Auth Pages (`app/auth/sign-in/page.tsx` and `app/auth/register/page.tsx`)

- Use `<AuthForm />` component
- Support both email/password and Google OAuth
- Redirect to dashboard on successful auth

### Dashboard Layout (`app/(dashboard)/layout.tsx`)

```
Dashboard Group
├── <Sidebar />
│   └── Navigation menu (Dashboard, Notes, Review, Settings)
└── <ProtectedRoute>
    ├── <Header />
    │   ├── Mobile menu toggle
    │   ├── Dark mode toggle
    │   └── User profile dropdown
    └── <main>
        └── Page content (notes, review, settings, etc.)
```

---

## Component Descriptions

### Sidebar (`components/layout/Sidebar.tsx`)

**Purpose**: Main navigation menu

**Features**:
- Mobile-responsive (hidden on small screens, toggled via header button)
- Active route highlighting
- Brand logo and app name
- Navigation links with icons (lucide-react)
- Version info in footer

**Key Props**:
- `isOpen: boolean` — visibility on mobile
- `onClose: () => void` — close sidebar callback

**Styling**:
- Fixed position with overlay on mobile
- Smooth slide-in/out animation
- Dark mode support

### Header (`components/layout/Header.tsx`)

**Purpose**: Top navigation bar with user menu

**Features**:
- Mobile menu toggle button
- Dark mode toggle
- User profile dropdown with logout
- Sticky positioning
- Avatar display (photo or initials)

**Integrations**:
- Uses `useAuthStore` to access user info
- Uses `logoutUser()` from Firebase auth utils
- Handles dropdown with ref-based outside click detection

**Dark Mode**:
- Toggle updates `document.documentElement.classList`
- Persists preference (can be enhanced with localStorage)

### AuthForm (`components/auth/AuthForm.tsx`)

**Purpose**: Unified login/signup form

**Features**:
- Toggle between login and signup modes
- Email input with validation
- Password input with show/hide toggle
- Google OAuth integration
- Error message display
- Loading state with spinner
- Vietnamese error messages

**Firebase Integration**:
- Uses `signInWithEmailAndPassword()`
- Uses `createUserWithEmailAndPassword()`
- Uses `signInWithPopup()` with GoogleAuthProvider
- Updates Zustand store on successful auth

### ProtectedRoute (`components/auth/AuthProvider.tsx`)

**Purpose**: Route protection wrapper

**Features**:
- Checks auth state before rendering page
- Shows loading spinner while checking auth
- Shows auth required message if not logged in
- Can be used on any page that requires authentication

---

## Styling Approach

### Tailwind CSS

- **Mobile-first**: base styles are mobile, then use `md:`, `lg:` breakpoints
- **Dark mode**: use `dark:` prefix for dark mode styles
- **Responsive**: full breakpoint support (sm, md, lg, xl, 2xl)

### Breakpoints

- `sm: 640px` — tablets
- `md: 768px` — small desktops
- `lg: 1024px` — large desktops
- `xl: 1280px` — extra large

### Color Palette

- **Primary**: `blue-600` / `blue-700` for buttons, active states
- **Secondary**: `purple-600` for accent
- **Backgrounds**: `white` / `dark:black`, `gray-50` / `dark:zinc-900`
- **Text**: `gray-900` / `dark:white`, `gray-600` / `dark:gray-400`
- **Borders**: `gray-200` / `dark:zinc-800`

---

## Authentication Flow

1. **Unauthenticated user** → lands on `app/page.tsx` (landing page)
2. **Clicks "Sign In"** → redirects to `app/auth/sign-in/page.tsx`
3. **Uses AuthForm** → calls Firebase auth method
4. **On success**:
   - Firebase auth state changes
   - `useAuthListener()` picks up change
   - Zustand store updates
   - Auth state persists via Firebase
5. **On next visit** → automatically logged in if session valid

---

## Dark Mode Implementation

Currently implemented via:
- Button toggle in header
- Updates `document.documentElement.classList.add/remove('dark')`
- Can be enhanced to persist in localStorage or Firebase user preferences

To enable persistent dark mode:
1. Store preference in `localStorage` or user document in Firestore
2. Read on app mount and apply to HTML element
3. Sync with system preference (`prefers-color-scheme`)

---

## Mobile Responsive Design

### Sidebar

- Hidden by default on mobile (`lg:hidden`)
- Toggleable via header button
- Full-height overlay when open
- Smooth slide-in animation

### Header

- Always visible
- Menu button visible only on mobile (`lg:hidden`)
- User menu always visible
- Sticky positioning

### Main Content

- Padding adjusts responsively
- Full-width on mobile, max-width container on desktop
- Grid layouts adapt (1 column mobile, 2-3 columns desktop)

---

## Integration Points

### Firebase Auth

- **Config**: `lib/firebase/config.ts`
- **Auth helpers**: `lib/firebase/auth.ts` (logout, getIdToken)
- **Listener**: `hooks/useAuthListener.ts` (syncs with Zustand)

### Zustand Store

- **File**: `store/useAuthStore.ts`
- **State**: `user`, `isLoading`, `error`
- **Used by**: Header, ProtectedRoute, AuthForm

### Route Protection

- Wrap pages with `<ProtectedRoute>` in layout
- Or manually check `useAuthStore()` in components
- Redirect via Next.js router can be added if needed

---

## Environment Setup

### Required Environment Variables

Create `.env.local` based on `.env.example`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Dependencies

```bash
npm install firebase zustand lucide-react tailwindcss
```

---

## Development

### Run Development Server

```bash
npm run dev
```

Then open `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

---

## Next Steps

1. **Complete auth** → test sign-in/register flow
2. **Add note creation** → create note form and handler
3. **Build AI pipeline** → integrate Gemini API
4. **Design Firestore schema** → implement data persistence
5. **Add spaced repetition** → build review engine
6. **Polish UI** → create additional components and pages

---

## Troubleshooting

**Sidebar not closing on mobile after nav click**:
- Check `onClose` callback is passed correctly
- Verify Sidebar receives `isOpen` state

**Dark mode not persisting**:
- Add localStorage integration
- Save preference to user Firestore document

**Auth not persisting**:
- Check Firebase persistence is enabled in `config.ts`
- Verify `useAuthListener` is called in root layout

**Protected routes showing blank**:
- Ensure `<AuthProvider>` wraps entire app
- Check `useAuthListener` hook is called
- Verify Zustand store is updated correctly
