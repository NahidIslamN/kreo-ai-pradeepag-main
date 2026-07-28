export type NotificationTarget = "all-reps" | "specific-rep";

export type NotificationType = "success" | "warning" | "normal";

export interface SalesRep {
    id: number;
    user: number;
    full_name: string;
    status: string;
    email: string;
    phone: string;
}

export interface SalesRepsResponse {
    success: boolean;
    message: string;
    request_id: string;
    data: SalesRep[];
}

export interface SendNotificationPayload {
    title: string;
    description: string;
    notification_type: NotificationType;
    user_ids: number[];
}

export interface NotificationHistoryItem {
    id: string;
    target: NotificationTarget;
    repName?: string;
    recipients: number;
    message: string;
    sentAt: string;
    readCount: number;
}   