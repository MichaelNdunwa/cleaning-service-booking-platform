import type {
    ServicesResponse,
    AddonsResponse,
    AvailabilityResponse,
    BookingResponse,
    BookingDetailResponse,
    CustomerResponse,
    CreateBookingPayload,
    LoginPayload,
    SignupPayload,
    AuthResponse,
    OAuthPayload,
} from "./types";

/* ── Configuration ── */
const API_BASE_URL =
    process.env.NEXT_PUBLIC_ODOO_API_URL || "";

/* ── Base Fetcher ── */
async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const res = await fetch(url, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `API error: ${res.status}`);
    }

    return res.json();
}

/* ── Auth ── */
export async function signup(payload: SignupPayload): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/api/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function logout(): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/api/v1/auth/logout", {
        method: "POST",
    });
}

export async function getMe(): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/api/v1/auth/me");
}

export async function oauthLogin(payload: OAuthPayload): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/api/v1/auth/oauth", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/* ── Service Types ── */
export async function getServices(): Promise<ServicesResponse> {
    return apiFetch<ServicesResponse>("/api/v1/services");
}

/* ── Add-ons ── */
export async function getAddons(): Promise<AddonsResponse> {
    return apiFetch<AddonsResponse>("/api/v1/addons");
}

/* ── Availability ── */
export async function getAvailability(
    date: string,
    serviceTypeId?: number
): Promise<AvailabilityResponse> {
    const params = new URLSearchParams({ date });
    if (serviceTypeId) {
        params.set("service_type_id", String(serviceTypeId));
    }
    return apiFetch<AvailabilityResponse>(
        `/api/v1/availability?${params.toString()}`
    );
}

/* ── Create Booking ── */
export async function createBooking(
    payload: CreateBookingPayload
): Promise<BookingResponse> {
    return apiFetch<BookingResponse>("/api/v1/booking", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/* ── Get Booking ── */
export async function getBooking(
    bookingId: number
): Promise<BookingDetailResponse> {
    return apiFetch<BookingDetailResponse>(`/api/v1/booking/${bookingId}`);
}

/* ── Create / Update Customer ── */
export async function createCustomer(customer: {
    name: string;
    email: string;
    phone?: string;
}): Promise<CustomerResponse> {
    return apiFetch<CustomerResponse>("/api/v1/customer", {
        method: "POST",
        body: JSON.stringify(customer),
    });
}
