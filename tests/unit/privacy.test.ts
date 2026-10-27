import { expect, it } from "vitest";
import {
    buildPatientDisplay,
    buildAnonymizedPatientDisplay,
    buildReportRowDisplay,
    buildAnonymizedReportRowDisplay,
    canShowPatientPii,
    hiddenPiiLabel,
    maskPatientName,
} from "@/utils/privacy";
import type { PortalId, ReportRow } from "@/types";
import { patient, trial, enrollment } from "./fixtures";

it.each<PortalId>(["jh-doctor", "jh-admin", "fda", "bavaria"])(
    "applies patient and report privacy for %s",
    (role) => {
        const pii = role === "jh-doctor" || role === "jh-admin";
        expect(canShowPatientPii(role)).toBe(pii);
        expect(
            buildPatientDisplay(
                patient(),
                enrollment({ doses: 2 }),
                trial(),
                role,
            ),
        ).toMatchObject({
            name: pii ? "Alex Example" : "Patient TEST-P1",
            dob: pii ? "1990-01-01" : "Hidden",
            showPii: pii,
            doseLabel: "2/2",
            statusLabel: "Complete",
            trackingId: "-",
        });
        const row: ReportRow = {
            patientId: "TEST-P1",
            group: "treatment",
            assignedDrug: "bavaria",
            startValue: null,
            endValue: null,
            reductionPct: null,
            reductionLabel: "Insufficient Data",
            adverseEvents: [],
        };
        expect(buildReportRowDisplay(row, patient(), role)).toMatchObject({
            patientName: pii ? "Alex Example" : "Patient TEST-P1",
            startValue: "N/A",
            adverseEvents: "None",
            groupTone: "red",
        });
        expect(buildAnonymizedReportRowDisplay(row).patientName).toBe(
            "Patient TEST-P1",
        );
    },
);
it("handles missing enrollment and only exposes tracking when requested", () => {
    const assignment = {
        patientId: "TEST-P1",
        drug: "placebo" as const,
        trackingId: "PLC-001",
    };
    expect(
        buildAnonymizedPatientDisplay(
            patient({ icdCodes: [] }),
            undefined,
            trial(),
            assignment,
            true,
        ),
    ).toMatchObject({
        eligibilityLabel: "Excluded",
        statusLabel: "Excluded",
        icdCodes: "None",
        doses: 0,
        trackingId: "PLC-001",
    });
    expect(maskPatientName(patient())).toBe(maskPatientName("TEST-P1"));
    expect(hiddenPiiLabel()).toBe("Hidden");
});
