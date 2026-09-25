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
    { name: 'Lucas Chen', grade: 'Grade 10-A', studentId: 'EDU-2024-041', attendance: '98.5%', gpa: '3.85 / 4.0' },
    { name: 'Chloe Chen', grade: 'Grade 7-C', studentId: 'EDU-2025-112', attendance: '96.2%', gpa: '3.92 / 4.0' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Parent Guardian Portal</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Role: Parent
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Monitor academic progress, term reports, and fee commitments for your enrolled children.
          </p>
        </div>
      </div>

      {/* Children Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((child) => (
          <div key={child.studentId} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-lg">
                  {child.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{child.name}</h2>
                  <p className="text-xs text-slate-400">{child.grade} • ID: {child.studentId}</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Good Standing
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400">Term Attendance</span>
                <p className="text-lg font-bold text-white mt-0.5">{child.attendance}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400">Cumulative GPA</span>
                <p className="text-lg font-bold text-emerald-400 mt-0.5">{child.gpa}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
                <span>View Report Card</span>
              </button>
              <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pay Fee Bill</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
