import { AlertTriangleIcon, RefreshCwIcon } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title: string;
  body: string;
  retryLabel: string;
  onRetry: () => void;
}

export function ErrorState({ title, body, retryLabel, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-line bg-surface p-5 shadow-card" role="alert">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger-soft">
          <AlertTriangleIcon className="h-5 w-5 text-danger" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-ink">{title}</h3>
          <p className="mt-1 text-sm text-ink-muted">{body}</p>
          <Button variant="secondary" className="mt-3" onClick={onRetry}>
            <RefreshCwIcon className="h-4 w-4" aria-hidden="true" />
            {retryLabel}
          </Button>
        </div>
      </div>
    </div>);

}