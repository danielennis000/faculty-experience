import type { QueryIntent, Student } from '../types/domain';

export function suggestedResources(student: Student): { label: string; href: string }[] {
  const base = [
    { label: 'Tutoring / success coaching', href: 'https://example.edu/tutoring' },
    { label: 'Academic integrity and extensions policy', href: 'https://example.edu/policies' },
  ];

  if (student.assignmentsMissing > 0) {
    base.unshift({
      label: 'Missing assignment makeup workflow',
      href: 'https://example.edu/makeup-assignments',
    });
  }

  if (student.currentGrade < 70) {
    base.unshift({
      label: 'Grade recovery planning guide',
      href: 'https://example.edu/grade-recovery',
    });
  }

  return base.slice(0, 4);
}

export function buildAgenticDraftMessage(student: Student, intent: QueryIntent): string {
  const reasons = student.riskReasons.length
    ? student.riskReasons.join('; ')
    : 'overall engagement is something I want to check in on';

  const intentLine =
    intent === 'inactive_students'
      ? 'I noticed you have not logged into the course recently.'
      : intent === 'low_grades'
        ? 'I am reaching out because your current grade is below where we want you to be in this course.'
        : intent === 'missing_assignments'
          ? 'I see a few assignments are still outstanding.'
          : intent === 'module_dropoff'
            ? 'I want to make sure the recent modules are feeling approachable.'
            : 'I am checking in based on what I am seeing in the course analytics.';

  return `Hi ${student.name.split(' ')[0]},

${intentLine} In my review, ${reasons}.

I would like to help you get back on track. If you can reply with a time that works this week, I can offer a quick check-in or point you to a couple of resources. There is no grade penalty for asking for help.

Best,
[Instructor]`;
}
