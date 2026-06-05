import { defineStore } from "pinia";
import { ref } from "vue";
import type { ModalId, ToastRecord, TrialTab } from "@/types";

export const useUiStore = defineStore("ui", () => {
    const activeTab = ref<TrialTab>("overview");
    const openModal = ref<ModalId | null>(null);
    const selectedPatientId = ref<string | null>(null);
    const toasts = ref<ToastRecord[]>([]);
    const nextToastId = ref(1);

    function switchTab(tab: TrialTab) {
        activeTab.value = tab;
    }

    function showModal(modal: ModalId, patientId: string | null = null) {
        selectedPatientId.value = patientId;
        openModal.value = modal;
    }

    function closeModal() {
        openModal.value = null;
    }

    function pushToast(message: string, type: ToastRecord["type"] = "info") {
        toasts.value.push({ id: nextToastId.value, message, type });
        nextToastId.value += 1;
    }

    function dismissToast(id: number) {
        toasts.value = toasts.value.filter((toast) => toast.id !== id);
    }

    return {
        activeTab,
        openModal,
        selectedPatientId,
        toasts,
        switchTab,
        showModal,
        closeModal,
        pushToast,
        dismissToast,
    };
});
