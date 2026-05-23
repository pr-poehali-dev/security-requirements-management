import { ItemStatus } from '@/lib/types';

const statusConfig: Record<ItemStatus, { label: string; className: string }> = {
  'Активен': { label: 'Активен', className: 'status-active' },
  'В разработке': { label: 'В разработке', className: 'status-dev' },
  'Не активен': { label: 'Не активен', className: 'status-inactive' },
  'В архиве': { label: 'В архиве', className: 'status-archive' },
};

export function StatusBadge({ status }: { status: ItemStatus }) {
  const cfg = statusConfig[status] ?? statusConfig['Не активен'];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
