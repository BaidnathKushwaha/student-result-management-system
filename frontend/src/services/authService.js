import { loginApi, registerApi } from '../api/authApi';
import { setToken, setStoredUser, clearToken } from '../utils/tokenUtils';

export const login = async (username, password) => {
    const { data } = await loginApi({ username, password });
    setToken(data.token);
    const user = { username: data.username, role: data.role };
    setStoredUser(user);
    return user;
};

export const register = async ({ username, password, role, referenceId }) => {
    const { data } = await registerApi({ username, password, role, referenceId });
    setToken(data.token);
    const user = { username: data.username, role: data.role };
    setStoredUser(user);
    return user;
};

export const logout = () => {
    clearToken();
};