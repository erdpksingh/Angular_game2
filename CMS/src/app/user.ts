import { GameLanguage } from './game-language';

export class User {
    id: number;
    username: string;
    role: UserRole;
    gameLanguages?: GameLanguage[];
    opened?: boolean;
    // parameters from CMS
    cmsId?: string;
    email?: string;
    language?: string;
    token?: string;
    timestamp?: string;
}

export enum UserRole {
    Author,
    Admin
}
