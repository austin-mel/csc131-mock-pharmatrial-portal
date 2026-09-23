# Data dictionary

Frontend stores, seed data, and API snapshots use these types. See [Architecture](ARCHITECTURE.md) for runtime modes and the [demo walkthrough](../README.md#demo-walkthrough) for action order.

“Required” describes TypeScript fields, not form validation. Privacy labels describe frontend display rules; the backend must enforce access.

## Patient

Source: [`Patient`](../src/types/patient.ts)

| Field         | Type       | Required | Privacy                |
| ------------- | ---------- | -------: | ---------------------- |
| `id`          | `string`   |      Yes | Visible to trial roles |
| `name`        | `string`   |      Yes | PII, Jane Hopkins only |
| `dob`         | `string`   |      Yes | PII, Jane Hopkins only |
| `icdCodes`    | `string[]` |      Yes | Clinical               |
| `bloodType`   | `string`   |      Yes | Clinical               |
| `bp`          | `string`   |       No | Clinical               |
| `oxygen`      | `number`   |       No | Clinical               |
| `meds`        | `string`   |       No | Clinical               |
| `allergy`     | `string`   |       No | Clinical               |
| `height`      | `number`   |       No | Clinical               |
| `weight`      | `number`   |       No | Clinical               |
| `address`     | `string`   |       No | PII, Jane Hopkins only |
| `insuranceId` | `string`   |       No | PII, Jane Hopkins only |
| `employment`  | `string`   |       No | Demographic            |
| `temperature` | `string`   |       No | Clinical               |

## Trial

Source: [`Trial`](../src/types/trial.ts)

| Field               | Type                         | Required |
| ------------------- | ---------------------------- | -------: |
| `id`                | `string`                     |      Yes |
| `name`              | `string`                     |      Yes |
| `drug`              | `string`                     |      Yes |
| `phase`             | `string`                     |      Yes |
| `condition`         | `string`                     |      Yes |
| `start`             | `string`                     |      Yes |
| `end`               | `string`                     |      Yes |
| `enrollment`        | `number`                     |      Yes |
| `status`            | `TrialStatus`                |      Yes |
| `statusLabel`       | `string`                     |       No |
| `archived`          | `boolean`                    |      Yes |
| `created`           | `string`                     |       No |
| `approvals`         | `TrialApprovals`             |      Yes |
| `batchSubmitted`    | `boolean`                    |      Yes |
| `assignmentsLocked` | `boolean`                    |      Yes |
| `notifiedFDA`       | `boolean`                    |      Yes |
| `disclosed`         | `boolean`                    |      Yes |
| `batchRef`          | `string`                     |       No |
| `treatmentPct`      | `number`                     |       No |
| `manufactureDate`   | `string`                     |       No |
| `lotNumber`         | `string`                     |       No |
| `shippingNotes`     | `string`                     |       No |
| `dosesPerPatient`   | `number`                     |      Yes |
| `description`       | `string`                     |       No |
| `eligibility`       | `TrialEligibility` or `null` |       No |

## Trial eligibility

Source: [`TrialEligibility`](../src/types/trial.ts)

| Field          | Type       | Meaning                                                    |
| -------------- | ---------- | ---------------------------------------------------------- |
| `includeIcd`   | `string[]` | Match at least one fragment when the list contains values. |
| `excludeIcd`   | `string[]` | Reject matches to any fragment.                            |
| `minAge`       | `number`   | Minimum patient age                                        |
| `incompatMeds` | `string[]` | Reject matches in medication text.                         |

## Approvals

Source: [`TrialApprovals`](../src/types/approval.ts)

| Field | Type             | Meaning                     |
| ----- | ---------------- | --------------------------- |
| `fda` | `ApprovalStatus` | FDA approval state          |
| `jh`  | `ApprovalStatus` | Jane Hopkins approval state |

## Enrollment

Source: [`TrialEnrollment`](../src/types/trial.ts)

| Field          | Type            | Meaning                           |
| -------------- | --------------- | --------------------------------- |
| `eligible`     | `boolean`       | Patient eligibility for the trial |
| `doses`        | `number`        | Dose count for this trial         |
| `appointments` | `Appointment[]` | Appointment history               |

| Type                   | Shape                      |
| ---------------------- | -------------------------- |
| `TrialEnrollmentMap`   | Patient ID to enrollment   |
| `TrialPatientsByTrial` | Trial ID to enrollment map |

## Appointment

Source: [`Appointment` and `AppointmentDraft`](../src/types/appointment.ts)

| Field            | Type               |                Required |
| ---------------- | ------------------ | ----------------------: |
| `date`           | `string`           |                     Yes |
| `time`           | `string`           |                      No |
| `type`           | `AppointmentType`  |                     Yes |
| `dose`           | `boolean`          | Saved appointments only |
| `bloodTestLevel` | `number` or `null` |                     Yes |
| `adverseEvents`  | `string[]`         |                     Yes |
| `note`           | `string`           |                     Yes |

## Assignment

Source: [`TrialAssignment`](../src/types/assignment.ts)

| Field        | Type           | Meaning                    |
| ------------ | -------------- | -------------------------- |
| `patientId`  | `string`       | Assigned patient ID        |
| `drug`       | `AssignedDrug` | Treatment or placebo group |
| `trackingId` | `string`       | FDA tracking identifier    |

`TrialAssignmentMap` maps patient ID to assignment.

## Report

Source: [`ReportRow`](../src/types/report.ts)

| Field            | Type                     |
| ---------------- | ------------------------ |
| `patientId`      | `string`                 |
| `group`          | `ReportGroup`            |
| `assignedDrug`   | `AssignedDrug` or `null` |
| `startValue`     | `number` or `null`       |
| `endValue`       | `number` or `null`       |
| `reductionPct`   | `number` or `null`       |
| `reductionLabel` | `string`                 |
| `adverseEvents`  | `string[]`               |

## Portal and auth

Source: [`Portal`](../src/types/portal.ts)

| Field   | Type       |
| ------- | ---------- |
| `id`    | `PortalId` |
| `label` | `string`   |
| `role`  | `string`   |
| `color` | `string`   |
| `tint`  | `string`   |
| `abbr`  | `string`   |
| `user`  | `string`   |
| `logo`  | `string`   |

The [auth store](../src/stores/auth.store.ts) tracks these state values:

| Field              | Type               |
| ------------------ | ------------------ |
| `selectedPortalId` | `PortalId`         |
| `loggedIn`         | `boolean`          |
| `error`            | `string` or `null` |

## Audit event

Source: [`TrialAuditEvent`](../src/stores/trials.store.ts)

| Field           | Type               |
| --------------- | ------------------ |
| `id`            | `string`           |
| `actorPortalId` | `PortalId`         |
| `action`        | `TrialAuditAction` |
| `entityId`      | `string`           |
| `entityType`    | `"trial"`          |
| `createdAt`     | `string`           |

The trial store holds audit events in memory. A backend must persist its own audit records.

## State values

### `PortalId`

| Value       | Meaning             |
| ----------- | ------------------- |
| `jh-doctor` | Jane Hopkins Doctor |
| `jh-admin`  | Jane Hopkins Admin  |
| `fda`       | FDA Administrator   |
| `bavaria`   | Bavaria Admin       |

### `TrialStatus`

| Value              | Meaning                                |
| ------------------ | -------------------------------------- |
| `pending-approval` | Trial has not reached active dosing    |
| `active`           | FDA locked assignments to start dosing |
| `rejected`         | Trial cannot progress                  |
| `complete`         | FDA disclosed results                  |

### `ApprovalStatus`

| Value      | Meaning                  |
| ---------- | ------------------------ |
| `approved` | Approved                 |
| `pending`  | Waiting for action       |
| `rejected` | Rejected                 |
| `blocked`  | Waiting for a prior step |

### `TrialTab`

| Value          | Purpose                                  |
| -------------- | ---------------------------------------- |
| `overview`     | Trial summary and lifecycle              |
| `patients`     | Patient or masked patient views          |
| `appointments` | Jane Hopkins Doctor appointment workflow |
| `doses`        | Dose tracking                            |
| `notify`       | Jane Hopkins FDA notification            |
| `assignments`  | FDA assignment workflow                  |
| `disclose`     | FDA disclosure workflow                  |
| `batch`        | Bavaria batch workflow                   |
| `report`       | Final report                             |

### `AppointmentType`

`Dose Administration`, `Follow-up Evaluation`, `Initial Screening`, `Post-Trial Assessment`.

### `AssignedDrug`

`bavaria`, `placebo`.

### `ReportGroup`

`treatment`, `placebo`.

### `TrialAuditAction`

`trial.approve`, `trial.reject`, `trial.submit_batch`, `trial.lock_assignments`, `trial.notify_fda`, `trial.disclose_report`.
