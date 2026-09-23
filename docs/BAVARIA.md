# Bavaria Admin guide

Use the Bavaria portal (`bavaria`) to create trials, submit batches, and manage closed records. Sign in as Anna Keller with the [demo credentials](../README.md#demo-credentials).

## Access

Bavaria can review trial metadata, approvals, batch details, masked patient progress, and reports after disclosure. The interface hides patient names, dates of birth, addresses, insurance IDs, and treatment groups before disclosure.

## Create a trial

1. Open the create trial form.
2. Enter the name, drug, phase, condition, dates, enrollment target, dose count, and description.
3. Submit the trial for FDA review.

The app sets the trial to `pending-approval`, FDA review to `pending`, and Jane Hopkins review to `blocked`. FDA approval opens Jane Hopkins review.

## Submit a batch

**Prerequisite:** FDA and Jane Hopkins must approve the trial.

1. Open **Drug Batch**.
2. Enter the batch reference, treatment percentage, manufacture date, lot number, and shipping notes.
3. Submit the batch.

Use a treatment percentage from 10 to 90. Submission clears existing assignments and lets FDA generate new assignments.

## Review and close a trial

| Action             | Requirement                              | Result                                                                           |
| ------------------ | ---------------------------------------- | -------------------------------------------------------------------------------- |
| Monitor progress   | Select a visible trial.                  | Review status, approvals, and lifecycle steps in **Overview**.                   |
| Review results     | FDA must publish disclosure.             | Open **Report** for outcomes, group comparisons, reductions, and adverse events. |
| Archive or restore | The trial must be complete or rejected.  | Toggle archive state to move the trial between lists.                            |
| Delete             | The trial must be rejected and archived. | Remove the trial from local state and send a delete request in live mode.        |

Reports continue to mask patient names and dates of birth after disclosure.

See [Architecture](ARCHITECTURE.md) for shared privacy and persistence rules.
