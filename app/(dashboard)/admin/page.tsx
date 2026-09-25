/**
 * Admin Role Dashboard
 * Accessible ONLY by role = 'admin'
 * Focus: Operations, Staff, Students, Academic Terms, System Governance
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
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    {
      label: 'Total Enrolled Students',
      value: '1,420',
      change: '+8.4% from last term',
      icon: GraduationCap,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
    },
    {
      label: 'Active Faculty Staff',
      value: '88',
      change: '100% active standing',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: 'Classes & Sections',
      value: '42',
      change: 'Across 6 grade levels',
      icon: BookOpen,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'Academic Term Progress',
      value: '64%',
      change: 'Day 58 of 90',
      icon: CalendarDays,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
  ];

  const recentEvents = [
    {
      title: 'New Faculty Onboarded',
      subtitle: 'Dr. Sarah Connor assigned to Dept. of Physics',
      time: '18 mins ago',
      category: 'Staffing',
    },
    {
      title: 'Term 2 Fee Schedule Published',
      subtitle: 'Invoices generated for 1,420 enrolled students',
      time: '2 hours ago',
      category: 'Finance',
    },
    {
      title: 'Role Authorization Policy Verified',
      subtitle: 'Edge middleware verified 5,230 active session tokens',
      time: '5 hours ago',
      category: 'Security',
    },
    {
      title: 'Grade 10 Curriculum Updated',
      subtitle: 'Advanced Mechanics syllabus synchronized with ministry guidelines',
      time: '1 day ago',
      category: 'Academics',
    },
  ];

  const recentUsers = [
    { name: 'Dr. Arthur Pendelton', email: 'admin@educore.edu', role: 'admin', dept: 'Head Office', status: 'Active' },
    { name: 'Sarah Jenkins, M.Sc.', email: 'teacher@educore.edu', role: 'teacher', dept: 'Physics & STEM', status: 'Active' },
    { name: 'Marcus Sterling, CPA', email: 'finance@educore.edu', role: 'accountant', dept: 'Bursar Office', status: 'Active' },
    { name: 'Elena Rostova', email: 'parent@educore.edu', role: 'parent', dept: 'Guardian', status: 'Active' },
    { name: 'Lucas Chen', email: 'student@educore.edu', role: 'student', dept: 'Grade 10-A', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">School Administration</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Admin Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Institutional overview, faculty records, student enrollment, and access control governance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer">
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Enroll Student</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 shadow-xs transition-colors cursor-pointer">
            <Settings className="w-3.5 h-3.5" />
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
              className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{stat.label}</span>
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} border ${stat.border}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* RLS Status & Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Directory Preview */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Registered Institutional Profiles</h2>
              <p className="text-xs text-slate-500">Live roster queried from Supabase profiles table</p>
            </div>
            <button className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer">
              View All Users →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 uppercase font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Department / Class</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentUsers.map((u) => (
                  <tr key={u.email} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-900">{u.name}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 capitalize border border-slate-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{u.dept}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Audit Activity */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">Recent Institutional Activity</h2>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-4">
            {recentEvents.map((event, idx) => (
              <div
                key={idx}
                className="flex gap-3 items-start pb-3.5 border-b border-slate-100 last:border-0 last:pb-0"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-slate-800 truncate">{event.title}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{event.subtitle}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                    {event.time} • {event.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
