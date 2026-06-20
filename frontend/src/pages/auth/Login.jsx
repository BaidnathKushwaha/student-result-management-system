import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/helpers';
import { ROLES } from '../../utils/constants';

const ROLE_HOME = {
    [ROLES.ADMIN]: '/admin/dashboard',
    [ROLES.FACULTY]: '/faculty/dashboard',
    [ROLES.STUDENT]: '/student/dashboard',
};

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!username.trim() || !password.trim()) {
            setError('Enter both username and password');
            return;
        }
        setSubmitting(true);
        try {
            const user = await login(username.trim(), password);
            toast.success(`Welcome back, ${user.username}`);
            navigate(ROLE_HOME[user.role] || '/login', { replace: true });
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthLayout>
            <h1 className="eg-auth-title">Sign in</h1>
            <p className="eg-auth-subtitle">Enter your credentials to access your dashboard.</p>

            {error && <div className="eg-alert eg-alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="eg-field">
                    <label className="eg-label" htmlFor="username">Username</label>
                    <input
                        id="username"
                        className="eg-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="your username"
                        autoComplete="username"
                    />
                </div>
                <div className="eg-field">
                    <label className="eg-label" htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="eg-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                    />
                </div>
                <button type="submit" className="eg-btn eg-btn-primary eg-btn-block" disabled={submitting}>
                    {submitting ? 'Signing in…' : 'Sign in'}
                </button>
            </form>

            <div className="eg-auth-footer">
                New here? <Link to="/register">Create an account</Link>
            </div>
        </AuthLayout>
    );
}