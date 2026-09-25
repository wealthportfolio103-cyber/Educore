/**
 * Student Role Dashboard
 * Accessible ONLY by role = 'student'
 * Focus: Homework, Term Results, Timetable, Course Materials
 */

import React from 'react';
import {
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const pendingAssignments = [
    {
      title: 'Electromagnetism Problem Set 4',
      subject: 'Physics 101',
      due: 'Today at 5:00 PM',
      status: 'Due Soon',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Calculus Derivative Practice Quiz',
      subject: 'Pure Mathematics',
      due: 'Tomorrow 11:59 PM',
      status: 'Pending',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'World War II Analytical Essay',
      subject: 'Modern History',
      due: 'Monday next week',
      status: 'In Progress',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Student Workspace</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              Student View
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track daily class schedules, submit homework assignments, and review term grades.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Active Homework & Assignments
          </h2>
          <div className="space-y-3">
            {pendingAssignments.map((hw, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{hw.title}</h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${hw.badgeColor}`}
                    >
                      {hw.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {hw.subject} • Due: {hw.due}
                  </p>
                </div>
                <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer">
                  Submit Work
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            Today's Timetable
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-semibold text-slate-900 block">09:00 - 10:30 AM</span>
              <p className="text-slate-500 mt-0.5">Physics 101 • Lab 3B</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-semibold text-slate-900 block">11:00 - 12:30 PM</span>
              <p className="text-slate-500 mt-0.5">Calculus & Algebra • Room 204</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-semibold text-slate-900 block">02:00 - 03:30 PM</span>
              <p className="text-slate-500 mt-0.5">World History • Room 108</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
