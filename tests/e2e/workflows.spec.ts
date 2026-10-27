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
    openSidebar,
    tab,
} from "./helpers/workflow";

test.beforeEach(async ({ page }) => {
    await blockUnexpectedBackendRequests(page);
});
test.afterEach(async ({ page }) => {
    expectNoBackendRequests(page);
});

test("completes a new trial across all four portals through the UI", async ({
    page,
}) => {
    test.setTimeout(120_000);
    await loginAs(page, 3);
    await openSidebar(page);
    await page.getByRole("button", { name: "New Trial", exact: true }).click();
    const create = modal(page, "Create New Clinical Trial");
    await create.getByRole("button", { name: "Submit for Approval" }).click();
    await expect(
        page.getByText("Trial name and drug name are required.", {
            exact: true,
        }),
    ).toBeVisible();
    await dismissToasts(page);
    await create
        .getByLabel("Trial Name", { exact: true })
        .fill("E2E Lifecycle Study");
    await create.getByLabel("Drug Name").fill("E2E-DRUG");
    await create.getByLabel("Condition Under Study").fill("Asthma");
    await create.getByLabel("Doses Per Patient").fill("1");
    await create.getByRole("button", { name: "Submit for Approval" }).click();
    await expect(create).not.toBeVisible();
    // Creating from the mobile sidebar leaves it open; selecting the new trial closes it.
    await chooseTrial(page, "E2E Lifecycle Study");
    await tab(page, "Drug Batch");
    await expect(
        page.getByRole("button", { name: "Prepare & Submit Drug Batch" }),
    ).toBeDisabled();

    await loginAs(page, 2, false);
    await chooseTrial(page, "E2E Lifecycle Study");
    await tab(page, "Overview");
    await page
        .getByRole("button", { name: "Review Trial", exact: true })
        .click();
    const review = modal(page, "Review Trial");
    await review.getByLabel("Required ICD-10 Codes").fill("J45");
    await review.getByRole("button", { name: "Approve Trial" }).click();
    await expect(page.locator("section.banner")).toContainText(
        "Pending JH Approval",
    );

    await loginAs(page, 1, false);
    await chooseTrial(page, "E2E Lifecycle Study");
    await tab(page, "Patients");
    await page
        .getByRole("button", { name: "Add Patient", exact: true })
        .click();
    const add = modal(page, "Add New Patient & Enroll in Trial");
    await add.getByLabel("First Name").fill("Lifecycle");
    await add.getByLabel("Last Name").fill("Participant");
    await add.getByLabel("Date of Birth").fill("1990-01-01");
    await add.getByLabel("ICD-10 Codes").fill("J45");
    await add.getByRole("button", { name: "Save Patient" }).click();
    await expect(
        page.getByText("Patient added and enrolled.", { exact: true }),
    ).toBeVisible();
    await dismissToasts(page);
    await tab(page, "Overview");
    await page
        .getByRole("button", { name: "Review Trial", exact: true })
        .click();
    await review.getByRole("button", { name: "Approve Trial" }).click();
    await expect(page.locator("section.banner")).toContainText(
        "Approved - Awaiting Batch",
    );

    await loginAs(page, 3, false);
    await chooseTrial(page, "E2E Lifecycle Study");
    await tab(page, "Drug Batch");
    await page
        .getByRole("button", { name: "Prepare & Submit Drug Batch" })
        .click();
    const batch = modal(page, "Submit Drug Batch");
    await batch.getByLabel("Batch Reference Code").fill("E2E-BATCH");
    await batch
        .getByRole("button", { name: "Submit Batch", exact: true })
        .click();
    await expect(
        page.getByText("Drug batch submitted to FDA.", { exact: true }),
    ).toBeVisible();

    await loginAs(page, 2, false);
    await chooseTrial(page, "E2E Lifecycle Study");
    await tab(page, "Assignments");
    await page.getByRole("button", { name: "Randomize Assignments" }).click();
    const assignment = modal(page, "Randomized Drug Assignment");
    await expect(
        assignment.getByRole("button", { name: "Lock Assignments" }),
    ).toBeDisabled();
    await assignment
        .getByRole("button", { name: "Randomize", exact: true })
        .click();
    await assignment.getByRole("button", { name: "Lock Assignments" }).click();
    await tab(page, "Disclose");
    await expect(
        page.getByRole("button", { name: "Send Report" }),
    ).toBeDisabled();

    await loginAs(page, 0, false);
    await chooseTrial(page, "E2E Lifecycle Study");
    await tab(page, "Appointments");
    await page
        .getByRole("button", { name: "Log Appointment", exact: true })
        .click();
    const visit = modal(page, "Log Appointment");
    await visit.getByLabel("Blood-Test Level").fill("100");
    await visit.getByLabel("Clinical Note").fill("Lifecycle dose recorded");
    await visit.getByRole("button", { name: "Save Appointment" }).click();
    await expect(
        page
            .getByText("Lifecycle dose recorded", { exact: true })
            .filter({ visible: true }),
    ).toBeVisible();

    await loginAs(page, 1, false);
    await chooseTrial(page, "E2E Lifecycle Study");
    await tab(page, "Notify FDA");
    await page.getByRole("button", { name: "Send Results to FDA" }).click();
    await modal(page, "Notify FDA of Completion")
        .getByRole("button", { name: "Notify FDA", exact: true })
        .click();
    await expect(
        page.getByText("Results transmitted to FDA.", { exact: true }),
    ).toBeVisible();

    await loginAs(page, 2, false);
    await chooseTrial(page, "E2E Lifecycle Study");
    await tab(page, "Disclose");
    await page.getByRole("button", { name: "Send Report" }).click();
    await modal(page, "Disclose Trial Assignments")
        .getByRole("button", { name: "Disclose", exact: true })
        .click();
    await chooseTrial(page, "E2E Lifecycle Study", true);
    await tab(page, "Report");
    await expect(
        page.getByRole("main", { name: "Blank trial workspace" }),
    ).toContainText("Insufficient Data");

    await loginAs(page, 3, false);
    await chooseTrial(page, "E2E Lifecycle Study");
    await tab(page, "Report");
    await expect(
        page.getByRole("main", { name: "Blank trial workspace" }),
    ).not.toContainText("Lifecycle Participant");
    await page
        .getByRole("button", { name: "Archive Trial", exact: true })
        .click();
    await expect(
        page.getByRole("button", { name: "Unarchive Trial", exact: true }),
    ).toBeVisible();
    await expect(
        page.getByRole("button", { name: "Delete trial", exact: true }),
    ).toHaveCount(0);
});

