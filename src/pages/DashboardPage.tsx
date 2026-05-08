import { Bot, Send } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { InterventionPreviewPanel } from '@/components/query/InterventionPreviewPanel';
import { QueryAssistantBody } from '@/components/query/QueryAssistantBody';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { courses } from '../data/mockData';
import {
  loadPrototypeState,
  recordModuleFlag,
  recordQueryRun,
  recordStudentNudge,
} from '../services/prototypeStorage';
import { examplePrompts, quickAskChips, runMockQuery } from '../services/queryEngine';
import type { CourseModule, QueryIntent, QueryResult, Student } from '../types/domain';
import { buildAgenticDraftMessage, suggestedResources } from '../utils/agenticDraft';

const defaultThresholds = {
  daysInactive: 7,
  gradeBelow: 70,
};

interface ConversationTurn {
  id: string;
  userText: string;
  result: QueryResult;
}

interface ActiveIntervention {
  turnId: string;
  student: Student;
  intent: QueryIntent;
}

export default function DashboardPage() {
  const { courseId = '' } = useParams();
  const course = courses.find((item) => item.courseId === courseId) ?? courses[0];
  const [query, setQuery] = useState('');
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [intervention, setIntervention] = useState<ActiveIntervention | null>(null);
  const [draftMessage, setDraftMessage] = useState('');
  const [storageVersion, setStorageVersion] = useState(0);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const stored = useMemo(() => loadPrototypeState(), [storageVersion]);
  const bumpStorage = () => setStorageVersion((v) => v + 1);

  const intentForDraft: QueryIntent =
    intervention && intervention.intent !== 'unsupported' ? intervention.intent : 'low_grades';

  useEffect(() => {
    if (intervention) {
      setDraftMessage(buildAgenticDraftMessage(intervention.student, intentForDraft));
    } else {
      setDraftMessage('');
    }
  }, [intervention, intentForDraft]);

  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [turns.length, intervention?.turnId, intervention?.student.studentId]);

  function handleIntervene(turnId: string, student: Student, intent: QueryIntent) {
    setIntervention({ turnId, student, intent });
  }

  function mergeStudentsForTurn(list: Student[]) {
    return list.map((student) => ({
      ...student,
      status: stored.studentStatuses[student.studentId] ?? student.status,
    }));
  }

  function mergeModulesForTurn(list: CourseModule[]) {
    return list.map((moduleRow) => ({
      ...moduleRow,
      status: stored.moduleStatuses[moduleRow.moduleId] ?? moduleRow.status,
    }));
  }

  function handleFlagModule(moduleRow: CourseModule) {
    recordModuleFlag(moduleRow.moduleId, moduleRow.moduleName);
    bumpStorage();
    toast.success(`Simulated flag recorded for ${moduleRow.moduleName}.`);
  }

  function runAsk(value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      toast.warning('Type a question or tap a quick ask.');
      return;
    }

    const nextResult = runMockQuery(course.courseId, trimmed, defaultThresholds);
    const turn: ConversationTurn = {
      id: `turn-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      userText: trimmed,
      result: nextResult,
    };

    setTurns((previous) => [...previous, turn]);
    setQuery('');
    setIntervention(null);

    if (nextResult.intent !== 'unsupported') {
      const shortQuery = trimmed.length > 90 ? `${trimmed.slice(0, 90)}…` : trimmed;
      recordQueryRun(`Course question: ${shortQuery}`);
      bumpStorage();
    }
  }

  function handleSendInterventionMessage() {
    if (!intervention) {
      return;
    }
    if (!draftMessage.trim()) {
      toast.warning('Add text to the message before sending the simulated check-in.');
      return;
    }
    const { student } = intervention;
    recordStudentNudge(student.studentId, student.name);
    bumpStorage();
    toast.success(
      `Simulated send to ${student.name} — they would receive a check-in asking if they need help (mock only).`,
    );
    setIntervention(null);
  }

  function handleCopyEmailDraft(subject: string, body: string) {
    const text = `Subject: ${subject}\n\n${body}`;
    void navigator.clipboard.writeText(text).then(
      () => toast.success('Draft copied to clipboard.'),
      () => toast.error('Could not copy — select the text manually.'),
    );
  }

  function handleSimulateEmailSend(subject: string, _body: string) {
    const shortSubject = subject.length > 90 ? `${subject.slice(0, 90)}…` : subject;
    recordQueryRun(`Simulated email send: ${shortSubject}`);
    bumpStorage();
    toast.success('Simulated send — logged in this prototype only. Nothing left your browser.');
  }

  const interventionResources = intervention ? suggestedResources(intervention.student) : [];

  return (
    <div className="hub-app">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b-4 border-gold bg-primary px-4 py-3 text-primary-foreground sm:px-6">
        <Link to="/" className="text-base font-bold tracking-tight hover:opacity-90 sm:text-lg">
          Faculty Insight Assistant
        </Link>
        <span className="max-w-[50%] truncate text-right text-xs font-medium text-primary-foreground/90 sm:text-sm">
          {course.courseName}
        </span>
      </header>

      <main className="hub-body">
        <div className="hub-transcript" ref={transcriptRef} tabIndex={-1}>
          <div className="hub-transcript-inner">
            <div className="pb-2">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Faculty workspace</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Answers stay in the thread; use{' '}
                <span className="font-medium text-foreground">Intervene</span> to open an inline message preview and
                simulate a student check-in from there.
              </p>
            </div>

            {turns.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                    <Bot className="h-7 w-7 text-muted-foreground" aria-hidden />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Start from the dock below</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Use quick asks or type your own question.
                    </p>
                  </div>
                  <Separator className="max-w-xs" />
                  <div className="flex flex-wrap justify-center gap-2">
                    {examplePrompts.map((prompt) => (
                      <Button
                        key={prompt}
                        variant="link"
                        size="sm"
                        className="h-auto max-w-[280px] whitespace-normal px-2 py-1 text-xs sm:text-sm"
                        onClick={() => setQuery(prompt)}
                      >
                        {prompt.length > 52 ? `${prompt.slice(0, 52)}…` : prompt}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-10">
                {turns.map((turn) => (
                  <article key={turn.id} className="conversation-turn">
                    <div className="chat-bubble-user" role="status">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80">You</p>
                      <p className="mt-2 text-[15px] leading-relaxed text-foreground">{turn.userText}</p>
                    </div>
                    <div
                      className="chat-bubble-assistant mt-5"
                      role="region"
                      aria-label="Assistant response"
                    >
                      <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                          <Bot className="h-5 w-5 text-primary" aria-hidden />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">CreateAI</p>
                          <p className="text-xs text-muted-foreground">Simulated response</p>
                        </div>
                      </div>
                      <div className="pt-4">
                        <QueryAssistantBody
                          result={turn.result}
                          mergedStudents={mergeStudentsForTurn(turn.result.students)}
                          mergedModules={mergeModulesForTurn(turn.result.modules)}
                          selectedStudentId={
                            intervention?.turnId === turn.id ? intervention.student.studentId : undefined
                          }
                          gradeThreshold={defaultThresholds.gradeBelow}
                          onIntervene={(student, intent) => handleIntervene(turn.id, student, intent)}
                          onFlagModule={handleFlagModule}
                          onCopyEmail={handleCopyEmailDraft}
                          onSimulateSendEmail={handleSimulateEmailSend}
                          onRunFollowUp={runAsk}
                        />
                      </div>
                      {intervention?.turnId === turn.id ? (
                        <InterventionPreviewPanel
                          student={intervention.student}
                          draftMessage={draftMessage}
                          onDraftChange={setDraftMessage}
                          resources={interventionResources}
                          onClose={() => setIntervention(null)}
                          onSimulateSend={handleSendInterventionMessage}
                        />
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="chat-dock">
          <div className="chat-dock-inner">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick asks</p>
            <div className="flex flex-wrap gap-2">
              {quickAskChips.map((chip) => (
                <Button key={chip.label} variant="secondary" size="sm" onClick={() => runAsk(chip.prompt)}>
                  {chip.label}
                </Button>
              ))}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <Textarea
                placeholder="Ask CreateAI to summarize alerts, draft outreach, or analyze this course…"
                aria-label="Ask the AI assistant"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    runAsk(query);
                  }
                }}
                rows={2}
                className="min-h-[52px] flex-1 resize-none sm:min-h-[44px]"
              />
              <Button type="button" className="shrink-0 gap-2 sm:h-10" onClick={() => runAsk(query)}>
                <Send className="h-4 w-4" aria-hidden />
                Ask
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
