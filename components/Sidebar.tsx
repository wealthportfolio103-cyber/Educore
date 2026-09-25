/**
 * Dynamic Role-Based Sidebar Navigation Shell
 * Clean, modern enterprise SaaS navigation for Next.js App Router.
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarDays,
  Settings,
  BookOpen,
  ClipboardCheck,
  Award,
  FileSpreadsheet,
  Receipt,
  CreditCard,
  History,
  HeartHandshake,
  BadgePercent,
  Clock,
  LogOut,
  School,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Profile, UserRole } from '@/types/database.types';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

// Role-specific navigation configurations
export const ROLE_NAVIGATION: Record<UserRole, { label: string; items: NavItem[] }> = {
  admin: {
    label: 'Administration & Operations',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'User Management', href: '/admin/users', icon: Users, badge: 'Staff & Students' },
      { name: 'Classes & Sections', href: '/admin/classes', icon: GraduationCap },
      { name: 'Academic Terms', href: '/admin/academic-years', icon: CalendarDays },
      { name: 'System Settings', href: '/admin/settings', icon: Settings },
    ],
  },
  teacher: {
    label: 'Faculty & Instruction',
    items: [
      { name: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
      { name: 'My Classes', href: '/teacher/classes', icon: GraduationCap },
      { name: 'Daily Attendance', href: '/teacher/attendance', icon: ClipboardCheck },
      { name: 'Gradebook', href: '/teacher/gradebook', icon: Award },
      { name: 'Assignments', href: '/teacher/assignments', icon: BookOpen, badge: '3 to mark' },
    ],
  },
  accountant: {
    label: 'Finance & Bursar',
    items: [
      { name: 'Dashboard', href: '/finance', icon: LayoutDashboard },
      { name: 'Fee Structures', href: '/finance/fee-structures', icon: BadgePercent },
      { name: 'Student Invoices', href: '/finance/invoices', icon: Receipt, badge: '12 pending' },
      { name: 'Payment Ledger', href: '/finance/payments', icon: History },
    ],
  },
  parent: {
    label: 'Parent & Guardian Portal',
    items: [
      { name: 'Dashboard', href: '/parent', icon: LayoutDashboard },
      { name: 'My Children', href: '/parent/children', icon: HeartHandshake },
      { name: 'Term Report Cards', href: '/parent/report-cards', icon: FileSpreadsheet },
      { name: 'Fee Invoices & Bills', href: '/parent/fees', icon: CreditCard, badge: 'Due' },
    ],
  },
  student: {
    label: 'Student Workspace',
    items: [
      { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
      { name: 'My Assignments', href: '/student/assignments', icon: BookOpen, badge: '2 due today' },
      { name: 'Term Grades', href: '/student/grades', icon: Award },
      { name: 'Class Timetable', href: '/student/timetable', icon: Clock },
    ],
  },
};

// Subtle, clean enterprise color themes for role tags
export const ROLE_THEMES: Record<
  UserRole,
  {
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    activeBg: string;
    activeText: string;
    activeIcon: string;
    roleTitle: string;
  }
> = {
  admin: {
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    badgeBorder: 'border-indigo-200',
    activeBg: 'bg-indigo-50/80',
    activeText: 'text-indigo-700',
    activeIcon: 'text-indigo-600',
    roleTitle: 'School Administrator',
  },
  teacher: {
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    activeBg: 'bg-blue-50/80',
    activeText: 'text-blue-700',
    activeIcon: 'text-blue-600',
    roleTitle: 'Faculty & Teacher',
  },
  accountant: {
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    activeBg: 'bg-emerald-50/80',
    activeText: 'text-emerald-700',
    activeIcon: 'text-emerald-600',
    roleTitle: 'School Accountant',
  },
  parent: {
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    activeBg: 'bg-amber-50/80',
    activeText: 'text-amber-700',
    activeIcon: 'text-amber-600',
    roleTitle: 'Parent & Guardian',
  },
  student: {
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-700',
    badgeBorder: 'border-teal-200',
    activeBg: 'bg-teal-50/80',
    activeText: 'text-teal-700',
    activeIcon: 'text-teal-600',
    roleTitle: 'Enrolled Student',
  },
};

interface SidebarProps {
  initialProfile?: Profile | null;
  className?: string;
}

export function Sidebar({ initialProfile = null, className = '' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const [loading, setLoading] = useState(!initialProfile);
  const [signingOut, setSigningOut] = useState(false);

  // Sync state if initialProfile prop changes
  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
      setLoading(false);
    }
  }, [initialProfile]);

  // Client-side profile fetch if initialProfile was not provided
  useEffect(() => {
    if (profile) return;

    let isMounted = true;
    async function fetchUserProfile() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (isMounted) setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!error && data && isMounted) {
          setProfile(data as Profile);
        } else if (isMounted) {
          setProfile({
            id: user.id,
            email: user.email || 'user@school.edu',
            full_name: (user.user_metadata?.full_name as string) || 'Authorized Staff',
            role: (user.user_metadata?.role as UserRole) || 'admin',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error('Failed to load user profile in Sidebar:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, [profile]);

  const activeRole: UserRole = profile?.role || 'admin';
  const roleConfig = ROLE_NAVIGATION[activeRole] || ROLE_NAVIGATION.admin;
  const theme = ROLE_THEMES[activeRole] || ROLE_THEMES.admin;

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <aside
      className={`w-64 bg-white border-r border-slate-200 text-slate-700 flex flex-col h-full shrink-0 select-none ${className}`}
    >
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-xs text-white">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 tracking-tight text-sm leading-tight">
              EduCore
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">School Management</p>
          </div>
        </Link>

        {/* Compact Role Indicator */}
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border capitalize flex items-center gap-1 ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}
        >
          {activeRole}
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {roleConfig.label}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-slate-400 gap-2 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
            <span>Loading navigation...</span>
          </div>
        ) : (
          roleConfig.items.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' &&
                item.href !== '/teacher' &&
                item.href !== '/finance' &&
                item.href !== '/parent' &&
                item.href !== '/student' &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? `${theme.activeBg} ${theme.activeText} font-semibold shadow-xs`
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? theme.activeIcon : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                    {item.badge}
                  </span>
                ) : isActive ? (
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                ) : null}
              </Link>
            );
          })
        )}
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                (profile?.full_name || 'U').charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {profile?.full_name || 'School Staff Member'}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {profile?.email || 'authenticated@school.edu'}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={signingOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
        >
          {signingOut ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Signing out...</span>
            </>
          ) : (
            <>
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
