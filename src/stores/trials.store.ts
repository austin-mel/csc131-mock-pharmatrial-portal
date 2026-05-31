import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { trialStatusLabel } from '@/composables';
import { seedAssignments, seedTrialPatients, seedTrials } from '@/data';
import type { PortalId, Trial, TrialAssignmentMap, TrialEligibility, TrialPatientsByTrial } from '@/types';

const SIDEBAR_PAGE_SIZE = 10;

type TrialAuditAction =
  | 'trial.approve'
  | 'trial.reject'
  | 'trial.submit_batch'
  | 'trial.lock_assignments'
  | 'trial.notify_fda'
  | 'trial.disclose_report';

interface TrialAuditEvent {
  id: string;
  actorPortalId: PortalId;
  action: TrialAuditAction;
  entityId: string;
  entityType: 'trial';
  createdAt: string;
}

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
  const trialPatients = ref<TrialPatientsByTrial>(structuredClone(seedTrialPatients));
  const assignments = ref<Record<string, TrialAssignmentMap>>(structuredClone(seedAssignments));
  const auditLog = ref<TrialAuditEvent[]>([]);
  const currentTrialId = ref<string | null>(trials.value[0]?.id ?? null);
  const sidebarSearch = ref('');
  const sidebarPage = ref(1);
  const showingArchived = ref(false);

  const currentTrial = computed(() => trials.value.find((trial) => trial.id === currentTrialId.value) ?? null);
  const filteredTrials = computed(() => {
    const query = sidebarSearch.value.trim().toLowerCase();
    return trials.value
      .filter((trial) => Boolean(trial.archived) === showingArchived.value)
      .filter((trial) => {
        if (!query) return true;
        return [trial.name, trial.id, trial.drug, trial.condition, trial.statusLabel ?? trialStatusLabel(trial)].some((value) =>
          String(value).toLowerCase().includes(query),
        );
      });
  });
  const pageCount = computed(() => Math.max(1, Math.ceil(filteredTrials.value.length / SIDEBAR_PAGE_SIZE)));
  const visibleTrials = computed(() =>
    filteredTrials.value.slice(
      (sidebarPage.value - 1) * SIDEBAR_PAGE_SIZE,
      sidebarPage.value * SIDEBAR_PAGE_SIZE,
    ),
  );

  function selectTrial(id: string) {
    currentTrialId.value = id;
    const trial = trials.value.find((item) => item.id === id);
    showingArchived.value = Boolean(trial?.archived);
  }

  function setSearch(value: string) {
    sidebarSearch.value = value;
    sidebarPage.value = 1;
  }

  function setArchiveFilter(value: boolean) {
    showingArchived.value = value;
    sidebarPage.value = 1;
  }

  function changePage(delta: number) {
    sidebarPage.value = Math.min(pageCount.value, Math.max(1, sidebarPage.value + delta));
  }

  function enrollmentsFor(trialId: string) {
    return trialPatients.value[trialId] ?? {};
  }

  function assignmentsFor(trialId: string) {
    return assignments.value[trialId] ?? {};
  }

  function enrollPatient(trialId: string, patientId: string, eligible: boolean) {
    const trial = trials.value.find((item) => item.id === trialId);
    if (trial?.status === 'rejected') return false;
    if (!trialPatients.value[trialId]) trialPatients.value[trialId] = {};
    trialPatients.value[trialId][patientId] = trialPatients.value[trialId][patientId] ?? {
      eligible,
      doses: 0,
      appointments: [],
    };
    trialPatients.value[trialId][patientId].eligible = eligible;
    return true;
  }

  function recordAudit(actorPortalId: PortalId, action: TrialAuditAction, entityId: string) {
    auditLog.value.push({
      id: crypto.randomUUID(),
      actorPortalId,
      action,
      entityId,
      entityType: 'trial',
      createdAt: new Date().toISOString(),
    });
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
      created: new Date().toISOString().slice(0, 10),
      approvals: { jh: 'blocked', fda: 'pending' },
      batchSubmitted: false,
      assignmentsLocked: false,
      notifiedFDA: false,
      disclosed: false,
      treatmentPct: 50,
      eligibility: null,
      dosesPerPatient: draft.dosesPerPatient,
      description: draft.description || 'No description provided.',
    };
    trial.statusLabel = trialStatusLabel(trial);
    trials.value.push(trial);
    trialPatients.value[trial.id] = {};
    assignments.value[trial.id] = {};
    currentTrialId.value = trial.id;
    showingArchived.value = false;
    return trial;
  }

  function approveTrial(trialId: string, portalId: PortalId, eligibility?: TrialEligibility) {
    const trial = trials.value.find((item) => item.id === trialId);
    if (!trial || trial.status === 'rejected') return false;
    if (portalId === 'jh-admin' && !Object.keys(enrollmentsFor(trialId)).length) return false;

    if (portalId === 'fda' && trial.approvals.fda === 'pending') {
      trial.approvals.fda = 'approved';
      trial.eligibility = eligibility ?? trial.eligibility ?? { includeIcd: [], excludeIcd: [], minAge: 18, incompatMeds: [] };
      if (trial.approvals.jh === 'blocked') trial.approvals.jh = 'pending';
    } else if (portalId === 'jh-admin' && trial.approvals.jh === 'pending') {
      trial.approvals.jh = 'approved';
    } else {
      return false;
    }

    if (trial.approvals.jh === 'approved' && trial.approvals.fda === 'approved') {
      trial.status = 'active';
    }

    trial.statusLabel = trialStatusLabel(trial);
    recordAudit(portalId, 'trial.approve', trialId);
    return true;
  }

  function rejectTrial(trialId: string, portalId: PortalId) {
    const trial = trials.value.find((item) => item.id === trialId);
    if (!trial || trial.status === 'rejected') return false;

    if (portalId === 'fda' && trial.approvals.fda === 'pending') {
      trial.approvals.fda = 'rejected';
    } else if (portalId === 'jh-admin' && trial.approvals.jh === 'pending') {
      trial.approvals.jh = 'rejected';
    } else {
      return false;
    }

    trial.status = 'rejected';
    trial.statusLabel = trialStatusLabel(trial);
    recordAudit(portalId, 'trial.reject', trialId);
    return true;
  }

  function submitBatch(
    trialId: string,
    draft: {
      batchRef: string;
      dosesPerPatient: number;
      treatmentPct: number;
      manufactureDate?: string;
      lotNumber?: string;
      shippingNotes?: string;
    },
    actorPortalId: PortalId = 'bavaria',
  ) {
    const trial = trials.value.find((item) => item.id === trialId);
    if (!trial || trial.status === 'rejected') return false;

    trial.batchSubmitted = true;
    trial.batchRef = draft.batchRef;
    trial.dosesPerPatient = draft.dosesPerPatient;
    trial.treatmentPct = draft.treatmentPct;
    trial.manufactureDate = draft.manufactureDate;
    trial.lotNumber = draft.lotNumber;
    trial.shippingNotes = draft.shippingNotes;
    trial.assignmentsLocked = false;
    trial.statusLabel = trialStatusLabel(trial);
    assignments.value[trialId] = {};
    recordAudit(actorPortalId, 'trial.submit_batch', trialId);
    return true;
  }

  function saveAssignments(trialId: string, draft: TrialAssignmentMap, actorPortalId: PortalId = 'fda') {
    const trial = trials.value.find((item) => item.id === trialId);
    if (!trial || trial.status === 'rejected') return false;

    assignments.value[trialId] = draft;
    trial.assignmentsLocked = true;
    trial.statusLabel = trialStatusLabel(trial);
    recordAudit(actorPortalId, 'trial.lock_assignments', trialId);
    return true;
  }

  function notifyFda(trialId: string, actorPortalId: PortalId = 'jh-admin') {
    const trial = trials.value.find((item) => item.id === trialId);
    if (!trial || trial.status === 'rejected') return false;

    trial.notifiedFDA = true;
    trial.statusLabel = trialStatusLabel(trial);
    recordAudit(actorPortalId, 'trial.notify_fda', trialId);
    return true;
  }

  function discloseTrial(trialId: string, actorPortalId: PortalId = 'fda') {
    const trial = trials.value.find((item) => item.id === trialId);
    if (!trial || trial.status === 'rejected') return false;

    trial.disclosed = true;
    trial.status = 'complete';
    trial.statusLabel = trialStatusLabel(trial);
    recordAudit(actorPortalId, 'trial.disclose_report', trialId);
    return true;
  }

  function toggleArchive(trialId = currentTrialId.value) {
    const trial = trials.value.find((item) => item.id === trialId);
    if (!trial) return false;

    trial.archived = !trial.archived;
    showingArchived.value = trial.archived;
    return true;
  }

  function deleteTrial(trialId = currentTrialId.value) {
    const index = trials.value.findIndex((item) => item.id === trialId);
    if (index < 0) return false;

    const deletedTrial = trials.value[index];
    trials.value.splice(index, 1);

    if (currentTrialId.value === trialId) {
      const matchingTabTrial = trials.value.find((trial) => trial.archived === showingArchived.value);
      currentTrialId.value = matchingTabTrial?.id ?? trials.value[0]?.id ?? null;
      if (!matchingTabTrial && trials.value[0]) showingArchived.value = Boolean(trials.value[0].archived);
    }

    if (!trials.value.some((trial) => trial.archived === showingArchived.value) && trials.value.length) {
      showingArchived.value = Boolean(trials.value[0].archived);
    }

    return deletedTrial;
  }

  return {
    trials,
    trialPatients,
    assignments,
    auditLog,
    currentTrialId,
    currentTrial,
    sidebarSearch,
    sidebarPage,
    showingArchived,
    filteredTrials,
    visibleTrials,
    pageCount,
    selectTrial,
    setSearch,
    setArchiveFilter,
    changePage,
    enrollmentsFor,
    assignmentsFor,
    enrollPatient,
    createTrial,
    approveTrial,
    rejectTrial,
    submitBatch,
    saveAssignments,
    notifyFda,
    discloseTrial,
    toggleArchive,
    deleteTrial,
  };
});
