import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

export function OrgDomainsPage() {
  const { orgDomains, currentUser } = useStore();
  const isAdmin = currentUser?.role === 'administrator';
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = orgDomains.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Организационные домены</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Организационная структура и доменная модель компании</p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => navigate('/admin/org-domains/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            size="sm"
          >
            <Icon name="Plus" size={14} />
            Добавить домен
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по названию или ID..."
          className="pl-9 text-sm"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
        <span>Всего: <strong className="text-foreground">{filtered.length}</strong></span>
        <span>Активных: <strong className="text-green-700">{filtered.filter(d => d.status === 'Активен').length}</strong></span>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/60 border-b border-border">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide w-36">ID</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Название</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide w-20">Версия</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide w-36">Владелец</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide w-32">Статус</th>
              <th className="px-4 py-2.5 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-muted-foreground text-sm">
                  Нет элементов
                </td>
              </tr>
            )}
            {filtered.map(domain => (
              <tr key={domain.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <span className="id-badge">{domain.id}</span>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  <Link
                    to={`${isAdmin ? '/admin' : '/library'}/org-domains/${domain.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {domain.name}
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono-ibm text-xs text-muted-foreground">v{domain.version}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{domain.owner}</td>
                <td className="px-4 py-3"><StatusBadge status={domain.status} /></td>
                <td className="px-4 py-3">
                  <Link
                    to={`${isAdmin ? '/admin' : '/library'}/org-domains/${domain.id}`}
                    className="text-muted-foreground hover:text-blue-600 transition-colors"
                  >
                    <Icon name="ChevronRight" size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
