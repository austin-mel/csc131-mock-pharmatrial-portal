<script setup lang="ts">
import { computed, ref, watch } from "vue";

import DataCard from "@/components/Dashboard/DataCard.vue";
import DataTable from "@/components/Dashboard/DataTable.vue";
import PaginationControls from "@/components/Navigation/PaginationControls.vue";
import StatusBadge from "@/components/StatusBadge/StatusBadge.vue";
import type { Appointment } from "@/types";

type AppointmentLogRow = Appointment & {
  patientId: string;
  patientName: string;
};

const props = defineProps<{ rows: AppointmentLogRow[] }>();

const PAGE_SIZE = 20;
const page = ref(1);
const pageCount = computed(() => Math.max(1, Math.ceil(props.rows.length / PAGE_SIZE)));
const pagedRows = computed(() => props.rows.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE));

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
      <DataTable>
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
            <td colspan="7" class="text-muted">No appointments logged yet.</td>
          </tr>
          <tr v-for="row in pagedRows" :key="`${row.patientId}-${row.date}-${row.time}-${row.type}`">
            <td class="font-mono text-xs text-fda">
              {{ row.date }} <span v-if="row.time">{{ row.time }}</span>
            </td>
            <td>
              <strong>{{ row.patientName }}</strong>
              <div class="font-mono text-xs text-fda">{{ row.patientId }}</div>
            </td>
            <td>{{ row.type }}</td>
            <td>
              <StatusBadge :tone="row.dose ? 'green' : 'gray'">
                {{ row.dose ? "Recorded" : "No" }}
              </StatusBadge>
            </td>
            <td>{{ row.bloodTestLevel ?? "Not recorded" }}</td>
            <td>{{ row.adverseEvents.length ? row.adverseEvents.join(", ") : "None" }}</td>
            <td>{{ row.note }}</td>
          </tr>
        </tbody>
      </DataTable>
    </DataCard>
    <div v-if="pageCount > 1" class="mt-3">
      <PaginationControls :page="page" :pages="pageCount" @change="changePage" />
    </div>
  </div>
</template>
