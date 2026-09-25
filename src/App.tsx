/**
 * EduCore - School Management System
 * Interactive Workbench & Next.js SSR Multi-Role Architecture Sandbox
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Code2,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  School,
  Users,
  Copy,
  Check,
  ExternalLink,
  Laptop,
  Compass,
  FileCode,
  Database,
  Lock,
  LogOut,
  Info,
  ChevronRight,
  FileCheck,
} from 'lucide-react';

import LoginPage, { DEMO_CREDENTIALS } from '../app/login/page';
import Sidebar, { ROLE_THEMES } from '../components/Sidebar';
import AdminDashboardPage from '../app/(dashboard)/admin/page';
import TeacherDashboardPage from '../app/(dashboard)/teacher/page';
import FinanceDashboardPage from '../app/(dashboard)/finance/page';
import ParentDashboardPage from '../app/(dashboard)/parent/page';
import StudentDashboardPage from '../app/(dashboard)/student/page';
import { ROLE_DEFAULT_PATHS, ROLE_ROUTE_ACCESS } from '../lib/supabase/middleware';
import type { Profile, UserRole } from '../types/database.types';

// Mock profiles for our live simulator
const PRESET_PROFILES: Record<UserRole, Profile> = {
  admin: {
    id: 'user-admin-uuid-001',
    email: 'admin@educore.edu',
    full_name: 'Dr. Arthur Pendelton',
    avatar_url: null,
    role: 'admin',
    phone_number: '+1 (555) 234-5678',
    department: 'Administration',
    student_id: null,
    is_active: true,
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-09-20T12:00:00Z',
  },
  teacher: {
    id: 'user-teacher-uuid-002',
    email: 'teacher@educore.edu',
    full_name: 'Sarah Jenkins, M.Sc.',
    avatar_url: null,
    role: 'teacher',
    phone_number: '+1 (555) 876-5432',
    department: 'Physics & STEM',
    student_id: null,
    is_active: true,
    created_at: '2024-02-01T08:00:00Z',
    updated_at: '2024-09-20T12:00:00Z',
  },
  accountant: {
    id: 'user-finance-uuid-003',
    email: 'finance@educore.edu',
    full_name: 'Marcus Sterling, CPA',
    avatar_url: null,
    role: 'accountant',
    phone_number: '+1 (555) 345-6789',
    department: 'Bursar & Finance Office',
    student_id: null,
    is_active: true,
    created_at: '2024-01-20T08:00:00Z',
    updated_at: '2024-09-20T12:00:00Z',
  },
  parent: {
    id: 'user-parent-uuid-004',
    email: 'parent@educore.edu',
    full_name: 'Elena Rostova',
    avatar_url: null,
    role: 'parent',
    phone_number: '+1 (555) 987-6543',
    department: null,
    student_id: null,
    is_active: true,
    created_at: '2024-03-10T08:00:00Z',
    updated_at: '2024-09-20T12:00:00Z',
  },
  student: {
    id: 'user-student-uuid-005',
    email: 'student@educore.edu',
    full_name: 'Lucas Chen',
    avatar_url: null,
    role: 'student',
    phone_number: '+1 (555) 432-1098',
    department: null,
    student_id: 'EDU-2024-041',
    is_active: true,
    created_at: '2024-08-25T08:00:00Z',
    updated_at: '2024-09-20T12:00:00Z',
  },
};

const CODE_FILES: { title: string; filename: string; category: string; description: string; code: string }[] = [
  {
    title: 'Server SSR Client',
    filename: '/lib/supabase/server.ts',
    category: 'Supabase SSR',
    description: 'Server Component, Action, & Route Handler client with safe cookie handling.',
    code: `import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Ignored when called from Server Components
          }
        },
      },
    }
  );
}`,
  },
  {
    title: 'Browser Client',
    filename: '/lib/supabase/client.ts',
    category: 'Supabase SSR',
    description: 'Browser singleton client utilizing createBrowserClient.',
    code: `import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (clientInstance) return clientInstance;

  clientInstance = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return clientInstance;
}`,
  },
  {
    title: 'Middleware Session & RBAC',
    filename: '/lib/supabase/middleware.ts',
    category: 'RBAC Engine',
    description: 'Performs token refresh and executes role-based route enforcement.',
    code: `import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database, UserRole } from '@/types/database.types';

export const ROLE_ROUTE_ACCESS: { prefix: string; role: UserRole }[] = [
  { prefix: '/admin', role: 'admin' },
  { prefix: '/teacher', role: 'teacher' },
  { prefix: '/finance', role: 'accountant' },
  { prefix: '/parent', role: 'parent' },
  { prefix: '/student', role: 'student' },
];

export const ROLE_DEFAULT_PATHS: Record<UserRole, string> = {
  admin: '/admin',
  teacher: '/teacher',
  accountant: '/finance',
  parent: '/parent',
  student: '/student',
};

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Authenticate user with Supabase Auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const matchedRoute = ROLE_ROUTE_ACCESS.find((r) => pathname.startsWith(r.prefix));

  // 1. Unauthenticated users -> redirect to /login
  if (!user || authError) {
    if (matchedRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // 2. Fetch User Role from profiles table
  let userRole: UserRole | null = (user.user_metadata?.role as UserRole) || null;
  if (!userRole) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile) userRole = profile.role as UserRole;
  }

  const effectiveRole: UserRole = userRole || 'student';

  // 3. Authenticated user hitting /login -> route to their role dashboard
  if (pathname === '/login' || pathname === '/') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = ROLE_DEFAULT_PATHS[effectiveRole] || '/admin';
    return NextResponse.redirect(redirectUrl);
  }

  // 4. Role authorization check
  if (matchedRoute && matchedRoute.role !== effectiveRole) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = ROLE_DEFAULT_PATHS[effectiveRole];
    redirectUrl.searchParams.set('denied', matchedRoute.role);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}`,
  },
  {
    title: 'Root Middleware Matcher',
    filename: '/middleware.ts',
    category: 'Next.js Edge',
    description: 'Registers updateSession on all app routes while ignoring static assets.',
    code: `import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};`,
  },
  {
    title: 'Dynamic Sidebar Shell',
    filename: '/components/Sidebar.tsx',
    category: 'UI Components',
    description: 'Fetches role from profiles table and renders tailored navigation links.',
    code: `// Role navigation mapping
export const ROLE_NAVIGATION = {
  admin: { label: 'Administration & Ops', items: [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Classes', href: '/admin/classes' },
    { name: 'Academic Years', href: '/admin/academic-years' },
    { name: 'Settings', href: '/admin/settings' },
  ]},
  teacher: { label: 'Faculty & Instruction', items: [
    { name: 'Dashboard', href: '/teacher' },
    { name: 'My Classes', href: '/teacher/classes' },
    { name: 'Attendance', href: '/teacher/attendance' },
    { name: 'Gradebook', href: '/teacher/gradebook' },
    { name: 'Assignments', href: '/teacher/assignments' },
  ]},
  accountant: { label: 'Financial Management', items: [
    { name: 'Dashboard', href: '/finance' },
    { name: 'Fee Structures', href: '/finance/fee-structures' },
    { name: 'Invoices', href: '/finance/invoices' },
    { name: 'Payment History', href: '/finance/payments' },
  ]},
  parent: { label: 'Parent Portal', items: [
    { name: 'Dashboard', href: '/parent' },
    { name: 'My Children', href: '/parent/children' },
    { name: 'Report Cards', href: '/parent/report-cards' },
    { name: 'Fee Bills', href: '/parent/fees' },
  ]},
  student: { label: 'Student Workspace', items: [
    { name: 'Dashboard', href: '/student' },
    { name: 'Assignments', href: '/student/assignments' },
    { name: 'Grades', href: '/student/grades' },
    { name: 'Timetable', href: '/student/timetable' },
  ]},
};`,
  },
  {
    title: 'PostgreSQL Schema & RLS',
    filename: '/supabase/schema.sql',
    category: 'Database SQL',
    description: 'Profiles table, user_role enum, RLS policies, and auth trigger.',
    code: `CREATE TYPE public.user_role AS ENUM (
  'admin', 'teacher', 'accountant', 'parent', 'student'
);

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role public.user_role NOT NULL DEFAULT 'student',
  phone_number TEXT,
  department TEXT,
  student_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

-- Admins have full access
CREATE POLICY "Admins have full access"
  ON public.profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );`,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'app' | 'inspector' | 'guide'>('app');
  const [currentUser, setCurrentUser] = useState<Profile | null>(PRESET_PROFILES.admin);
  const [currentPath, setCurrentPath] = useState<string>('/admin');
  const [targetUrlInput, setTargetUrlInput] = useState<string>('/admin');
  const [middlewareLog, setMiddlewareLog] = useState<{
    status: 'allow' | 'redirect' | 'denied';
    message: string;
    details: string;
  }>({
    status: 'allow',
    message: '200 OK — Allowed by Edge Middleware',
    details: 'User authenticated with role "admin". Authorized for /admin routes.',
  });

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedCodeFile, setSelectedCodeFile] = useState(0);

  // Execute Next.js middleware simulation logic whenever user navigates or changes path
  const simulateMiddlewareNavigation = (newPath: string, testUser: Profile | null = currentUser) => {
    setTargetUrlInput(newPath);

    // 1. Check if route is protected
    const matchedRoute = ROLE_ROUTE_ACCESS.find((r) => newPath.startsWith(r.prefix));

    if (!testUser) {
      if (matchedRoute) {
        setMiddlewareLog({
          status: 'redirect',
          message: '307 Temporary Redirect -> /login',
          details: `Unauthenticated request to protected route "${newPath}". Middleware redirected user to /login?redirectTo=${encodeURIComponent(newPath)}.`,
        });
        setCurrentPath('/login');
        return;
      }
      setMiddlewareLog({
        status: 'allow',
        message: '200 OK — Public Route',
        details: `Request to "${newPath}" permitted without authentication.`,
      });
      setCurrentPath(newPath);
      return;
    }

    // User is authenticated
    if (newPath === '/login' || newPath === '/') {
      const defaultRolePath = ROLE_DEFAULT_PATHS[testUser.role];
      setMiddlewareLog({
        status: 'redirect',
        message: `307 Temporary Redirect -> ${defaultRolePath}`,
        details: `User already signed in with role "${testUser.role}". Visiting login triggers automatic route to role dashboard.`,
      });
      setCurrentPath(defaultRolePath);
      return;
    }

    // Role-based access enforcement
    if (matchedRoute) {
      if (matchedRoute.role !== testUser.role) {
        const authorizedPath = ROLE_DEFAULT_PATHS[testUser.role];
        setMiddlewareLog({
          status: 'denied',
          message: `307 Redirect (Forbidden Scope) -> ${authorizedPath}`,
          details: `Role "${testUser.role}" does NOT have permission for "${matchedRoute.prefix}/*" (requires role "${matchedRoute.role}"). Redirected to authorized dashboard.`,
        });
        setCurrentPath(authorizedPath);
        return;
      }
    }

    setMiddlewareLog({
      status: 'allow',
      message: '200 OK — Access Granted',
      details: `Role "${testUser.role}" is authorized to access route "${newPath}".`,
    });
    setCurrentPath(newPath);
  };

  const handleRoleQuickSwitch = (role: UserRole) => {
    const profile = PRESET_PROFILES[role];
    setCurrentUser(profile);
    const dest = ROLE_DEFAULT_PATHS[role];
    simulateMiddlewareNavigation(dest, profile);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    simulateMiddlewareNavigation('/login', null);
  };

  const handleLoginSuccess = (role: UserRole, email: string) => {
    const profile: Profile = {
      ...PRESET_PROFILES[role],
      email: email || PRESET_PROFILES[role].email,
    };
    setCurrentUser(profile);
    const dest = ROLE_DEFAULT_PATHS[role];
    simulateMiddlewareNavigation(dest, profile);
  };

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Application Control Toolbar */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-bold">
            <School className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">EduCore</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Next.js + Supabase SSR
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('app')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'app'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('inspector')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'inspector'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code & Architecture ({CODE_FILES.length} Files)</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'guide'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>RBAC Matrix & Guide</span>
          </button>
        </div>

        {/* User Role Quick Switch Pill */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">Active Role:</span>
              <div className="relative group">
                <button className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-white hover:bg-slate-700 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="capitalize">{currentUser.role}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({currentUser.full_name})</span>
                </button>
                {/* Role Switcher Menu */}
                <div className="absolute right-0 mt-1 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 z-50 hidden group-hover:block">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                    Switch Test Persona
                  </div>
                  {(['admin', 'teacher', 'accountant', 'parent', 'student'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleQuickSwitch(r)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                        currentUser.role === r ? 'font-bold text-blue-400 bg-slate-800/50' : 'text-slate-300'
                      }`}
                    >
                      <span className="capitalize">{r}</span>
                      {currentUser.role === r && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                  <div className="border-t border-slate-800 mt-1 pt-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out (Unauthenticate)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleRoleQuickSwitch('admin')}
              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'app' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Edge Middleware URL Bar & Realtime Inspector */}
            <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2 shrink-0">
              {/* Simulated Browser URL bar */}
              <div className="flex items-center gap-2 flex-1 max-w-xl">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 w-full">
                  <span className="text-slate-500 font-sans font-semibold">https://school.domain</span>
                  <input
                    type="text"
                    value={targetUrlInput}
                    onChange={(e) => setTargetUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') simulateMiddlewareNavigation(targetUrlInput);
                    }}
                    placeholder="/admin"
                    className="bg-transparent text-white focus:outline-none flex-1 font-mono text-xs"
                  />
                  <button
                    onClick={() => simulateMiddlewareNavigation(targetUrlInput)}
                    className="px-2 py-0.5 rounded bg-blue-600 text-[11px] font-semibold text-white hover:bg-blue-500 transition-colors"
                  >
                    Go
                  </button>
                </div>
              </div>

              {/* Quick Path Route Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                <span className="text-[11px] text-slate-400 uppercase font-bold shrink-0">Test Route:</span>
                {[
                  { label: '/admin', path: '/admin' },
                  { label: '/teacher', path: '/teacher' },
                  { label: '/finance', path: '/finance' },
                  { label: '/parent', path: '/parent' },
                  { label: '/student', path: '/student' },
                  { label: '/login', path: '/login' },
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => simulateMiddlewareNavigation(item.path)}
                    className={`px-2 py-1 rounded-md text-[11px] font-mono border transition-all ${
                      currentPath === item.path
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Middleware Diagnostic Status Banner */}
            <div
              className={`px-4 py-2 border-b text-xs flex items-center justify-between transition-colors shrink-0 ${
                middlewareLog.status === 'allow'
                  ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                  : middlewareLog.status === 'redirect'
                  ? 'bg-blue-950/20 border-blue-900/40 text-blue-300'
                  : 'bg-amber-950/20 border-amber-900/40 text-amber-300'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {middlewareLog.status === 'allow' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : middlewareLog.status === 'redirect' ? (
                  <RotateCcw className="w-4 h-4 shrink-0 text-blue-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                )}
                <span className="font-bold">{middlewareLog.message}:</span>
                <span className="truncate text-slate-300">{middlewareLog.details}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono shrink-0 hidden md:inline">
                lib/supabase/middleware.ts
              </span>
            </div>

            {/* Simulated Route Render Window */}
            <div className="flex-1 flex overflow-hidden">
              {currentPath === '/login' || !currentUser ? (
                <div className="flex-1 overflow-y-auto">
                  <LoginPage
                    onSuccess={handleLoginSuccess}
                    initialRole={currentUser?.role || 'admin'}
                  />
                </div>
              ) : (
                <div className="flex-1 flex overflow-hidden">
                  {/* Dynamic Sidebar Shell */}
                  <Sidebar
                    initialProfile={currentUser}
                    currentPath={currentPath}
                    onNavigate={(path) => simulateMiddlewareNavigation(path)}
                    onSignOut={handleSignOut}
                  />

                  {/* Dashboard Content Canvas */}
                  <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
                    {/* Role Workspace Header */}
                    <div className="h-14 bg-slate-900/70 border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          Active Terminal: {currentUser.role.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-400">
                          Account: <span className="text-white font-medium">{currentUser.email}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Supabase SSR Session Valid
                        </span>
                      </div>
                    </div>

                    {/* Dynamic Landing Page per current route */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                      {currentPath.startsWith('/admin') && <AdminDashboardPage />}
                      {currentPath.startsWith('/teacher') && <TeacherDashboardPage />}
                      {currentPath.startsWith('/finance') && <FinanceDashboardPage />}
                      {currentPath.startsWith('/parent') && <ParentDashboardPage />}
                      {currentPath.startsWith('/student') && <StudentDashboardPage />}
                      {!currentPath.startsWith('/admin') &&
                        !currentPath.startsWith('/teacher') &&
                        !currentPath.startsWith('/finance') &&
                        !currentPath.startsWith('/parent') &&
                        !currentPath.startsWith('/student') && (
                          <div className="p-8 text-center">
                            <h2 className="text-xl font-bold text-white mb-2">Custom Route Rendered</h2>
                            <p className="text-slate-400 text-sm">Path: {currentPath}</p>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Code & Architecture Inspector Tab */}
        {activeTab === 'inspector' && (
          <div className="flex-1 flex overflow-hidden">
            {/* File List Drawer */}
            <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
              <div className="p-4 border-b border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Deliverable Files ({CODE_FILES.length})
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Ready to copy directly into your Next.js App Router codebase.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {CODE_FILES.map((file, idx) => (
                  <button
                    key={file.filename}
                    onClick={() => setSelectedCodeFile(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                      selectedCodeFile === idx
                        ? 'bg-blue-600/15 border-blue-500/50 text-white'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{file.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {file.category}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-blue-400 truncate">{file.filename}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{file.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Code Preview Pane */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
              <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-white">
                      {CODE_FILES[selectedCodeFile].filename}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      TypeScript
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {CODE_FILES[selectedCodeFile].description}
                  </p>
                </div>

                <button
                  onClick={() => handleCopyCode(CODE_FILES[selectedCodeFile].code, selectedCodeFile)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  {copiedIndex === selectedCodeFile ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy File Content</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex-1 overflow-auto p-6 font-mono text-xs bg-slate-950 text-slate-200 leading-relaxed">
                <pre>{CODE_FILES[selectedCodeFile].code}</pre>
              </div>
            </div>
          </div>
        )}

        {/* RBAC Matrix & Implementation Guide Tab */}
        {activeTab === 'guide' && (
          <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-5xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                School Management System — Multi-Role Architecture Specification
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Engineered with Next.js 14/15 App Router, Supabase SSR Auth cookies, and PostgreSQL Row-Level Security (RLS).
              </p>
            </div>

            {/* Architecture Pillar Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white">1. Edge Middleware Protection</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Every inbound HTTP request executes in Edge runtime. It verifies tokens using <code className="text-blue-400 font-mono">supabase.auth.getUser()</code> (avoiding forged local cookies) and checks route prefixes against the user profile's assigned role.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white">2. Supabase SSR Token Exchange</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Session tokens are stored in secure HTTP-only cookies managed via <code className="text-purple-400 font-mono">@supabase/ssr</code>. The middleware transparently sets and refreshes cookies on both the request and response headers.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white">3. PostgreSQL RLS Enforcement</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Route protection is backed by database-level Row Level Security. Even if an attacker attempts direct REST/GraphQL queries, policies enforce that users can only select and mutate records authorized for their role.
                </p>
              </div>
            </div>

            {/* Access Matrix Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-4">Role-Based Route Access Matrix</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 uppercase font-semibold text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Role Key</th>
                      <th className="py-3 px-4">Institutional Scope</th>
                      <th className="py-3 px-4">Authorized Route Prefix</th>
                      <th className="py-3 px-4">Landing Dashboard</th>
                      <th className="py-3 px-4">Sidebar Menu Links</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-purple-400">admin</td>
                      <td className="py-3 px-4">School Administration & Ops</td>
                      <td className="py-3 px-4 font-mono">/admin/*</td>
                      <td className="py-3 px-4 font-mono">/admin</td>
                      <td className="py-3 px-4 text-slate-400">Dashboard, Users, Classes, Academic Years, Settings</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-400">teacher</td>
                      <td className="py-3 px-4">Class Management, Attendance, Grading</td>
                      <td className="py-3 px-4 font-mono">/teacher/*</td>
                      <td className="py-3 px-4 font-mono">/teacher</td>
                      <td className="py-3 px-4 text-slate-400">Dashboard, My Classes, Attendance, Gradebook, Assignments</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">accountant</td>
                      <td className="py-3 px-4">Fee Structures, Invoices, Billing</td>
                      <td className="py-3 px-4 font-mono">/finance/*</td>
                      <td className="py-3 px-4 font-mono">/finance</td>
                      <td className="py-3 px-4 text-slate-400">Dashboard, Fee Structures, Invoices, Payment History</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">parent</td>
                      <td className="py-3 px-4">Child Performance, Fee Bills</td>
                      <td className="py-3 px-4 font-mono">/parent/*</td>
                      <td className="py-3 px-4 font-mono">/parent</td>
                      <td className="py-3 px-4 text-slate-400">Dashboard, My Children, Report Cards, Fee Bills</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-cyan-400">student</td>
                      <td className="py-3 px-4">Homework, Term Results, Timetable</td>
                      <td className="py-3 px-4 font-mono">/student/*</td>
                      <td className="py-3 px-4 font-mono">/student</td>
                      <td className="py-3 px-4 text-slate-400">Dashboard, Assignments, Grades, Timetable</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step-by-Step Setup Guide */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-semibold text-white">Next.js Deployment Instructions</h3>
              <ol className="list-decimal list-inside space-y-3 text-xs text-slate-300">
                <li>
                  <strong className="text-white">Add Environment Variables:</strong> Set{' '}
                  <code className="bg-slate-950 px-2 py-0.5 rounded text-blue-400 font-mono">
                    NEXT_PUBLIC_SUPABASE_URL
                  </code>{' '}
                  and{' '}
                  <code className="bg-slate-950 px-2 py-0.5 rounded text-blue-400 font-mono">
                    NEXT_PUBLIC_SUPABASE_ANON_KEY
                  </code>{' '}
                  in your <code className="text-slate-400 font-mono">.env.local</code>.
                </li>
                <li>
                  <strong className="text-white">Run Database Migration:</strong> Paste the SQL from{' '}
                  <code className="text-blue-400 font-mono">/supabase/schema.sql</code> into your Supabase SQL Editor.
                  This provisions the <code className="text-white">profiles</code> table, the <code className="text-white">user_role</code> enum, and the auto-trigger on <code className="text-white">auth.users</code>.
                </li>
                <li>
                  <strong className="text-white">Drop in Codebase Files:</strong> Place the files into your Next.js project directory as structured in the Inspector tab.
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
