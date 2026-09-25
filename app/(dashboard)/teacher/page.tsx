/**
 * Teacher Role Dashboard
 * Accessible ONLY by role = 'teacher'
 * Focus: Class Management, Attendance, Gradebook, Assignments
 */

import React from 'react';
import {
  GraduationCap,
  ClipboardCheck,
  Award,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  PlusCircle,
} from 'lucide-react';

export default function TeacherDashboardPage() {
  const teacherStats = [
    { label: 'Assigned Classes', value: '4 Sections', sub: 'Grade 10 & 11 Physics', icon: GraduationCap, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Today\'s Attendance', value: '96.2%', sub: '118 of 122 students present', icon: ClipboardCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Pending Grading', value: '14 Papers', sub: 'Term 1 Midterm Physics Lab', icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Active Assignments', value: '3 Active', sub: 'Due Friday 5:00 PM', icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ];

  const todayClasses = [
    { time: '09:00 - 10:30 AM', class: 'Grade 10-A', subject: 'Advanced Mechanics', room: 'Lab 3B', attendanceDone: true },
    { time: '11:00 - 12:30 PM', class: 'Grade 11-B', subject: 'Electromagnetism', room: 'Hall 2', attendanceDone: true },
    { time: '02:00 - 03:30 PM', class: 'Grade 10-C', subject: 'Introductory Waves & Optics', room: 'Lab 3B', attendanceDone: false },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Faculty Dashboard</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Role: Teacher
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Manage your daily class periods, take roll-call attendance, and score student assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors">
            <PlusCircle className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors">
            <ClipboardCheck className="w-4 h-4" />
            <span>Take Attendance</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {teacherStats.map((stat) => {
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
                <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Schedule & Pending Work */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              Today's Teaching Schedule
            </h2>
            <span className="text-xs text-slate-400">Wednesday, Term 1</span>
          </div>

          <div className="space-y-3">
            {todayClasses.map((cls, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {cls.subject} • {cls.class}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {cls.time} | Room: {cls.room}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {cls.attendanceDone ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Attendance Submitted
                    </span>
                  ) : (
                    <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold shadow-sm transition-colors">
                      Start Roll Call
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            Gradebook Queue
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex justify-between font-semibold text-white mb-1">
                <span>Lab Report 2: Optics</span>
                <span className="text-amber-400">8 pending</span>
              </div>
              <p className="text-slate-400 text-[11px]">Grade 10-A • Submitted yesterday</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex justify-between font-semibold text-white mb-1">
                <span>Mechanics Midterm Quiz</span>
                <span className="text-amber-400">6 pending</span>
              </div>
              <p className="text-slate-400 text-[11px]">Grade 11-B • Due today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
