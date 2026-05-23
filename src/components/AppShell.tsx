import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '@/lib/store';
import Icon from '@/components/ui/icon';

const adminNav = [
  { label: 'Орг. домены', path: '/admin/org-domains', icon: 'Building2' },
  { label: 'Тех. домены', path: '/admin/tech-domains', icon: 'Server' },
  { label: 'Требования', path: '/admin/requirements', icon: 'ClipboardList' },
  { label: 'Технологии', path: '/admin/technologies', icon: 'Cpu' },
];

const userNav = [
  { label: 'Орг. домены', path: '/library/org-domains', icon: 'Building2' },
  { label: 'Тех. домены', path: '/library/tech-domains', icon: 'Server' },
  { label: 'Требования', path: '/library/requirements', icon: 'ClipboardList' },
  { label: 'Технологии', path: '/library/technologies', icon: 'Cpu' },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { currentUser, logout } = useStore();
  const location = useLocation();
  const isAdmin = currentUser?.role === 'administrator';
  const navItems = isAdmin ? adminNav : userNav;
  const basePath = isAdmin ? '/admin' : '/library';

  return (
    <div className="flex h-screen bg-[hsl(var(--background))] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] flex flex-col">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-[hsl(var(--sidebar-border))]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
              <Icon name="ShieldCheck" size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-white tracking-tight">SecureLib</span>
          </div>
        </div>

        {/* Section label */}
        <div className="px-4 pt-4 pb-2">
          <p className="text-[10px] font-medium text-[hsl(var(--sidebar-foreground))] uppercase tracking-widest opacity-50">
            {isAdmin ? 'Библиотека (Адм.)' : 'Библиотека'}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${active ? 'active' : 'text-[hsl(var(--sidebar-foreground))]'}`}
              >
                <Icon name={item.icon} size={15} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Role switch for admin */}
        {isAdmin && (
          <div className="px-2 pb-2 border-t border-[hsl(var(--sidebar-border))] pt-2">
            <Link
              to="/library/org-domains"
              className="nav-item text-[hsl(var(--sidebar-foreground))] text-xs"
            >
              <Icon name="Eye" size={13} />
              Библиотека потребителя
            </Link>
          </div>
        )}
        {!isAdmin && (
          <div className="px-2 pb-2 border-t border-[hsl(var(--sidebar-border))] pt-2">
            <Link
              to="/admin/org-domains"
              className="nav-item text-[hsl(var(--sidebar-foreground))] text-xs opacity-40 pointer-events-none"
            >
              <Icon name="Lock" size={13} />
              Только чтение
            </Link>
          </div>
        )}

        {/* User */}
        <div className="px-4 py-3 border-t border-[hsl(var(--sidebar-border))]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[hsl(var(--sidebar-accent))] flex items-center justify-center">
              <Icon name="User" size={12} className="text-[hsl(var(--sidebar-accent-foreground))]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{currentUser?.displayName}</p>
              <p className="text-[10px] text-[hsl(var(--sidebar-foreground))] opacity-60 capitalize">
                {currentUser?.role === 'administrator' ? 'Администратор' : 'Пользователь'}
              </p>
            </div>
            <button
              onClick={logout}
              className="text-[hsl(var(--sidebar-foreground))] hover:text-white opacity-60 hover:opacity-100 transition-opacity"
              title="Выйти"
            >
              <Icon name="LogOut" size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
