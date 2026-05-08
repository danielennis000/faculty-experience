import { ExternalLink, Send, User, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { Student } from '@/types/domain';
import { cn } from '@/lib/utils';

export interface InterventionPreviewPanelProps {
  student: Student;
  draftMessage: string;
  onDraftChange: (value: string) => void;
  resources: { label: string; href: string }[];
  onClose: () => void;
  onSimulateSend: () => void;
}

export function InterventionPreviewPanel({
  student,
  draftMessage,
  onDraftChange,
  resources,
  onClose,
  onSimulateSend,
}: InterventionPreviewPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => textareaRef.current?.focus(), 100);
    return () => window.clearTimeout(t);
  }, [student.studentId]);

  return (
    <div
      className={cn(
        'mt-5 rounded-2xl border border-primary/25 bg-primary/[0.03] p-5 shadow-sm ring-1 ring-primary/10',
      )}
      role="region"
      aria-label={`Message preview for ${student.name}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <User className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Intervene · preview</p>
            <p className="truncate text-base font-semibold text-foreground">{student.name}</p>
            <p className="truncate text-sm text-muted-foreground">{student.email}</p>
            {student.status === 'nudged' ? (
              <Badge variant="outline" className="mt-2 border-emerald-600/40 text-emerald-800">
                Already messaged (mock)
              </Badge>
            ) : null}
          </div>
        </div>
        <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={onClose} aria-label="Close preview">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Risk signals</h4>
        <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-sm text-muted-foreground">
          {(student.riskReasons.length ? student.riskReasons : ['No structured reasons; monitor generally.']).map(
            (reason) => (
              <li key={reason}>{reason}</li>
            ),
          )}
        </ul>
      </div>

      <Separator className="my-4" />

      <div className="space-y-2">
        <Label htmlFor={`intervene-draft-${student.studentId}`}>Message students will see (editable)</Label>
        <Textarea
          ref={textareaRef}
          id={`intervene-draft-${student.studentId}`}
          rows={8}
          value={draftMessage}
          onChange={(e) => onDraftChange(e.target.value)}
          className="font-sans text-sm leading-relaxed"
          aria-describedby={`intervene-hint-${student.studentId}`}
        />
        <p id={`intervene-hint-${student.studentId}`} className="text-xs text-muted-foreground">
          Simulated send logs locally and marks the row as messaged. Framed as a check-in to see if they need help —
          nothing leaves this browser.
        </p>
      </div>

      {resources.length > 0 ? (
        <div className="mt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Suggested resources</h4>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
            {resources.map((resource) => (
              <a
                key={resource.href}
                href={resource.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {resource.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" className="gap-2" onClick={onSimulateSend}>
          <Send className="h-4 w-4" aria-hidden />
          Send check-in (simulated)
        </Button>
      </div>
    </div>
  );
}
