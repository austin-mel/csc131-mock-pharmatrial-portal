# Bavaria Admin Guide

## Role Summary

Bavaria Admin is the pharmaceutical sponsor role for creating trial drafts, submitting batch metadata, monitoring trial progress without PII, viewing post-disclosure reports, and managing closed trial archives.

| Field | Value |
|---|---|
| Portal ID | `bavaria` |
| Demo user | Anna Keller |
| Organization | Bavaria Pharma |
| Main responsibility | Sponsor trial setup and batch workflow while respecting patient privacy. |

## What This Role Can See

- Pending, active, rejected, archived, and complete trial states.
- Trial metadata, approvals, lifecycle status, and batch status.
- Anonymized patient progress where available.
- Final reports after FDA disclosure.
- Archive state for complete and rejected trials.

## What This Role Cannot See

- Patient PII such as name, DOB, address, or insurance ID.
- Bavaria/placebo assignment before FDA disclosure.
- Jane Hopkins appointment-entry controls.
- FDA approval, assignment, and disclosure controls.
- Jane Hopkins approval and FDA notification controls.

## Main Actions

| Action | When It Is Available | Result |
|---|---|---|
| Create trial | Bavaria portal active | Creates a pending trial draft. |
| Submit batch | FDA and JH approvals are approved | Stores batch metadata and enables FDA assignments. |
| Monitor trial | Trial visible to Bavaria | Shows non-PII status and lifecycle progress. |
| View report | Trial disclosed | Shows post-disclosure report data. |
| Archive trial | Trial complete or rejected | Toggles archived state. |
| Delete archived rejected trial | Trial rejected and archived | Removes the trial from demo state. |

## Workflow: Create a Trial

1. Log in as Bavaria Admin.
2. Open the create trial modal.
3. Enter trial name, drug, phase, condition, start date, end date, enrollment target, dose count, and description.
4. Submit the trial.
5. The system creates a new trial with:
   - `status = pending-approval`
   - `approvals.fda = pending`
   - `approvals.jh = blocked`
   - `batchSubmitted = false`
   - `assignmentsLocked = false`
   - `notifiedFDA = false`
   - `disclosed = false`

## Workflow: Submit a Batch

1. Open a trial where FDA and Jane Hopkins approvals are complete.
2. Open the batch tab.
3. Enter batch reference, treatment percentage, manufacture date, lot number, and shipping notes.
4. Submit the batch.
5. The system validates treatment percentage is between 10 and 90.
6. The system stores batch fields and clears any existing assignment map.
7. FDA can now create and lock treatment assignments.

## Workflow: Monitor a Trial Without PII

1. Open the trial list.
2. Search by trial name, ID, drug, condition, or status.
3. Select a trial.
4. Review overview, lifecycle, approval, batch, and anonymized patient progress.
5. Use status labels to identify whether Bavaria action is needed.

## Workflow: View Final Report

1. Open a completed disclosed trial.
2. Open the report tab.
3. Review treatment/placebo comparison, outcome rows, reductions, and adverse events.
4. Patient identifiers remain masked according to privacy rules.

## Workflow: Archive or Delete Closed Trials

1. Open a complete or rejected trial.
2. Archive the trial if it should move out of active review.
3. For rejected archived trials only, use delete if the demo record should be removed.
4. The system selects the next visible trial after deletion.

## Privacy and Blinding Rules

- Bavaria never sees patient PII in the demo.
- Bavaria cannot see treatment assignment before FDA disclosure.
- Batch submission is blocked until both FDA and JH approvals are complete.
- Deletion is limited to archived rejected trials.

## Related Source Files

| Area | Source |
|---|---|
| Trial creation and batch state | `src/stores/trials.store.ts` |
| Batch helper | `src/composables/batches/useDrugBatch.ts` |
| Trial status helper | `src/composables/trials/useTrialStatus.ts` |
| Privacy display helper | `src/utils/privacy.ts` |
| Trial creation modal | `src/components/Modals/Trials/CreateTrialModal.vue` |
| Batch modal | `src/components/Modals/Batches/DrugBatchModal.vue` |
