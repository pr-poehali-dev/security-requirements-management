import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

export function LoginPage() {
  const login = useStore(s => s.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(username, password);
    if (!ok) setError('Неверный логин или пароль');
    else setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded mb-4">
            <Icon name="ShieldCheck" size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-white tracking-tight">SecureLib</h1>
          <p className="text-sm text-slate-400 mt-1">Платформа управления требованиями ИБ</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-sm font-medium text-slate-300 mb-5 uppercase tracking-wider">Вход в систему</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-slate-400 text-xs uppercase tracking-wide">Логин</Label>
              <Input
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="mt-1 bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
                placeholder="admin"
                autoComplete="username"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-slate-400 text-xs uppercase tracking-wide">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
                placeholder="••••••"
                autoComplete="current-password"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950 border border-red-900 rounded px-3 py-2">
                <Icon name="AlertCircle" size={14} />
                {error}
              </div>
            )}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
              Войти
            </Button>
          </form>
          <div className="mt-4 pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-600 text-center">
              admin / admin &nbsp;·&nbsp; test / test
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
