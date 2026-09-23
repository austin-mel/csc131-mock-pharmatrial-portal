import { expect, type Page } from "playwright/test";

export type DemoPortal = {
    label: string;
    role: string;
    abbr: string;
    user: string;
    email: string;
    password: string;
};

export const demoPortals: DemoPortal[] = [
    {
        label: "Jane Hopkins Doctor",
        role: "Trial Physician",
        abbr: "DR",
        user: "Dr. Sarah Chen",
        email: "doctor@jh.example",
        password: "jh-doctor-demo",
    },
    {
        label: "Jane Hopkins Admin",
        role: "Admin Coordinator",
        abbr: "JA",
        user: "Emily Rodriguez",
        email: "admin@jh.example",
        password: "jh-admin-demo",
    },
    {
        label: "FDA Admin",
        role: "Federal Regulator",
        abbr: "FDA",
        user: "Michael Torres",
        email: "admin@fda.example",
        password: "fda-demo",
    },
    {
        label: "Bavaria Admin",
        role: "Pharmaceutical Co.",
        abbr: "BV",
        user: "Anna Keller",
        email: "admin@bavaria.example",
        password: "bavaria-demo",
    },
];

export const defaultPortal = demoPortals[0];

const backendCallsByPage = new WeakMap<Page, string[]>();

export function emailInput(page: Page) {
    return page.getByPlaceholder("username@institution.org");
}

export function passwordInput(page: Page) {
    return page.getByPlaceholder("password");
}

export function portalButton(page: Page, portal: DemoPortal) {
    return page
        .getByRole("button")
        .filter({ hasText: portal.label })
        .filter({ hasText: portal.role });
}

export async function blockUnexpectedBackendRequests(page: Page) {
    const backendCalls: string[] = [];
    backendCallsByPage.set(page, backendCalls);

    await page.route("**/*", async (route) => {
        const url = new URL(route.request().url());
        if (/^\/(?:api|auth|workflow)\//.test(url.pathname)) {
            backendCalls.push(route.request().url());
            await route.abort();
            return;
        }

        await route.continue();
    });
}

export function expectNoBackendRequests(page: Page) {
    expect(backendCallsByPage.get(page) ?? []).toEqual([]);
}

export async function expectLoginPage(page: Page) {
    await expect(page).toHaveURL("/");
    await expect(page).toHaveTitle("Pharmatrial | Sign In");
    await expect(page.locator("section")).toContainText("Clinical Trial");
    await expect(page.locator("section")).toContainText("Data Exchange");
    await expect(emailInput(page)).toBeVisible();
    await expect(passwordInput(page)).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();

    for (const portal of demoPortals) {
        await expect(portalButton(page, portal)).toBeVisible();
    }
}

export async function selectPortal(page: Page, portal: DemoPortal) {
    await portalButton(page, portal).click();
    await expect(emailInput(page)).toHaveValue(portal.email);
    await expect(passwordInput(page)).toHaveValue(portal.password);
}

export async function signIn(
    page: Page,
    credentials: Pick<DemoPortal, "email" | "password">,
) {
    await emailInput(page).fill(credentials.email);
    await passwordInput(page).fill(credentials.password);
    await page.getByRole("button", { name: "Sign In" }).click();
}

export async function expectDashboardFor(page: Page, portal: DemoPortal) {
    await expect(page).toHaveURL("/dashboard");
    await expect(page).toHaveTitle("Dashboard");

    const nav = page.getByRole("navigation");
    await expect(nav).toBeVisible();
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
    await expect(
        page.getByRole("main", { name: "Blank trial workspace" }),
    ).toBeVisible();

    const isCompactNav = (page.viewportSize()?.width ?? 1280) < 640;
    if (isCompactNav) {
        await expect(nav.getByText(portal.abbr, { exact: true })).toBeVisible();
        return;
    }

    await expect(nav).toContainText(portal.label);
    await expect(nav.getByText(portal.user)).toBeVisible();
}
