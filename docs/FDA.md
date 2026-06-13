# FDA Admin Guide

## Role Summary

FDA Admin is the regulatory workflow role for trial review, eligibility criteria, treatment assignment, final disclosure, and report review.

| Field | Value |
|---|---|
| Portal ID | `fda` |
| Demo user | Michael Torres |
| Organization | FDA Administration |
| Main responsibility | Regulate trial progression and control blinded treatment assignments. |

## What This Role Can See

- Pending, active, rejected, and complete trials.
- Trial approval state and lifecycle status.
- Eligibility criteria.
- Anonymized patient records.
- Treatment assignments before disclosure.
- Final reports after disclosure.

## What This Role Cannot See

- Jane Hopkins patient PII in the current demo UI.
- Jane Hopkins appointment-entry controls.
- Bavaria trial creation controls.
- Bavaria batch form submission controls.

## Main Actions

| Action | When It Is Available | Result |
|---|---|---|
| Approve FDA review | Trial pending FDA approval | Sets FDA approval to `approved` and enables JH review. |
| Reject FDA review | Trial pending FDA approval | Sets trial status to `rejected`. |
| Define eligibility | During FDA approval | Saves inclusion ICDs, exclusion ICDs, minimum age, and incompatible medications. |
| Review anonymized patients | Active/current trial states | Shows masked patient identifiers and trial progress. |
| Generate assignments | Bavaria batch submitted | Creates Bavaria/placebo assignment draft. |
| Lock assignments | Every eligible patient has an assignment | Sets trial status to `active`. |
| Publish disclosure | JH notified FDA and all eligible patients are dosed | Sets trial status to `complete` and exposes reports. |
| View report | Trial disclosed | Shows final anonymized report views. |

## Workflow: Approve a Trial

1. Log in as FDA Admin.
2. Open a trial with status `pending-approval` and FDA approval `pending`.
3. Review trial metadata.
4. Define eligibility criteria if needed:
   - Required ICD codes.
   - Excluded ICD codes.
   - Minimum age.
   - Incompatible medications.
5. Approve the trial.
6. The system sets `approvals.fda` to `approved`.
7. If JH approval was blocked, the system sets `approvals.jh` to `pending`.

## Workflow: Reject a Trial

1. Open a trial pending FDA approval.
2. Reject the trial.
3. The system sets `approvals.fda` to `rejected`.
4. The trial status becomes `rejected`.
5. The rejected trial cannot continue through batch, assignment, dosing, notification, or disclosure.

## Workflow: Assign Treatment Groups

1. Open a trial where Bavaria has submitted a batch.
2. Review eligible anonymized patients.
3. Generate or review assignments.
4. Confirm every eligible patient has exactly one assignment.
5. Save assignments.
6. The system stores the assignment map, sets `assignmentsLocked` to true, and sets trial status to `active`.

## Workflow: Publish Final Disclosure

1. Open the disclosure tab.
2. Confirm assignments are locked.
3. Confirm Jane Hopkins has notified FDA.
4. Confirm all eligible patients completed dosing.
5. Publish disclosure.
6. The system sets `disclosed` to true and trial status to `complete`.
7. Report tabs become visible to Jane Hopkins, FDA, and Bavaria roles.

## Privacy and Blinding Rules

- FDA controls treatment assignment and final disclosure.
- FDA sees anonymized patient display data in the current demo.
- Jane Hopkins and Bavaria do not see Bavaria/placebo assignment before disclosure.
- Disclosure is blocked until assignment, dosing, and notification requirements are complete.

## Related Source Files

| Area | Source |
|---|---|
| Approval, assignment, and disclosure state | `src/stores/trials.store.ts` |
| Assignment helper | `src/composables/assignments/useAssignments.ts` |
| Trial status helper | `src/composables/trials/useTrialStatus.ts` |
| Privacy display helper | `src/utils/privacy.ts` |
| FDA assignment modal | `src/components/Modals/Regulatory/FdaAssignmentModal.vue` |
| Disclosure modal | `src/components/Modals/Regulatory/DiscloseTrialModal.vue` |
