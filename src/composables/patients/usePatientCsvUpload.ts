import { computed, ref } from "vue";

import { usePatientsStore, useTrialsStore, useUiStore } from "@/stores";
import type { Patient, Trial } from "@/types";
import type { CsvRow } from "@/utils";
import { parseCsvWithHeaders } from "@/utils";
import { checkEligibility } from "./usePatients";

export interface PatientCsvPreviewRow {
    rowNum: number;
    data: CsvRow;
    patient: Patient | null;
    errors: string[];
    eligible: boolean;
}

export function usePatientCsvUpload(trial: () => Trial) {
    const patients = usePatientsStore();
    const trials = useTrialsStore();
    const ui = useUiStore();
    const rows = ref<PatientCsvPreviewRow[]>([]);
    const fileName = ref("");

    const validRows = computed(() =>
        rows.value.filter((row) => !row.errors.length && row.patient),
    );
    const eligibleCount = computed(
        () => validRows.value.filter((row) => row.eligible).length,
    );

    function reset() {
        rows.value = [];
        fileName.value = "";
    }

    function valueFor(data: CsvRow, names: string[]) {
        const key = names.find((name) => data[name] !== undefined);
        return key ? data[key] : "";
    }

    function splitCodes(value: string) {
        return value
            .split(/[|;,]/)
            .map((code) => code.trim())
            .filter(Boolean);
    }

    function generatePatientId() {
        const segment = () => Math.random().toString(36).slice(2, 6);
        let id = "";
        do {
            id = `${segment()}-${segment()}`;
        } while (patients.patients.some((patient) => patient.id === id));
        return id;
    }

    function makePatient(data: CsvRow): Patient {
        const existingId = valueFor(data, [
            "patientId",
            "id",
            "patient ID",
            "Patient ID",
        ]);
        const firstName = valueFor(data, [
            "firstName",
            "first name",
            "First Name",
        ]);
        const lastName = valueFor(data, [
            "lastName",
            "last name",
            "Last Name",
        ]);
        const name =
            valueFor(data, ["name", "Name"]) ||
            `${firstName} ${lastName}`.trim();
        const patientId = existingId || generatePatientId();
        const existing = patients.getPatient(patientId);
        const icdText = valueFor(data, [
            "icdCodes",
            "icd",
            "ICD",
            "ICD codes",
            "ICD-10",
            "icd10",
        ]);

        return {
            id: patientId,
            name,
            dob:
                valueFor(data, [
                    "dob",
                    "DOB",
                    "dateOfBirth",
                    "date of birth",
                ]) ||
                existing?.dob ||
                "",
            icdCodes: icdText
                ? splitCodes(icdText)
                : (existing?.icdCodes ?? []),
            bloodType:
                valueFor(data, ["bloodType", "blood type", "Blood Type"]) ||
                existing?.bloodType ||
                "O+",
            meds:
                valueFor(data, ["meds", "medications", "Medications"]) ||
                existing?.meds ||
                "None",
            allergy:
                valueFor(data, ["allergy", "allergies", "Allergies"]) ||
                existing?.allergy ||
                "None",
            height:
                Number(valueFor(data, ["height", "heightCm", "height cm"])) ||
                existing?.height,
            weight:
                Number(valueFor(data, ["weight", "weightKg", "weight kg"])) ||
                existing?.weight,
            bp:
                valueFor(data, ["bp", "bloodPressure", "blood pressure"]) ||
                existing?.bp,
            oxygen:
                Number(valueFor(data, ["oxygen", "o2", "O2"])) ||
                existing?.oxygen,
            temperature:
                valueFor(data, ["temperature", "temp"]) ||
                existing?.temperature,
            address: valueFor(data, ["address", "Address"]) || existing?.address,
            insuranceId:
                valueFor(data, [
                    "insuranceId",
                    "insurance ID",
                    "insurance",
                ]) || existing?.insuranceId,
            employment:
                valueFor(data, ["employment", "Employment"]) ||
                existing?.employment ||
                "Employed",
        };
    }

    function processText(text: string) {
        const parsed = parseCsvWithHeaders(text);
        if (!parsed.headers.length) {
            ui.pushToast("CSV file is empty.", "error");
            rows.value = [];
            return;
        }

        rows.value = parsed.rows.map((data, index) => {
            const patient = makePatient(data);
            const errors: string[] = [];
            if (!patient.id.trim()) errors.push("Patient ID missing");
            if (!patient.name.trim()) errors.push("Name missing");
            if (!patient.dob.trim()) errors.push("DOB missing");
            const eligible = errors.length
                ? false
                : checkEligibility(patient, trial());
            return { rowNum: index + 2, data, patient, errors, eligible };
        });
    }

    function handleFile(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        fileName.value = file.name;
        const reader = new FileReader();
        reader.onload = () => processText(String(reader.result ?? ""));
        reader.readAsText(file);
    }

    function downloadTemplate() {
        const csv = [
            "patientId,name,dob,icdCodes,bloodType,meds,allergy,height,weight,bp,oxygen,temperature,address,insuranceId,employment",
            "a3f9-2c11,Maria Johnson,1978-03-14,B20|Z21,O+,None,Penicillin,163,58,118/76,98,98.4F,1420 Elm St,INS-447821093,Employed",
        ].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "patient-upload-template.csv";
        link.click();
        URL.revokeObjectURL(link.href);
    }

    function importRows() {
        validRows.value.forEach((row) => {
            if (!row.patient) return;
            patients.upsertPatient(row.patient);
            trials.enrollPatient(
                trial().id,
                row.patient.id,
                checkEligibility(row.patient, trial()),
            );
        });
        ui.pushToast(
            `Imported ${validRows.value.length} patients (${eligibleCount.value} eligible).`,
            "success",
        );
    }

    return {
        rows,
        fileName,
        validRows,
        eligibleCount,
        reset,
        handleFile,
        downloadTemplate,
        importRows,
    };
}
