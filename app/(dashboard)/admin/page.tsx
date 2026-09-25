/**
 * Admin Role Dashboard
 * Accessible ONLY by role = 'admin'
 * Focus: Operations, Staff, Students, Academic Terms, System Audit
 */

import React from 'react';
import {
  Users,
  GraduationCap,
  CalendarDays,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  BookOpen,
  Settings,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Enrolled Students', value: '1,420', change: '+8.4% vs last term', icon: GraduationCap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Active Faculty Staff', value: '88', change: '100% attendance', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Classes & Sections', value: '42', change: 'Active across 6 grades', icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Academic Term Progress', value: '64%', change: 'Day 58 of 90', icon: CalendarDays, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  const recentEvents = [
    { title: 'New Teacher Onboarded', subtitle: 'Dr. Sarah Connor assigned to Dept. of Physics', time: '18 mins ago', type: 'info' },
    { title: 'Fee Schedule Published', subtitle: 'Term 2 invoices generated for 1,420 students', time: '2 hours ago', type: 'success' },
    { title: 'Role Access Audited', subtitle: 'Edge middleware verified 5,230 access tokens', time: '5 hours ago', type: 'security' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">School Administration</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Role: Admin
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Centralized operations hub for EduCore Academy institutions and faculty governance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors">
            <UserPlus className="w-4 h-4" />
            <span>Enroll New Student</span>
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors">
            <Settings className="w-4 h-4" />
            <span>System Settings</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operations & System Audit Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Operations Actions */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            Role-Based Access Control Status
          </h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Route Protection Enforcement</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Edge Middleware verifies JWT role from Supabase profiles on every request
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Active & Enforcing
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Row Level Security (RLS)</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  PostgreSQL policies restrict read/write permissions per user UUID & role
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Secured
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">SSR Cookie Refresh Cycle</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automatic token exchange via @supabase/ssr prevents stale auth states
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                Live
              </span>
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Recent Audit Activity</h2>
          <div className="space-y-4">
            {recentEvents.map((event, idx) => (
              <div key={idx} className="flex gap-3 items-start pb-3 border-b border-slate-800/80 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">{event.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{event.subtitle}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">{event.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
