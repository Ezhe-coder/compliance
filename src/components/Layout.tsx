import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ScanLine, FileText, Settings, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>
          <span className="font-semibold text-lg tracking-tight">ComplianceAI</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/scan" icon={<ScanLine size={20} />} label="New Scan" />
          <NavItem to="/reports" icon={<FileText size={20} />} label="Reports" />
          <NavItem to="/settings" icon={<Settings size={20} />} label="API Configuration" />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
              US
            </div>
            <div className="text-sm">
              <p className="font-medium">User Account</p>
              <p className="text-gray-500 text-xs">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <OutletOrChildren>{children}</OutletOrChildren>
        </div>
      </main>
    </div>
  );
}

function OutletOrChildren({ children }: { children?: React.ReactNode }) {
  return children ? <>{children}</> : <Outlet />;
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
          isActive
            ? "bg-indigo-50 text-indigo-700"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
