<script setup lang="ts">
import { DataCard, DataTable, StatusBadge } from "@/components";
import { SvgIcon } from "@/assets";
import { buildPatientDisplay } from "@/utils";
import type { Patient, PortalId, Trial, TrialEnrollmentMap } from "@/types";

const props = defineProps<{
    pii: boolean;
    portalId: PortalId;
    trial: Trial;
    patients: Patient[];
    enrollments: TrialEnrollmentMap;
}>();

function patientDoses(patientId: string) {
    return props.enrollments[patientId]?.doses ?? 0;
}

function patientDisplay(patient: Patient) {
    return buildPatientDisplay(
        patient,
        props.enrollments[patient.id],
        props.trial,
        props.portalId,
    );
}
</script>

<template>
    <DataCard title="Per-Patient Dose Status">
        <template #header>
            <StatusBadge :tone="pii ? 'green' : 'blue'">
                {{ pii ? "Full PII" : "Anonymized" }}
            </StatusBadge>
        </template>
        <DataTable>
            <thead>
                <tr>
                    <th v-if="pii">Patient</th>
                    <th v-if="pii">DOB</th>
                    <th>UUID</th>
                    <th v-for="index in trial.dosesPerPatient" :key="index">
                        D{{ index }}
                    </th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!patients.length">
                    <td
                        :colspan="
                            pii
                                ? trial.dosesPerPatient + 4
                                : trial.dosesPerPatient + 2
                        "
                        class="text-muted"
                    >
                        No eligible patients found.
                    </td>
                </tr>
                <tr v-for="patient in patients" :key="patient.id">
                    <td v-if="pii">{{ patientDisplay(patient).name }}</td>
                    <td v-if="pii">{{ patientDisplay(patient).dob }}</td>
                    <td class="font-mono text-xs text-fda">{{ patient.id }}</td>
                    <td v-for="index in trial.dosesPerPatient" :key="index">
                        <StatusBadge
                            :tone="
                                index <= patientDoses(patient.id)
                                    ? 'green'
                                    : 'gray'
                            "
                        >
                            <SvgIcon
                                v-if="index <= patientDoses(patient.id)"
                                name="check"
                            />
                            <span v-else>-</span>
                        </StatusBadge>
                    </td>
                    <td>
                        <StatusBadge
                            :tone="
                                patientDoses(patient.id) >=
                                trial.dosesPerPatient
                                    ? 'green'
                                    : 'yellow'
                            "
                        >
                            {{
                                patientDoses(patient.id) >=
                                trial.dosesPerPatient
                                    ? "Complete"
                                    : `${patientDoses(patient.id)}/${trial.dosesPerPatient}`
                            }}
                        </StatusBadge>
                    </td>
                </tr>
            </tbody>
        </DataTable>
    </DataCard>
</template>
