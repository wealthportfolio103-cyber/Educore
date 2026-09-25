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
    {
      label: 'Term Revenue Collected',
      value: '$842,500',
      change: '+12.4% vs last term',
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'Outstanding Balance',
      value: '$68,400',
      change: '84 student accounts',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      label: 'Invoices Issued',
      value: '1,420',
      change: 'Term 1 Tuition & Lab fees',
      icon: Receipt,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: 'Payment Collection Rate',
      value: '98.4%',
      change: 'Bank transfer & portal',
      icon: CreditCard,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
    },
  ];

  const recentTransactions = [
    {
      id: 'INV-2025-0891',
      student: 'Alexander Hayes',
      section: 'Grade 10-A',
      amount: '$1,250.00',
      status: 'Paid',
      date: 'Today, 10:14 AM',
      method: 'Online Portal',
    },
    {
      id: 'INV-2025-0890',
      student: 'Sophia Lin',
      section: 'Grade 11-B',
      amount: '$950.00',
      status: 'Paid',
      date: 'Today, 09:30 AM',
      method: 'Bank Transfer',
    },
    {
      id: 'INV-2025-0889',
      student: 'Marcus Vance',
      section: 'Grade 9-C',
      amount: '$1,250.00',
      status: 'Pending',
      date: 'Yesterday',
      method: 'Invoice Sent',
    },
    {
      id: 'INV-2025-0888',
      student: 'Emma Watson',
      section: 'Grade 12-A',
      amount: '$1,400.00',
      status: 'Paid',
      date: 'Sep 23',
      method: 'Credit Card',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Bursar & Finance Office</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Accountant Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage tuition fee schedules, student invoices, recurring collections, and bursar ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer">
            <Receipt className="w-3.5 h-3.5" />
            <span>Generate Invoices</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 shadow-xs transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" />
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
                  <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Invoices & Transactions Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Payment Ledger</h2>
            <p className="text-xs text-slate-500">Real-time tuition transactions verified in system</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors cursor-pointer">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Status</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Invoice #</th>
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">Section</th>
                <th className="py-2.5 px-3">Billing Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Payment Method</th>
                <th className="py-2.5 px-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-slate-900">{tx.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{tx.student}</td>
                  <td className="py-3 px-3 text-slate-500">{tx.section}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{tx.amount}</td>
                  <td className="py-3 px-3">
                    {tx.status === 'Paid' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        {tx.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" />
                        {tx.status}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-500">{tx.method}</td>
                  <td className="py-3 px-3 text-slate-500">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
