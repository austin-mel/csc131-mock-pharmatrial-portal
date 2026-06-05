export type AppointmentType =
    | "Dose Administration"
    | "Follow-up Evaluation"
    | "Initial Screening"
    | "Post-Trial Assessment";

export interface Appointment {
    date: string;
    time?: string;
    type: AppointmentType;
    dose: boolean;
    bloodTestLevel: number | null;
    adverseEvents: string[];
    note: string;
}

export interface AppointmentDraft {
    date: string;
    time?: string;
    type: AppointmentType;
    bloodTestLevel: number | null;
    adverseEvents: string[];
    note: string;
}
