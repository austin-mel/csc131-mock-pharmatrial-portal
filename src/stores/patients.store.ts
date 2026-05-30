import { defineStore } from 'pinia';
import { ref } from 'vue';
import { seedPatients } from '@/data';
import type { Patient } from '@/types';

export const usePatientsStore = defineStore('patients', () => {
  const patients = ref<Patient[]>(structuredClone(seedPatients));

  function getPatient(id: string) {
    return patients.value.find((patient) => patient.id === id) ?? null;
  }

  function upsertPatient(patient: Patient) {
    const index = patients.value.findIndex((item) => item.id === patient.id);
    if (index >= 0) patients.value[index] = patient;
    else patients.value.push(patient);
    return patient;
  }

  return {
    patients,
    getPatient,
    upsertPatient,
  };
});