test("rejects a trial, archives it, cancels deletion and then confirms deletion", async ({
    page,
}) => {
    await loginAs(page, 2);
    await chooseTrial(page, "Demo Cedar Kidney Study");
    await page
        .getByRole("button", { name: "Review Trial", exact: true })
        .click();
    await modal(page, "Review Trial")
        .getByRole("button", { name: "Reject Trial" })
        .click();
    await loginAs(page, 3, false);
    await chooseTrial(page, "Demo Cedar Kidney Study");
    await expect(page.locator("section.banner")).toContainText("Rejected");
    await expect(
        page.getByRole("button", { name: "Drug Batch", exact: true }),
    ).toHaveCount(0);
    await page
        .getByRole("button", { name: "Archive Trial", exact: true })
        .click();
    page.once("dialog", (dialog) => dialog.dismiss());
    await page
        .getByRole("button", { name: "Delete trial", exact: true })
        .click();
    await expect(page.locator("section.banner")).toContainText(
        "Demo Cedar Kidney Study",
    );
    page.once("dialog", (dialog) => dialog.accept());
    await page
        .getByRole("button", { name: "Delete trial", exact: true })
        .click();
    await openSidebar(page);
    await page
        .getByPlaceholder("Search trials...")
        .fill("Demo Cedar Kidney Study");
    await expect(
        page
            .getByRole("complementary")
            .getByRole("button")
            .filter({ hasText: "Demo Cedar Kidney Study" }),
    ).toHaveCount(0);
});
