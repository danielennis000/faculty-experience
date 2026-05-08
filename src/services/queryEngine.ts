import { courses, modules, students } from '../data/mockData';
import type {
  CourseModule,
  QueryIntent,
  QueryResult,
  QueryThresholds,
  Student,
  StudentAlertItem,
} from '../types/domain';

const currentDate = new Date('2026-05-07T12:00:00-07:00');

export const examplePrompts = [
  "Which students haven't logged in in the last 7 days?",
  'Who is below a 70% grade threshold?',
  'Show me students missing assignments.',
  'Which Canvas modules have a drop-off spike?',
];

/** Faculty-hub style one-click asks (CreateAI Faculty Hub pattern). */
export const quickAskChips: { label: string; prompt: string }[] = [
  { label: 'Recommended next actions', prompt: 'Show recommended next actions for this course.' },
  { label: 'Student alerts', prompt: 'Summarize student alerts that need faculty review.' },
  { label: 'At-risk roster', prompt: 'Show the full at-risk roster for this course.' },
  { label: 'Message at-risk students', prompt: 'Draft an email to message at-risk students in this course.' },
  { label: 'Draft announcement', prompt: 'Draft a Canvas course announcement based on current risk signals.' },
  { label: 'Prep my day', prompt: 'Prep my day with a short faculty checklist from course signals.' },
];

