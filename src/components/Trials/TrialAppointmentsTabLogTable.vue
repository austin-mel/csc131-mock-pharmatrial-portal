<script setup lang="ts">
import {
    DataCard,
    DataTable,
    PaginationControls,
    StatusBadge,
} from "@/components";
import { computed, ref, watch } from "vue";

import type { Appointment } from "@/types";

type AppointmentLogRow = Appointment & {
    patientId: string;
    patientName: string;
};

const props = defineProps<{ rows: AppointmentLogRow[] }>();

const PAGE_SIZE = 20;
const page = ref(1);
const pageCount = computed(() =>
    Math.max(1, Math.ceil(props.rows.length / PAGE_SIZE)),
);
const pagedRows = computed(() =>
    props.rows.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE),
);

watch(
    () => props.rows,
    () => {
        page.value = 1;
    },
);

function changePage(delta: number) {
    page.value = Math.min(pageCount.value, Math.max(1, page.value + delta));
}
</script>

<template>
    <div>
        <DataCard title="Visit Log">
            <DataTable class="max-[520px]:hidden">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Patient</th>
                        <th>Type</th>
                        <th>Dose</th>
                        <th>Blood Test</th>
                        <th>Adverse Events</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!pagedRows.length">
                        <td colspan="7" class="text-muted">
                            No appointments logged yet.
                        </td>
                    </tr>
                    <tr
                        v-for="row in pagedRows"
                        :key="`${row.patientId}-${row.date}-${row.time}-${row.type}`"
                    >
                        <td class="font-mono text-xs text-fda">
                            {{ row.date }}
                            <span v-if="row.time">{{ row.time }}</span>
                        </td>
                        <td>
                            <strong>{{ row.patientName }}</strong>
                            <div class="font-mono text-xs text-fda">
                                {{ row.patientId }}
                            </div>
                        </td>
                        <td>{{ row.type }}</td>
                        <td>
                            <StatusBadge :tone="row.dose ? 'green' : 'gray'">
                                {{ row.dose ? "Recorded" : "No" }}
                            </StatusBadge>
                        </td>
                        <td>{{ row.bloodTestLevel ?? "Not recorded" }}</td>
                        <td>
                            {{
                                row.adverseEvents.length
                                    ? row.adverseEvents.join(", ")
                                    : "None"
                            }}
                        </td>
                        <td>{{ row.note }}</td>
                    </tr>
                </tbody>
            </DataTable>
            <div class="hidden gap-3 p-3 max-[520px]:grid">
                <div
                    v-if="!pagedRows.length"
                    class="rounded-md border border-rule bg-bg p-3 text-sm text-muted"
                >
                    No appointments logged yet.
                </div>
                <article
                    v-for="row in pagedRows"
                    :key="`${row.patientId}-${row.date}-${row.time}-${row.type}-card`"
                    class="rounded-md border border-rule bg-surface p-3 shadow-sm"
                >
                    <div class="mb-2 flex items-start justify-between gap-3">
                        <div class="min-w-0">
                            <strong
                                class="block break-words text-[15px] text-ink"
                                >{{ row.type }}</strong
                            >
                            <div class="font-mono text-xs text-fda">
                                {{ row.date }}
                                <span v-if="row.time">{{ row.time }}</span>
                            </div>
                        </div>
                        <StatusBadge :tone="row.dose ? 'green' : 'gray'">
                            {{ row.dose ? "Dose" : "No Dose" }}
                        </StatusBadge>
                    </div>
                    <div class="grid gap-2 text-[13px]">
                        <div>
                            <span
                                class="font-mono text-[10px] uppercase tracking-[.12em] text-muted"
                                >Patient</span
                            >
                            <div class="text-ink">
                                <strong>{{ row.patientName }}</strong>
                                <div class="font-mono text-xs text-fda">
                                    {{ row.patientId }}
                                </div>
                            </div>
                        </div>
                        <div>
                            <span
                                class="font-mono text-[10px] uppercase tracking-[.12em] text-muted"
                                >Blood Test</span
                            >
                            <div class="text-ink">
                                {{ row.bloodTestLevel ?? "Not recorded" }}
                            </div>
                        </div>
                        <div>
                            <span
                                class="font-mono text-[10px] uppercase tracking-[.12em] text-muted"
                                >Adverse Events</span
                            >
                            <div class="text-ink">
                                {{
                                    row.adverseEvents.length
                                        ? row.adverseEvents.join(", ")
                                        : "None"
                                }}
                            </div>
                        </div>
                        <div>
                            <span
                                class="font-mono text-[10px] uppercase tracking-[.12em] text-muted"
                                >Notes</span
                            >
                            <div class="break-words text-ink">
                                {{ row.note }}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </DataCard>
        <div v-if="pageCount > 1" class="mt-3">
            <PaginationControls
                :page="page"
                :pages="pageCount"
                @change="changePage"
            />
        </div>
    </div>
</template>
