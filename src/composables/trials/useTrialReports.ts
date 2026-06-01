import type {
  Patient,
  ReportGroup,
  ReportRow,
  TrialAssignmentMap,
  TrialEnrollmentMap,
} from "@/types";

export function buildReportRows(
  patients: Patient[],
  enrollments: TrialEnrollmentMap,
  assignments: TrialAssignmentMap,
): ReportRow[] {
  return patients
    .filter((patient) => enrollments[patient.id]?.eligible)
    .map((patient) => {
      const enrollment = enrollments[patient.id];
      const readings = enrollment.appointments
        .map((appointment) => ({
          date: appointment.date,
          time: appointment.time ?? "",
          value: appointment.bloodTestLevel,
        }))
        .filter((reading): reading is { date: string; time: string; value: number } =>
          Number.isFinite(reading.value),
        )
        .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
      const assignment = assignments[patient.id] ?? null;
      const group: ReportGroup = assignment?.drug === "bavaria" ? "treatment" : "placebo";
      const startValue = readings.length >= 2 ? readings[0].value : null;
      const endValue = readings.length >= 2 ? readings[readings.length - 1].value : null;
      const reductionPct =
        startValue !== null && startValue > 0 && endValue !== null
          ? Math.round(((startValue - endValue) / startValue) * 100)
          : null;
      const adverseEvents = enrollment.appointments.flatMap((appointment) =>
        appointment.adverseEvents.map((event) => event.trim()).filter(Boolean),
      );

      return {
        patientId: patient.id,
        group,
        assignedDrug: assignment?.drug ?? null,
        startValue,
        endValue,
        reductionPct,
        reductionLabel: reductionLabel(reductionPct),
        adverseEvents,
      };
    });
}

export function averageReduction(rows: ReportRow[], group: ReportGroup): number | null {
  const values = rows
    .filter((row) => row.group === group && row.reductionPct !== null)
    .map((row) => row.reductionPct as number);

  if (!values.length) return null;

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function totalAdverseEvents(rows: ReportRow[]): number {
  return rows.reduce((sum, row) => sum + row.adverseEvents.length, 0);
}

export function reductionLabel(reductionPct: number | null): string {
  if (reductionPct === null) return "Insufficient Data";
  if (reductionPct > 0) return `${reductionPct}% reduction`;
  if (reductionPct === 0) return "No change";
  return `${Math.abs(reductionPct)}% increase`;
}

export function formatReduction(value: number | null): string {
  return value === null ? "N/A" : `${value}%`;
}
