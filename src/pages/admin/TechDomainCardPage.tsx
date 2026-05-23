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
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';

const STATUSES: ItemStatus[] = ['Активен', 'В разработке', 'Не активен', 'В архиве'];

export function TechDomainCardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { techDomains, orgDomains, addTechDomain, updateTechDomain, deleteTechDomain, currentUser } = useStore();
  const isAdmin = currentUser?.role === 'administrator';
  const isNew = id === 'new';
  const existing = techDomains.find(d => d.id === id);

  const [editing, setEditing] = useState(isNew);
  const [name, setName] = useState(existing?.name ?? '');
  const [owner, setOwner] = useState(existing?.owner ?? '');
  const [status, setStatus] = useState<ItemStatus>(existing?.status ?? 'В разработке');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>(existing?.orgDomains ?? []);
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');

  if (!isNew && !existing) {
    return <div className="p-6 text-center text-muted-foreground">Элемент не найден</div>;
  }

  const handleSave = () => {
    if (isNew) {
      const created = addTechDomain({ name, owner, status, description, orgDomains: selectedOrgs });
      navigate(`/admin/tech-domains/${created.id}`, { replace: true });
    } else {
      updateTechDomain(id!, { name, owner, status, description, orgDomains: selectedOrgs });
      setEditing(false);
    }
  };

  const handleDelete = () => {
    if (confirm('Удалить элемент?')) {
      deleteTechDomain(id!);
      navigate('/admin/tech-domains');
    }
  };

  const toggleOrg = (oid: string) => {
    setSelectedOrgs(prev => prev.includes(oid) ? prev.filter(x => x !== oid) : [...prev, oid]);
  };

  const item = isNew ? null : techDomains.find(d => d.id === id)!;

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5">
        <Link to="/admin/tech-domains" className="hover:text-foreground transition-colors">Тех. домены</Link>
        <Icon name="ChevronRight" size={12} />
        <span className="text-foreground">{isNew ? 'Новый элемент' : item?.name}</span>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-start justify-between">
          <div>
            {item && <div className="id-badge mb-2">{item.id}</div>}
            <h1 className="text-lg font-semibold">{isNew ? 'Новый тех. домен' : item?.name}</h1>
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
                <Icon name="Pencil" size={13} />Редактировать
              </Button>
              <Button size="sm" variant="destructive" onClick={handleDelete} className="gap-1.5">
                <Icon name="Trash2" size={13} />Удалить
              </Button>
            </div>
          )}
        </div>

        {!isNew && (
          <div className="flex border-b border-border px-5">
            {(['info', 'history'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`text-sm py-2.5 px-1 mr-5 border-b-2 transition-colors font-medium ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                {tab === 'info' ? 'Информация' : 'История версий'}
              </button>
            ))}
          </div>
        )}

        <div className="p-5">
          {(isNew || activeTab === 'info') && (
            <div className="space-y-4">
              {!isNew && (
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">ID</Label>
                  <div className="mt-1 font-mono-ibm text-sm text-muted-foreground">{item?.id}</div>
                </div>
              )}
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Название</Label>
                {editing ? <Input className="mt-1" value={name} onChange={e => setName(e.target.value)} /> : <div className="mt-1 text-sm font-medium">{item?.name}</div>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Владелец</Label>
                  {editing ? <Input className="mt-1" value={owner} onChange={e => setOwner(e.target.value)} /> : <div className="mt-1 text-sm">{item?.owner}</div>}
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Статус</Label>
                  {editing ? (
                    <Select value={status} onValueChange={v => setStatus(v as ItemStatus)}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  ) : <div className="mt-1"><StatusBadge status={item!.status} /></div>}
                </div>
              </div>

              {/* Org Domains */}
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Организационные домены</Label>
                {editing ? (
                  <div className="mt-2 space-y-1.5">
                    {orgDomains.map(org => (
                      <div key={org.id} className="flex items-center gap-2">
                        <Checkbox id={org.id} checked={selectedOrgs.includes(org.id)} onCheckedChange={() => toggleOrg(org.id)} />
                        <label htmlFor={org.id} className="text-sm cursor-pointer">{org.name}</label>
                        <span className="id-badge">{org.id}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(item?.orgDomains ?? []).map(oid => {
                      const org = orgDomains.find(o => o.id === oid);
                      return org ? <span key={oid} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">{org.name}</span> : null;
                    })}
                    {(item?.orgDomains ?? []).length === 0 && <span className="text-sm text-muted-foreground">Не указаны</span>}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Описание</Label>
                {editing ? <Textarea className="mt-1 min-h-[120px]" value={description} onChange={e => setDescription(e.target.value)} /> : <div className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{item?.description}</div>}
              </div>

              {editing && (
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5" size="sm">
                    <Icon name="Save" size={13} />{isNew ? 'Создать' : 'Сохранить'}
                  </Button>
                  {!isNew && <Button variant="outline" size="sm" onClick={() => setEditing(false)}>Отмена</Button>}
                </div>
              )}
            </div>
          )}
          {!isNew && activeTab === 'history' && item && <VersionHistory history={item.versionHistory} />}
        </div>
      </div>
    </div>
  );
}