export function runMockQuery(
  courseId: string,
  query: string,
  thresholds: QueryThresholds,
): QueryResult {
  const intent = getIntent(query);
  const courseStudents = students.filter((student) => student.courseId === courseId);
  const courseModules = modules.filter((module) => module.courseId === courseId);
  const courseMeta = courses.find((c) => c.courseId === courseId);

  if (intent === 'recommended_actions') {
    const atRiskStudents = courseStudents.filter((s) => s.severity !== 'low');
    const riskyModules = courseModules.filter((m) => m.severity !== 'low');

    return {
      intent,
      summary: `Here are high-value next actions for ${courseMeta?.courseName ?? 'this course'}, based on mocked Canvas-style signals.`,
      students: atRiskStudents,
      modules: riskyModules,
      suggestedActions: [
        atRiskStudents.length
          ? `Review ${atRiskStudents.length} student alert(s) below comfortable thresholds`
          : 'No active student alerts — spot-check engagement anyway',
        riskyModules.length
          ? `Triage ${riskyModules.length} module(s) with engagement risk`
          : 'Scan modules after the next assessment cycle',
        'Queue a short Canvas announcement or nudge while context is fresh',
      ],
    };
  }

  if (intent === 'student_alerts') {
    const atRisk = courseStudents.filter((s) => s.severity !== 'low');
    const alertItems = buildStudentAlerts(atRisk);

    return {
      intent,
      summary: `${alertItems.length} alert(s) are awaiting faculty review in this prototype roster.`,
      students: atRisk,
      modules: [],
      suggestedActions: [],
      alerts: alertItems,
    };
  }

  if (intent === 'at_risk_roster') {
    const inactive = courseStudents.filter((s) => daysSince(s.lastLoginDate) > thresholds.daysInactive);
    const lowGrades = courseStudents.filter((s) => s.currentGrade < thresholds.gradeBelow);
    const missing = courseStudents.filter((s) => s.assignmentsMissing > 0);
    const combined = uniqueByStudentId([...inactive, ...lowGrades, ...missing]);

    return {
      intent,
      summary: `Combined roster: students who are inactive, below ${thresholds.gradeBelow}%, or missing work (${combined.length} unique).`,
      students: combined,
      modules: [],
      suggestedActions: [
        'Sort by severity, then work top-down with the assistant drafts',
        'Use “Message at-risk students” when you want a single bulk draft',
      ],
    };
  }

  if (intent === 'bulk_outreach') {
    const combined = uniqueByStudentId(
      courseStudents.filter(
        (s) =>
          s.severity !== 'low' ||
          daysSince(s.lastLoginDate) > thresholds.daysInactive ||
          s.currentGrade < thresholds.gradeBelow ||
          s.assignmentsMissing > 0,
      ),
    );
    const rosterLines = combined
      .map(
        (s) =>
          `• ${s.name} <${s.email}> — ${s.riskReasons.join('; ') || 'review recommended'}`,
      )
      .join('\n');

    return {
      intent,
      summary:
        'Draft below simulates a single outreach you could send via “Message Students Who” or email (BCC). Edit before any real send.',
      students: combined,
      modules: [],
      suggestedActions: [
        'Personalize opening line with course name and week number',
        'Attach links from the Intervene panel when you open a student',
      ],
      emailDraft: {
        subject: `Checking in — ${courseMeta?.courseName ?? 'our course'}`,
        recipientsLabel: `Simulated BCC: ${combined.length} student(s)`,
        body: `Hello,

I'm reaching out because I want every student to succeed in ${courseMeta?.courseName ?? 'this course'}. If you've fallen behind on logins, assignments, or exams, this is a no-judgment invite to reconnect. Reply to this message or visit office hours and we will make a simple plan.

(Optional coaching notes for you — remove before sending:)
${rosterLines || '• No students matched filters in mock data.'}

Thanks,
${courseMeta?.instructorName ?? 'Instructor'}`,
      },
    };
  }

  if (intent === 'draft_announcement') {
    const hotModule =
      courseModules.find((m) => m.dropOffRate >= 30) ?? courseModules[0] ?? null;
    const atRiskCount = courseStudents.filter((s) => s.severity !== 'low').length;

    const body = hotModule
      ? `Hi everyone,

Quick heads-up about ${hotModule.moduleName}. Analytics suggest some learners are disengaging partway through the module. If that is you, you are not alone — please use the review guide and reach out if the sequence feels unclear.

This week I am holding extra office hours and will post a short FAQ thread. Goal: make sure everyone can finish the week strong.

Thanks,
${courseMeta?.instructorName ?? 'Instructor'}`
      : `Hi everyone,

I am sharing a short course-wide check-in based on early signals in ${courseMeta?.courseName ?? 'our course'}. If you need flexibility or tutoring, reply privately — we have options.

Thanks,
${courseMeta?.instructorName ?? 'Instructor'}`;

    return {
      intent,
      summary: hotModule
        ? `Announcement references ${hotModule.moduleName} (${hotModule.dropOffRate}% drop-off in mock data).`
        : 'General encouragement announcement — add module specifics if needed.',
      students: courseStudents.filter((s) => s.severity !== 'low').slice(0, 5),
      modules: hotModule ? [hotModule] : [],
      suggestedActions: [
        'Paste into Canvas Announcements after a quick tone edit',
        'Pin a follow-up discussion thread',
      ],
      emailDraft: {
        subject: hotModule
          ? `Update: ${hotModule.moduleName} support this week`
          : `Weekly check-in — ${courseMeta?.courseName ?? 'course'}`,
        recipientsLabel: 'Simulated: entire course',
        body,
      },
    };
  }

  if (intent === 'prep_my_day') {
    const atRisk = courseStudents.filter((s) => s.severity !== 'low');

    return {
      intent,
      summary:
        'A lightweight “start here” list — swap in real tasks after you validate alerts with stakeholders.',
      students: atRisk,
      modules: courseModules.filter((m) => m.severity !== 'low'),
      suggestedActions: [],
      prepDayItems: [
        {
          text: atRisk.length
            ? `Triage ${atRisk.length} active alert(s) before class`
            : 'Skim discussions — no mock alerts fired',
          actionPrompt: 'Summarize student alerts that need faculty review.',
        },
        {
          text: 'Block one 25-minute slot for student replies',
          actionPrompt: 'Show the full at-risk roster for this course.',
        },
        {
          text: 'Queue one course-wide nudge if several students share the same gap',
          actionPrompt: 'Draft an email to message at-risk students in this course.',
        },
      ],
    };
  }

  if (intent === 'inactive_students') {
    const matches = courseStudents.filter(
      (student) => daysSince(student.lastLoginDate) > thresholds.daysInactive,
    );

    return buildResult(
      intent,
      `${matches.length} students have not logged in for more than ${thresholds.daysInactive} days.`,
      matches,
      [],
      ['Send a nudge to each high-risk student', 'Review the course activity timeline'],
    );
  }

  if (intent === 'low_grades') {
    const matches = courseStudents.filter((student) => student.currentGrade < thresholds.gradeBelow);

    return buildResult(
      intent,
      `${matches.length} students are below the ${thresholds.gradeBelow}% grade threshold. Students exactly at the threshold are not included.`,
      matches,
      [],
      ['Send a nudge', 'Review recent assignment performance'],
    );
  }

  if (intent === 'missing_assignments') {
    const matches = courseStudents.filter((student) => student.assignmentsMissing > 0);

    return buildResult(
      intent,
      `${matches.length} students are missing at least one assignment.`,
      matches,
      [],
      ['Send a nudge', 'Review assignment instructions'],
    );
  }

  if (intent === 'module_dropoff') {
    const matches = courseModules.filter((module) => module.dropOffRate >= 30);

    return buildResult(
      intent,
      `${matches.length} modules show elevated drop-off and may need review.`,
      [],
      matches,
      ['Flag module for review', 'Check links and instructions'],
    );
  }

  return buildResult(
    'unsupported',
    'Try quick chips for alerts, roster, bulk messages, announcements, or prep. I also understand login, grade, assignment, and module drop-off questions.',
    [],
    [],
    examplePrompts,
  );
}

