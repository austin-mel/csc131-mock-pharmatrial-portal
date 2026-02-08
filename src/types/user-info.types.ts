export interface UserContactInfo {
    phone_number: string;
    
    email:        string;
};


export const UserRoles = [
    'Bavaria',
    'JHDoctor',
    'JHAdmin',
    'FDA',
] as const;

export type UserRole = typeof UserRoles[number];


export interface UserInformation {
    first_name: string;

    last_name: string;

    contact: UserContactInfo;

    role:    UserRole;

    date: Date;
}