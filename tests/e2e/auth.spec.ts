import { expect, test } from "playwright/test";
import {
    blockUnexpectedBackendRequests,
    defaultPortal,
    demoPortals,
    emailInput,
    expectDashboardFor,
    expectLoginPage,
    expectNoBackendRequests,
    passwordInput,
    selectPortal,
    signIn,
} from "./helpers/auth";

test.beforeEach(async ({ page }) => {
    await blockUnexpectedBackendRequests(page);
});

test.afterEach(async ({ page }) => {
    expectNoBackendRequests(page);
});

test.describe("login page", () => {
    test("renders the portal picker and default demo credentials", async ({
        page,
    }) => {
        await page.goto("/");

        await expectLoginPage(page);
        await expect(emailInput(page)).toHaveValue(defaultPortal.email);
        await expect(passwordInput(page)).toHaveValue(defaultPortal.password);
    });

    test("updates credential fields when a different portal is selected", async ({
        page,
    }) => {
        await page.goto("/");

        for (const portal of demoPortals.slice(1)) {
            await selectPortal(page, portal);
        }
    });

    test("keeps the user on the login page and shows an error for invalid credentials", async ({
        page,
    }) => {
        await page.goto("/");

        await signIn(page, {
            email: defaultPortal.email,
            password: "not-the-demo-password",
        });

        await expect(page).toHaveURL("/");
        await expect(page).toHaveTitle("Pharmatrial | Sign In");
        await expect(page.getByText("Invalid email or password for selected portal!"))
            .toBeVisible();
        await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
    });

    test("rejects valid credentials from the wrong selected portal", async ({
        page,
    }) => {
        const fdaPortal = demoPortals[2];

        await page.goto("/");
        await selectPortal(page, fdaPortal);
        await signIn(page, defaultPortal);

        await expect(page).toHaveURL("/");
        await expect(page.getByText("Invalid email or password for selected portal!"))
            .toBeVisible();
    });

    for (const portal of demoPortals) {
        test(`authenticates ${portal.label} with its demo credentials`, async ({
            page,
        }) => {
            await page.goto("/");
            await selectPortal(page, portal);
            await signIn(page, portal);

            await expectDashboardFor(page, portal);
        });
    }
});

test.describe("url protection", () => {
    test("redirects unauthenticated dashboard requests to the login page", async ({
        page,
    }) => {
        await page.goto("/dashboard");

        await expectLoginPage(page);
    });

    test("redirects authenticated users away from the login url", async ({
        page,
    }) => {
        await page.goto("/");
        await signIn(page, defaultPortal);
        await expectDashboardFor(page, defaultPortal);

        await page.evaluate(async () => {
            const { router } = await import("/src/router/router.module.ts");
            await router.push("/");
        });

        await expectDashboardFor(page, defaultPortal);
    });

    test("clears protected-route access after logout", async ({ page }) => {
        await page.goto("/");
        await signIn(page, defaultPortal);
        await expectDashboardFor(page, defaultPortal);

        await page.getByRole("button", { name: "Logout" }).click();
        await expectLoginPage(page);

        await page.goto("/dashboard");
        await expectLoginPage(page);
    });
});
