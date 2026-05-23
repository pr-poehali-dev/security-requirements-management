import { useState, KeyboardEvent } from 'react';
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

function renderMarkdown(text: string) {
  return text
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-semibold mt-3 mb-1">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-semibold mt-2 mb-1">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-sm list-disc">$1</li>')
    .replace(/\n\n/g, '<br/>')
    .replace(/\n/g, '<br/>');
}

export function TechnologyCardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { technologies, addTechnology, updateTechnology, deleteTechnology, currentUser } = useStore();
  const isAdmin = currentUser?.role === 'administrator';
  const isNew = id === 'new';
  const existing = technologies.find(t => t.id === id);

  const [editing, setEditing] = useState(isNew);
  const [name, setName] = useState(existing?.name ?? '');
  const [owner, setOwner] = useState(existing?.owner ?? '');
  const [status, setStatus] = useState<ItemStatus>(existing?.status ?? 'В разработке');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [tags, setTags] = useState<string[]>(existing?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'preview' | 'history'>('info');

  if (!isNew && !existing) return <div className="p-6 text-center text-muted-foreground">Элемент не найден</div>;

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,/g, '');
      if (!tags.includes(newTag)) setTags([...tags, newTag]);
      setTagInput('');
    }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  const handleSave = () => {
    if (isNew) {
      const created = addTechnology({ name, owner, status, description, tags });
      navigate(`/admin/technologies/${created.id}`, { replace: true });
    } else {
      updateTechnology(id!, { name, owner, status, description, tags });
      setEditing(false);
    }
  };

  const handleDelete = () => {
    if (confirm('Удалить технологию?')) {
      deleteTechnology(id!);
      navigate('/admin/technologies');
    }
  };

  const item = isNew ? null : technologies.find(t => t.id === id)!;

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5">
        <Link to={`${isAdmin ? '/admin' : '/library'}/technologies`} className="hover:text-foreground transition-colors">Технологии</Link>
        <Icon name="ChevronRight" size={12} />
        <span className="text-foreground">{isNew ? 'Новая технология' : item?.name}</span>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-start justify-between">
          <div>
            {item && <div className="id-badge mb-2">{item.id}</div>}
            <h1 className="text-lg font-semibold">{isNew ? 'Новая технология' : item?.name}</h1>
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
            {(['info', 'preview', 'history'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`text-sm py-2.5 px-1 mr-5 border-b-2 transition-colors font-medium ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                {tab === 'info' ? 'Редактор' : tab === 'preview' ? 'Просмотр' : 'История'}
              </button>
            ))}
          </div>
        )}

        <div className="p-5">
          {(isNew || activeTab === 'info') && (
            <div className="space-y-4">
              {!isNew && <div><Label className="text-xs uppercase tracking-wide text-muted-foreground">ID</Label><div className="mt-1 font-mono-ibm text-sm text-muted-foreground">{item?.id}</div></div>}
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

              {/* Tags */}
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Теги</Label>
                {editing ? (
                  <div className="mt-1 flex flex-wrap gap-1.5 min-h-[38px] px-3 py-2 rounded border border-input bg-background items-center">
                    {tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-red-500"><Icon name="X" size={10} /></button>
                      </span>
                    ))}
                    <input
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder={tags.length === 0 ? 'Введите тег, Enter' : ''}
                      className="flex-1 min-w-[80px] outline-none text-xs bg-transparent"
                    />
                  </div>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(item?.tags ?? []).map(tag => (
                      <span key={tag} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Описание (Markdown)</Label>
                {editing ? (
                  <Textarea className="mt-1 min-h-[200px] font-mono-ibm text-xs" value={description} onChange={e => setDescription(e.target.value)} />
                ) : (
                  <div className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap font-mono-ibm text-xs bg-muted/30 p-3 rounded border border-border">{item?.description}</div>
                )}
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

          {!isNew && activeTab === 'preview' && item && (
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(item.description) }} />
            </div>
          )}

          {!isNew && activeTab === 'history' && item && <VersionHistory history={item.versionHistory} />}
        </div>
      </div>
    </div>
  );
}
