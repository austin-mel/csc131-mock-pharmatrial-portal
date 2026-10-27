import { describe, expect, it, vi } from "vitest";
import {
    allEligibleDosed,
    checkEligibility,
    completedDoseCount,
    eligiblePatients,
    enrolledPatients,
    totalDosesGiven,
} from "@/composables/patients/usePatients";
import { patient, trial, enrollment } from "./fixtures";

describe("eligibility", () => {
    it("uses condition defaults when no FDA criteria exist", () => {
        expect(checkEligibility(patient(), trial())).toBe(true);
        expect(checkEligibility(patient({ icdCodes: [] }), trial())).toBe(
            false,
        );
        expect(
            checkEligibility(
                patient({ icdCodes: ["Z21"] }),
                trial({ condition: "HIV" }),
            ),
        ).toBe(true);
        expect(checkEligibility(patient(), trial({ condition: "HIV" }))).toBe(
            false,
        );
    });
    const criteria = {
        includeIcd: ["E11"],
        excludeIcd: ["Z34"],
        minAge: 18,
        incompatMeds: ["Warfarin"],
    };
    it.each([
        [{ icdCodes: ["e11.9"] }, true],
        [{ icdCodes: ["J45"] }, false],
        [{ icdCodes: ["E11", "z34.1"] }, false],
        [{ dob: "2020-01-01" }, false],
        [{ meds: "Daily WARFARIN tablet" }, false],
        [{ dob: "1990-01-01" }, true],
    ])("checks configured criteria: %j", (changes, expected) => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-10-24"));
        expect(
            checkEligibility(
                patient(changes),
                trial({ eligibility: criteria }),
            ),
        ).toBe(expected);
    });
});
describe("cohort dosing totals", () => {
    const people = [patient(), patient({ id: "P2" }), patient({ id: "P3" })];
    const records = {
        "TEST-P1": enrollment({ doses: 2 }),
        P2: enrollment({ eligible: false, doses: 5 }),
    };
    it("excludes unenrolled and ineligible patients from dose totals", () => {
        expect(enrolledPatients(people, records)).toHaveLength(2);
        expect(eligiblePatients(people, records)).toEqual([people[0]]);
        expect(completedDoseCount(trial(), people, records)).toBe(1);
        expect(totalDosesGiven(people, records)).toBe(2);
        expect(allEligibleDosed(trial(), people, records)).toBe(true);
    });
    it("does not declare an empty or partially dosed cohort complete", () => {
        expect(allEligibleDosed(trial(), people, {})).toBe(false);
        expect(
            allEligibleDosed(trial(), people, {
                "TEST-P1": enrollment({ doses: 1 }),
            }),
        ).toBe(false);
    });
});
