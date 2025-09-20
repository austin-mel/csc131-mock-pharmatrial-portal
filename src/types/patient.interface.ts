import type { Appointment, PersonName } from ".";

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


    contact: PatientContactInfo;

    dob: string;

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

    stage: number;
    
    appointments: Appointment[];
}

