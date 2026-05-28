import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { seedTrials } from '@/data';
import type { Trial } from '@/types';

export interface CreateTrialDraft {
  name: string;
  drug: string;
  phase: string;
  condition: string;
  start: string;
  end: string;
  enrollment: number;
  dosesPerPatient: number;
  description: string;
}

export const useTrialsStore = defineStore('trials', () => {
  const trials = ref<Trial[]>(structuredClone(seedTrials));
  const currentTrialId = ref<string | null>(trials.value[0]?.id ?? null);
  const sidebarSearch = ref('');
  const showingArchived = ref(false);

  const currentTrial = computed(() => trials.value.find((trial) => trial.id === currentTrialId.value) ?? null);
  const filteredTrials = computed(() => {
    const query = sidebarSearch.value.trim().toLowerCase();
    return trials.value
      .filter((trial) => Boolean(trial.archived) === showingArchived.value)
      .filter((trial) => {
        if (!query) return true;
        return [trial.name, trial.id, trial.drug, trial.condition, trial.statusLabel].some((value) =>
          value.toLowerCase().includes(query),
        );
      });
  });

  function selectTrial(id: string) {
    currentTrialId.value = id;
    const trial = trials.value.find((item) => item.id === id);
    showingArchived.value = Boolean(trial?.archived);
  }

  function setSearch(value: string) {
    sidebarSearch.value = value;
  }

  function setArchiveFilter(value: boolean) {
    showingArchived.value = value;
  }

  function createTrial(draft: CreateTrialDraft) {
    const next = trials.value.length + 1;
    const trial: Trial = {
      id: `TRL-2023-${String(next).padStart(3, '0')}`,
      name: draft.name,
      drug: draft.drug,
      phase: draft.phase,
      condition: draft.condition || '-',
      start: draft.start,
      end: draft.end,
      enrollment: draft.enrollment,
      status: 'pending-approval',
      statusLabel: 'Pending Approval',
      archived: false,
      dosesPerPatient: draft.dosesPerPatient,
      description: draft.description || 'No description provided.',
    };
    trials.value.push(trial);
    currentTrialId.value = trial.id;
    showingArchived.value = false;
    return trial;
  }

  return {
    trials,
    currentTrialId,
    currentTrial,
    sidebarSearch,
    showingArchived,
    filteredTrials,
    selectTrial,
    setSearch,
    setArchiveFilter,
    createTrial,
  };
});
