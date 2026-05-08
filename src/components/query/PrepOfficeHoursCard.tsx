import { Calendar, Clock } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Coworker Faculty Hub prototype — calendar / availability / booking pattern reference. */
export const FACULTY_HUB_CALENDAR_REF = 'https://djz1k3r2z2gvt.cloudfront.net/index.html';

type WeekCell = { label: string; dayNum: number; isToday: boolean };

function mondayThisWeek(now: Date): Date {
  const d = new Date(now);
  const day = d.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + offset);
  d.setHours(12, 0, 0, 0);
  return d;
}

function buildWeekCells(now: Date): WeekCell[] {
  const start = mondayThisWeek(now);
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const today = now.getDate();
  const todayMonth = now.getMonth();
  return labels.map((label, i) => {
    const cell = new Date(start);
    cell.setDate(start.getDate() + i);
    const isToday = cell.getDate() === today && cell.getMonth() === todayMonth;
    return { label, dayNum: cell.getDate(), isToday };
  });
}

const MOCK_SLOTS = [
  { id: 'tue-230', label: 'Tue · 2:30 PM', detail: '15 min · office hours' },
  { id: 'wed-10', label: 'Wed · 10:00 AM', detail: 'Canvas inbox block' },
  { id: 'thu-3', label: 'Thu · 3:00 PM', detail: 'Open slot before OH ends' },
] as const;

/** Compact availability + office hours + “book” affordances, aligned with Faculty Hub calendar UX. */
export function PrepOfficeHoursCard() {
  const now = useMemo(() => new Date(), []);
  const week = useMemo(() => buildWeekCells(now), [now]);
  const [heldId, setHeldId] = useState<string | null>(null);

  function holdSlot(id: string, label: string) {
    if (heldId === id) {
      return;
    }
    setHeldId(id);
    toast.success(`Held ${label} — simulated booking (no external calendar).`);
  }

  return (
    <div className="rounded-xl border border-border/60 bg-background/60 p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Calendar className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Calendar & office hours
          </p>
          
        </div>
      </div>

      <div className="mt-4 flex gap-1.5 sm:gap-2">
        {week.map((cell) => (
          <div
            key={cell.label}
            className={cn(
              'flex min-w-0 flex-1 flex-col items-center rounded-lg border px-1 py-2 text-center sm:px-2',
              cell.isToday ? 'border-primary/50 bg-primary/[0.06]' : 'border-border/50 bg-muted/20',
            )}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
              {cell.label}
            </span>
            <span className="text-sm font-bold text-foreground sm:text-base">{cell.dayNum}</span>
            <span className="mt-1 h-1.5 w-full max-w-[28px] rounded-full bg-gold/80 sm:max-w-[36px]" title="Office hours block (mock)" />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-border/50 bg-muted/15 px-3 py-2.5">
        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        <div className="text-xs leading-relaxed text-foreground">
          <span className="font-medium">Office hours (mock):</span> Tue & Thu · 2:00–4:00 PM · Hayden pod B
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Open slots to hold</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {MOCK_SLOTS.map((slot) => {
            const active = heldId === slot.id;
            return (
              <Button
                key={slot.id}
                type="button"
                variant={active ? 'secondary' : 'outline'}
                size="sm"
                className="h-auto flex-col items-start gap-0.5 py-2 sm:min-w-[140px]"
                onClick={() => holdSlot(slot.id, slot.label)}
              >
                <span className="text-xs font-semibold">{slot.label}</span>
                <span className="text-[10px] font-normal text-muted-foreground">{slot.detail}</span>
              </Button>
            );
          })}
        </div>
        {heldId ? (
          <p className="mt-2 text-xs text-muted-foreground">Tap another slot to change your simulated hold.</p>
        ) : null}
      </div>
    </div>
  );
}
