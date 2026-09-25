/**
 * Dynamic Role-Based Sidebar Navigation Shell
 * Fetches user profile from Supabase and dynamically renders tailored navigation links.
 */

'use client';

import React, { useEffect, useState } from 'react';
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
  FileText,
  BadgePercent,
  Clock,
  LogOut,
  Shield,
  School,
  UserCheck,
  ChevronRight,
  Loader2,
  Sparkles,
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
    label: 'Administration & Ops',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Users', href: '/admin/users', icon: Users, badge: 'Staff & Students' },
      { name: 'Classes', href: '/admin/classes', icon: GraduationCap },
      { name: 'Academic Years', href: '/admin/academic-years', icon: CalendarDays },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
  teacher: {
    label: 'Faculty & Instruction',
    items: [
      { name: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
      { name: 'My Classes', href: '/teacher/classes', icon: GraduationCap },
      { name: 'Attendance', href: '/teacher/attendance', icon: ClipboardCheck },
      { name: 'Gradebook', href: '/teacher/gradebook', icon: Award },
      { name: 'Assignments', href: '/teacher/assignments', icon: BookOpen, badge: '3 to mark' },
    ],
  },
  accountant: {
    label: 'Financial Management',
    items: [
      { name: 'Dashboard', href: '/finance', icon: LayoutDashboard },
      { name: 'Fee Structures', href: '/finance/fee-structures', icon: BadgePercent },
      { name: 'Invoices', href: '/finance/invoices', icon: Receipt, badge: '12 pending' },
      { name: 'Payment History', href: '/finance/payments', icon: History },
    ],
  },
  parent: {
    label: 'Parent Portal',
    items: [
      { name: 'Dashboard', href: '/parent', icon: LayoutDashboard },
      { name: 'My Children', href: '/parent/children', icon: HeartHandshake },
      { name: 'Report Cards', href: '/parent/report-cards', icon: FileSpreadsheet },
      { name: 'Fee Bills', href: '/parent/fees', icon: CreditCard, badge: 'Due' },
    ],
  },
  student: {
    label: 'Student Workspace',
    items: [
      { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
      { name: 'Assignments', href: '/student/assignments', icon: BookOpen, badge: '2 due today' },
      { name: 'Grades', href: '/student/grades', icon: Award },
      { name: 'Timetable', href: '/student/timetable', icon: Clock },
    ],
  },
};

// Distinct styling presets for each role
export const ROLE_THEMES: Record<
  UserRole,
  {
    badgeBg: string;
    badgeText: string;
    activeBg: string;
    activeText: string;
    iconColor: string;
    roleTitle: string;
  }
> = {
  admin: {
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
    badgeText: 'text-purple-700',
    activeBg: 'bg-purple-50 text-purple-700 border-purple-500',
    activeText: 'text-purple-700',
    iconColor: 'text-purple-600',
    roleTitle: 'School Administrator',
  },
  teacher: {
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    badgeText: 'text-indigo-700',
    activeBg: 'bg-indigo-50 text-indigo-700 border-indigo-500',
    activeText: 'text-indigo-700',
    iconColor: 'text-indigo-600',
    roleTitle: 'Teaching Faculty',
  },
  accountant: {
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    badgeText: 'text-emerald-700',
    activeBg: 'bg-emerald-50 text-emerald-700 border-emerald-500',
    activeText: 'text-emerald-700',
    iconColor: 'text-emerald-600',
    roleTitle: 'Chief Bursar & Accountant',
  },
  parent: {
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    badgeText: 'text-amber-700',
    activeBg: 'bg-amber-50 text-amber-700 border-amber-500',
    activeText: 'text-amber-700',
    iconColor: 'text-amber-600',
    roleTitle: 'Parent & Guardian',
  },
  student: {
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    badgeText: 'text-cyan-700',
    activeBg: 'bg-cyan-50 text-cyan-700 border-cyan-500',
    activeText: 'text-cyan-700',
    iconColor: 'text-cyan-600',
    roleTitle: 'Enrolled Student',
  },
};

interface SidebarProps {
  initialProfile?: Profile | null;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  onSignOut?: () => void;
  className?: string;
}

export function Sidebar({
  initialProfile = null,
  currentPath = '/admin',
  onNavigate,
  onSignOut,
  className = '',
}: SidebarProps) {
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

  // Client-side profile fetch if not passed by server layout
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
          // Fallback to auth metadata if profile row isn't populated yet
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
      if (onSignOut) {
        await onSignOut();
      } else {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setSigningOut(false);
    }
  };

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <aside
      className={`w-64 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col h-full shrink-0 select-none ${className}`}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-white tracking-tight text-base leading-tight">
              EduCore
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">School Management</p>
          </div>
        </div>
      </div>

      {/* Role Indicator Banner */}
      <div className="px-4 py-3 bg-slate-800/40 border-b border-slate-800/60 flex items-center justify-between">
        <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
          Role Scope
        </span>
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border capitalize flex items-center gap-1.5 ${theme.badgeBg}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {activeRole}
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {roleConfig.label}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-slate-400 gap-2 text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span>Loading menu...</span>
          </div>
        ) : (
          roleConfig.items.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href || (item.href !== '/admin' && item.href !== '/teacher' && item.href !== '/finance' && item.href !== '/parent' && item.href !== '/student' && currentPath.startsWith(item.href));

            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold shadow-sm shadow-black/20'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? theme.iconColor : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {item.badge}
                  </span>
                ) : isActive ? (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                ) : null}
              </a>
            );
          })
        )}
      </div>

      {/* User Profile Summary & Sign Out */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/60 border border-slate-800 mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center font-bold text-white text-xs border border-slate-600 shrink-0 overflow-hidden">
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
            <p className="text-xs font-semibold text-white truncate">
              {profile?.full_name || 'School Staff Member'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {profile?.email || 'authenticated@school.edu'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={signingOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-300 hover:text-white bg-rose-950/30 hover:bg-rose-900/60 border border-rose-900/40 rounded-lg transition-colors disabled:opacity-60"
        >
          {signingOut ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Logging out...</span>
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
