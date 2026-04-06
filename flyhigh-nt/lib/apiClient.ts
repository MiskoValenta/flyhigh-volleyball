export let BASE_URL = '';

if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost') {
        BASE_URL = 'http://localhost:5000/api';
    } else {
        BASE_URL = 'https://api.flyhigh-volleyball.cz/api';
    }
} else {
    BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    let headersObj: any = {
        "Content-Type": "application/json"
    };

    if (options.headers) {
        headersObj = {
            "Content-Type": "application/json",
            ...options.headers
        };
    }

    const config: RequestInit = {
        ...options,
        credentials: "include",
        headers: headersObj,
    };

    let response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: "include",
        });

        if (refreshResponse.ok) {
            response = await fetch(`${BASE_URL}${endpoint}`, config);
        } else {
            if (typeof window !== "undefined") {
                window.location.href = "/";
            }
        }
    }

    return response;
}