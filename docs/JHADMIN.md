# Jane Hopkins Admin Guide

## Role Summary

Jane Hopkins Admin is the institutional coordination role for trial approval, enrollment review, dose completion tracking, and FDA notification.

| Field | Value |
|---|---|
| Portal ID | `jh-admin` |
| Demo user | Emily Rodriguez |
| Organization | Jane Hopkins Hospital |
| Main responsibility | Approve Jane Hopkins participation and notify FDA when dosing is complete. |

## What This Role Can See

- Pending trials awaiting Jane Hopkins review.
- Enrolled patients and eligibility status.
- Patient PII for Jane Hopkins clinical coordination.
- Dose completion status for eligible patients.
- Notification status and final reports after disclosure.

## What This Role Cannot See

- Bavaria/placebo treatment assignment before FDA disclosure.
- FDA-only treatment assignment controls.
- FDA-only final disclosure controls.
- Bavaria-only trial creation, batch submission, archive, or deletion controls.

## Main Actions

| Action | When It Is Available | Result |
|---|---|---|
| Review enrolled patients | Pending or active JH-visible trial | Shows patients and eligibility status. |
| Approve JH review | FDA approved, JH approval pending, enrolled patients exist | Sets Jane Hopkins approval to `approved`. |
| Reject JH review | JH approval pending | Sets trial status to `rejected`. |
| Monitor dose completion | Active trial with locked assignments | Shows eligible patient dose progress. |
| Notify FDA | Assignments locked and all eligible patients fully dosed | Sets `notifiedFDA` to true. |
| View report | Trial disclosed | Shows final report with Jane Hopkins PII visibility. |

## Workflow: Approve a Trial

1. Log in as Jane Hopkins Admin.
2. Open a trial with FDA approval complete and JH approval pending.
3. Review enrolled patients.
4. Confirm that at least one patient is enrolled.
5. Approve the trial.
6. The system sets `approvals.jh` to `approved`.
7. The trial becomes ready for Bavaria batch submission when FDA approval is also approved.

## Workflow: Reject a Trial

1. Open a trial with JH approval pending.
2. Review trial and enrollment information.
3. Reject the trial.
4. The system sets `approvals.jh` to `rejected`.
5. The trial status becomes `rejected`.
6. Rejected trials cannot continue to batch submission, assignment, dosing, notification, or disclosure.

## Workflow: Monitor Dose Completion

1. Open an active trial.
2. Review the dose tracker.
3. Confirm each eligible patient has reached the required dose count.
4. The system calculates completion using `dosesPerPatient`.
5. When every eligible patient is complete, the notify workflow becomes available.

## Workflow: Notify FDA

1. Open the notify tab for an active trial.
2. Confirm FDA assignments are locked.
3. Confirm all eligible patients completed required dosing.
4. Submit FDA notification.
5. The system sets `notifiedFDA` to true.
6. The trial status label changes to `Awaiting FDA Report`.
7. FDA can now publish final disclosure when disclosure prerequisites are met.

## Privacy and Blinding Rules

- Jane Hopkins Admin can see patient PII for institutional trial coordination.
- Bavaria/placebo assignment remains hidden before FDA disclosure.
- FDA notification is blocked until assignments are locked and dosing is complete.
- Jane Hopkins Admin cannot publish final disclosure.

## Related Source Files

| Area | Source |
|---|---|
| Approval and notification state | `src/stores/trials.store.ts` |
| Trial status helpers | `src/composables/trials/useTrialStatus.ts` |
| Patient and dose calculations | `src/composables/patients/usePatients.ts` |
| Notify modal | `src/components/Modals/Regulatory/NotifyFdaModal.vue` |
| Trial dose tab | `src/components/Trials/TrialDoseTrackerTab.vue` |
