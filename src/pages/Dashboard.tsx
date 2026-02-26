import React from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your compliance status and recent activities.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Scans" 
          value="1,284" 
          change="+12%" 
          icon={<Activity className="text-indigo-600" />} 
        />
        <StatCard 
          title="Compliance Rate" 
          value="98.2%" 
          change="+0.4%" 
          icon={<CheckCircle className="text-emerald-600" />} 
        />
        <StatCard 
          title="Issues Found" 
          value="23" 
          change="-5%" 
          icon={<AlertTriangle className="text-amber-600" />} 
        />
        <StatCard 
          title="Avg. Processing" 
          value="1.2s" 
          change="0%" 
          icon={<Clock className="text-blue-600" />} 
        />
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Recent Scans</h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
        </div>
        <div className="divide-y divide-gray-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500">IMG</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">asset_marketing_v{i}.jpg</p>
                  <p className="text-xs text-gray-500">Scanned 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  Compliant
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <span className="sr-only">Menu</span>
                  •••
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon }: { title: string; value: string; change: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        <span className={`text-xs font-medium ${change.startsWith('+') ? 'text-emerald-600' : 'text-amber-600'}`}>
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  );
}
