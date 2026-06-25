# Data Dictionary

## Overview

This dictionary documents the workflow data used by the Pharmatrial frontend and live backend snapshot. In live mode, the backend is the source of truth and the frontend hydrates Pinia stores from `/workflow/snapshot`. In fallback mode, the same data shapes are loaded from seeded TypeScript files in `src/data` so the workflow remains usable without a server.

## Patient Data

Source type: `Patient`

| Field | Type | Required | Description | Privacy |
|---|---|---:|---|---|
| `id` | `string` | Yes | Patient UUID-style identifier used across enrollments and assignments. | Visible to all authorized trial roles. |
| `name` | `string` | Yes | Patient full name. | PII; Jane Hopkins only. |
| `dob` | `string` | Yes | Date of birth. | PII; Jane Hopkins only. |
| `icdCodes` | `string[]` | Yes | ICD diagnosis codes used for eligibility checks. | Clinical data. |
| `bloodType` | `string` | Yes | Blood type. | Clinical data. |
| `bp` | `string` | No | Blood pressure value. | Clinical data. |
| `oxygen` | `number` | No | Oxygen saturation value. | Clinical data. |
| `meds` | `string` | No | Medication notes, used for incompatible medication checks. | Clinical data. |
| `allergy` | `string` | No | Allergy notes. | Clinical data. |
| `height` | `number` | No | Height value. | Clinical data. |
| `weight` | `number` | No | Weight value. | Clinical data. |
| `address` | `string` | No | Patient address. | PII; Jane Hopkins only. |
| `insuranceId` | `string` | No | Insurance identifier. | PII; Jane Hopkins only. |
| `employment` | `string` | No | Employment status or note. | Demographic/PII. |
| `temperature` | `string` | No | Temperature value. | Clinical data. |

## Trial Data

Source type: `Trial`

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | `string` | Yes | Trial identifier such as `TRL-2023-001`. |
| `name` | `string` | Yes | Human-readable trial name. |
| `drug` | `string` | Yes | Drug or regimen under study. |
| `phase` | `string` | Yes | Trial phase label. |
| `condition` | `string` | Yes | Target condition. |
| `start` | `string` | Yes | Trial start date. |
| `end` | `string` | Yes | Trial end date. |
| `enrollment` | `number` | Yes | Target enrollment count. |
| `status` | `TrialStatus` | Yes | Main lifecycle status. |
| `statusLabel` | `string` | No | Derived display label for current workflow state. |
| `archived` | `boolean` | Yes | Whether trial is archived in the UI. |
| `created` | `string` | No | Trial creation date. |
| `approvals` | `TrialApprovals` | Yes | FDA and Jane Hopkins approval states. |
| `batchSubmitted` | `boolean` | Yes | Whether Bavaria submitted drug batch metadata. |
| `assignmentsLocked` | `boolean` | Yes | Whether FDA locked assignment map. |
| `notifiedFDA` | `boolean` | Yes | Whether Jane Hopkins notified FDA after dosing completion. |
| `disclosed` | `boolean` | Yes | Whether FDA published final disclosure. |
| `batchRef` | `string` | No | Bavaria batch reference. |
| `treatmentPct` | `number` | No | Percentage of eligible patients assigned to Bavaria treatment. |
| `manufactureDate` | `string` | No | Batch manufacture date. |
| `lotNumber` | `string` | No | Batch lot number. |
| `shippingNotes` | `string` | No | Shipment or handling notes. |
| `dosesPerPatient` | `number` | Yes | Required dose administrations per eligible patient. |
| `description` | `string` | No | Trial description. |
| `eligibility` | `TrialEligibility \| null` | No | FDA-defined eligibility rules. |

## Trial Eligibility Data

Source type: `TrialEligibility`

| Field | Type | Description |
|---|---|---|
| `includeIcd` | `string[]` | Required ICD code fragments for inclusion. |
| `excludeIcd` | `string[]` | ICD code fragments that exclude a patient. |
| `minAge` | `number` | Minimum patient age. |
| `incompatMeds` | `string[]` | Medication text fragments that exclude a patient. |

## Trial Approval Data

Source type: `TrialApprovals`

| Field | Type | Description |
|---|---|---|
| `fda` | `ApprovalStatus` | FDA approval state. |
| `jh` | `ApprovalStatus` | Jane Hopkins approval state. |

## Trial Enrollment Data

Source type: `TrialEnrollment`

