import type { CourseModule, Student } from '@/types/domain';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/** ASU brand-aligned chart palette (maroon + gold + neutral gray). */
export const ASU = {
  maroon: '#8C1D40',
  gold: '#FFC627',
  gray: '#94a3b8',
  maroonSoft: '#b85c7a',
} as const;

function shortName(full: string) {
  const parts = full.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}. ${parts[parts.length - 1]}`;
  }
  return full.length > 14 ? `${full.slice(0, 12)}…` : full;
}

/** Horizontal bars — same layout language across the prototype. */
export function PriorityMetricsChart({
  studentCount,
  moduleCount,
}: {
  studentCount: number;
  moduleCount: number;
}) {
  const data = [
    { label: 'Students to address', value: studentCount, fill: ASU.maroon },
    { label: 'Modules to review', value: moduleCount, fill: ASU.gold },
  ];

  return (
    <div className="h-[140px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 20, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="label"
            width={132}
            tick={{ fontSize: 11, fill: '#475569' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(140, 29, 64, 0.06)' }}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={26}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Horizontal grade bars — maroon below threshold, gold at/above. */
export function StudentGradeHorizontalChart({
  students,
  gradeThreshold,
}: {
  students: Student[];
  gradeThreshold: number;
}) {
  const data = students.map((s) => ({
    name: shortName(s.name),
    grade: s.currentGrade,
    fill: s.currentGrade < gradeThreshold ? ASU.maroon : ASU.gold,
  }));

  const rowHeight = Math.min(320, Math.max(140, 36 + data.length * 36));

  return (
    <div style={{ height: rowHeight }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={{ fontSize: 11, fill: '#475569' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value) => [`${value ?? ''}%`, 'Course grade']}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
          />
          <Bar dataKey="grade" radius={[0, 6, 6, 0]} maxBarSize={22}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Maroon below {gradeThreshold}% · Gold at or above
      </p>
    </div>
  );
}

/** Horizontal module metrics — gold = engagement, maroon = drop-off. */
export function ModuleSignalsHorizontalChart({ modules }: { modules: CourseModule[] }) {
  const data = modules.map((m) => ({
    name: m.moduleName.length > 26 ? `${m.moduleName.slice(0, 24)}…` : m.moduleName,
    engagement: m.engagementRate,
    dropoff: m.dropOffRate,
  }));

  const h = Math.min(320, 48 + data.length * 44);

  return (
    <div style={{ height: h }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={128}
            tick={{ fontSize: 10, fill: '#475569' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: 4 }} iconType="circle" />
          <Bar dataKey="engagement" name="Engagement" fill={ASU.gold} radius={[0, 4, 4, 0]} maxBarSize={14} />
          <Bar dataKey="dropoff" name="Drop-off" fill={ASU.maroon} radius={[0, 4, 4, 0]} maxBarSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AlertSeverityStrip({
  counts,
}: {
  counts: { high: number; medium: number; low: number };
}) {
  const total = counts.high + counts.medium + counts.low || 1;
  return (
    <div className="flex h-2.5 w-full max-w-md overflow-hidden rounded-full bg-muted">
      <div className="bg-[#8C1D40]" style={{ width: `${(counts.high / total) * 100}%` }} title={`High: ${counts.high}`} />
      <div className="bg-[#FFC627]" style={{ width: `${(counts.medium / total) * 100}%` }} title={`Medium: ${counts.medium}`} />
      <div className="bg-[#94a3b8]" style={{ width: `${(counts.low / total) * 100}%` }} title={`Low: ${counts.low}`} />
    </div>
  );
}

export function countSeverityMix(students: Student[]) {
  return {
    high: students.filter((s) => s.severity === 'high').length,
    medium: students.filter((s) => s.severity === 'medium').length,
    low: students.filter((s) => s.severity === 'low').length,
  };
}
