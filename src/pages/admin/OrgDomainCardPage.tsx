import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { ItemStatus } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';
import { VersionHistory } from '@/components/VersionHistory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

const STATUSES: ItemStatus[] = ['Активен', 'В разработке', 'Не активен', 'В архиве'];

export function OrgDomainCardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orgDomains, addOrgDomain, updateOrgDomain, deleteOrgDomain, currentUser } = useStore();
  const isAdmin = currentUser?.role === 'administrator';
  const isNew = id === 'new';

  const existing = orgDomains.find(d => d.id === id);

  const [editing, setEditing] = useState(isNew);
  const [name, setName] = useState(existing?.name ?? '');
  const [owner, setOwner] = useState(existing?.owner ?? '');
  const [status, setStatus] = useState<ItemStatus>(existing?.status ?? 'В разработке');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');

  if (!isNew && !existing) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Элемент не найден</p>
        <Button className="mt-4" variant="outline" onClick={() => navigate(-1)}>Назад</Button>
      </div>
    );
  }

  const handleSave = () => {
    if (isNew) {
      const created = addOrgDomain({ name, owner, status, description });
      navigate(`/admin/org-domains/${created.id}`, { replace: true });
    } else {
      updateOrgDomain(id!, { name, owner, status, description });
      setEditing(false);
    }
  };

  const handleDelete = () => {
    if (confirm('Удалить элемент?')) {
      deleteOrgDomain(id!);
      navigate('/admin/org-domains');
    }
  };

  const item = isNew ? null : orgDomains.find(d => d.id === id)!;

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5">
        <Link to="/admin/org-domains" className="hover:text-foreground transition-colors">Орг. домены</Link>
        <Icon name="ChevronRight" size={12} />
        <span className="text-foreground">{isNew ? 'Новый элемент' : (item?.name ?? '')}</span>
      </div>

      {/* Card */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Card header */}
        <div className="px-5 py-4 border-b border-border flex items-start justify-between">
          <div>
            {item && <div className="id-badge mb-2">{item.id}</div>}
            <h1 className="text-lg font-semibold">{isNew ? 'Новый орг. домен' : item?.name}</h1>
            {item && (
              <div className="flex items-center gap-3 mt-1.5">
                <StatusBadge status={item.status} />
                <span className="font-mono-ibm text-xs text-muted-foreground">v{item.version}</span>
              </div>
            )}
          </div>
          {isAdmin && !isNew && !editing && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="gap-1.5">
                <Icon name="Pencil" size={13} />
                Редактировать
              </Button>
              <Button size="sm" variant="destructive" onClick={handleDelete} className="gap-1.5">
                <Icon name="Trash2" size={13} />
                Удалить
              </Button>
            </div>
          )}
        </div>

        {/* Tabs */}
        {!isNew && (
          <div className="flex border-b border-border px-5">
            {(['info', 'history'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm py-2.5 px-1 mr-5 border-b-2 transition-colors font-medium ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'info' ? 'Информация' : 'История версий'}
              </button>
            ))}
          </div>
        )}

        <div className="p-5">
          {(isNew || activeTab === 'info') && (
            <div className="space-y-4">
              {/* ID */}
              {!isNew && (
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">ID</Label>
                  <div className="mt-1 font-mono-ibm text-sm text-muted-foreground">{item?.id}</div>
                </div>
              )}

              {/* Name */}
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Название</Label>
                {editing ? (
                  <Input className="mt-1" value={name} onChange={e => setName(e.target.value)} placeholder="Введите название" />
                ) : (
                  <div className="mt-1 text-sm font-medium">{item?.name}</div>
                )}
              </div>

              {/* Owner + Status row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Владелец</Label>
                  {editing ? (
                    <Input className="mt-1" value={owner} onChange={e => setOwner(e.target.value)} placeholder="Фамилия И.О." />
                  ) : (
                    <div className="mt-1 text-sm">{item?.owner}</div>
                  )}
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Статус</Label>
                  {editing ? (
                    <Select value={status} onValueChange={v => setStatus(v as ItemStatus)}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1"><StatusBadge status={item!.status} /></div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Описание</Label>
                {editing ? (
                  <Textarea className="mt-1 min-h-[120px]" value={description} onChange={e => setDescription(e.target.value)} placeholder="Описание домена..." />
                ) : (
                  <div className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{item?.description}</div>
                )}
              </div>

              {/* Save / Cancel */}
              {editing && (
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5" size="sm">
                    <Icon name="Save" size={13} />
                    {isNew ? 'Создать' : 'Сохранить'}
                  </Button>
                  {!isNew && (
                    <Button variant="outline" size="sm" onClick={() => {
                      setEditing(false);
                      setName(item?.name ?? '');
                      setOwner(item?.owner ?? '');
                      setStatus(item?.status ?? 'В разработке');
                      setDescription(item?.description ?? '');
                    }}>
                      Отмена
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Version History Tab */}
          {!isNew && activeTab === 'history' && item && (
            <VersionHistory history={item.versionHistory} />
          )}
        </div>
      </div>
    </div>
  );
}
