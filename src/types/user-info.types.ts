import { type PersonName } from "./person-name.interface";


export interface UserContactInfo {
    phone_number: string;
    
    email:        string;
};


export const UserRoles = [
    '',
    'Bavaria',
    'JHDoctor',
    'JHAdmin',
    'FDA',
] as const;

export type UserRole = typeof UserRoles[number];


export interface UserInformation {
    name:    PersonName;

    contact: UserContactInfo;

    role:    UserRole;

    date_of_hire: string;

}