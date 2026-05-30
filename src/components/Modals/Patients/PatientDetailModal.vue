<script setup lang="ts">
import { computed } from "vue";

import ActionButton from "@/components/ActionButton/ActionButton.vue";
import DataCard from "@/components/Dashboard/DataCard.vue";
import DetailGrid from "@/components/Dashboard/DetailGrid.vue";
import StatusBadge from "@/components/StatusBadge/StatusBadge.vue";
import ModalShell from "@/components/ModalShell/ModalShell.vue";
import { useAuthStore } from "@/stores";
import type { Patient, Trial, TrialEnrollmentMap } from "@/types";

const props = defineProps<{
  open: boolean;
  patient: Patient | null;
  trial: Trial;
  enrollments: TrialEnrollmentMap;
}>();
defineEmits<{ close: []; edit: [id: string] }>();

const auth = useAuthStore();
const showPii = computed(() => auth.selectedPortalId === "jh-doctor");
const enrollment = computed(() => (props.patient ? props.enrollments[props.patient.id] : null));
const canEdit = computed(() => showPii.value && props.trial.status !== "complete");
const initials = computed(() =>
  props.patient?.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "",
);

const items = computed(() => {
  if (!props.patient) return [];
  const base = [
    { label: "UUID", value: props.patient.id },
    { label: "ICD-10 Codes", value: props.patient.icdCodes.join(", ") || "None" },
    { label: "Enrollment", value: enrollment.value ? "Enrolled" : "Not enrolled" },
    { label: "Eligibility", value: enrollment.value?.eligible ? "Eligible" : "Excluded" },
    { label: "Doses", value: `${enrollment.value?.doses ?? 0}/${props.trial.dosesPerPatient}` },
    { label: "Appointments", value: enrollment.value?.appointments.length ?? 0 },
  ];

  if (!showPii.value) return base;

  return [
    { label: "Name", value: props.patient.name },
    { label: "DOB", value: props.patient.dob },
    { label: "Blood Type", value: props.patient.bloodType },
    ...base,
    { label: "Blood Pressure", value: props.patient.bp ?? "-" },
    { label: "O2 Saturation", value: props.patient.oxygen ?? "-" },
    { label: "Temperature", value: props.patient.temperature ?? "-" },
    { label: "Height / Weight", value: `${props.patient.height ?? "-"} cm / ${props.patient.weight ?? "-"} kg` },
    { label: "Medications", value: props.patient.meds ?? "None" },
    { label: "Allergies", value: props.patient.allergy ?? "None" },
    { label: "Address", value: props.patient.address ?? "-" },
    { label: "Insurance", value: props.patient.insuranceId ?? "-" },
    { label: "Employment", value: props.patient.employment ?? "-" },
  ];
});
</script>

<template>
  <ModalShell
    :open="open"
    title="Patient Detail"
    wide
    @close="$emit('close')"
  >
    <div
      v-if="patient"
      class="-m-[22px] mb-[22px] flex items-center gap-[18px] bg-[linear-gradient(135deg,#1e7e4e,#155d38)] p-[22px] text-white"
    >
      <div class="flex size-[58px] shrink-0 items-center justify-center rounded-full bg-white/20 font-serif text-[21px]">
        {{ initials }}
      </div>
      <div class="min-w-0">
        <div class="font-serif text-xl">
          {{ showPii ? patient.name : "Anonymized Patient" }}
        </div>
        <div class="mt-0.5 font-mono text-[11px] text-white/60">{{ patient.id }}</div>
        <div class="mt-2 flex flex-wrap gap-[7px]">
          <StatusBadge :tone="enrollment?.eligible ? 'green' : 'gray'">
            {{ enrollment?.eligible ? "Eligible" : "Excluded" }}
          </StatusBadge>
          <StatusBadge tone="blue">{{ enrollment ? "Enrolled" : "Not enrolled" }}</StatusBadge>
          <StatusBadge :tone="(enrollment?.doses ?? 0) >= trial.dosesPerPatient ? 'green' : 'yellow'">
            {{ enrollment?.doses ?? 0 }}/{{ trial.dosesPerPatient }} doses
          </StatusBadge>
        </div>
      </div>
    </div>
    <DetailGrid v-if="patient" :items="items" />
    <DataCard v-if="patient" title="Appointments">
      <div class="p-[18px] text-sm text-muted">
        {{ enrollment?.appointments.length ?? 0 }} appointment{{ (enrollment?.appointments.length ?? 0) === 1 ? "" : "s" }} logged for this trial.
      </div>
    </DataCard>
    <template #footer>
      <ActionButton @click="$emit('close')">Close</ActionButton>
      <ActionButton
        v-if="patient && canEdit"
        variant="jh"
        @click="$emit('edit', patient.id)"
      >
        Edit Record
      </ActionButton>
    </template>
  </ModalShell>
</template>
