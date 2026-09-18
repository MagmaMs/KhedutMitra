import { InboxIcon } from "lucide-react";
interface EmptyStateProps {
  title: string;
  body: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
}
export function EmptyState({
  title,
  body,
  icon: Icon = InboxIcon,
  action
}: EmptyStateProps) {
  return <div className="rounded-lg border border-dashed border-line bg-surface px-5 py-10 text-center">
      <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft">
        <Icon className="h-5 w-5 text-brand-deep" aria-hidden="true" />
      </span>
      <h3 className="text-base font-bold text-ink">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-ink-muted">{body}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>;
}