import { expect, it, vi } from "vitest";
import { usePatientCsvUpload } from "@/composables/patients/usePatientCsvUpload";
import { usePatientsStore, useTrialsStore, useUiStore } from "@/stores";
import { trial } from "./fixtures";

async function upload(text: string) {
    const workflow = usePatientCsvUpload(() =>
        trial({
            eligibility: {
                includeIcd: ["E11"],
                excludeIcd: [],
                minAge: 18,
                incompatMeds: [],
            },
        }),
    );
    const input = document.createElement("input");
    Object.defineProperty(input, "files", {
        value: [new File([text], "patients.csv", { type: "text/csv" })],
    });
    workflow.handleFile({ target: input } as unknown as Event);
    await vi.waitFor(() =>
        expect(
            workflow.rows.value.length || useUiStore().toasts.length,
        ).toBeGreaterThan(0),
    );
    return workflow;
}
it("previews valid and invalid rows and imports only valid records with eligibility", async () => {
    const workflow = await upload(
        "patientId,name,dob,icdCodes\nCSV1,Alex,1990-01-01,E11\nCSV2,Sam,1990-01-01,J45\nCSV3,,1990-01-01,E11",
    );
    expect(workflow.fileName.value).toBe("patients.csv");
    expect(workflow.rows.value[2]).toMatchObject({
        rowNum: 4,
        errors: ["Name missing"],
    });
    expect(workflow.validRows.value).toHaveLength(2);
    expect(workflow.eligibleCount.value).toBe(1);
    expect(usePatientsStore().getPatient("CSV1")).toBeNull();
    workflow.importRows();
    expect(usePatientsStore().getPatient("CSV1")?.name).toBe("Alex");
    expect(usePatientsStore().getPatient("CSV3")).toBeNull();
    expect(useTrialsStore().enrollmentsFor("TEST-T1").CSV2.eligible).toBe(
        false,
    );
    expect(useUiStore().toasts.at(-1)?.message).toBe(
        "Imported 2 patients (1 eligible).",
    );
    workflow.reset();
    expect(workflow.rows.value).toEqual([]);
    expect(workflow.fileName.value).toBe("");
});
it("supports column aliases, generated IDs and multiple ICD separators", async () => {
    const workflow = await upload(
        'First Name,Last Name,DOB,ICD-10\nAlex,Example,1990-01-01,"E11|I10;J45"',
    );
    expect(workflow.rows.value[0].patient).toMatchObject({
        name: "Alex Example",
        icdCodes: ["E11", "I10", "J45"],
    });
    expect(workflow.rows.value[0].patient?.id).toMatch(/^[a-z0-9]+-[a-z0-9]+$/);
});
it("reports empty files and ignores cancelled file selection", async () => {
    const workflow = await upload("");
    expect(useUiStore().toasts[0].message).toBe("CSV file is empty.");
    expect(workflow.rows.value).toEqual([]);
    workflow.handleFile({
        target: document.createElement("input"),
    } as unknown as Event);
    expect(workflow.rows.value).toEqual([]);
});
