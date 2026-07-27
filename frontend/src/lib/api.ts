import type {
    CatalogResponse,
    AvailabilityResponse,
    BookingResponse,
    BookingDetailResponse,
    CustomerResponse,
    CreateBookingPayload,
    LoginPayload,
    SignupPayload,
    AuthResponse,
    OAuthPayload,
    ForgotPasswordPayload,
    ResetPasswordPayload,
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

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/api/v1/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/api/v1/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/* ── Catalog (unified endpoint) ── */
export async function getCatalog(): Promise<CatalogResponse> {
    return apiFetch<CatalogResponse>("/api/v1/catalog");
}

/* ── Availability ── */
export async function getAvailability(
    date: string
): Promise<AvailabilityResponse> {
    const params = new URLSearchParams({ date });
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
