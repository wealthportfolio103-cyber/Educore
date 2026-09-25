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
  Users,
} from 'lucide-react';

export default function TeacherDashboardPage() {
  const teacherStats = [
    {
      label: 'Assigned Classes',
      value: '4 Sections',
      sub: 'Grade 10 & 11 Physics',
      icon: GraduationCap,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: "Today's Attendance",
      value: '96.2%',
      sub: '118 of 122 students present',
      icon: ClipboardCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'Pending Grading',
      value: '14 Papers',
      sub: 'Term 1 Midterm Physics Lab',
      icon: Award,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      label: 'Active Homework',
      value: '3 Active',
      sub: 'Due Friday at 5:00 PM',
      icon: BookOpen,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
    },
  ];

  const todayClasses = [
    {
      time: '09:00 - 10:30 AM',
      class: 'Grade 10-A',
      subject: 'Advanced Mechanics',
      room: 'Lab 3B',
      attendanceDone: true,
      enrolled: 32,
    },
    {
      time: '11:00 - 12:30 PM',
      class: 'Grade 11-B',
      subject: 'Electromagnetism',
      room: 'Hall 2',
      attendanceDone: true,
      enrolled: 28,
    },
    {
      time: '02:00 - 03:30 PM',
      class: 'Grade 10-C',
      subject: 'Introductory Waves & Optics',
      room: 'Lab 3B',
      attendanceDone: false,
      enrolled: 30,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Faculty Dashboard</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Teacher Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your daily class periods, take roll-call attendance, and score student assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Assignment</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 shadow-xs transition-colors cursor-pointer">
            <ClipboardCheck className="w-3.5 h-3.5" />
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
                <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Schedule & Pending Work */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Today's Teaching Schedule
            </h2>
            <span className="text-xs text-slate-500 font-medium">Wednesday • Term 1</span>
          </div>

          <div className="space-y-3">
            {todayClasses.map((cls, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {cls.subject} • {cls.class}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {cls.time} | Room: {cls.room} ({cls.enrolled} students)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {cls.attendanceDone ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Attendance Submitted
                    </span>
                  ) : (
                    <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer">
                      Start Roll Call
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gradebook Queue */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-600" />
              Gradebook Queue
            </h2>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              14 Pending
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="flex justify-between font-semibold text-slate-900 mb-1">
                <span>Lab Report 2: Optics</span>
                <span className="text-amber-700">8 pending</span>
              </div>
              <p className="text-slate-500 text-[11px]">Grade 10-A • Submitted yesterday</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="flex justify-between font-semibold text-slate-900 mb-1">
                <span>Mechanics Midterm Quiz</span>
                <span className="text-amber-700">6 pending</span>
              </div>
              <p className="text-slate-500 text-[11px]">Grade 11-B • Due today</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="flex justify-between font-semibold text-slate-900 mb-1">
                <span>Thermal Physics Homework 1</span>
                <span className="text-emerald-700 font-normal">All graded</span>
              </div>
              <p className="text-slate-500 text-[11px]">Grade 10-C • Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
