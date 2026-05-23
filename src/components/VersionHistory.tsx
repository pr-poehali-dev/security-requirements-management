import { VersionEntry } from '@/lib/types';
import Icon from '@/components/ui/icon';

export function VersionHistory({ history }: { history: VersionEntry[] }) {
  return (
    <div className="space-y-1">
      {[...history].reverse().map((entry, i) => (
        <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
          <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Icon name="GitCommit" size={11} className="text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono-ibm text-xs font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                v{entry.version}
              </span>
              <span className="text-xs text-muted-foreground">{entry.changedAt}</span>
              <span className="text-xs text-muted-foreground">— {entry.changedBy}</span>
            </div>
            {entry.comment && (
              <p className="text-xs text-foreground mt-0.5">{entry.comment}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
