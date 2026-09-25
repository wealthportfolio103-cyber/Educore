/**
 * School Management System - Authentication Login Page
 * Next.js App Router Client Component with Supabase Auth
 */

'use client';

import React, { useState } from 'react';
import {
  School,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ROLE_DEFAULT_PATHS } from '@/lib/supabase/middleware';
import type { UserRole } from '@/types/database.types';

// Pre-seeded demo credentials for quick role switching and testing
export const DEMO_CREDENTIALS: {
  role: UserRole;
  title: string;
  email: string;
  password: string;
  badgeColor: string;
  description: string;
}[] = [
  {
    role: 'admin',
    title: 'School Administrator',
    email: 'admin@educore.edu',
    password: 'Password123!',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    description: 'System operations, staff, student enrollment, academic terms',
  },
  {
    role: 'teacher',
    title: 'Faculty / Teacher',
    email: 'teacher@educore.edu',
    password: 'Password123!',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200',
    description: 'Class rosters, attendance, grading, homework assignments',
  },
  {
    role: 'accountant',
    title: 'School Accountant',
    email: 'finance@educore.edu',
    password: 'Password123!',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200',
    description: 'Tuition fees, billing, invoices, receipts, financial records',
  },
  {
    role: 'parent',
    title: 'Parent / Guardian',
    email: 'parent@educore.edu',
    password: 'Password123!',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    description: 'Child progress, report cards, fee payments, announcements',
  },
  {
    role: 'student',
    title: 'Enrolled Student',
    email: 'student@educore.edu',
    password: 'Password123!',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200',
    description: 'Timetables, assignments submission, term marks, courses',
  },
];

interface LoginPageProps {
  onSuccess?: (role: UserRole, email: string) => void;
  initialRole?: UserRole;
}

export default function LoginPage({ onSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('admin@educore.edu');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Quick fill helper for developers & test users
  const handleSelectDemo = (demo: typeof DEMO_CREDENTIALS[number]) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setErrorMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const supabase = createClient();

      // 1. Authenticate with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        // Fallback for simulated/demo accounts in environments without live Supabase connection
        const matchedDemo = DEMO_CREDENTIALS.find(
          (d) => d.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (matchedDemo && password === 'Password123!') {
          setSuccessMsg(`Welcome back! Routing to ${matchedDemo.title} portal...`);
          if (onSuccess) {
            onSuccess(matchedDemo.role, matchedDemo.email);
          } else {
            const destination = ROLE_DEFAULT_PATHS[matchedDemo.role];
            setTimeout(() => {
              window.location.href = destination;
            }, 600);
          }
          return;
        }

        throw new Error(
          error.message === 'Invalid login credentials'
            ? 'Invalid email or password. Please verify credentials or use a test role preset below.'
            : error.message
        );
      }

      if (!data.user) {
        throw new Error('Authentication succeeded but user identity was not retrieved.');
      }

      // 2. Fetch User Profile to determine assigned role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      let detectedRole: UserRole = 'student';

      if (!profileError && profile) {
        const typedProfile = profile as unknown as { role: UserRole; is_active: boolean };
        if (!typedProfile.is_active) {
          throw new Error('This school account is currently deactivated. Please contact administration.');
        }
        detectedRole = typedProfile.role;
      } else if (data.user.user_metadata?.role) {
        detectedRole = data.user.user_metadata.role as UserRole;
      }

      setSuccessMsg(`Authenticated successfully. Redirecting to ${detectedRole.toUpperCase()} workspace...`);

      if (onSuccess) {
        onSuccess(detectedRole, email);
      } else {
        const destination = ROLE_DEFAULT_PATHS[detectedRole] || '/admin';
        window.location.href = destination;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during login.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        {/* School Logo & Title */}
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-xl shadow-blue-500/20 text-white border border-white/10">
            <School className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-5 text-center text-3xl font-extrabold tracking-tight text-white">
          EduCore Academy
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Unified Multi-Role School Management Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg z-10 px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {/* Status Message Banners */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
              <div className="flex-1 leading-relaxed">{successMsg}</div>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Institutional Email
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. staff@educore.edu"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember this terminal</span>
              </label>
              <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                256-bit SSL Session
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-600/30 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying credentials & role...</span>
                </>
              ) : (
                <>
                  <span>Sign In to School Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Role Selector */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Instant Role Switcher (Pre-Configured)
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Click any role below to prefill credentials and test role-based route enforcement:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_CREDENTIALS.map((demo) => {
                const isSelected = email === demo.email;
                return (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={() => handleSelectDemo(demo)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-blue-500/80 ring-1 ring-blue-500/50 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-semibold text-white truncate">{demo.title}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold border capitalize ${demo.badgeColor}`}
                      >
                        {demo.role}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 truncate">{demo.email}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Protected by Supabase SSR Auth Cookies & Next.js Edge Middleware RBAC
        </p>
      </div>
    </div>
  );
}
