import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, Briefcase, FileText, Bot, Settings, LogOut, Shield } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Search, label: 'Coin Scanner', path: '/scanner' },
  { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: Bot, label: 'AI Assistant', path: '/assistant' },
];

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 h-screen bg-bg-surface border-r border-border fixed left-0 top-0 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <Shield className="w-8 h-8 text-brand-purple" />
        <span className="font-display font-bold text-xl tracking-tight">CryptoGuard</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-brand-purple/10 text-brand-purple border-l-4 border-brand-purple" 
                  : "text-text-secondary hover:bg-bg-elevated hover:text-white"
              )}
            >
              <item.icon className={clsx("w-5 h-5", isActive ? "text-brand-purple" : "text-text-secondary group-hover:text-white")} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-text-secondary hover:text-white hover:bg-bg-elevated rounded-xl transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
