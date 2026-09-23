# Jane Hopkins Admin guide

Use the Jane Hopkins Admin portal (`jh-admin`) to enroll patients, review participation, monitor dosing, and notify FDA. Sign in as Emily Rodriguez with the [demo credentials](../README.md#demo-credentials).

## Access

Jane Hopkins Admin can view patient PII, eligibility, dose progress, notification status, and reports. The interface hides treatment groups until FDA publishes disclosure.

## Enroll patients

1. Open the trial's **Patients** tab.
2. Select **Add Patient** or **Bulk Upload (CSV)**.
3. Save patient details or review the CSV preview and confirm import.
4. Review each patient's eligibility before approving participation.

The app permits entry on visible pending and active trials until FDA notification. Complete enrollment before FDA locks assignments so the roster matches the assignment list.

### CSV format

Use **Download Template** in the upload dialog. A minimal example:

```csv
patientId,name,dob,icdCodes
demo-001,Alex Sample,1985-06-15,B20|Z21
```

- Supply a name and date of birth for each new patient. Use `YYYY-MM-DD` for dates.
- Omit `patientId` to generate an ID, or reuse an existing ID to update that patient. An existing patient can supply a missing date of birth.
- Separate ICD codes with `|`. The template lists optional clinical and demographic fields.
- Review validation and eligibility separately. Import skips invalid rows but enrolls valid rows even when they fail eligibility criteria.

## Approve or reject participation

**Prerequisites:** FDA must approve the trial, and Jane Hopkins review must remain pending. Enroll at least one patient before approval.

1. Review trial details and enrolled patients.
2. Approve or reject Jane Hopkins participation.

Approval enables Bavaria to submit a batch. Rejection sets the trial to `rejected` and stops its workflow.

## Notify FDA

**Prerequisites:** FDA must lock assignments, and every eligible patient must reach the trial's required dose count.

1. Open **Dose Tracker** and review completion.
2. Open **Notify FDA** and submit the notification.
3. Review **Report** after FDA publishes disclosure.

Notification sets `notifiedFDA` to `true` and closes patient entry. FDA controls disclosure.

See [Architecture](ARCHITECTURE.md) for shared privacy and persistence rules.
