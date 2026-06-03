import type { Patient, TrialEnrollment, TrialPatientsByTrial } from '@/types';

export const seedPatients: Patient[] = [
  {
    id: 'a3f9-2c11',
    name: 'Maria Johnson',
    dob: '1978-03-14',
    icdCodes: ['B20', 'Z21'],
    bloodType: 'O+',
    bp: '118/76',
    oxygen: 98,
    meds: 'None',
    allergy: 'Penicillin',
    height: 163,
    weight: 58,
    address: '1420 Elm St, Sacramento CA 95814',
    insuranceId: 'INS-447821093',
    employment: 'Employed',
    temperature: '98.4F',
  },
  {
    id: 'b7d2-8e44',
    name: 'James Wilson',
    dob: '1965-11-02',
    icdCodes: ['B20', 'I10'],
    bloodType: 'A+',
    bp: '132/82',
    oxygen: 97,
    meds: 'Lisinopril',
    allergy: 'None',
    height: 178,
    weight: 82,
    address: '88 C St, Sacramento CA 95816',
    insuranceId: 'INS-773921046',
    employment: 'Retired',
    temperature: '98.7F',
  },
  {
    id: 'c1a8-5f90',
    name: 'Priya Patel',
    dob: '1989-07-21',
    icdCodes: ['Z21'],
    bloodType: 'B+',
    bp: '112/70',
    oxygen: 99,
    meds: 'None',
    allergy: 'None',
    height: 158,
    weight: 54,
    address: '902 Pine Ave, Davis CA 95616',
    insuranceId: 'INS-221908554',
    employment: 'Employed',
    temperature: '98.2F',
  },
  {
    id: 'd4e6-1b72',
    name: 'Robert Garcia',
    dob: '1972-01-30',
    icdCodes: ['B20', 'E11'],
    bloodType: 'AB+',
    bp: '128/80',
    oxygen: 96,
    meds: 'Metformin',
    allergy: 'Sulfa',
    height: 171,
    weight: 90,
    address: '14 Lake Rd, Roseville CA 95678',
    insuranceId: 'INS-553209871',
    employment: 'Employed',
    temperature: '98.8F',
  },
  ...Array.from({ length: 22 }, (_, index): Patient => {
    const number = index + 1;
    return {
      id: `demo-${String(number).padStart(2, '0')}`,
      name: `Demo Patient ${String(number).padStart(2, '0')}`,
      dob: `19${70 + (index % 25)}-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 27) + 1).padStart(2, '0')}`,
      icdCodes: index % 3 === 0 ? ['B20', 'Z21'] : ['B20'],
      bloodType: ['O+', 'A+', 'B+', 'AB+'][index % 4],
      bp: `${112 + (index % 18)}/${72 + (index % 10)}`,
      oxygen: 96 + (index % 4),
      meds: index % 5 === 0 ? 'Lisinopril' : 'None',
      allergy: index % 6 === 0 ? 'Sulfa' : 'None',
      height: 158 + (index % 24),
      weight: 56 + (index % 38),
      address: `${100 + index} Trial Way, Sacramento CA 95814`,
      insuranceId: `INS-DEMO-${String(1000 + index)}`,
      employment: index % 4 === 0 ? 'Retired' : 'Employed',
      temperature: `98.${index % 10}F`,
    };
  }),
];

