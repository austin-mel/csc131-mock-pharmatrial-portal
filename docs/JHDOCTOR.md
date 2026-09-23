# Jane Hopkins Doctor guide

Use the Jane Hopkins Doctor portal (`jh-doctor`) to update patient records, log appointments, and record doses. Sign in as Dr. Sarah Chen with the [demo credentials](../README.md#demo-credentials).

## Access

Doctors can view active trials and completed trials after FDA notification and disclosure. They can view patient PII, appointment history, dose progress, adverse events, and final reports. The interface hides treatment groups until disclosure.

The current interface assigns patient creation and CSV import to [Jane Hopkins Admin](JHADMIN.md#enroll-patients). Doctors cannot open pending trials, and active trials hide their enrollment controls.

## Update a patient

1. Open **Patients** on an active trial.
2. Select a patient's edit action.
3. Update demographics, ICD codes, medications, allergies, vitals, or PII fields.
4. Save the record.

Completed trials provide read-only patient records.

## Log an appointment or dose

**Prerequisites:** The trial must be active, FDA must lock assignments, and the patient must be eligible.

1. Open **Appointments**, select **Log Appointment**, and choose the patient.
2. Enter the date, optional time, appointment type, blood test level, adverse events, and notes.
3. Choose **Dose Administration** to record a dose, or select another visit type.
4. Submit the appointment and review **Dose Tracker**.

The app saves each appointment. For dose administrations, it increments the patient's dose count up to `dosesPerPatient`. Appointment and dose entry keep treatment groups hidden.

## Review results

After Jane Hopkins Admin notifies FDA and FDA publishes disclosure, open the completed trial's **Report** tab. Review outcomes, group comparisons, and adverse events alongside patient details.

See [Architecture](ARCHITECTURE.md) for shared privacy and persistence rules.
