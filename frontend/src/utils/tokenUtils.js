import { STORAGE_KEYS } from './constants';

export const getToken = () => sessionStorage.getItem(STORAGE_KEYS.TOKEN);

export const setToken = (token) => sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);

export const clearToken = () => {
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
};

export const getStoredUser = () => {
    const raw = sessionStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
};

export const setStoredUser = (user) => sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

/**
 * Decodes a JWT payload without verifying the signature.
 * Used only to read non-sensitive claims (e.g. expiry) on the client.
 */
export const decodeJwt = (token) => {
    try {
        const payload = token.split('.')[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch {
        return null;
    }
};

export const isTokenExpired = (token) => {
    const decoded = decodeJwt(token);
    if (!decoded?.exp) return true;
    return decoded.exp * 1000 < Date.now();
};