export const seedTrialPatients: TrialPatientsByTrial = {
  'TRL-2023-001': {
    'a3f9-2c11': {
      eligible: true,
      doses: 3,
      appointments: [
        { date: '2023-07-01', type: 'Initial Screening', dose: false, bloodTestLevel: 120, adverseEvents: [], note: 'Baseline blood test.' },
        { date: '2023-08-01', type: 'Dose Administration', dose: true, bloodTestLevel: 92, adverseEvents: ['Mild fatigue'], note: 'Dose administered.' },
        { date: '2023-09-01', type: 'Dose Administration', dose: true, bloodTestLevel: 80, adverseEvents: [], note: 'Continued improvement.' },
      ],
    },
    'b7d2-8e44': {
      eligible: true,
      doses: 2,
      appointments: [
        { date: '2023-07-03', type: 'Initial Screening', dose: false, bloodTestLevel: 110, adverseEvents: [], note: 'Baseline.' },
        { date: '2023-08-03', type: 'Follow-up Evaluation', dose: false, bloodTestLevel: 105, adverseEvents: ['Headache'], note: 'Follow-up.' },
      ],
    },
    'c1a8-5f90': {
      eligible: true,
      doses: 3,
      appointments: [
        { date: '2023-07-02', type: 'Initial Screening', dose: false, bloodTestLevel: 98, adverseEvents: [], note: 'Baseline.' },
      ],
    },
    ...(Object.fromEntries(
      Array.from({ length: 22 }, (_, index) => {
        const number = index + 1;
        const patientId = `demo-${String(number).padStart(2, '0')}`;
        return [
          patientId,
          {
            eligible: true,
            doses: index % 4 === 0 ? 3 : index % 4 === 1 ? 2 : 1,
            appointments: [
              { date: `2023-07-${String((index % 20) + 5).padStart(2, '0')}`, type: 'Initial Screening', dose: false, bloodTestLevel: 115 - (index % 9), adverseEvents: [], note: 'Demo baseline visit.' },
              { date: `2023-08-${String((index % 20) + 5).padStart(2, '0')}`, type: 'Dose Administration', dose: true, bloodTestLevel: 101 - (index % 8), adverseEvents: index % 5 === 0 ? ['Mild fatigue'] : [], note: 'Demo dose visit.' },
            ],
          },
        ];
      }),
    ) as Record<string, TrialEnrollment>),
  },
  'TRL-2023-002': {
    'd4e6-1b72': { eligible: false, doses: 0, appointments: [] },
    'a3f9-2c11': { eligible: true, doses: 0, appointments: [] },
  },
  'TRL-2023-003': {
    'b7d2-8e44': { eligible: true, doses: 0, appointments: [] },
    'a3f9-2c11': { eligible: true, doses: 0, appointments: [] },
    'c1a8-5f90': { eligible: true, doses: 0, appointments: [] },
    'demo-01': { eligible: true, doses: 0, appointments: [] },
    'demo-02': { eligible: true, doses: 0, appointments: [] },
    'demo-03': { eligible: true, doses: 0, appointments: [] },
    'demo-04': { eligible: true, doses: 0, appointments: [] },
    'demo-05': { eligible: true, doses: 0, appointments: [] },
    'demo-06': { eligible: true, doses: 0, appointments: [] },
    'demo-07': { eligible: true, doses: 0, appointments: [] },
    'demo-08': { eligible: true, doses: 0, appointments: [] },
    'demo-09': { eligible: true, doses: 0, appointments: [] },
  },
  'TRL-2023-004': {
    'a3f9-2c11': { eligible: true, doses: 0, appointments: [] },
    'c1a8-5f90': { eligible: true, doses: 0, appointments: [] },
  },
  'TRL-2023-007': {
    'a3f9-2c11': {
      eligible: true,
      doses: 2,
      appointments: [
        { date: '2023-08-01', type: 'Initial Screening', dose: false, bloodTestLevel: 118, adverseEvents: [], note: 'Baseline.' },
        { date: '2023-09-01', type: 'Dose Administration', dose: true, bloodTestLevel: 96, adverseEvents: [], note: 'Dose administered.' },
        { date: '2023-10-01', type: 'Dose Administration', dose: true, bloodTestLevel: 83, adverseEvents: [], note: 'Final dose administered.' },
      ],
    },
    'b7d2-8e44': {
      eligible: true,
      doses: 2,
      appointments: [
        { date: '2023-08-02', type: 'Initial Screening', dose: false, bloodTestLevel: 112, adverseEvents: [], note: 'Baseline.' },
        { date: '2023-09-02', type: 'Dose Administration', dose: true, bloodTestLevel: 101, adverseEvents: ['Nausea'], note: 'Dose administered.' },
        { date: '2023-10-02', type: 'Dose Administration', dose: true, bloodTestLevel: 90, adverseEvents: [], note: 'Final dose administered.' },
      ],
    },
  },
  'TRL-2022-014': {
    'a3f9-2c11': {
      eligible: true,
      doses: 2,
      appointments: [
        { date: '2022-01-10', type: 'Initial Screening', dose: false, bloodTestLevel: 116, adverseEvents: [], note: 'Baseline.' },
        { date: '2022-02-10', type: 'Dose Administration', dose: true, bloodTestLevel: 95, adverseEvents: [], note: 'Dose administered.' },
        { date: '2022-03-10', type: 'Dose Administration', dose: true, bloodTestLevel: 84, adverseEvents: [], note: 'Final dose administered.' },
      ],
    },
    'd4e6-1b72': {
      eligible: true,
      doses: 2,
      appointments: [
        { date: '2022-01-11', type: 'Initial Screening', dose: false, bloodTestLevel: 124, adverseEvents: [], note: 'Baseline.' },
        { date: '2022-02-11', type: 'Dose Administration', dose: true, bloodTestLevel: 118, adverseEvents: ['Fatigue'], note: 'Dose administered.' },
        { date: '2022-03-11', type: 'Dose Administration', dose: true, bloodTestLevel: 111, adverseEvents: [], note: 'Final dose administered.' },
      ],
    },
  },
};
