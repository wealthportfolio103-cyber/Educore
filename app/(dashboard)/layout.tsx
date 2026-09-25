/**
 * Authenticated Role Dashboard Shared Layout
 * Server Component with Next.js SSR session verification and crisp SaaS layout container.
 */

import React from 'react';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { Profile, UserRole } from '@/types/database.types';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userProfile: Profile | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile) {
      userProfile = profile as Profile;
    } else {
      userProfile = {
        id: user.id,
        email: user.email || '',
        full_name:
          (user.user_metadata?.full_name as string) ||
          user.email?.split('@')[0] ||
          'Institutional Staff',
        role: (user.user_metadata?.role as UserRole) || 'admin',
        avatar_url: null,
        phone_number: null,
        department: null,
        student_id: null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
      {/* Dynamic Role Sidebar */}
      <Sidebar initialProfile={userProfile} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/90 flex items-center justify-between px-6 shrink-0 z-10 shadow-xs">
          {/* Global Search Bar */}
          <div className="flex items-center gap-3 w-80 md:w-96">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students, faculty, courses... (⌘K)"
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Academic Term & Header Utilities */}
          <div className="flex items-center gap-3.5 text-xs">
            <span className="font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 hidden sm:inline-block">
              Term 1 • 2025/2026 Academic Year
            </span>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <button
              title="Notifications"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 absolute top-1.5 right-1.5" />
            </button>

            <button
              title="Help & Support"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dashboard Body Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
