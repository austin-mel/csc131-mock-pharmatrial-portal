import { expect, type Page } from "playwright/test";
import { demoPortals, selectPortal, signIn } from "./auth";

export async function loginAs(page: Page, role: number, initial = true) {
    if (initial) await page.goto("./");
    else
        await page.getByRole("button", { name: "Logout", exact: true }).click();
    await selectPortal(page, demoPortals[role]);
    await signIn(page, demoPortals[role]);
    await expect(page).toHaveURL(/#\/dashboard$/);
    await expect(
        page.getByRole("button", { name: "Overview", exact: true }),
    ).toBeVisible();
    await dismissToasts(page);
}
export async function openSidebar(page: Page) {
    const open = page.getByRole("button", {
        name: "Open clinical trials menu",
    });
    if (await open.isVisible()) {
        const box = await page.getByRole("complementary").boundingBox();
        if (!box || box.x < 0) await open.click();
    }
}
export async function chooseTrial(page: Page, name: string, completed = false) {
    await openSidebar(page);
    const sidebar = page.getByRole("complementary");
    const filter = sidebar.getByRole("switch");
    if (((await filter.getAttribute("aria-checked")) === "true") !== completed)
        await filter.click();
    await sidebar.getByPlaceholder("Search trials...").fill(name);
    await sidebar.getByRole("button").filter({ hasText: name }).click();
    await expect(page.locator("section.banner")).toContainText(name);
}
export function modal(page: Page, title: string) {
    return page
        .locator("section")
        .filter({
            has: page.getByRole("heading", { name: title, exact: true }),
        });
}
export async function tab(page: Page, name: string) {
    await page.getByRole("button", { name, exact: true }).click();
}
export async function dismissToasts(page: Page) {
    const dismiss = page.getByRole("button", { name: "Dismiss notification" });
    while (await dismiss.count()) await dismiss.first().click();
}
