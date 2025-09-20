<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores';
import { ViewButton } from '@/components';
import { CheckIcon, RejectIcon } from '@/assets';
import type { PatientInformation, Appointment } from '@/types';

// Mock data
const sampleAppointments: Appointment[] = [
  {
    date: new Date('2025-09-01T10:00:00Z'),
    o2: 97,
    bp: '120/80',
    temp: 98.6,
    hiv: 0,
    notes: [],
    doctor: 'Dr. Smith',
  },
  {
    date: new Date('2025-09-15T14:30:00Z'),
    o2: 95,
    bp: '118/76',
    temp: 98.4,
    hiv: 1,
    notes: [{ notes: 'Patient reported mild headache.' }],
    doctor: 'Dr. Adams',
  },
];

// Mock patients data
const patients = ref<PatientInformation[]>([
  {
    name: { first: 'Jane', last: 'Doe' },
    id: '00af1',
    contact: {
      phone_number: '123-456-7890',
      email: 'jane.doe@example.com',
    },
    dob: '1985-04-12',
    address: '123 Main St, Springfield',
    insurance_num: 'INS-001',
    height: 165,
    weight: 65,
    blood: 'A+',
    employed: true,
    insured: true,
    allergies: [
      { name: 'Peanuts', reactions: 'Anaphylaxis' },
    ],
    medications: [
      { name: 'Lisinopril', purpose: 'Blood pressure control' },
    ],
    history: [
      { disease: 'Hypertension', carrier: 'Father' },
    ],
    icdcodes: [
      { code: 'I10' },
    ],
    stage: 1,
    eligibility: true,
    appointments: sampleAppointments,
  },
  {
    name: { first: 'Josh', last: 'Allen' },
    id: '00eaga2',
    contact: {
      phone_number: '555-123-4567',
      email: 'josh.allen@example.com',
    },
    dob: '1990-09-20',
    address: '456 Elm St, Buffalo',
    insurance_num: 'INS-002',
    height: 193,
    weight: 98,
    blood: 'O+',
    employed: true,
    insured: true,
    allergies: [],
    medications: [],
    history: [],
    icdcodes: [],
    stage: 4,
    eligibility: false,
    appointments: [],
  },
  {
    name: { first: 'Lightning', last: 'McQueen' },
    id: '00313513',
    contact: {
      phone_number: '999-888-7777',
      email: 'kachow@racing.com',
    },
    dob: '2006-06-16',
    address: 'Route 66, Radiator Springs',
    insurance_num: 'INS-003',
    height: 180,
    weight: 75,
    blood: 'B-',
    employed: false,
    insured: false,
    allergies: [
      { name: 'Oil', reactions: 'Overheating' },
    ],
    medications: [],
    history: [
      { disease: 'Engine failure', carrier: 'Unknown' },
    ],
    icdcodes: [
      { code: 'Z99.89' },
    ],
    stage: 5,
    eligibility: true,
    appointments: [],
  },
  {
    name: { first: 'Josh', last: 'Allen' },
    id: '00eaga2',
    contact: {
      phone_number: '555-123-4567',
      email: 'josh.allen@example.com',
    },
    dob: '1990-09-20',
    address: '456 Elm St, Buffalo',
    insurance_num: 'INS-002',
    height: 193,
    weight: 98,
    blood: 'O+',
    employed: true,
    insured: true,
    allergies: [],
    medications: [],
    history: [],
    icdcodes: [],
    stage: 4,
    eligibility: false,
    appointments: [],
  },
  {
    name: { first: 'Josh', last: 'Allen' },
    id: '00eaga2',
    contact: {
      phone_number: '555-123-4567',
      email: 'josh.allen@example.com',
    },
    dob: '1990-09-20',
    address: '456 Elm St, Buffalo',
    insurance_num: 'INS-002',
    height: 193,
    weight: 98,
    blood: 'O+',
    employed: true,
    insured: true,
    allergies: [],
    medications: [],
    history: [],
    icdcodes: [],
    stage: 4,
    eligibility: false,
    appointments: [],
  },
]);

const auth = useAuthStore();

const currentRole = computed(() => {
  if (!auth.isLoggedIn || !auth.accountType) return '';
  return auth.accountType;
});
</script>

<template>
  <div class="overflow-x-auto rounded-lg shadow border border-gray-200 w-full">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50 hidden md:table-header-group">
        <tr>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Stage</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">View</th>
          <th v-if="currentRole === 'JHAdmin'" class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Eligibility</th>
        </tr>
      </thead>

      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="patient in patients" :key="patient.id" class="block md:table-row">
          <td class="px-6 py-4 text-sm font-medium text-gray-900 hidden md:table-cell">
            {{ patient.name.first }} {{ patient.name.last }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
            {{ patient.id }}
          </td>
          <td class="px-6 py-4 text-sm hidden md:table-cell">
            {{ patient.stage }}
          </td>
          <td class="px-6 py-4 text-sm hidden md:table-cell">
            <ViewButton />
          </td>
          <td v-if="currentRole === 'JHAdmin'" class="px-6 py-4 hidden md:table-cell"> 
            <component :is="patient.eligibility ? CheckIcon : RejectIcon" class="w-8 h-8" aria-hidden="true" /> 
            <span class="sr-only">{{ patient.eligibility ? 'Eligible' : 'Not eligible' }}</span> 
          </td>

          <!-- Mobile -->
          <td colspan="5" class="block md:hidden px-6 py-4">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ patient.name.first }} {{ patient.name.last }}</p>
                <p class="text-xs text-gray-500">ID: {{ patient.id }}</p>
              </div>
              <div v-if="currentRole === 'JHAdmin'"> 
                <component :is="patient.eligibility ? CheckIcon : RejectIcon" class="w-8 h-8" aria-hidden="true" /> 
                <span class="sr-only">{{ patient.eligibility ? 'Eligible' : 'Not eligible' }}</span> 
              </div>
            </div>

            <div class="flex justify-between items-center mt-3 pt-2">
              <ViewButton />
              <div class="text-sm font-medium">{{ patient.stage }}</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
