import { type NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Initialize Firebase for server-side middleware
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();
const firestore = getFirestore();

/**
 * Middleware for protecting admin routes
 * - Validates Firebase session
 * - Checks user role
 * - Redirects unauthorized users
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only protect routes starting with /admin
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  try {
    // Get Firebase auth token from cookies
    const authToken = request.cookies.get('__session')?.value;

    if (!authToken) {
      // No session, redirect to login
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Verify token and get user role from Firestore
    const currentUser = auth.currentUser;

    if (!currentUser) {
      // Session invalid, redirect to login
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Check user role from Firestore
    const userRef = doc(firestore, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists() || userSnap.data().role !== 'admin') {
      // User is not admin, redirect to 403
      return NextResponse.redirect(new URL('/403', request.url));
    }

    // User is authenticated admin, allow access
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, redirect to login for safety
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
}

/**
 * Configure which routes to run middleware on
 */
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
