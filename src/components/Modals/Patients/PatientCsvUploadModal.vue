<script setup lang="ts">
import {
    ActionButton,
    ModalShell,
    PatientCsvInstructions,
    PatientCsvPreviewTable,
} from "@/components";
import { watch } from "vue";

import { usePatientCsvUpload } from "@/composables";
import type { Trial } from "@/types";

const props = defineProps<{ open: boolean; trial: Trial }>();
const emit = defineEmits<{ close: [] }>();

const upload = usePatientCsvUpload(() => props.trial);
const {
    rows,
    fileName,
    validRows,
    eligibleCount,
    reset,
    handleFile,
    downloadTemplate,
} = upload;

watch(
    () => props.open,
    (open) => {
        if (!open) return;
        reset();
    },
);

function importRows() {
    upload.importRows();
    emit("close");
}
</script>

<template>
    <ModalShell
        :open="open"
        title="Bulk Upload Patients (CSV)"
        wide
        @close="$emit('close')"
    >
        <PatientCsvInstructions
            :file-name="fileName"
            @download-template="downloadTemplate"
            @file-change="handleFile"
        />
        <PatientCsvPreviewTable
            :rows="rows"
            :valid-count="validRows.length"
            :eligible-count="eligibleCount"
        />
        <template #footer>
            <ActionButton @click="$emit('close')">Cancel</ActionButton>
            <ActionButton
                variant="jh"
                :disabled="!validRows.length"
                @click="importRows"
            >
                Import Patients
            </ActionButton>
        </template>
    </ModalShell>
</template>
