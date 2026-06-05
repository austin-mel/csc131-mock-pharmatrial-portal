<script setup lang="ts">
import { ActionButton } from "@/components";
import { SvgIcon } from "@/assets";

defineProps<{ fileName: string }>();
defineEmits<{
    downloadTemplate: [];
    fileChange: [event: Event];
}>();
</script>

<template>
    <p
        class="mb-4 rounded-md border border-rule bg-bg px-3 py-2 text-sm text-muted"
    >
        Upload creates or updates patients and enrolls valid rows in the active
        trial.
    </p>
    <div
        class="mb-1.5 mt-3.5 font-mono text-[10px] uppercase tracking-[.12em] text-muted"
    >
        CSV Format
    </div>
    <p class="mb-2 text-xs text-muted">
        Supported columns: patientId, name, dob, icdCodes, bloodType, meds,
        allergy, height, weight, bp, oxygen, temperature.
    </p>
    <ActionButton @click="$emit('downloadTemplate')">
        <SvgIcon name="uploadFile" />
        Download Template
    </ActionButton>
    <div
        class="mb-1.5 mt-3.5 font-mono text-[10px] uppercase tracking-[.12em] text-muted"
    >
        Upload File
    </div>
    <input
        type="file"
        accept=".csv,text/csv"
        @change="$emit('fileChange', $event)"
    />
    <div v-if="fileName" class="mt-2 font-mono text-xs text-fda">
        {{ fileName }}
    </div>
</template>