function getIntent(query: string): QueryIntent {
  const normalized = query.toLowerCase();

  if (normalized.includes('prep') && normalized.includes('day')) {
    return 'prep_my_day';
  }

  if (
    normalized.includes('recommended') ||
    (normalized.includes('next') && normalized.includes('action'))
  ) {
    return 'recommended_actions';
  }

  if (normalized.includes('alert')) {
    return 'student_alerts';
  }

  if (
    (normalized.includes('message') && normalized.includes('student')) ||
    normalized.includes('bulk') ||
    (normalized.includes('email') && normalized.includes('risk')) ||
    (normalized.includes('send') && normalized.includes('student'))
  ) {
    return 'bulk_outreach';
  }

  if (
    normalized.includes('at-risk') ||
    normalized.includes('at risk') ||
    (normalized.includes('full') && normalized.includes('roster'))
  ) {
    return 'at_risk_roster';
  }

  if (normalized.includes('announcement')) {
    return 'draft_announcement';
  }

  if (normalized.includes('login') || normalized.includes('logged in')) {
    return 'inactive_students';
  }

  if (normalized.includes('grade') || normalized.includes('threshold')) {
    return 'low_grades';
  }

  if (normalized.includes('missing') || normalized.includes('assignment')) {
    return 'missing_assignments';
  }

  if (
    normalized.includes('module') ||
    normalized.includes('drop-off') ||
    normalized.includes('dropoff') ||
    (normalized.includes('canvas') && !normalized.includes('announcement'))
  ) {
    return 'module_dropoff';
  }

  return 'unsupported';
}

function buildResult(
  intent: QueryIntent,
  summary: string,
  matchedStudents: Student[],
  matchedModules: CourseModule[],
  suggestedActions: string[],
): QueryResult {
  return {
    intent,
    summary,
    students: matchedStudents,
    modules: matchedModules,
    suggestedActions,
  };
}

function buildStudentAlerts(atRisk: Student[]): StudentAlertItem[] {
  return atRisk.map((s) => ({
    alertId: `alert-${s.studentId}`,
    studentId: s.studentId,
    studentName: s.name,
    headline: s.riskReasons[0] ?? 'Monitor performance',
    detail: s.riskReasons.length ? s.riskReasons.join('; ') : 'Review grade and activity trend.',
    severity: s.severity,
  }));
}

function uniqueByStudentId(list: Student[]): Student[] {
  const seen = new Set<string>();
  return list.filter((s) => {
    if (seen.has(s.studentId)) {
      return false;
    }
    seen.add(s.studentId);
    return true;
  });
}

function daysSince(dateValue: string): number {
  const date = new Date(`${dateValue}T12:00:00-07:00`);
  const difference = currentDate.getTime() - date.getTime();

  return Math.floor(difference / (1000 * 60 * 60 * 24));
}
