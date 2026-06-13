# Jane Hopkins Doctor Guide

## Role Summary

Jane Hopkins Doctor is the clinical workflow role for patient care during an active blinded trial.

| Field | Value |
|---|---|
| Portal ID | `jh-doctor` |
| Demo user | Dr. Sarah Chen |
| Organization | Jane Hopkins Hospital |
| Main responsibility | Manage patient records, appointments, dose administrations, and clinical observations. |

## What This Role Can See

- Active assigned trials.
- Completed trials after FDA disclosure and Jane Hopkins notification.
- Full patient PII, including name, DOB, address, insurance ID, and clinical fields.
- Patient eligibility status, appointment history, dose progress, and adverse events.
- Final report data after FDA disclosure.

## What This Role Cannot See

- Bavaria/placebo treatment assignment before FDA disclosure.
- Pending trials that are not ready for doctor workflow.
- Rejected trials beyond limited visible states exposed by the application.
- FDA-only assignment and disclosure controls.
- Bavaria batch submission controls.

## Main Actions

| Action | When It Is Available | Result |
|---|---|---|
| View patients | Active trial or disclosed completed trial | Displays full Jane Hopkins patient table. |
| Add patient | Patient entry is enabled for the trial state | Creates a patient and enrolls them in the trial workflow. |
| Edit patient | Existing patient selected | Updates patient demographics or clinical fields. |
| Import CSV | Patient entry is enabled | Creates or updates patients in bulk and enrolls valid rows. |
| Create appointment | Active trial, eligible patient | Adds a clinical visit record. |
| Record dose | Appointment type is `Dose Administration` | Increments patient dose count up to the trial target. |
| View report | Trial disclosed | Shows final report with Jane Hopkins PII visibility. |

## Workflow: Import Patients from CSV

1. Log in as Jane Hopkins Doctor.
2. Open a trial where patient entry is available.
3. Open the patient CSV upload modal.
4. Download the template if needed.
5. Upload a CSV containing patient fields such as patient ID, name, DOB, ICD codes, blood type, medications, allergy, vitals, address, insurance ID, and employment.
6. Review row validation:
   - Missing patient ID is rejected.
   - Missing name is rejected.
   - Missing DOB is rejected.
7. Review eligibility results calculated from the current trial criteria.
8. Confirm import.
9. The system upserts valid patients and enrolls them in the selected trial.

## Workflow: Create or Edit a Patient

1. Open the patients tab.
2. Select an existing patient or create a new patient.
3. Enter demographics, ICD codes, medication notes, allergy notes, vitals, and PII fields.
4. Save the form.
5. The patient store creates or updates the record.
6. Eligibility is recalculated when the patient is enrolled in a trial.

## Workflow: Log an Appointment

1. Open an active trial with locked FDA assignments.
2. Select an eligible patient.
3. Open the appointment form.
4. Enter appointment date, optional time, appointment type, blood-test level, adverse events, and notes.
5. Submit the appointment.
6. The system adds the appointment to the patient's trial enrollment.

## Workflow: Record a Dose

1. Follow the appointment workflow.
2. Set appointment type to `Dose Administration`.
3. Submit the appointment.
4. The appointment is saved with `dose = true`.
5. The enrollment dose count increments if the patient has not already reached `dosesPerPatient`.
6. Dose tracker views update to show the new progress.

## Privacy and Blinding Rules

- Patient PII is visible to Jane Hopkins Doctor because this role performs clinical care.
- Treatment assignment remains hidden until FDA final disclosure.
- Dose and appointment data can be entered without exposing whether the patient is receiving Bavaria drug or placebo.
- Rejected trials block appointment and dose progression.

## Related Source Files

| Area | Source |
|---|---|
| Patient state | `src/stores/patients.store.ts` |
| Trial enrollment and appointments | `src/stores/trials.store.ts` |
| Patient eligibility | `src/composables/patients/usePatients.ts` |
| CSV import | `src/composables/patients/usePatientCsvUpload.ts` |
| Appointment logic | `src/composables/appointments/useAppointments.ts` |
| Patient UI | `src/components/PatientTables`, `src/components/Modals/Patients` |
