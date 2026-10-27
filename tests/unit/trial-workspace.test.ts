import { expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import TrialWorkspace from "@/components/Trials/TrialWorkspace.vue";
import { useAuthStore, useTrialsStore, useUiStore } from "@/stores";
import type { PortalId } from "@/types";

const roles: PortalId[] = ["jh-doctor", "jh-admin", "fda", "bavaria"];
it.each(roles)(
    "renders the active workspace and authorized tabs for %s",
    async (role) => {
        useAuthStore().selectPortal(role);
        useTrialsStore().selectTrial("TRL-2026-904");
        const wrapper = mount(TrialWorkspace);
        expect(wrapper.text()).toContain("Demo Aspen Glucose Study");
        expect(wrapper.text()).toContain("Trial Overview");
        const tabs = wrapper
            .findAll("button")
            .filter((b) =>
                [
                    "Overview",
                    "Patients",
                    "Appointments",
                    "Dose Tracker",
                    "Notify FDA",
                    "Assignments",
                    "Disclose",
                    "Drug Batch",
                ].includes(b.text()),
            );
        const expected: Record<PortalId, string[]> = {
            "jh-doctor": [
                "Overview",
                "Patients",
                "Appointments",
                "Dose Tracker",
            ],
            "jh-admin": ["Overview", "Patients", "Dose Tracker", "Notify FDA"],
            fda: ["Overview", "Patients", "Assignments", "Disclose"],
            bavaria: ["Overview", "Patients", "Drug Batch"],
        };
        expect(tabs.map((b) => b.text())).toEqual(expected[role]);
        for (const tab of tabs.slice(1)) {
            await tab.trigger("click");
            const main = wrapper.get("main");
            expect(main.text().length).toBeGreaterThan(30);
            if (tab.text() === "Patients") {
                if (role.startsWith("jh-"))
                    expect(main.text()).toContain("Caleb Ortiz");
                else expect(main.text()).not.toContain("Caleb Ortiz");
                await main.get("input").setValue("no matching patient");
                expect(main.text()).not.toContain("UI-PAT-008");
            }
            if (tab.text() === "Notify FDA") {
                expect(main.text()).toContain("Not ready");
                expect(main.get("button").attributes("disabled")).toBeDefined();
            }
            if (tab.text() === "Disclose") {
                expect(main.text()).toContain("must notify the FDA");
                expect(main.get("button").attributes("disabled")).toBeDefined();
            }
        }
    },
);
it.each(roles)(
    "renders published outcome and adverse-event reports for %s",
    async (role) => {
        useAuthStore().selectPortal(role);
        const trials = useTrialsStore();
        if (role !== "bavaria") trials.setArchiveFilter(true);
        trials.selectTrial("TRL-2026-903");
        const wrapper = mount(TrialWorkspace);
        await wrapper
            .findAll("button")
            .find((b) => b.text() === "Report")!
            .trigger("click");
        expect(wrapper.get("main").text()).toContain("Trial Report");
        expect(wrapper.get("main").text()).toContain("reduction");
        expect(wrapper.get("main").text()).toContain("Placebo");
        expect(wrapper.get("main").text()).toContain("Treatment");
        if (!role.startsWith("jh-")) {
            expect(wrapper.get("main").text()).toContain("Patient UI-PAT-");
            expect(wrapper.get("main").text()).not.toContain("Private Street");
        }
    },
);
it("resets a restricted active tab after a portal change", async () => {
    const auth = useAuthStore();
    auth.selectPortal("fda");
    useTrialsStore().selectTrial("TRL-2026-904");
    const wrapper = mount(TrialWorkspace);
    useUiStore().switchTab("assignments");
    await nextTick();
    expect(wrapper.text()).toContain("Private FDA mapping");
    auth.selectPortal("jh-doctor");
    await nextTick();
    expect(useUiStore().activeTab).toBe("overview");
    expect(wrapper.text()).not.toContain("Private FDA mapping");
});
