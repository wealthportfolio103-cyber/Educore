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
    { title: 'Electromagnetism Problem Set 4', subject: 'Physics 101', due: 'Today at 5:00 PM', status: 'Urgent' },
    { title: 'Calculus Derivative Practice Quiz', subject: 'Pure Mathematics', due: 'Tomorrow 11:59 PM', status: 'Pending' },
    { title: 'World War II Analytical Essay', subject: 'Modern History', due: 'Monday next week', status: 'In Progress' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Student Workspace</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Role: Student
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Track daily class schedules, submit homework assignments, and review grades.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Active Homework & Assignments
          </h2>
          <div className="space-y-3">
            {pendingAssignments.map((hw, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-sm font-semibold text-white">{hw.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{hw.subject} • Due: {hw.due}</p>
                </div>
                <button className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors">
                  Submit Work
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            Today's Timetable
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-semibold text-white block">09:00 - 10:30 AM</span>
              <p className="text-slate-400">Physics 101 • Lab 3B</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-semibold text-white block">11:00 - 12:30 PM</span>
              <p className="text-slate-400">Calculus & Algebra • Room 204</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-semibold text-white block">02:00 - 03:30 PM</span>
              <p className="text-slate-400">World History • Room 108</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
