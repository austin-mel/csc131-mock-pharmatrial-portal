import { expect, test, type Page } from "playwright/test";
import {
    blockUnexpectedBackendRequests,
    defaultPortal,
    expectDashboardFor,
    expectLoginPage,
    expectNoBackendRequests,
    signIn,
} from "./helpers/auth";

function viewport(page: Page) {
    const size = page.viewportSize();
    if (!size) throw new Error("Expected Playwright to provide a viewport.");
    return size;
}

async function expectNoHorizontalOverflow(page: Page) {
    await expect
        .poll(async () =>
            page.evaluate(
                () =>
                    Math.max(
                        document.documentElement.scrollWidth,
                        document.body.scrollWidth,
                    ) <= window.innerWidth + 1,
            ),
        )
        .toBe(true);
}

async function expectElementInsideViewport(page: Page, selector: string) {
    const box = await page.locator(selector).first().boundingBox();
    if (!box) throw new Error(`Expected ${selector} to be visible.`);

    const { width, height } = viewport(page);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
    expect(box.y).toBeLessThanOrEqual(height + 1);
}

test.beforeEach(async ({ page }) => {
    await blockUnexpectedBackendRequests(page);
});

test.afterEach(async ({ page }) => {
    expectNoBackendRequests(page);
});

test.describe("responsive login experience", () => {
    test("keeps the login card and controls usable in every viewport", async ({
        page,
    }) => {
        await page.goto("/");

        await expectLoginPage(page);
        await expectNoHorizontalOverflow(page);
        await expectElementInsideViewport(page, "section");

        const loginPanel = page.locator("section").first();
        const box = await loginPanel.boundingBox();
        if (!box) throw new Error("Expected login panel to be visible.");

        expect(box.width).toBeLessThanOrEqual(viewport(page).width);
        await expect(page.getByRole("button", { name: "Sign In" })).toBeInViewport();
    });
});

test.describe("responsive authenticated shell", () => {
    test("keeps core dashboard functionality available in every viewport", async ({
        page,
    }) => {
        await page.goto("/");
        await signIn(page, defaultPortal);
        await expectDashboardFor(page, defaultPortal);

        await expectNoHorizontalOverflow(page);
        await expect(page.getByText("Trial Overview")).toBeVisible();
        await expect(page.getByRole("button", { name: "Logout" })).toBeInViewport();

        const menuButton = page.getByRole("button", {
            name: "Open clinical trials menu",
        });

        if (viewport(page).width < 1024) {
            await expect(menuButton).toBeVisible();
            await menuButton.click();

            await expect(
                page.getByRole("button", { name: "Close clinical trials menu" }),
            ).toBeVisible();
            await expect(page.getByPlaceholder("Search trials...")).toBeVisible();
            await expect(page.getByPlaceholder("Search trials...")).toBeInViewport();

            await page.getByPlaceholder("Search trials...").fill("neurology");
            await expect(page.getByText(/neurology/i).first()).toBeVisible();
            await page
                .getByRole("button", { name: "Close clinical trials menu" })
                .click();
        } else {
            await expect(menuButton).toBeHidden();
            await expect(page.getByPlaceholder("Search trials...")).toBeVisible();
            await expect(page.getByPlaceholder("Search trials...")).toBeInViewport();
        }
    });

    test("allows horizontal tab access without page-level overflow", async ({
        page,
    }) => {
        await page.goto("/");
        await signIn(page, defaultPortal);

        const overviewTab = page.getByRole("button", { name: "Overview" });
        await expect(overviewTab).toBeVisible();
        await expectNoHorizontalOverflow(page);

        await overviewTab.evaluate((element) => {
            const tabBar = element.parentElement;
            if (!tabBar) throw new Error("Expected overview tab to have a parent.");
            tabBar.scrollLeft = tabBar.scrollWidth;
        });

        await expectNoHorizontalOverflow(page);
        await expect(overviewTab).toBeVisible();
    });
});
