# PHASE 1 - TASK 4: App Layout — Quick Reference

## Files Created

### Root Layout
- **`app/layout.tsx`** — Global layout with metadata, fonts, AuthProvider

### Pages
- **`app/page.tsx`** — Landing page (public)
- **`app/(dashboard)/page.tsx`** — Dashboard home (protected)
- **`app/(dashboard)/notes/page.tsx`** — Notes list (protected)
- **`app/(dashboard)/review/page.tsx`** — Review queue (protected)
- **`app/(dashboard)/settings/page.tsx`** — User settings (protected)
- **`app/auth/sign-in/page.tsx`** — Login page
- **`app/auth/register/page.tsx`** — Signup page

### Layout Components
- **`app/(dashboard)/layout.tsx`** — Dashboard layout with Sidebar + Header
- **`components/layout/Sidebar.tsx`** — Navigation sidebar (mobile responsive)
- **`components/layout/Header.tsx`** — Top header with user menu & dark mode

### Auth Components
- **`components/auth/AuthProvider.tsx`** — Auth listener + protected route wrapper

### Configuration & Utilities
- **`lib/firebase/config.ts`** — Firebase SDK initialization (auth, Firestore, Storage)
- **`lib/firebase/auth.ts`** — Auth helper functions (logout, getIdToken)
- **`lib/utils.ts`** — Utility function `cn()` for classname combining
- **`store/useAuthStore.ts`** — Zustand global auth store
- **`hooks/useAuthListener.ts`** — Custom hook to listen for auth state changes

### Documentation
- **`LAYOUT_ARCHITECTURE.md`** — Comprehensive layout documentation
- **`.env.example`** — Environment variables template

---

## Key Integration Points

### AuthProvider Setup (in Root Layout)
```tsx
<AuthProvider>
  {children}
</AuthProvider>
```
- Initializes Firebase auth listener
- Watches for auth state changes
- Updates Zustand store automatically

### Protected Pages (in Dashboard Group Layout)
```tsx
<ProtectedRoute>
  {children}
</ProtectedRoute>
```
- Checks if user is authenticated
- Shows loading spinner while checking
- Shows "auth required" message if not authenticated

### Responsive Layout (Mobile-First)
- Sidebar hidden on mobile, toggle via header button
- Header always visible
- Main content with responsive padding and max-width

### Dark Mode
- Toggle button in header
- Updates `document.documentElement.classList`
- Can be persisted to localStorage or user preferences

---

## Testing Checklist

- [ ] Clone/pull the project
- [ ] Run `npm install` in the second-brain directory
- [ ] Create `.env.local` with Firebase credentials
- [ ] Run `npm run dev`
- [ ] Visit `http://localhost:3000`
  - [ ] Landing page loads
  - [ ] Navigation links work
  - [ ] Dark mode toggle works
- [ ] Click "Sign In" → go to `/auth/sign-in`
  - [ ] AuthForm displays
  - [ ] Email/password login works (with valid Firebase config)
  - [ ] Google login shows (if OAuth configured)
- [ ] After login → redirected to `/dashboard`
  - [ ] Sidebar shows with active navigation
  - [ ] Header shows user email
  - [ ] Mobile: menu toggle works
- [ ] Click user profile dropdown → logout option
- [ ] Logout → redirected to landing page

---

## Architecture Summary

```
Landing (public)
    ↓
Auth Pages (public)
    ↓
Dashboard (protected)
├── Sidebar (nav)
├── Header (user menu)
└── Pages (notes, review, settings)
```

**Auth Flow**:
1. User logs in → Firebase auth state changes
2. `useAuthListener()` detects change
3. Zustand store updates with user data
4. ProtectedRoute sees authenticated user
5. Dashboard renders with full UI

**State Management**:
- Global: `useAuthStore` (user, isLoading, error)
- Local: component state for UI toggles, forms
- Persistent: Firebase session (via LOCAL persistence)

---

## Next Phase Tasks

**PHASE 1 - Task 5**: Server Actions for notes/AI
**PHASE 1 - Task 6**: Note creation form & UI
**PHASE 1 - Task 7**: AI integration with Gemini 1.5 Flash
**PHASE 2**: Full spaced repetition engine
