import type { LucideIcon } from 'lucide-react';
import {
  Bot,
  ChevronRight,
  Flag,
  LayoutGrid,
  ListChecks,
  Mail,
  Send,
  Sparkles,
  Target,
  TriangleAlert,
  Users,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useId, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertSeverityStrip,
  countSeverityMix,
  ModuleSignalsHorizontalChart,
  PriorityMetricsChart,
  StudentGradeHorizontalChart,
} from '@/components/query/charts';
import { PrepOfficeHoursCard } from '@/components/query/PrepOfficeHoursCard';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { CourseModule, PrepDayItem, QueryIntent, QueryResult, Student } from '@/types/domain';
import { cn } from '@/lib/utils';

function ResponseSection({
  title,
  subtitle,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-border/80 bg-card p-5 shadow-sm ring-1 ring-black/[0.04]',
        className,
      )}
    >
      <header className="mb-4 flex items-start gap-3">
        {Icon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm leading-snug text-foreground">{subtitle}</p> : null}
        </div>
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function InlineSummary({ text }: { text: string }) {
  return <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>;
}

function MessageList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-3.5 shadow-sm"
        >
          <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span className="text-sm leading-relaxed text-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PrepDayChecklist({
  items,
  onRunFollowUp,
}: {
  items: PrepDayItem[];
  onRunFollowUp: (prompt: string) => void;
}) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={`${item.text}-${item.actionPrompt}`}>
          <button
            type="button"
            aria-label={`Run follow-up ask: ${item.text}`}
            onClick={() => onRunFollowUp(item.actionPrompt)}
            className={cn(
              'flex w-full items-start gap-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-3.5 text-left shadow-sm transition-colors',
              'hover:border-primary/35 hover:bg-primary/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            )}
          >
            <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span className="min-w-0 flex-1 text-sm leading-relaxed text-foreground">{item.text}</span>
            <span className="mt-0.5 flex shrink-0 items-center gap-0.5 text-xs font-medium text-primary">
              Run
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function SeverityBadge({ severity }: { severity: Student['severity'] }) {
  const map = {
    high: 'destructive' as const,
    medium: 'gold' as const,
    low: 'secondary' as const,
  };
  return (
    <Badge variant={map[severity]} className="uppercase">
      {severity}
    </Badge>
  );
}

function AlertMessageCard({
  studentName,
  headline,
  detail,
  severity,
}: {
  studentName: string;
  headline: string;
  detail: string;
  severity: Student['severity'];
}) {
  const initial = studentName.trim().charAt(0).toUpperCase();
  const accent =
    severity === 'high'
      ? 'border-l-destructive bg-destructive/[0.06]'
      : severity === 'medium'
        ? 'border-l-gold bg-gold/10'
        : 'border-l-muted-foreground/40 bg-muted/40';

  return (
    <article
      className={cn(
        'flex gap-3 rounded-2xl border border-border/60 border-l-4 bg-card p-4 pl-3 shadow-sm',
        accent,
      )}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-background text-base font-bold text-primary shadow-inner ring-1 ring-border/60"
        aria-hidden
      >
        {initial}
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-foreground">{studentName}</span>
          <SeverityBadge severity={severity} />
        </div>
        <p className="text-sm font-medium text-foreground">{headline}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
      </div>
    </article>
  );
}

function StudentsTable({
  students,
  selectedId,
  turnIntent,
  onIntervene,
}: {
  students: Student[];
  selectedId: string | undefined;
  turnIntent: QueryIntent;
  onIntervene: (student: Student, intent: QueryIntent) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-background/50">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Student</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Last login</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Assistant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.studentId}>
              <TableCell>
                <div className="font-medium">{student.name}</div>
                <div className="text-xs text-muted-foreground">{student.email}</div>
              </TableCell>
              <TableCell>{student.currentGrade}%</TableCell>
              <TableCell className="text-muted-foreground">{student.lastLoginDate}</TableCell>
              <TableCell>
                <SeverityBadge severity={student.severity} />
              </TableCell>
              <TableCell>
                {student.status === 'nudged' ? (
                  <Badge variant="outline" className="border-emerald-600/40 text-emerald-800">
                    Messaged
                  </Badge>
                ) : (
                  <Badge variant="muted">Watch</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant={selectedId === student.studentId ? 'default' : 'outline'}
                  size="sm"
                  className="gap-1.5"
                  aria-label={`Open assistant for ${student.name}`}
                  onClick={() => onIntervene(student, turnIntent)}
                >
                  <Bot className="h-3.5 w-3.5" aria-hidden />
                  Intervene
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ModulesTable({
  modules,
  onFlag,
}: {
  modules: CourseModule[];
  onFlag: (m: CourseModule) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-background/50">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Module</TableHead>
            <TableHead>Engagement</TableHead>
            <TableHead>Drop-off</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {modules.map((mod) => (
            <TableRow key={mod.moduleId}>
              <TableCell className="font-medium">{mod.moduleName}</TableCell>
              <TableCell>{mod.engagementRate}%</TableCell>
              <TableCell>{mod.dropOffRate}%</TableCell>
              <TableCell>
                <SeverityBadge severity={mod.severity} />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  disabled={mod.status === 'flagged'}
                  aria-label={mod.status === 'flagged' ? `${mod.moduleName} flagged` : `Flag ${mod.moduleName}`}
                  onClick={() => onFlag(mod)}
                >
                  <Flag className="h-3.5 w-3.5" aria-hidden />
                  {mod.status === 'flagged' ? 'Flagged' : 'Flag module'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EmailDraftBlock({
  draft,
  onCopyEmail,
  onSimulateSendEmail,
}: {
  draft: NonNullable<QueryResult['emailDraft']>;
  onCopyEmail: (subject: string, body: string) => void;
  onSimulateSendEmail?: (subject: string, body: string) => void;
}) {
  const formId = useId();
  const [sendSimulated, setSendSimulated] = useState(false);
  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.body);

  useEffect(() => {
    setSubject(draft.subject);
    setBody(draft.body);
    setSendSimulated(false);
  }, [draft.subject, draft.body, draft.recipientsLabel]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted/20 shadow-inner">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 bg-background/90 px-4 py-2.5">
        <div className="min-w-0 flex-1 space-y-2">
          {draft.recipientsLabel ? (
            <p className="truncate text-xs text-muted-foreground">{draft.recipientsLabel}</p>
          ) : null}
          <div className="space-y-1.5">
            <Label htmlFor={`${formId}-subject`} className="text-xs uppercase tracking-wide text-muted-foreground">
              Subject
            </Label>
            <Input
              id={`${formId}-subject`}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="font-semibold text-foreground"
              aria-label="Email subject"
            />
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {sendSimulated ? (
            <Badge variant="outline" className="border-emerald-600/45 text-emerald-900 dark:text-emerald-100">
              Sent (simulated)
            </Badge>
          ) : null}
          {onSimulateSendEmail && !sendSimulated ? (
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => {
                onSimulateSendEmail(subject.trim() || '(no subject)', body);
                setSendSimulated(true);
              }}
            >
              <Send className="h-3.5 w-3.5" aria-hidden />
              Send (simulated)
            </Button>
          ) : null}
          <Button variant="secondary" size="sm" onClick={() => onCopyEmail(subject.trim() || '(no subject)', body)}>
            Copy
          </Button>
        </div>
      </div>
      <div className="bg-gradient-to-b from-card to-muted/30 px-4 py-4">
        <Label htmlFor={`${formId}-body`} className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
          Message body
        </Label>
        <Textarea
          id={`${formId}-body`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={12}
          className="max-h-72 min-h-[200px] resize-y font-sans text-sm leading-relaxed"
          aria-label="Email or announcement body"
        />
      </div>
    </div>
  );
}

function rosterTitle(intent: QueryIntent): string {
  switch (intent) {
    case 'at_risk_roster':
      return 'At-risk roster';
    case 'inactive_students':
      return 'Inactive students';
    case 'low_grades':
      return 'Below grade threshold';
    case 'missing_assignments':
      return 'Missing assignments';
    default:
      return 'Roster';
  }
}

export interface QueryAssistantBodyProps {
  result: QueryResult;
  mergedStudents: Student[];
  mergedModules: CourseModule[];
  selectedStudentId: string | undefined;
  gradeThreshold: number;
  onIntervene: (student: Student, intent: QueryIntent) => void;
  onFlagModule: (moduleRow: CourseModule) => void;
  onCopyEmail: (subject: string, body: string) => void;
  /** Simulated send — parent shows toast / logs; draft stays visible. */
  onSimulateSendEmail?: (subject: string, body: string) => void;
  /** Prep checklist rows run this with a canned prompt (same as typing in the composer). */
  onRunFollowUp?: (prompt: string) => void;
}

export function QueryAssistantBody({
  result,
  mergedStudents,
  mergedModules,
  selectedStudentId,
  gradeThreshold,
  onIntervene,
  onFlagModule,
  onCopyEmail,
  onSimulateSendEmail,
  onRunFollowUp,
}: QueryAssistantBodyProps) {
  const sections: ReactNode[] = [];
  const { intent } = result;

  if (intent === 'unsupported') {
    sections.push(
      <ResponseSection key="unsupported" title="Could not run" icon={TriangleAlert}>
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Unsupported in this prototype</AlertTitle>
          <AlertDescription>{result.summary}</AlertDescription>
        </Alert>
      </ResponseSection>,
    );
    return <div className="flex flex-col gap-6">{sections}</div>;
  }

  if (intent === 'recommended_actions') {
    sections.push(
      <ResponseSection key="rec" title="Recommended next actions" icon={Target}>
        <InlineSummary text={result.summary} />
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Signal volume</p>
          <PriorityMetricsChart studentCount={mergedStudents.length} moduleCount={mergedModules.length} />
        </div>
        {result.suggestedActions.length > 0 ? <MessageList items={result.suggestedActions} /> : null}
      </ResponseSection>,
    );
  } else if (intent === 'student_alerts') {
    if (result.alerts && result.alerts.length > 0) {
      const mix = countSeverityMix(mergedStudents);
      sections.push(
        <ResponseSection key="alerts" title="Student alerts" subtitle="Highest severity first." icon={Users}>
          <InlineSummary text={result.summary} />
          {mergedStudents.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Severity mix</p>
              <AlertSeverityStrip counts={mix} />
              <p className="text-xs text-muted-foreground">High · medium · low</p>
            </div>
          ) : null}
          <div className="flex flex-col gap-3">
            {result.alerts.map((item) => (
              <AlertMessageCard
                key={item.alertId}
                studentName={item.studentName}
                headline={item.headline}
                detail={item.detail}
                severity={item.severity}
              />
            ))}
          </div>
        </ResponseSection>,
      );
    } else {
      sections.push(
        <ResponseSection key="alerts-empty" title="Student alerts" icon={Users}>
          <InlineSummary text={result.summary} />
          <p className="text-sm text-muted-foreground">No alerts in mock data for this course.</p>
        </ResponseSection>,
      );
    }
  } else if (intent === 'prep_my_day') {
    if (result.prepDayItems && result.prepDayItems.length > 0) {
      sections.push(
        <ResponseSection key="prep" title="Prep my day" icon={ListChecks}>
          <InlineSummary text={result.summary} />
          <PrepOfficeHoursCard />
          {onRunFollowUp ? (
            <>
              <p className="text-xs text-muted-foreground">Tap a row to run the matching ask in the thread.</p>
              <PrepDayChecklist items={result.prepDayItems} onRunFollowUp={onRunFollowUp} />
            </>
          ) : (
            <MessageList items={result.prepDayItems.map((i) => i.text)} />
          )}
        </ResponseSection>,
      );
    } else {
      sections.push(
        <ResponseSection key="prep-empty" title="Prep my day" icon={ListChecks}>
          <InlineSummary text={result.summary} />
        </ResponseSection>,
      );
    }
  } else if (intent === 'bulk_outreach' && result.emailDraft) {
    sections.push(
      <ResponseSection key="outreach" title="Draft outreach" icon={Mail}>
        <InlineSummary text={result.summary} />
        <EmailDraftBlock
          draft={result.emailDraft}
          onCopyEmail={onCopyEmail}
          onSimulateSendEmail={onSimulateSendEmail}
        />
      </ResponseSection>,
    );
  } else if (intent === 'draft_announcement' && result.emailDraft) {
    sections.push(
      <ResponseSection key="announce" title="Draft announcement" icon={Sparkles}>
        <InlineSummary text={result.summary} />
        <EmailDraftBlock
          draft={result.emailDraft}
          onCopyEmail={onCopyEmail}
          onSimulateSendEmail={onSimulateSendEmail}
        />
      </ResponseSection>,
    );
  } else if (
    intent === 'at_risk_roster' ||
    intent === 'inactive_students' ||
    intent === 'low_grades' ||
    intent === 'missing_assignments'
  ) {
    sections.push(
      <ResponseSection key="roster" title={rosterTitle(intent)} icon={Users}>
        <InlineSummary text={result.summary} />
        {mergedStudents.length > 0 ? (
          <>
            <StudentGradeHorizontalChart students={mergedStudents} gradeThreshold={gradeThreshold} />
            <Separator className="my-2" />
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Roster</p>
            <StudentsTable
              students={mergedStudents}
              selectedId={selectedStudentId}
              turnIntent={intent}
              onIntervene={onIntervene}
            />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No students matched this ask in mock data.</p>
        )}
      </ResponseSection>,
    );
  } else if (intent === 'module_dropoff') {
    sections.push(
      <ResponseSection key="modules" title="Module drop-off" subtitle="Engagement vs. drop-off (mock)." icon={LayoutGrid}>
        <InlineSummary text={result.summary} />
        {mergedModules.length > 0 ? (
          <>
            <ModuleSignalsHorizontalChart modules={mergedModules} />
            <Separator className="my-2" />
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Actions</p>
            <ModulesTable modules={mergedModules} onFlag={onFlagModule} />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No modules matched this ask in mock data.</p>
        )}
      </ResponseSection>,
    );
  } else {
    sections.push(
      <ResponseSection key="fallback" title="Assistant reply" icon={Sparkles}>
        <InlineSummary text={result.summary} />
        <p className="text-sm text-muted-foreground">This intent has no dedicated layout in the prototype.</p>
      </ResponseSection>,
    );
  }

  return <div className="flex flex-col gap-6">{sections}</div>;
}