| Field | Type | Description |
|---|---|---|
| `eligible` | `boolean` | Whether the patient is eligible for the trial. |
| `doses` | `number` | Count of dose administrations logged for this trial. |
| `appointments` | `Appointment[]` | Appointment history for this patient in this trial. |

Enrollment maps:

| Type | Shape | Description |
|---|---|---|
| `TrialEnrollmentMap` | `Record<string, TrialEnrollment>` | Patient ID to enrollment. |
| `TrialPatientsByTrial` | `Record<string, TrialEnrollmentMap>` | Trial ID to patient enrollment map. |

## Appointment Data

Source types: `Appointment`, `AppointmentDraft`

| Field | Type | Required | Description |
|---|---|---:|---|
| `date` | `string` | Yes | Appointment date. |
| `time` | `string` | No | Appointment time. |
| `type` | `AppointmentType` | Yes | Appointment category. |
| `dose` | `boolean` | Appointment only | True when appointment type is `Dose Administration`. |
| `bloodTestLevel` | `number \| null` | Yes | Lab value used for report outcome calculations. |
| `adverseEvents` | `string[]` | Yes | List of adverse events recorded during the visit. |
| `note` | `string` | Yes | Clinical note. Defaults to `No notes.` when empty. |

## Assignment Data

Source type: `TrialAssignment`

| Field | Type | Description |
|---|---|---|
| `patientId` | `string` | Patient ID assigned by FDA. |
| `drug` | `AssignedDrug` | Assigned group: Bavaria drug or placebo. |
| `trackingId` | `string` | FDA assignment tracking identifier. |

Assignment map:

| Type | Shape | Description |
|---|---|---|
| `TrialAssignmentMap` | `Record<string, TrialAssignment>` | Patient ID to assignment. |

## Report Data

Source type: `ReportRow`

| Field | Type | Description |
|---|---|---|
| `patientId` | `string` | Patient identifier. |
| `group` | `ReportGroup` | `treatment` or `placebo`. |
| `assignedDrug` | `AssignedDrug \| null` | Bavaria or placebo assignment. |
| `startValue` | `number \| null` | First valid blood-test value. |
| `endValue` | `number \| null` | Last valid blood-test value. |
| `reductionPct` | `number \| null` | Percentage reduction from start to end. |
| `reductionLabel` | `string` | Human-readable result label. |
| `adverseEvents` | `string[]` | Flattened adverse events across appointments. |

## Portal and Auth Data

Source types: `Portal`, auth store state

| Field | Type | Description |
|---|---|---|
| `id` | `PortalId` | Portal identifier. |
| `label` | `string` | Portal display name. |
| `role` | `string` | Role title. |
| `color` | `string` | Theme color. |
| `tint` | `string` | Theme tint color. |
| `abbr` | `string` | Short role abbreviation. |
| `user` | `string` | Demo user name. |
| `logo` | `string` | Logo asset path/import. |
| `selectedPortalId` | `PortalId` | Currently selected login portal. |
| `loggedIn` | `boolean` | Whether the demo user is authenticated. |
| `error` | `string \| null` | Current login error message. |

## Audit Data

Source type: internal `TrialAuditEvent`

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Generated audit event ID. |
| `actorPortalId` | `PortalId` | Portal that performed the action. |
| `action` | `TrialAuditAction` | Workflow event name. |
| `entityId` | `string` | Trial ID. |
| `entityType` | `"trial"` | Audited entity type. |
| `createdAt` | `string` | ISO timestamp. |

In fallback mode, audit events are browser-local. In live mode, audit events should be persisted by the backend as append-only records.

## Enum and State Values

### `PortalId`

| Value | Meaning |
|---|---|
| `jh-doctor` | Jane Hopkins Doctor. |
| `jh-admin` | Jane Hopkins Admin. |
| `fda` | FDA Admin. |
| `bavaria` | Bavaria Admin. |

### `TrialStatus`

| Value | Meaning |
|---|---|
| `pending-approval` | Trial is in approval, batch, or assignment preparation before becoming active. |
| `active` | Trial has locked assignments and can proceed through dosing. |
| `rejected` | Trial was rejected and cannot progress. |
| `complete` | FDA disclosure is published and trial reporting is available. |

### `ApprovalStatus`

| Value | Meaning |
|---|---|
| `approved` | Review is approved. |
| `pending` | Review is waiting for action. |
| `rejected` | Review rejected the trial. |
| `blocked` | Review is not available until a prior step completes. |

### `TrialTab`

