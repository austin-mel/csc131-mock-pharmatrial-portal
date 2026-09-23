# FDA Administrator guide

Select **FDA Admin** (`fda`) to review trials, define eligibility, assign treatment groups, and publish disclosure. Sign in as Michael Torres with the [demo credentials](../README.md#demo-credentials).

## Access

FDA can review trial approvals, eligibility, masked patient records, treatment assignments, and reports. FDA can see treatment groups before disclosure; the interface masks patient PII.

## Approve or reject a trial

**Prerequisite:** The trial must await FDA approval.

1. Open the trial and review its metadata.
2. Set inclusion and exclusion ICD criteria, minimum age, and incompatible medications.
3. Approve or reject the trial.

Approval sets FDA review to `approved` and opens Jane Hopkins review. Rejection sets the trial to `rejected` and stops its workflow.

## Assign treatment groups

**Prerequisite:** Bavaria must submit a batch, and the trial must have at least one eligible patient.

1. Open **Assignments**, then **Randomize Assignments**.
2. Select **Randomize** and review the group split.
3. Confirm that every eligible patient has exactly one assignment.
4. Select **Lock Assignments**.

The app locks assignments and sets the trial to `active`. Jane Hopkins and Bavaria cannot view treatment groups until disclosure.

## Publish disclosure

**Prerequisites:** FDA must lock assignments, every eligible patient must complete dosing, and Jane Hopkins Admin must notify FDA.

1. Open **Disclose**.
2. Review the completion requirements and publish disclosure.
3. Open **Report** to review outcomes, group comparisons, and adverse events.

Disclosure sets the trial to `complete` and opens reports for all four portals. FDA reports continue to mask patient names and dates of birth.

See [Architecture](ARCHITECTURE.md) for shared privacy and persistence rules.
