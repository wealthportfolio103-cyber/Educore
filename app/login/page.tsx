/**
 * School Management System - Authentication Portal
 * Production Tabbed Auth (Sign In & Sign Up) with direct Supabase Auth integration.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  User,
  GraduationCap,
  AlertTriangle,
  Settings,
  ChevronDown,
  Save,
  Check,
} from 'lucide-react';
import {
  createClient,
  isSupabaseConfigured,
  getSupabaseConfig,
  saveSupabaseConfig,
} from '@/lib/supabase/client';
import { ROLE_DEFAULT_PATHS } from '@/lib/supabase/middleware';
import type { UserRole } from '@/types/database.types';

interface LoginPageProps {
  onSuccess?: (role: UserRole, email: string) => void;
  initialRole?: UserRole;
}

const ROLES: { id: UserRole; title: string; desc: string }[] = [
  { id: 'admin', title: 'Administrator', desc: 'School operations & governance' },
  { id: 'teacher', title: 'Teacher / Faculty', desc: 'Classes, attendance & grading' },
  { id: 'accountant', title: 'Accountant', desc: 'Tuition, fees & billing' },
  { id: 'parent', title: 'Parent / Guardian', desc: 'Student progress & fee bills' },
  { id: 'student', title: 'Student', desc: 'Homework, courses & timetable' },
];

export default function LoginPage({ onSuccess }: LoginPageProps) {
  const router = useRouter();

  // Tab State: 'signin' | 'signup'
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up Form State
  const [signUpFirstName, setSignUpFirstName] = useState('');
  const [signUpLastName, setSignUpLastName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpRole, setSignUpRole] = useState<UserRole>('teacher');

  // Submission & Alert States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Supabase Configuration Status Check
  const [hasConfig, setHasConfig] = useState(true);
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [inputAnonKey, setInputAnonKey] = useState('');
  const [configSaved, setConfigSaved] = useState(false);

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setHasConfig(configured);
    const { url, anonKey } = getSupabaseConfig();
    if (!configured) {
      setInputUrl(url.includes('placeholder') ? '' : url);
      setInputAnonKey(anonKey.includes('placeholder') ? '' : anonKey);
    }
  }, []);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || !inputAnonKey.trim()) {
      setErrorMsg('Please enter both Supabase Project URL and Anon Public Key.');
      return;
    }
    saveSupabaseConfig(inputUrl.trim(), inputAnonKey.trim());
    setHasConfig(true);
    setConfigSaved(true);
    setShowConfigDrawer(false);
    setErrorMsg(null);
    setSuccessMsg('Supabase configuration saved! You can now authenticate.');
    setTimeout(() => setConfigSaved(false), 3000);
  };

  // Humanize and sanitize auth errors
  const formatAuthError = (err: unknown): string => {
    if (!err) return 'An unexpected error occurred.';
    const message = err instanceof Error ? err.message : String(err);
    const lower = message.toLowerCase();

    if (
      lower.includes('failed to fetch') ||
      lower.includes('load failed') ||
      lower.includes('networkerror')
    ) {
      return 'Network error: Unable to connect to Supabase authentication server. Please check your internet connection or verify your Supabase project URL.';
    }
    if (lower.includes('invalid login credentials')) {
      return 'Invalid email or password. Please verify your credentials and try again.';
    }
    if (lower.includes('user not found')) {
      return 'No account was found with this email address. Please sign up or check for typos.';
    }
    if (lower.includes('user already registered') || lower.includes('already exists')) {
      return 'An account with this email already exists. Please switch to the Sign In tab.';
    }
    if (lower.includes('email not confirmed')) {
      return 'Your email address has not been confirmed yet. Please check your inbox for the confirmation link.';
    }
    if (lower.includes('password should be at least')) {
      return 'Password must be at least 6 characters long.';
    }
    if (lower.includes('signup requires a valid password')) {
      return 'Please choose a stronger password.';
    }
    return message;
  };

  // Sign In Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!signInEmail.trim() || !signInPassword) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (!isSupabaseConfigured()) {
      setErrorMsg(
        'Supabase configuration required. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to sign in.'
      );
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      // Authenticate with Supabase Auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: signInEmail.trim(),
        password: signInPassword,
      });

      if (signInError) {
        throw signInError;
      }

      if (!data.user) {
        throw new Error('Sign-in succeeded but user record was not retrieved.');
      }

      // Query profiles table to determine user's institutional role
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

      setSuccessMsg(`Welcome back! Routing to ${detectedRole.toUpperCase()} workspace...`);

      if (onSuccess) {
        onSuccess(detectedRole, signInEmail.trim());
      } else {
        const destination = ROLE_DEFAULT_PATHS[detectedRole] || '/admin';
        router.push(destination);
        router.refresh();
      }
    } catch (err: unknown) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // Sign Up Handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!signUpFirstName.trim() || !signUpLastName.trim()) {
      setErrorMsg('Please provide both first name and last name.');
      return;
    }

    if (!signUpEmail.trim() || !signUpPassword) {
      setErrorMsg('Please provide both institutional email and password.');
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (!isSupabaseConfigured()) {
      setErrorMsg(
        'Supabase configuration required. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to register.'
      );
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const fullName = `${signUpFirstName.trim()} ${signUpLastName.trim()}`;

      // 1. Create User in Supabase Auth with user metadata
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: signUpEmail.trim(),
        password: signUpPassword,
        options: {
          data: {
            full_name: fullName,
            first_name: signUpFirstName.trim(),
            last_name: signUpLastName.trim(),
            role: signUpRole,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!data.user) {
        throw new Error('Registration completed but user object was not returned.');
      }

      // 2. Insert corresponding row into profiles table
      try {
        const { error: profileError } = await (supabase.from('profiles') as any).upsert({
          id: data.user.id,
          email: signUpEmail.trim(),
          full_name: fullName,
          role: signUpRole,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        if (profileError) {
          console.warn('Profile record insert notice:', profileError.message);
        }
      } catch (profileErr) {
        console.warn('Profile table insert warning:', profileErr);
      }

      // 3. Handle immediate session or email confirmation required
      if (data.session) {
        setSuccessMsg(
          `Account created successfully! Redirecting to ${signUpRole.toUpperCase()} dashboard...`
        );
        if (onSuccess) {
          onSuccess(signUpRole, signUpEmail.trim());
        } else {
          const destination = ROLE_DEFAULT_PATHS[signUpRole] || '/admin';
          router.push(destination);
          router.refresh();
        }
      } else {
        setSuccessMsg(
          `Registration successful for ${signUpEmail.trim()}! Please check your inbox to confirm your email, then sign in.`
        );
        // Switch to sign in tab and populate email
        setSignInEmail(signUpEmail.trim());
        setActiveTab('signin');
      }
    } catch (err: unknown) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-xs text-white">
            <School className="w-6 h-6" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900">
          EduCore Academy
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Enterprise School Management & Multi-Role Student Information System
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white border border-slate-200/90 py-7 px-6 shadow-sm rounded-2xl sm:px-8">
          {/* Missing Supabase Configuration Banner */}
          {!hasConfig && (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-900">Supabase configuration required</p>
                  <p className="mt-0.5 text-amber-700 leading-relaxed">
                    Please set <code className="font-mono bg-amber-100/80 px-1 py-0.5 rounded text-[11px]">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
                    <code className="font-mono bg-amber-100/80 px-1 py-0.5 rounded text-[11px]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowConfigDrawer(!showConfigDrawer)}
                    className="mt-2 text-[11px] font-semibold text-amber-900 underline hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                  >
                    <Settings className="w-3 h-3" />
                    <span>{showConfigDrawer ? 'Hide Credentials Setup' : 'Enter Credentials in Browser'}</span>
                  </button>
                </div>
              </div>

              {/* In-Browser Credential Entry Drawer */}
              {showConfigDrawer && (
                <form onSubmit={handleSaveConfig} className="mt-3 pt-3 border-t border-amber-200/80 space-y-2">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-amber-900 mb-0.5">
                      Project URL
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://xyzcompany.supabase.co"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-amber-900 mb-0.5">
                      Anon Public API Key
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={inputAnonKey}
                      onChange={(e) => setInputAnonKey(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1.5 px-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save & Connect</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Actionable Error Banner */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <div className="flex-1 leading-relaxed font-medium">{errorMsg}</div>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <div className="flex-1 leading-relaxed font-medium">{successMsg}</div>
            </div>
          )}

          {/* Tabbed Navigation Header (Sign In / Sign Up) */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6 border border-slate-200/70">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'signin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* TAB 1: SIGN IN FORM */}
          {activeTab === 'signin' && (
            <form className="space-y-4" onSubmit={handleSignIn}>
              <div>
                <label
                  htmlFor="signin-email"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Institutional Email
                </label>
                <div className="relative rounded-lg shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="signin-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="e.g. j.smith@educore.edu"
                    className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="signin-password"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setErrorMsg(
                        'Password reset instructions will be sent to your institutional email if configured in Supabase.'
                      )
                    }
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative rounded-lg shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="signin-password"
                    name="password"
                    type={showSignInPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full pl-9 pr-10 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showSignInPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Remember this terminal</span>
                </label>
                <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  256-bit Encrypted
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In to School Portal</span>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: SIGN UP FORM */}
          {activeTab === 'signup' && (
            <form className="space-y-3.5" onSubmit={handleSignUp}>
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="signup-firstname"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    First Name
                  </label>
                  <div className="relative rounded-lg shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      id="signup-firstname"
                      type="text"
                      required
                      value={signUpFirstName}
                      onChange={(e) => setSignUpFirstName(e.target.value)}
                      placeholder="e.g. Jane"
                      className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="signup-lastname"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    id="signup-lastname"
                    type="text"
                    required
                    value={signUpLastName}
                    onChange={(e) => setSignUpLastName(e.target.value)}
                    placeholder="e.g. Doe"
                    className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Institutional Email
                </label>
                <div className="relative rounded-lg shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="e.g. jane.doe@educore.edu"
                    className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Password (min 6 characters)
                </label>
                <div className="relative rounded-lg shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="signup-password"
                    type={showSignUpPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full pl-9 pr-10 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showSignUpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label
                  htmlFor="signup-role"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Institutional Role
                </label>
                <div className="relative rounded-lg shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <select
                    id="signup-role"
                    value={signUpRole}
                    onChange={(e) => setSignUpRole(e.target.value as UserRole)}
                    className="block w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all capitalize cursor-pointer"
                  >
                    {ROLES.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.title} — {role.desc}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Role determines permissions and routing to the authorized dashboard.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer mt-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create Institutional Account</span>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          EduCore Information Systems • Direct Supabase Auth & PostgreSQL RLS
        </p>
      </div>
    </div>
  );
}
