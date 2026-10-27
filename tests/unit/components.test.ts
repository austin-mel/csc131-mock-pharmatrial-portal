import { expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import FormInput from "@/components/Form/FormInput.vue";
import FormSelect from "@/components/Form/FormSelect.vue";
import FormTextarea from "@/components/Form/FormTextarea.vue";
import SearchInput from "@/components/SearchInput/SearchInput.vue";
import PaginationControls from "@/components/Navigation/PaginationControls.vue";
import SegmentedControl from "@/components/Navigation/SegmentedControl.vue";
import ModalShell from "@/components/ModalShell/ModalShell.vue";
import ProgressBar from "@/components/Dashboard/ProgressBar.vue";
import ToastStack from "@/components/ToastStack/ToastStack.vue";
import CreateTrialModal from "@/components/Modals/Trials/CreateTrialModal.vue";
import TrialSourceBanner from "@/components/Trials/TrialSourceBanner.vue";
import { useAuthStore, useTrialsStore, useUiStore } from "@/stores";

it("emits typed model updates from text, numeric, search, select and textarea controls", async () => {
    const input = mount(FormInput, {
        props: { modelValue: "", placeholder: "Name" },
    });
    await input.get("input").setValue("Alex");
    expect(input.emitted("update:modelValue")?.[0]).toEqual(["Alex"]);
    const numeric = mount(FormInput, {
        props: { type: "number", min: 0, max: 10 },
    });
    await numeric.get("input").setValue("5");
    expect(numeric.emitted("update:modelValue")?.[0]).toEqual([5]);
    const search = mount(SearchInput, { props: { modelValue: "" } });
    await search.get("input").setValue("aspen");
    expect(search.emitted("update:modelValue")?.[0]).toEqual(["aspen"]);
    const select = mount(FormSelect, {
        slots: {
            default: '<option value="a">A</option><option value="b">B</option>',
        },
    });
    await select.get("select").setValue("b");
    expect(select.emitted("update:modelValue")?.[0]).toEqual(["b"]);
    const textarea = mount(FormTextarea);
    await textarea.get("textarea").setValue("Notes");
    expect(textarea.emitted("update:modelValue")?.[0]).toEqual(["Notes"]);
});
it("disables pagination at both boundaries and emits directions", async () => {
    const wrapper = mount(PaginationControls, { props: { page: 1, pages: 2 } });
    expect(wrapper.text()).toContain("Page 1/2");
    expect(wrapper.findAll("button")[0].attributes("disabled")).toBeDefined();
    await wrapper.findAll("button")[1].trigger("click");
    expect(wrapper.emitted("change")).toEqual([[1]]);
    await wrapper.setProps({ page: 2 });
    expect(wrapper.findAll("button")[1].attributes("disabled")).toBeDefined();
    await wrapper.findAll("button")[0].trigger("click");
    expect(wrapper.emitted("change")?.[1]).toEqual([-1]);
});
it("exposes filter state accessibly and toggles both directions", async () => {
    const wrapper = mount(SegmentedControl, {
        props: {
            modelValue: "current",
            options: [
                { label: "Current", value: "current" },
                { label: "Archived", value: "archived" },
            ],
        },
    });
    expect(wrapper.attributes("aria-checked")).toBe("false");
    await wrapper.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["archived"]);
    await wrapper.setProps({ modelValue: "archived" });
    expect(wrapper.attributes("aria-label")).toBe("Showing Archived");
    await wrapper.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[1]).toEqual(["current"]);
});
it("only dismisses a modal for close or a pointer gesture entirely on the backdrop", async () => {
    const wrapper = mount(ModalShell, {
        props: { open: false, title: "Review" },
        slots: { default: "Content", footer: "Actions" },
    });
    expect(wrapper.find("section").exists()).toBe(false);
    await wrapper.setProps({ open: true });
    expect(wrapper.get("h2").text()).toBe("Review");
    await wrapper.get("section").trigger("pointerdown");
    await wrapper.trigger("pointerup");
    expect(wrapper.emitted("close")).toBeUndefined();
    await wrapper.trigger("pointerdown");
    await wrapper.get("section").trigger("pointerup");
    expect(wrapper.emitted("close")).toBeUndefined();
    await wrapper.trigger("pointerdown");
    await wrapper.trigger("pointerup");
    await wrapper.get('button[aria-label="Close"]').trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(2);
});
it.each([
    [-5, "0%"],
    [45, "45%"],
    [150, "100%"],
])("clamps progress %s", (value, width) => {
    const wrapper = mount(ProgressBar, { props: { value: value as number } });
    expect(wrapper.get("[style]").attributes("style")).toContain(
        `width: ${width}`,
    );
});
it("announces toasts and dismisses the selected notification", async () => {
    const ui = useUiStore();
    ui.pushToast("Saved", "success");
    ui.pushToast("Try again", "error");
    const wrapper = mount(ToastStack);
    expect(wrapper.attributes("aria-live")).toBe("polite");
    await wrapper.findAll("button")[0].trigger("click");
    expect(wrapper.text()).not.toContain("Saved");
    expect(wrapper.text()).toContain("Try again");
});
it("validates trial creation, saves the form and resets it when reopened", async () => {
    useAuthStore().selectPortal("bavaria");
    const wrapper = mount(CreateTrialModal, { props: { open: false } });
    await wrapper.setProps({ open: true });
    const submit = () =>
        wrapper
            .findAll("button")
            .find((b) => b.text() === "Submit for Approval")!;
    await submit().trigger("click");
    expect(useUiStore().toasts.at(-1)?.message).toBe(
        "Trial name and drug name are required.",
    );
    await wrapper
        .get('input[placeholder="e.g. Phase 3 Antiviral Regimen B"]')
        .setValue(" New Trial ");
    await wrapper.get('input[placeholder="e.g. BAV-AV8"]').setValue(" DRUG ");
    await submit().trigger("click");
    expect(useTrialsStore().currentTrial).toMatchObject({
        name: "New Trial",
        drug: "DRUG",
        status: "pending-approval",
    });
    expect(wrapper.emitted("close")).toHaveLength(1);
    await wrapper.setProps({ open: false });
    await wrapper.setProps({ open: true });
    expect((wrapper.get("input").element as HTMLInputElement).value).toBe("");
});
it("shows loading, live and seeded data-source states", async () => {
    const store = useTrialsStore();
    store.apiHydrating = true;
    const wrapper = mount(TrialSourceBanner);
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
    store.apiHydrating = false;
    store.apiFallback = false;
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Viewing live data");
    store.apiFallback = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Demo mode enabled");
});