| Value | Purpose |
|---|---|
| `overview` | Trial summary and lifecycle. |
| `patients` | Patient or anonymized patient views. |
| `appointments` | JH Doctor appointment workflow. |
| `doses` | Dose tracking. |
| `notify` | JH FDA notification. |
| `assignments` | FDA assignment workflow. |
| `disclose` | FDA final disclosure workflow. |
| `batch` | Bavaria batch submission. |
| `report` | Final post-disclosure report. |

### `AppointmentType`

| Value | Meaning |
|---|---|
| `Dose Administration` | Visit records a dose and increments dose count. |
| `Follow-up Evaluation` | Follow-up visit without automatic dose increment. |
| `Initial Screening` | Screening visit. |
| `Post-Trial Assessment` | Post-trial evaluation. |

### Assignment Drug Values

| Value | Meaning |
|---|---|
| `bavaria` | Patient assigned to Bavaria drug treatment group. |
| `placebo` | Patient assigned to placebo group. |

### Report Groups

| Value | Meaning |
|---|---|
| `treatment` | Report row belongs to treatment group. |
| `placebo` | Report row belongs to placebo group. |

### Audit Actions

| Value | Trigger |
|---|---|
| `trial.approve` | FDA or JH approval succeeds. |
| `trial.reject` | FDA or JH rejection succeeds. |
| `trial.submit_batch` | Bavaria batch submission succeeds. |
| `trial.lock_assignments` | FDA assignment locking succeeds. |
| `trial.notify_fda` | JH FDA notification succeeds. |
| `trial.disclose_report` | FDA final disclosure succeeds. |

## Data Lifecycle Events

| Order | Event | Actor | State/Data Change |
|---:|---|---|---|
| 1 | Trial created | Bavaria Admin | New trial added pending FDA & JH approval. JH only sees trial after FDA approval. |
| 2 | FDA approval or rejection | FDA Admin | FDA approval becomes `approved` or `rejected`; rejected trials stop. |
| 3 | Eligibility criteria saved | FDA Admin | Trial eligibility rules are saved during FDA approval. |
| 4 | Patients created/imported | JH Doctor/Admin | Patient records are added or updated. |
| 5 | Patients enrolled and eligibility checked | System/JH workflow | Enrollment records are created with `eligible` result. |
| 6 | JH approval or rejection | JH Admin | JH approval becomes `approved` or `rejected`; rejected trials stop. |
| 7 | Bavaria batch submitted | Bavaria Admin | Batch metadata is stored and drugs shipped to FDA for assignments. |
| 8 | FDA assignments generated and locked | FDA Admin | Assignment mapping is edited and saved, `assignmentsLocked` becomes true, trial becomes active. |
| 9 | Appointment logged | JH Doctor | Appointment is appended to enrolled patient. |
| 10 | Dose count incremented | System | Dose count increments once for all `Dose Administration` type appointments. |
| 11 | All eligible patients dosed | System | Completion helper returns true when every eligible patient meets `dosesPerPatient`. |
| 12 | JH notifies FDA | JH Admin | `notifiedFDA` becomes true. |
| 13 | FDA publishes disclosure | FDA Admin | `disclosed` becomes true and trial status becomes `complete`. |
| 14 | Report rows generated | System | Report data is derived from appointments, enrollments, and assignments. |
| 15 | Trial archived | Bavaria Admin | `archived` toggles for complete or rejected trials. |
| 16 | Archived rejected trial deleted | Bavaria Admin | Rejected archived trial is removed from demo state. |

## Live Backend vs Seeded Fallback Data Handling

| Topic | Live Backend Mode | Seeded Fallback Mode |
|---|---|---|
| Persistence | Database-backed API is the source of truth. | Browser-local Pinia state initialized from `src/data`. |
| Authentication | `POST /auth/login` returns a bearer token for API requests. | Demo credentials are validated in `auth.store.ts`. |
| Authorization | Backend should enforce RBAC on every workflow endpoint. | Frontend role helpers constrain available UI actions. |
| PII | Backend should restrict and protect PII; frontend masks FDA/Bavaria display. | Frontend masking helpers hide Jane Hopkins PII from FDA/Bavaria views. |
| Audit | Backend should persist durable append-only audit records. | Audit entries are browser-local and reset with the session. |
| Deletion | Backend should apply retention and compliance policy. | Bavaria can delete archived rejected trials from local demo state. |
| Reports | Backend snapshot may include persisted or materialized report rows. | Reports are derived in browser after disclosure. |
