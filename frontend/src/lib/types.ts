/* ── TypeScript types for the Cleaning Service Booking Platform ── */

export interface ServiceType {
    id: number;
    name: string;
    code: string;
    description: string;
    base_price: number;
    category: "property" | "clean_level" | "specialty";
    bedrooms: number | null;
}

export interface Addon {
    id: number;
    name: string;
    code: string;
    description: string;
    price: number;
    duration_delta: number;
}

export interface TimeSlot {
    id: number;
    name: string;
    start_hour: number;
    end_hour: number;
    capacity: number;
    booked: number;
    available: number;
}

export interface Customer {
    id?: number;
    name: string;
    email: string;
    phone?: string;
}

export interface Address {
    line_1: string;
    line_2?: string;
    city: string;
    postcode: string;
}

export type Frequency = "one_time" | "weekly" | "fortnightly" | "monthly";

export type BookingState =
    | "draft"
    | "confirmed"
    | "scheduled"
    | "in_progress"
    | "done"
    | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Booking {
    id: number;
    reference: string;
    customer: Customer;
    service_type: Pick<ServiceType, "id" | "name">;
    addons: Pick<Addon, "id" | "name" | "price">[];
    booking_date: string;
    time_slot: Pick<TimeSlot, "id" | "name">;
    frequency: Frequency;
    address: Address;
    bedrooms: number;
    bathrooms: number;
    base_amount: number;
    addons_amount: number;
    amount_total: number;
    state: BookingState;
    payment_status: PaymentStatus;
    payment_reference: string;
    notes: string;
}

export interface CreateBookingPayload {
    customer: {
        name: string;
        email: string;
        phone?: string;
    };
    service_type_id: number;
    booking_date: string;
    time_slot_id: number;
    frequency: Frequency;
    addon_ids?: number[];
    address_line_1: string;
    address_line_2?: string;
    city: string;
    postcode: string;
    access_instructions?: string;
    bedrooms: number;
    bathrooms: number;
    notes?: string;
}

export interface ApiResponse<T> {
    data?: T;
    error?: string;
}

export interface ServicesResponse {
    services: ServiceType[];
}

export interface AddonsResponse {
    addons: Addon[];
}

export interface AvailabilityResponse {
    date: string;
    slots: TimeSlot[];
}

export interface BookingResponse {
    booking: {
        id: number;
        reference: string;
        state: BookingState;
        amount_total: number;
    };
}

export interface BookingDetailResponse {
    booking: Booking;
}

export interface CustomerResponse {
    customer: Customer;
}

/* ── Auth Types ── */

export interface AuthUser {
    id: number;
    name: string;
    email: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface SignupPayload {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    user?: AuthUser;
    error?: string;
}

export interface OAuthPayload {
    provider: "google" | "apple";
    email: string;
    name: string;
    provider_uid: string; // the `sub` (subject) from the Google/Apple ID token
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    token: string;
    password: string;
}
