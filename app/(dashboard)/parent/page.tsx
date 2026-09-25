/**
 * Parent Role Dashboard
 * Accessible ONLY by role = 'parent'
 * Focus: Child Performance, Fees, Communications, Report Cards
 */

import React from 'react';
import {
  HeartHandshake,
  FileSpreadsheet,
  CreditCard,
  Award,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function ParentDashboardPage() {
  const children = [
    {
      name: 'Lucas Chen',
      grade: 'Grade 10-A',
      studentId: 'EDU-2024-041',
      attendance: '98.5%',
      gpa: '3.85 / 4.0',
      standing: 'Honor Roll',
      feeStatus: 'Up to Date',
    },
    {
      name: 'Chloe Chen',
      grade: 'Grade 7-C',
      studentId: 'EDU-2025-112',
      attendance: '96.2%',
      gpa: '3.92 / 4.0',
      standing: 'Principal List',
      feeStatus: 'Term 1 Due ($450)',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Parent & Guardian Portal</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              Parent View
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitor academic progress, term reports, and fee commitments for your enrolled children.
          </p>
        </div>
      </div>

      {/* Children Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((child) => (
          <div
            key={child.studentId}
            className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold text-base">
                  {child.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{child.name}</h2>
                  <p className="text-xs text-slate-500">{child.grade} • ID: {child.studentId}</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                {child.standing}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium">Term Attendance</span>
                <p className="text-lg font-bold text-slate-900 mt-0.5">{child.attendance}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium">Cumulative GPA</span>
                <p className="text-lg font-bold text-indigo-600 mt-0.5">{child.gpa}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                <span>View Report Card</span>
              </button>
              <button className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                <CreditCard className="w-3.5 h-3.5" />
                <span>{child.feeStatus.includes('Due') ? 'Pay Invoice' : 'Receipt History'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
