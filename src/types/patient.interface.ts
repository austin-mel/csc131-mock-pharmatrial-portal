import type { Appointment, PersonName, Trial } from "@/types";

export interface PatientContactInfo {
    phone_number: string;
    
    email:        string;
};

export interface Allergy {
    name: string;
    reactions: string;
}

export interface Medications {
    name: string;
    purpose: string;
}

export interface History {
    disease: string;
    carrier: string;
}

export interface ICDCodes {
    code: string;
}

export interface PatientInformation {
    name:    PersonName;

    id: string;

    study_id: Trial['id'];

    drug_id: Trial['drug_id'];

    contact: PatientContactInfo;

    dob: Date;

    address: string;

    insurance_num: string;

    height: number;

    weight: number;

    blood: string;

    employed: boolean;

    insured: boolean;

    allergies: Allergy[];

    medications: Medications[];

    history: History[];

    icdcodes: ICDCodes[];

    eligibility: boolean;

    dose: number;
    
    appointments: Appointment[];
}

