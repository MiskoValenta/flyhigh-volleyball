export let BASE_URL = '';

if (process.env.NEXT_PUBLIC_API_URL) {
    BASE_URL = process.env.NEXT_PUBLIC_API_URL;
} else {
    BASE_URL = 'https://flyhigh-volleyball.cz/api';
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

export async function loginUser(data: any) {
    // Opraveno na fetchWithAuth
    const res = await fetchWithAuth(`/auth/login`, {
        method: 'POST',
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        let errorData: any = {};
        try {
            errorData = await res.json();
        } catch (e) {
            errorData = {};
        }

        if (errorData.message) {
            throw new Error(errorData.message);
        } else {
            throw new Error('Nepodařilo se přihlásit.');
        }
    }
}

export async function registerUser(data: any) {
    // Opraveno na fetchWithAuth
    const res = await fetchWithAuth(`/auth/register`, {
        method: 'POST',
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        let errorData: any = {};
        try {
            errorData = await res.json();
        } catch (e) {
            errorData = {};
        }

        if (errorData.message) {
            throw new Error(errorData.message);
        } else {
            throw new Error('Nepodařilo se zaregistrovat.');
        }
    }
}

export async function getCurrentUser() {
    const res = await fetchWithAuth(`/auth/me`);
    if (!res.ok) {
        throw new Error('Nepodařilo se načíst uživatele.');
    }
    return res.json();
}

export async function updateProfile(data: any) {
    const res = await fetchWithAuth(`/users/profile`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        let errorData: any = {};
        try {
            errorData = await res.json();
        } catch (e) {
            errorData = {};
        }

        if (errorData.message) {
            throw new Error(errorData.message);
        } else {
            throw new Error('Nepodařilo se aktualizovat profil.');
        }
    }
}

export async function logoutUser() {
    const res = await fetchWithAuth(`/auth/logout`, {
        method: 'POST'
    });

    if (!res.ok) {
        throw new Error('Nepodařilo se odhlásit.');
    }
}

export async function forgotPassword(email: string) {
    const res = await fetchWithAuth(`/auth/forgot-password`, {
        method: 'POST',
        body: JSON.stringify({ email })
    });

    if (!res.ok) {
        let errorData: any = {};
        try {
            errorData = await res.json();
        } catch (e) {
            errorData = {};
        }

        if (errorData.message) {
            throw new Error(errorData.message);
        } else {
            throw new Error('Nepodařilo se odeslat požadavek na reset hesla.');
        }
    }
}

export async function changePassword(data: any) {
    const res = await fetchWithAuth(`/users/password`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        let errorData: any = {};
        try {
            errorData = await res.json();
        } catch (e) {
            errorData = {};
        }

        if (errorData.message) {
            throw new Error(errorData.message);
        } else {
            throw new Error('Nepodařilo se změnit heslo.');
        }
    }
}