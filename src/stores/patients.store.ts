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

  function deletePatient(id: string) {
    const index = patients.value.findIndex((patient) => patient.id === id);
    if (index < 0) return false;
    patients.value.splice(index, 1);
    return true;
  }

  return {
    patients,
    getPatient,
    upsertPatient,
    deletePatient,
  };
});
