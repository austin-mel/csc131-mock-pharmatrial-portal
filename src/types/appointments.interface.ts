export interface Notes {
    notes: string;
}

export interface Appointment {
    date:   Date;

    o2:     number;

    bp:     string;

    temp:   number;

    hiv:  number;

    notes: Notes[];
}