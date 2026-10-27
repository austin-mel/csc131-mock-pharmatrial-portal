import { describe, expect, it } from "vitest";
import {
    buildAppointment,
    logAppointment,
} from "@/composables/appointments/useAppointments";
import {
    averageReduction,
    buildReportRows,
    formatReduction,
    reductionLabel,
    totalAdverseEvents,
} from "@/composables/trials/useTrialReports";
import { appointment, enrollment, patient } from "./fixtures";

describe("appointments", () => {
    it("normalizes notes, events and non-finite readings", () => {
        expect(
            buildAppointment(
                appointment({
                    bloodTestLevel: NaN,
                    adverseEvents: [" nausea ", " "],
                    note: "  ",
                }),
            ),
        ).toMatchObject({
            dose: true,
            bloodTestLevel: null,
            adverseEvents: ["nausea"],
            note: "No notes.",
        });
    });
    it("only increments doses for administration, caps the count and keeps visit history", () => {
        const record = enrollment({ doses: 1 });
        logAppointment(
            record,
            2,
            appointment({ type: "Follow-up Evaluation", note: " check " }),
        );
        expect(record.doses).toBe(1);
        logAppointment(record, 2, appointment());
        logAppointment(record, 2, appointment());
        expect(record.doses).toBe(2);
        expect(record.appointments).toHaveLength(3);
        expect(record.appointments[0].note).toBe("check");
    });
});
describe("reports", () => {
    it("sorts readings chronologically and excludes ineligible patients", () => {
        const rows = buildReportRows(
            [patient(), patient({ id: "excluded" })],
            {
                "TEST-P1": enrollment({
                    appointments: [
                        buildAppointment(
                            appointment({
                                date: "2026-06-02",
                                bloodTestLevel: 40,
                                adverseEvents: [" nausea "],
                            }),
                        ),
                        buildAppointment(
                            appointment({
                                date: "2026-06-01",
                                bloodTestLevel: 100,
                            }),
                        ),
                        buildAppointment(appointment({ bloodTestLevel: NaN })),
                    ],
                }),
                excluded: enrollment({ eligible: false }),
            },
            {
                "TEST-P1": {
                    patientId: "TEST-P1",
                    drug: "bavaria",
                    trackingId: "BAV-001",
                },
            },
        );
        expect(rows).toHaveLength(1);
        expect(rows[0]).toMatchObject({
            group: "treatment",
            startValue: 100,
            endValue: 40,
            reductionPct: 60,
            adverseEvents: ["nausea"],
        });
        expect(averageReduction(rows, "treatment")).toBe(60);
        expect(averageReduction(rows, "placebo")).toBeNull();
        expect(totalAdverseEvents(rows)).toBe(1);
    });
    it("handles missing readings and zero baselines without dividing by zero", () => {
        const records = enrollment();
        expect(
            buildReportRows([patient()], { "TEST-P1": records }, {})[0],
        ).toMatchObject({ reductionPct: null, assignedDrug: null });
        records.appointments = [
            buildAppointment(appointment({ bloodTestLevel: 0 })),
            buildAppointment(appointment({ bloodTestLevel: 10 })),
        ];
        expect(
            buildReportRows([patient()], { "TEST-P1": records }, {})[0]
                .reductionPct,
        ).toBeNull();
    });
    it.each([
        [null, "Insufficient Data"],
        [0, "No change"],
        [20, "20% reduction"],
        [-10, "10% increase"],
    ])("labels %s", (value, label) => {
        expect(reductionLabel(value as number | null)).toBe(label);
    });
    it("formats summary percentages", () => {
        expect(formatReduction(null)).toBe("N/A");
        expect(formatReduction(25)).toBe("25%");
    });
});
