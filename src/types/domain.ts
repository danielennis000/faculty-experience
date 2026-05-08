export type Severity = 'low' | 'medium' | 'high';

export type StudentStatus = 'normal' | 'watch' | 'nudged';
export type ModuleStatus = 'normal' | 'flagged';

export interface Course {
  courseId: string;
  courseName: string;
  term: string;
  instructorName: string;
}

export interface Student {
  studentId: string;
  courseId: string;
  name: string;
  email: string;
  currentGrade: number;
  lastLoginDate: string;
  assignmentsMissing: number;
  riskReasons: string[];
  severity: Severity;
  status: StudentStatus;
  recommendedActions: string[];
}

export interface CourseModule {
  moduleId: string;
  courseId: string;
  moduleName: string;
  engagementRate: number;
  dropOffRate: number;
  riskReasons: string[];
  severity: Severity;
  status: ModuleStatus;
}

export type ActivityType =
  | 'nudged_student'
  | 'flagged_module'
  | 'query_run'
  | 'scheduled_meeting';

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  type: ActivityType;
  targetId: string;
  summary: string;
}

export type QueryIntent =
  | 'inactive_students'
  | 'low_grades'
  | 'missing_assignments'
  | 'module_dropoff'
  | 'recommended_actions'
  | 'student_alerts'
  | 'at_risk_roster'
  | 'bulk_outreach'
  | 'draft_announcement'
  | 'prep_my_day'
  | 'unsupported';

export interface StudentAlertItem {
  alertId: string;
  studentId: string;
  studentName: string;
  headline: string;
  detail: string;
  severity: Severity;
}

export interface EmailDraft {
  subject: string;
  body: string;
  recipientsLabel?: string;
}

export interface QueryThresholds {
  daysInactive: number;
  gradeBelow: number;
}

export interface PrepDayItem {
  /** Display line in the prep checklist. */
  text: string;
  /** Simulated follow-up ask (same strings as quick asks / natural prompts work). */
  actionPrompt: string;
}

export interface QueryResult {
  intent: QueryIntent;
  summary: string;
  students: Student[];
  modules: CourseModule[];
  suggestedActions: string[];
  alerts?: StudentAlertItem[];
  emailDraft?: EmailDraft;
  prepDayItems?: PrepDayItem[];
}
