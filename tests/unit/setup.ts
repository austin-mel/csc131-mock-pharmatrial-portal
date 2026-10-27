import { afterEach, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { enableAutoUnmount } from "@vue/test-utils";

enableAutoUnmount(afterEach);
beforeEach(() => {
    setActivePinia(createPinia());
    vi.stubGlobal(
        "fetch",
        vi.fn(() => {
            throw new Error(
                "Unexpected network request: mock fetch in this test.",
            );
        }),
    );
});
afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
});
