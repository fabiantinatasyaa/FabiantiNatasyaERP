// Domain Models

export enum ServiceType {
    Haircut = 'Haircut',
    Color = 'Color',
    Treatment = 'Treatment',
    Manicure = 'Manicure',
    Facial = 'Facial'
}

export enum StaffTier {
    Junior = 'Junior',
    Senior = 'Senior',
    Master = 'Master'
}

export interface Staff {
    id: string;
    name: string;
    role: string;
    tier: StaffTier;
    utilizationRate: number; // Percentage 0-100
    avatar: string;
}

export interface Service {
    id: string;
    name: string;
    duration: number; // in minutes
    price: number;
    type: ServiceType;
    consumablesCost: number;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    lastVisit: string;
    loyaltyPoints: number;
    totalSpend: number;
    preferences: string[];
    history: {
        date: string;
        serviceId: string;
        price: number;
    }[];
}

export interface Appointment {
    id: string;
    customerId: string;
    staffId: string;
    serviceId: string;
    startTime: string; // ISO String
    status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show';
    predictedRisk?: 'High' | 'Medium' | 'Low'; // AI Predicted
}

export interface KPI {
    period: string;
    revenue: number;
    appointments: number;
    utilization: number;
    noShowRate: number;
}