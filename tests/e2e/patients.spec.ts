import { expect, test } from "playwright/test";
import {
    blockUnexpectedBackendRequests,
    expectNoBackendRequests,
} from "./helpers/auth";
import {
    chooseTrial,
    dismissToasts,
    loginAs,
    modal,
    tab,
} from "./helpers/workflow";

test.beforeEach(async ({ page }) => {
    await blockUnexpectedBackendRequests(page);
});
test.afterEach(async ({ page }) => {
    expectNoBackendRequests(page);
});

test("imports valid CSV rows, flags invalid rows and supports patient search and deletion", async ({
    page,
}) => {
    await loginAs(page, 1);
    await chooseTrial(page, "Demo Willow Asthma Study");
    await tab(page, "Patients");
    await page.getByRole("button", { name: "Bulk Upload (CSV)" }).click();
    const upload = modal(page, "Bulk Upload Patients (CSV)");
    await expect(
        upload.getByRole("button", { name: "Import Patients" }),
    ).toBeDisabled();
    const downloadPromise = page.waitForEvent("download");
    await upload.getByRole("button", { name: "Download Template" }).click();
    expect((await downloadPromise).suggestedFilename()).toBe(
        "patient-upload-template.csv",
    );
    await upload.locator('input[type="file"]').setInputFiles({
        name: "cohort.csv",
        mimeType: "text/csv",
        buffer: Buffer.from(
            "patientId,name,dob,icdCodes\nE2E-P1,CSV Participant,1990-01-01,J45\nE2E-P2,Excluded Participant,1990-01-01,E11\nE2E-P3,,1990-01-01,J45",
        ),
    });
    await expect(
        upload.getByText("Name missing", { exact: true }),
    ).toBeVisible();
    await upload.getByRole("button", { name: "Import Patients" }).click();
    await expect(
        page.getByText("Imported 2 patients (1 eligible).", { exact: true }),
    ).toBeVisible();
    await dismissToasts(page);
    await page.getByPlaceholder("Search patients...").fill("CSV Participant");
    const record = page
        .locator("tr:visible, article:visible")
        .filter({ hasText: "CSV Participant" });
    await expect(record).toHaveCount(1);
    await expect(record).toContainText("Eligible");
    await record.getByRole("button", { name: "View", exact: true }).click();
    await expect(modal(page, "Patient Detail")).toContainText(
        "CSV Participant",
    );
    await modal(page, "Patient Detail")
        .getByRole("button", { name: "Close", exact: true })
        .first()
        .click();
    page.once("dialog", (dialog) => dialog.dismiss());
    await record.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(record).toHaveCount(1);
    page.once("dialog", (dialog) => dialog.accept());
    await record.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(record).toHaveCount(0);
    await expect(
        page.getByText("Patient record deleted.", { exact: true }),
    ).toBeVisible();
    await page.getByPlaceholder("Search patients...").fill("E2E-P3");
    await expect(
        page
            .locator("tr:visible, article:visible")
            .filter({ hasText: "E2E-P3" }),
    ).toHaveCount(0);
});

test("doctor edits a patient and logs a non-dose follow-up with adverse events", async ({
    page,
}) => {
    await loginAs(page, 0);
    await chooseTrial(page, "Demo Aspen Glucose Study");
    await tab(page, "Patients");
    await page.getByPlaceholder("Search patients...").fill("Caleb Ortiz");
    const record = page
        .locator("tr:visible, article:visible")
        .filter({ hasText: "Caleb Ortiz" });
    await record.getByRole("button", { name: "Edit", exact: true }).click();
    const edit = modal(page, "Edit Patient Record");
    await edit.getByLabel("First Name").fill("Caleb Updated");
    await edit.getByRole("button", { name: "Save Patient" }).click();
    await page.getByPlaceholder("Search patients...").fill("Caleb Updated");
    await expect(
        page
            .locator("tr:visible, article:visible")
            .filter({ hasText: "Caleb Updated Ortiz" }),
    ).toHaveCount(1);
    await dismissToasts(page);
    await tab(page, "Appointments");
    await page
        .getByRole("button", { name: "Log Appointment", exact: true })
        .click();
    const visit = modal(page, "Log Appointment");
    await visit
        .getByRole("combobox", { name: /^Patient\b/ })
        .selectOption("UI-PAT-008");
    await visit
        .getByLabel("Appointment Type")
        .selectOption("Follow-up Evaluation");
    await visit.getByLabel("Blood-Test Level").fill("95");
    await visit.getByLabel("Clinical Note").fill("E2E follow-up assessment");
    await visit
        .getByPlaceholder("e.g. Mild fatigue")
        .first()
        .fill("Mild nausea");
    await visit.getByRole("button", { name: "Save Appointment" }).click();
    await expect(
        page.getByRole("main", { name: "Blank trial workspace" }),
    ).toContainText("E2E follow-up assessment");
    await expect(
        page.getByRole("main", { name: "Blank trial workspace" }),
    ).toContainText("Mild nausea");
});

for (const role of [0, 1, 2, 3]) {
    test(`enforces patient privacy and action visibility for portal ${role}`, async ({
        page,
    }) => {
        await loginAs(page, role);
        await chooseTrial(page, "Demo Aspen Glucose Study");
        await tab(page, "Patients");
        const main = page.getByRole("main", { name: "Blank trial workspace" });
        if (role < 2) {
            await expect(main).toContainText("Caleb Ortiz");
            await expect(main).toContainText("1967-05-08");
        } else {
            await expect(main).not.toContainText("Caleb Ortiz");
            await expect(main).not.toContainText("1967-05-08");
            await expect(main).toContainText("UI-PAT-008");
            await expect(
                main.getByRole("button", { name: "Edit", exact: true }),
            ).toHaveCount(0);
            await expect(
                main.getByRole("button", { name: "Add Patient", exact: true }),
            ).toHaveCount(0);
        }
        if (role !== 0)
            await expect(
                page.getByRole("button", { name: "Appointments", exact: true }),
            ).toHaveCount(0);
        if (role !== 2)
            await expect(
                page.getByRole("button", { name: "Assignments", exact: true }),
            ).toHaveCount(0);
        await chooseTrial(page, "Demo Juniper Arthritis Study", role !== 3);
        await tab(page, "Report");
        await expect(main).toContainText("Trial Report");
        await expect(main).toContainText("reduction");
        if (role >= 2) await expect(main).not.toContainText("UI-DEMO-INS");
    });
}
