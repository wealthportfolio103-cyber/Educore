/**
 * Accountant / Finance Role Dashboard
 * Accessible ONLY by role = 'accountant'
 * Focus: Fee Structures, Invoices, Payment History, Billing & Collections
 */

import React from 'react';
import {
  CreditCard,
  Receipt,
  BadgePercent,
  History,
  DollarSign,
  ArrowUpRight,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

export default function FinanceDashboardPage() {
  const financeStats = [
    { label: 'Term Revenue Collected', value: '$842,500', change: '+12% vs last term', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Outstanding Balance', value: '$68,400', change: '84 student accounts', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Invoices Issued', value: '1,420', change: 'Term 1 Tuition & Lab fees', icon: Receipt, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Payment Success Rate', value: '98.4%', change: 'Direct Debit & Stripe', icon: CreditCard, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  const recentTransactions = [
    { id: 'INV-2025-0891', student: 'Alexander Hayes (Grade 10-A)', amount: '$1,250.00', status: 'Paid', date: 'Today, 10:14 AM', method: 'Online Portal' },
    { id: 'INV-2025-0890', student: 'Sophia Lin (Grade 11-B)', amount: '$950.00', status: 'Paid', date: 'Today, 09:30 AM', method: 'Bank Transfer' },
    { id: 'INV-2025-0889', student: 'Marcus Vance (Grade 9-C)', amount: '$1,250.00', status: 'Pending', date: 'Yesterday', method: 'Invoice Sent' },
    { id: 'INV-2025-0888', student: 'Emma Watson (Grade 12-A)', amount: '$1,400.00', status: 'Paid', date: 'Sep 23', method: 'Credit Card' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Bursar & Finance Office</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Role: Accountant
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Manage tuition fee schedules, student invoices, recurring collections, and bursar ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors">
            <Receipt className="w-4 h-4" />
            <span>Generate Invoices</span>
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Statement</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {financeStats.map((stat) => {
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
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Invoices & Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Payment Ledger</h2>
            <p className="text-xs text-slate-400">Real-time tuition transactions verified via Supabase</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Status</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Student & Section</th>
                <th className="py-3 px-4">Billing Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-white">{tx.id}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-200">{tx.student}</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-400">{tx.amount}</td>
                  <td className="py-3.5 px-4">
                    {tx.status === 'Paid' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {tx.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="w-3 h-3" />
                        {tx.status}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{tx.method}</td>
                  <td className="py-3.5 px-4 text-slate-400">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
