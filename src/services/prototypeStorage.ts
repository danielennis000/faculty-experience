import type { ActivityLogItem, ModuleStatus, StudentStatus } from '../types/domain';

const storageKey = 'faculty-insight-assistant-state';

interface PrototypeState {
  studentStatuses: Record<string, StudentStatus>;
  moduleStatuses: Record<string, ModuleStatus>;
  activityLog: ActivityLogItem[];
}

const fallbackState: PrototypeState = {
  studentStatuses: {},
  moduleStatuses: {},
  activityLog: [],
};

export function loadPrototypeState(): PrototypeState {
  try {
    const rawState = window.localStorage.getItem(storageKey);
    return rawState ? { ...fallbackState, ...JSON.parse(rawState) } : fallbackState;
  } catch {
    return fallbackState;
  }
}

export function savePrototypeState(state: PrototypeState) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // The prototype remains usable if browser storage is unavailable.
  }
}

export function resetPrototypeState() {
  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // No-op for restricted storage contexts.
  }
}

export function recordQueryRun(summary: string) {
  const state = loadPrototypeState();
  const item: ActivityLogItem = {
    id: `log-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    timestamp: new Date().toISOString(),
    type: 'query_run',
    targetId: 'course',
    summary,
  };
  savePrototypeState({
    ...state,
    activityLog: [item, ...state.activityLog].slice(0, 50),
  });
}

export function recordStudentNudge(studentId: string, name: string) {
  const state = loadPrototypeState();
  const item: ActivityLogItem = {
    id: `log-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    timestamp: new Date().toISOString(),
    type: 'nudged_student',
    targetId: studentId,
    summary: `Simulated message sent to ${name}`,
  };
  savePrototypeState({
    ...state,
    studentStatuses: { ...state.studentStatuses, [studentId]: 'nudged' },
    activityLog: [item, ...state.activityLog].slice(0, 50),
  });
}

export function recordScheduledMeeting(studentId: string, name: string, whenLabel: string) {
  const state = loadPrototypeState();
  const item: ActivityLogItem = {
    id: `log-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    timestamp: new Date().toISOString(),
    type: 'scheduled_meeting',
    targetId: studentId,
    summary: `Simulated check-in proposed for ${name} (${whenLabel})`,
  };
  savePrototypeState({
    ...state,
    activityLog: [item, ...state.activityLog].slice(0, 50),
  });
}

export function recordModuleFlag(moduleId: string, moduleName: string) {
  const state = loadPrototypeState();
  const item: ActivityLogItem = {
    id: `log-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    timestamp: new Date().toISOString(),
    type: 'flagged_module',
    targetId: moduleId,
    summary: `Flagged module: ${moduleName}`,
  };
  savePrototypeState({
    ...state,
    moduleStatuses: { ...state.moduleStatuses, [moduleId]: 'flagged' },
    activityLog: [item, ...state.activityLog].slice(0, 50),
  });
}
