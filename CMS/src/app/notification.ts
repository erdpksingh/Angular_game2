export class Notification {
    type: NotificationType;
    message: string;
    autoClose: boolean;
    duration: number;
}

export enum NotificationType {
    Success,
    Error,
    Info
}