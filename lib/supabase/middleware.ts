/**
 * Next.js Middleware Session Refresh & Role Access Control Layer
 * Manages Supabase Auth cookie exchange and strictly enforces RBAC.
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database, UserRole } from '@/types/database.types';

// Map of route prefixes to the required user role
export const ROLE_ROUTE_ACCESS: { prefix: string; role: UserRole }[] = [
  { prefix: '/admin', role: 'admin' },
  { prefix: '/teacher', role: 'teacher' },
  { prefix: '/finance', role: 'accountant' },
  { prefix: '/parent', role: 'parent' },
  { prefix: '/student', role: 'student' },
];

// Default landing dashboard for each authorized role
export const ROLE_DEFAULT_PATHS: Record<UserRole, string> = {
  admin: '/admin',
  teacher: '/teacher',
  accountant: '/finance',
  parent: '/parent',
  student: '/student',
};

/**
 * Validates session, refreshes tokens if needed, and checks RBAC authorization.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-school-demo.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key-school-mgmt-system-2025';

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Security Note: Use getUser() instead of getSession() to guarantee server-side JWT verification
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Check if current route is protected by a specific role
  const matchedRoute = ROLE_ROUTE_ACCESS.find((route) =>
    pathname.startsWith(route.prefix)
  );

  // 1. Unauthenticated users trying to access ANY role-protected route
  if (!user || authError) {
    if (matchedRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // 2. Fetch authenticated user's profile and active role
  // We query the 'profiles' table for the current user's assigned role
  let userRole: UserRole | null = (user.user_metadata?.role as UserRole) || null;

  if (!userRole) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single();

    if (profile) {
      const typedProfile = profile as unknown as { role: UserRole; is_active: boolean };
      userRole = typedProfile.role;
    }
  }

  // Fallback default role if profile is missing
  const effectiveRole: UserRole = userRole || 'student';

  // 3. Authenticated user visiting /login -> redirect immediately to their role dashboard
  if (pathname === '/login' || pathname === '/') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = ROLE_DEFAULT_PATHS[effectiveRole] || '/login';
    redirectUrl.searchParams.delete('redirectTo');
    return NextResponse.redirect(redirectUrl);
  }

  // 4. Authenticated user attempting to access a route forbidden for their role
  if (matchedRoute && matchedRoute.role !== effectiveRole) {
    // Redirect to their own role's authorized dashboard
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = ROLE_DEFAULT_PATHS[effectiveRole];
    // Attach an advisory query param to notify the user why they were routed
    redirectUrl.searchParams.set('denied', matchedRoute.role);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
