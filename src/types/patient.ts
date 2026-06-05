export interface Patient {
    id: string;
    name: string;
    dob: string;
    icdCodes: string[];
    bloodType: string;
    bp?: string;
    oxygen?: number;
    meds?: string;
    allergy?: string;
    height?: number;
    weight?: number;
    address?: string;
    insuranceId?: string;
    employment?: string;
    temperature?: string;
}

export interface IcdCode {
    code: string;
    title: string;
}
